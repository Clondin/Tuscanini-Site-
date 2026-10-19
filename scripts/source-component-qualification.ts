import { createHash } from 'node:crypto';
import { lstat, readFile, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import sharp from 'sharp';

export interface SourceComponentReference {
  path: string; sha256: string; scope: 'qualified-component'; status: 'matched-components';
  reviewer: string; notes: string;
  qualificationRecord: { path: string; sha256: string };
}
export interface SourceComponentQualificationOptions {
  jobRoot: string; oldJobRoot: string; sku: string;
  owner: { taskName: string; threadId: string };
  primaryPath: string; primarySha256: string;
}
const check: (value: unknown, message: string) => asserts value = (value, message) => { if (!value) throw new Error(message); };
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
const sha = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const normalized = (path: string) => process.platform === 'win32' ? resolve(path).toLowerCase() : resolve(path);
const inside = (root: string, path: string) => {
  const part = relative(root, path);
  return !!part && part !== '..' && !part.startsWith(`..${sep}`) && !isAbsolute(part);
};
function dated(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function fields(value: Record<string, unknown>, required: string[], optional: string[], label: string) {
  check(required.every(key => key in value) && Object.keys(value).every(key => required.includes(key) || optional.includes(key)), `Unknown or missing ${label} fields`);
}

/** Reject both escaping links and internal aliases. Nothing is discovered or qualified by filename. */
async function noLinks(root: string, path: string): Promise<string> {
  // Windows may return an 8.3 USERPROFILE/TEMP alias. Compare actual ancestry,
  // while inspecting every original path segment so a junction cannot hide in it.
  for (let current = path; ; current = dirname(current)) {
    check(!(await lstat(current)).isSymbolicLink(), 'Symlink/junction qualification paths are forbidden');
    const actual = await realpath(current);
    if (normalized(actual) === normalized(root)) break;
    check(inside(root, actual) && dirname(current) !== current, 'Component qualification path escapes its own root');
  }
  const actual = await realpath(path);
  check(inside(root, actual), 'Component qualification realpath escapes its own root');
  return actual;
}

/** Only this explicit original-owner record can add fresh isolated components to an approval.
 * Absence is optional; any present but malformed/stale/escaping record fails closed.
 * The component meaning is the source owner's visual qualification, not a pixel classifier.
 */
export async function readSourceComponentQualifications(options: SourceComponentQualificationOptions): Promise<SourceComponentReference[]> {
  const { sku, owner } = options;
  check(/^\d+$/.test(sku) && owner.taskName === `/root/sku_${sku}`
    && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(owner.threadId), 'Original source owner task/UUID routing mismatch');
  const jobRoot = await realpath(options.jobRoot), oldRoot = await realpath(options.oldJobRoot);
  const recordPath = join(jobRoot, 'skus', sku, 'source-component-qualification.json');
  try { await lstat(recordPath); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; }
  const actualRecordPath = await noLinks(jobRoot, recordPath);
  check((await lstat(actualRecordPath)).isFile(), 'Component qualification record must be a file');
  const recordBytes = await readFile(actualRecordPath), recordHash = hash(recordBytes);
  const record: unknown = JSON.parse(recordBytes.toString('utf8').replace(/^\uFEFF/, ''));
  check(object(record), 'Invalid source component qualification record');
  fields(record, ['schema_version', 'sku', 'reviewedBy', 'reviewedAt', 'primaryPath', 'primarySha256', 'references'],
    ['ownerThreadId', 'comparisonEvidence', 'wholeAlternativeLabelStatus', 'wholeAlternativeLabelLimits', 'useAuthorization'], 'component qualification');
  check(record.schema_version === 'source-component-qualification/v1' && record.sku === sku
    && record.reviewedBy === owner.taskName && dated(record.reviewedAt), 'Component qualification schema/SKU/original owner/date mismatch');
  check(record.ownerThreadId === undefined || record.ownerThreadId === owner.threadId, 'Component qualification source owner UUID mismatch');
  check(record.wholeAlternativeLabelStatus === undefined || record.wholeAlternativeLabelStatus === 'different-revision-excluded', 'Complete alternative labels cannot be qualified by this component record');
  for (const key of ['wholeAlternativeLabelLimits', 'useAuthorization']) check(record[key] === undefined || text(record[key]), `Invalid qualification ${key}`);
  check(record.comparisonEvidence === undefined || (Array.isArray(record.comparisonEvidence) && record.comparisonEvidence.length > 0
    && record.comparisonEvidence.every(path => text(path) && isAbsolute(path))), 'Comparison evidence must be explicit absolute paths');
  check(text(record.primaryPath) && isAbsolute(record.primaryPath) && isAbsolute(options.primaryPath)
    && sha(record.primarySha256) && sha(options.primarySha256), 'Component qualification primary path/hash required');
  const primary = await realpath(options.primaryPath);
  check(await realpath(record.primaryPath) === primary && record.primarySha256 === options.primarySha256
    && hash(await readFile(primary)) === record.primarySha256, 'Component qualification does not match actual approved primary photo');
  check(Array.isArray(record.references) && record.references.length > 0, 'Explicit nonempty component references required');
  const recoveryRoot = join(oldRoot, 'artwork-source-recovery', sku);
  await noLinks(oldRoot, recoveryRoot);
  const actualRecoveryRoot = await realpath(recoveryRoot);
  const result: SourceComponentReference[] = [], seen = new Set<string>();
  for (const entry of record.references) {
    check(object(entry), 'Invalid component reference');
    fields(entry, ['path', 'sha256', 'scope', 'status', 'notes'], [], 'component reference');
    check(entry.scope === 'qualified-component' && entry.status === 'matched-components'
      && text(entry.notes) && text(entry.path) && isAbsolute(entry.path) && sha(entry.sha256), 'Reference must be explicitly qualified isolated component, matched-components, with notes/path/hash');
    const path = await noLinks(actualRecoveryRoot, resolve(entry.path));
    check((await lstat(path)).isFile() && path !== primary && !seen.has(normalized(path)), 'Duplicate or invalid component reference');
    const pixels = await readFile(path);
    check(hash(pixels) === entry.sha256, `Qualified component hash changed: ${path}`);
    const metadata = await sharp(pixels).metadata();
    check(['png', 'jpeg', 'webp', 'tiff'].includes(metadata.format ?? '') && metadata.width && metadata.height
      && (metadata.pages ?? 1) === 1, 'Qualified component must be a single raster fragment, not a complete document');
    seen.add(normalized(path));
    result.push({ path, sha256: entry.sha256, scope: 'qualified-component', status: 'matched-components',
      reviewer: owner.taskName, notes: entry.notes, qualificationRecord: { path: actualRecordPath, sha256: recordHash } });
  }
  check(hash(await readFile(actualRecordPath)) === recordHash && hash(await readFile(primary)) === record.primarySha256, 'Qualification record or primary changed while being read');
  for (const entry of result) check(hash(await readFile(entry.path)) === entry.sha256, 'Qualified component changed while being read');
  return result;
}
