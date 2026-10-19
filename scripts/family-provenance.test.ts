import { afterEach, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { storyFiles, validateStoryCompositeProvenance, type StoryProvenanceOptions } from './family-provenance';

const execute = promisify(execFile);
const python = process.platform === 'win32' ? join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe') : 'python3';
const helper = resolve('scripts/source-preserving-stories-v2.py');
const fixtures = resolve('scripts/test_source_preserving_stories_v2.py');
const temps: string[] = [];
const hash = (data: Uint8Array): string => createHash('sha256').update(data).digest('hex');
const readJson = async (path: string) => JSON.parse(await readFile(path, 'utf8'));
const saveJson = async (path: string, value: unknown) => writeFile(path, JSON.stringify(value, null, 2));
afterEach(async () => { for (const path of temps.splice(0)) await rm(path, { recursive: true, force: true }); });

async function fixture(): Promise<{ options: StoryProvenanceOptions; configPath: string; receiptPath: string; approvalPath: string; candidatePath: string }> {
  const temp = await mkdtemp(join(tmpdir(), 'story-provenance-')); temps.push(temp);
  const { stdout } = await execute(python, [fixtures, '--fixture', join(temp, 'fixture')], { windowsHide: true });
  const f = JSON.parse(stdout) as { job: string; sku_root: string; base: string; config_path: string; approval_path: string };
  const receiptPath = join(f.sku_root, 'candidate.receipt.json');
  const receipt = await readJson(receiptPath);
  const candidatePath = join(f.sku_root, 'candidate.png');
  for (const [index, file] of storyFiles.entries()) {
    if (index === 3) await copyFile(candidatePath, join(f.sku_root, file));
    else await sharp({ create: { width: 24, height: 24, channels: 4, background: { r: index * 40, g: 60, b: 100, alpha: 1 } } }).png().toFile(join(f.sku_root, file));
  }
  const hashes: Record<string, string> = {};
  for (const file of storyFiles) hashes[file] = hash(await readFile(join(f.sku_root, file)));
  return {
    configPath: f.config_path, receiptPath, approvalPath: f.approval_path, candidatePath,
    options: {
      jobRoot: f.job, skuRoot: f.sku_root, sku: '730100', role: 'family', imageGenRoot: join(temp, 'fixture/generated_images'),
      toolkitPath: helper, owners: new Map(),
      artworkReview: { status: 'matched', reviewedBy: '/root/sku_730100', reviewedImages: storyFiles, reviewedImageHashes: hashes },
      image: { file: '04-family.png', originalPath: f.base, qa: { accepted: true, visuallyInspected: true }, provenance: {
        kind: 'source-preserving-story-composite', receiptPath, promotedFrom: candidatePath,
        reviewedSources: receipt.sources.map(({ source_sku, dimensions, ...source }: { source_sku: string; dimensions: unknown }) => { void dimensions; return { ...source, sourceSku: source_sku }; }),
      } },
    },
  };
}

// These tests render and replay real Python fixtures while the full suite may run in parallel.
describe('bounded story original-photo provenance', { timeout: 30_000 }, () => {
  it('accepts assigned companion pixels with exact promoted copy and all-four review', async () => {
    const f = await fixture();
    const files = [f.configPath, f.receiptPath, f.approvalPath, f.candidatePath];
    const before = await Promise.all(files.map(path => readFile(path)));
    await validateStoryCompositeProvenance(f.options);
    expect(await Promise.all(files.map(path => readFile(path)))).toEqual(before);
    expect(f.options.owners.size).toBe(2);
  });
  it('keeps old versioned approvals usable when a different latest approval appears', async () => {
    const f = await fixture();
    await writeFile(join(f.options.jobRoot, 'approvals/latest.json'), '{"not":"the pinned approval"}');
    await expect(validateStoryCompositeProvenance(f.options)).resolves.toBeUndefined();
  });
  it('rejects a role/file mismatch', async () => {
    const f = await fixture(); f.options.role = 'use';
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('filename/role');
  });
  it('requires actual all-four final hashes', async () => {
    const f = await fixture(); delete f.options.artworkReview!.reviewedImageHashes!['02-use.png'];
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('artwork review hash');
  });
  it('requires the original hero owner', async () => {
    const f = await fixture(); f.options.artworkReview!.reviewedBy = '/root/sku_730101';
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('original hero owner');
  });
  it('rejects mismatched reviewed source SKU even when the photo is identical', async () => {
    const f = await fixture(); f.options.image.provenance!.reviewedSources[0].sourceSku = '730102';
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('reviewedSources');
  });
  it('rejects changed approval bytes without silently selecting a new approval', async () => {
    const f = await fixture(); const a = await readJson(f.approvalPath); a.approvedAt = '2026-10-19T13:00:00Z'; await saveJson(f.approvalPath, a);
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('Pinned file hash mismatch');
  });
  it('rejects a non-ImageGen base even when pinned', async () => {
    const f = await fixture(); f.options.imageGenRoot = f.options.skuRoot;
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('actual ImageGen raw');
  });
  it('rejects changed promoted bytes', async () => {
    const f = await fixture(); await copyFile(join(f.options.skuRoot, '02-use.png'), join(f.options.skuRoot, '04-family.png'));
    f.options.artworkReview!.reviewedImageHashes!['04-family.png'] = hash(await readFile(join(f.options.skuRoot, '04-family.png')));
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('differ from candidate');
  });
  it('rejects cross-hero generated output reuse without registering new ownership', async () => {
    const f = await fixture(); const r = await readJson(f.receiptPath); f.options.owners.set(r.base.sha256, '730102');
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('reused across hero SKUs');
    expect(f.options.owners.size).toBe(1);
  });
  it('rejects a forged receipt geometry through actual Python replay', async () => {
    const f = await fixture(); const r = await readJson(f.receiptPath); r.patches[0].target_quad[0][0] += 1; await saveJson(f.receiptPath, r);
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('Story receipt invariant mismatch: patches');
    expect(f.options.owners.size).toBe(0);
  });
  it('rejects a helper path different from its pin', async () => {
    const f = await fixture(); f.options.toolkitPath = resolve('scripts/source-photo-alpha.py');
    await expect(validateStoryCompositeProvenance(f.options)).rejects.toThrow('helper pin mismatch');
  });
});
