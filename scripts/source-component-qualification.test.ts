import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, relative } from 'node:path';
import sharp from 'sharp';
import { readSourceComponentQualifications, type SourceComponentQualificationOptions } from './source-component-qualification';

const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const temps: string[] = [];
afterEach(async () => {
  for (const path of temps.splice(0)) {
    if (!basename(path).startsWith('component-qualification-') || relative(tmpdir(), path).startsWith('..')) throw new Error('Unsafe test cleanup path');
    await rm(path, { recursive: true, force: true });
  }
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'component-qualification-')); temps.push(root);
  const job = join(root, 'new-job'), old = join(root, 'old-job');
  const sku = '730180', owner = { taskName: '/root/sku_730180', threadId: '01a14645-33c5-7710-bfa6-0af44788d500' };
  const own = join(old, 'skus', sku), recovery = join(old, 'artwork-source-recovery', sku);
  const recordPath = join(job, 'skus', sku, 'source-component-qualification.json');
  await Promise.all([mkdir(own, { recursive: true }), mkdir(recovery, { recursive: true }), mkdir(join(job, 'skus', sku), { recursive: true })]);
  const primary = join(own, 'source.png'), component = join(recovery, 'explicit-fragment.png');
  await sharp({ create: { width: 20, height: 20, channels: 4, background: '#123456' } }).png().toFile(primary);
  await sharp({ create: { width: 8, height: 5, channels: 4, background: '#abcdef' } }).png().toFile(component);
  const primarySha256 = hash(await readFile(primary));
  const record = {
    schema_version: 'source-component-qualification/v1', sku, reviewedBy: owner.taskName,
    reviewedAt: '2026-10-19T21:39:28.019Z', primaryPath: primary, primarySha256,
    references: [{ path: component, sha256: hash(await readFile(component)), scope: 'qualified-component', status: 'matched-components', notes: 'Synthetic isolated logo explicitly compared with this primary by its source owner.' }],
    comparisonEvidence: [primary, component], wholeAlternativeLabelStatus: 'different-revision-excluded',
    wholeAlternativeLabelLimits: 'Full alternate label revision is excluded; only the named isolated component is qualified.',
  };
  const options: SourceComponentQualificationOptions = { jobRoot: job, oldJobRoot: old, sku, owner, primaryPath: primary, primarySha256 };
  const save = () => writeFile(recordPath, JSON.stringify(record, null, 2));
  await save();
  return { root, job, old, recovery, recordPath, primary, component, record, options, save };
}
describe('fresh original-owner component qualification', () => {
  it('accepts only the explicit component and carries source-owner plus record hash provenance', async () => {
    const f = await fixture();
    const files = [f.recordPath, f.primary, f.component];
    const before = await Promise.all(files.map(path => readFile(path)));
    const refs = await readSourceComponentQualifications(f.options);
    expect(refs).toEqual([{ ...f.record.references[0], path: await realpath(f.component), reviewer: f.options.owner.taskName,
      qualificationRecord: { path: await realpath(f.recordPath), sha256: hash(before[0]) } }]);
    expect(await Promise.all(files.map(path => readFile(path)))).toEqual(before);
  });
  it('returns no references when the optional record is absent', async () => {
    const f = await fixture(); await rm(f.recordPath);
    await expect(readSourceComponentQualifications(f.options)).resolves.toEqual([]);
  });
  it('does not discover unlisted files or qualify by filename', async () => {
    const f = await fixture(); await copyFile(f.component, join(f.recovery, 'sharper-official-logo.png'));
    expect(await readSourceComponentQualifications(f.options)).toHaveLength(1);
  });
  it('rejects malformed present JSON instead of treating it as absent', async () => {
    const f = await fixture(); await writeFile(f.recordPath, '{bad-json');
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow();
  });
  it('rejects missing referenced files instead of treating the record as absent', async () => {
    const f = await fixture(); await rm(f.component);
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow();
  });
  it.each(['schema_version', 'sku', 'reviewedBy'] as const)('rejects wrong %s', async field => {
    const f = await fixture(); f.record[field] = 'wrong'; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('schema/SKU/original owner/date');
  });
  it.each(['not-a-date', '2026-10-19T21:39:28', '2026-02-30T12:00:00Z'])('rejects invalid or timezone-free review %s', async date => {
    const f = await fixture(); f.record.reviewedAt = date; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('date');
  });
  it('rejects wrong original owner routing even if the record claims that owner', async () => {
    const f = await fixture(); f.options.owner.taskName = '/root/sku_730181';
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('routing mismatch');
  });
  it('rejects wrong optional owner UUID', async () => {
    const f = await fixture(); await writeFile(f.recordPath, JSON.stringify({ ...f.record, ownerThreadId: '01a14645-33c5-7710-bfa6-0af44788d501' }));
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('UUID mismatch');
  });
  it('accepts a present UUID only when it is the original routed UUID', async () => {
    const f = await fixture(); await writeFile(f.recordPath, JSON.stringify({ ...f.record, ownerThreadId: f.options.owner.threadId }));
    await expect(readSourceComponentQualifications(f.options)).resolves.toHaveLength(1);
  });
  it('rejects another primary path even if its bytes/hash are identical', async () => {
    const f = await fixture(); const other = join(f.root, 'other-primary.png'); await copyFile(f.primary, other);
    f.record.primaryPath = other; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('actual approved primary');
  });
  it('rejects changed primary bytes', async () => {
    const f = await fixture(); await writeFile(f.primary, 'changed primary');
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('actual approved primary');
  });
  it('rejects a claimed primary hash different from its pinned actual hash', async () => {
    const f = await fixture(); f.record.primarySha256 = '0'.repeat(64); await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('actual approved primary');
  });
  it('rejects a component copied into another source SKU folder', async () => {
    const f = await fixture(); const other = join(f.old, 'artwork-source-recovery', '730181'); await mkdir(other);
    const path = join(other, 'explicit-fragment.png'); await copyFile(f.component, path); f.record.references[0].path = path; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('own root');
  });
  it('rejects an outside file even when its recorded hash is genuine', async () => {
    const f = await fixture(); const path = join(f.root, 'outside.png'); await copyFile(f.component, path); f.record.references[0].path = path; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('own root');
  });
  it('rejects recovery subdirectory links even when they lead back inside its own root', async () => {
    const f = await fixture(); const nested = join(f.recovery, 'real'); await mkdir(nested); await copyFile(f.component, join(nested, 'logo.png'));
    const alias = join(f.recovery, 'alias'); await symlink(nested, alias, process.platform === 'win32' ? 'junction' : 'dir');
    f.record.references[0].path = join(alias, 'logo.png'); await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('Symlink/junction');
  });
  it('rejects escaping recovery subdirectory links', async () => {
    const f = await fixture(); const outside = join(f.root, 'outside'); await mkdir(outside); await copyFile(f.component, join(outside, 'logo.png'));
    const alias = join(f.recovery, 'alias'); await symlink(outside, alias, process.platform === 'win32' ? 'junction' : 'dir');
    f.record.references[0].path = join(alias, 'logo.png'); await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('own root');
  });
  it.each(['exact-package', 'complete-label'])('rejects whole-label/non-qualified scope %s', async scope => {
    const f = await fixture(); f.record.references[0].scope = scope; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('isolated component');
  });
  it('rejects whole-alternative-label acceptance', async () => {
    const f = await fixture(); f.record.wholeAlternativeLabelStatus = 'matched'; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('Complete alternative labels');
  });
  it.each(['matched', 'different-revision'])('rejects non-component status %s', async status => {
    const f = await fixture(); f.record.references[0].status = status; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('matched-components');
  });
  it('rejects blank qualification notes', async () => {
    const f = await fixture(); f.record.references[0].notes = ' '; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('notes/path/hash');
  });
  it('rejects changed component bytes', async () => {
    const f = await fixture(); await writeFile(f.component, 'changed component');
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('component hash changed');
  });
  it('rejects a document/non-raster file even with a correct hash and component scope', async () => {
    const f = await fixture(); await writeFile(f.component, '%PDF whole document');
    f.record.references[0].sha256 = hash(await readFile(f.component)); await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow();
  });
  it('rejects duplicate explicit references', async () => {
    const f = await fixture(); f.record.references.push({ ...f.record.references[0] }); await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('Duplicate');
  });
  it('rejects empty references', async () => {
    const f = await fixture(); f.record.references = []; await f.save();
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('nonempty component');
  });
  it('rejects unknown record fields rather than silently changing qualification semantics', async () => {
    const f = await fixture(); await writeFile(f.recordPath, JSON.stringify({ ...f.record, allowWholeLabels: true }));
    await expect(readSourceComponentQualifications(f.options)).rejects.toThrow('Unknown or missing');
  });
});
