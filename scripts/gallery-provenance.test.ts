import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { galleryFiles, sha256, validateCompositeArtworkReview, validateGalleryProvenance, type GalleryReceiptImage } from './gallery-provenance';

const temporaryRoots: string[] = [];
afterEach(async () => { await Promise.all(temporaryRoots.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
const saveJson = (path: string, value: unknown) => writeFile(path, JSON.stringify(value));
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'gallery-provenance-'));
  temporaryRoots.push(root);
  const jobRoot = join(root, 'job');
  const skuRoot = join(jobRoot, 'skus', '730116');
  const imageGenRoot = join(root, 'generated_images');
  await Promise.all([mkdir(skuRoot, { recursive: true }), mkdir(imageGenRoot)]);
  const toolkitPath = join(root, 'source-preserving-composite.py');
  await writeFile(toolkitPath, '# pinned deterministic toolkit fixture');
  const base = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#ba1234' } }).png().toBuffer();
  const source = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#00ff22' } }).png().toBuffer();
  const final = await sharp({ create: { width: 8, height: 8, channels: 4, background: '#1133cc' } }).png().toBuffer();
  const originalPath = join(imageGenRoot, 'scene.png');
  const sourcePath = join(skuRoot, 'source.png');
  await Promise.all([writeFile(originalPath, base), writeFile(sourcePath, source), ...galleryFiles.map(file => writeFile(join(skuRoot, file), final))]);
  const receiptPath = join(skuRoot, 'composite-receipt.json');
  const configPath = join(skuRoot, 'composite-config.json');
  const reviewer = '/root/sku_730116';
  const approval = {
    schema_version: 'source-preserving-approval/v1', approved: true, approvedBy: 'user', approvedAt: '2026-10-17T12:00:00Z',
    method: 'deterministic-original-photo-homography', toolkit: { path: toolkitPath, sha256: sha256(await readFile(toolkitPath)) },
    skus: ['730116'], owners: { '730116': reviewer },
  };
  const config = {
    schema_version: 'source-preserving-composite/v1', sku: '730116', imagegen_base: { path: originalPath },
    output_path: join(skuRoot, galleryFiles[0]), receipt_path: receiptPath,
    review: { source_and_base_viewed: true, reviewer, viewed_at: approval.approvedAt }, patches: [{ id: 'label', source_path: sourcePath, source_quad: [[0, 0], [8, 0], [8, 8], [0, 8]], target_quad: [[0, 0], [8, 0], [8, 8], [0, 8]] }],
  };
  await saveJson(configPath, config);
  const asset = (path: string, bytes: Buffer) => ({ path, sha256: sha256(bytes), dimensions: { width: 8, height: 8 } });
  const receipt = {
    schema_version: 'source-preserving-composite-receipt/v1', method: approval.method, sku: '730116',
    config: { path: configPath, sha256: sha256(await readFile(configPath)) }, toolkit: approval.toolkit,
    base: asset(originalPath, base), sources: [asset(sourcePath, source)], final: asset(config.output_path, final),
    review: config.review,
    patches: [{ ...config.patches[0], source_sha256: sha256(source), source_polygon: config.patches[0].source_quad, inverse_homography: [1, 0, 0, 0, 1, 0, 0, 0], affected_pixels: 64, opacity: 1, feather_px: 0 }],
  };
  await saveJson(receiptPath, receipt);
  await saveJson(join(jobRoot, 'source-preserving-approval.json'), approval);
  const image: GalleryReceiptImage = {
    file: galleryFiles[0], originalPath, qa: { accepted: true, visuallyInspected: true },
    provenance: { kind: 'source-preserving-composite', receiptPath, reviewedSources: [
      { path: sourcePath, sha256: sha256(source), scope: 'exact-package', status: 'matched', reviewer, notes: 'Exact package revision reviewed against the API reference.' },
    ] },
  };
  const artworkReview = { status: 'matched', reviewedBy: reviewer, reviewedImages: [...galleryFiles], reviewedImageHashes: Object.fromEntries(galleryFiles.map(file => [file, sha256(final)])) };
  const options = { jobRoot, skuRoot, sku: '730116', image, imageGenRoot, toolkitPath, artworkReview, owners: new Map<string, string>() };
  return { root, options, approval, config, receipt, receiptPath, configPath, base, source, final };
}

describe('gallery provenance', () => {
  it('keeps the original byte-equality requirement for pure ImageGen output', async () => {
    const { options, base } = await fixture();
    delete options.image.provenance;
    await expect(validateGalleryProvenance(options)).rejects.toThrow('differs from');
    await writeFile(join(options.skuRoot, options.image.file), base);
    await expect(validateGalleryProvenance(options)).resolves.toBeUndefined();
  });

  it('accepts an approved, source-reviewed composite while preserving its raw base ownership', async () => {
    const { options, base, final } = await fixture();
    await validateCompositeArtworkReview(options.skuRoot, options.artworkReview);
    await validateGalleryProvenance(options);
    expect(options.owners.get(sha256(base))).toBe('730116');
    expect(options.owners.get(sha256(final))).toBe('730116');
  });

  it.each(['approved', 'approvedBy', 'method', 'skus', 'owners'] as const)('rejects missing or mismatched approval %s', async field => {
    const { options, approval } = await fixture();
    const invalid = { ...approval, [field]: field === 'approved' ? false : field === 'skus' ? [] : field === 'owners' ? { '730116': 'another-owner' } : 'unapproved' };
    await saveJson(join(options.jobRoot, 'source-preserving-approval.json'), invalid);
    await expect(validateGalleryProvenance(options)).rejects.toThrow();
  });

  it('rejects a claimed composite when no root approval file exists', async () => {
    const { options } = await fixture();
    await rm(join(options.jobRoot, 'source-preserving-approval.json'));
    await expect(validateGalleryProvenance(options)).rejects.toThrow();
  });

  it.each(['base', 'source', 'final', 'toolkit', 'config'] as const)('rejects changed %s bytes', async kind => {
    const { options, receipt } = await fixture();
    const path = kind === 'source' ? receipt.sources[0].path : receipt[kind].path;
    await writeFile(path, 'changed bytes after review');
    await expect(validateGalleryProvenance(options)).rejects.toThrow();
  });

  it('rejects a raw original outside the generated_images directory even when its bytes match', async () => {
    const { options, base } = await fixture();
    delete options.image.provenance;
    options.image.originalPath = join(options.skuRoot, 'pretend-raw.png');
    await writeFile(options.image.originalPath, base);
    await writeFile(join(options.skuRoot, options.image.file), base);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('outside');
  });

  it('rejects stale all-four artwork review after a stable final changes', async () => {
    const { options, source } = await fixture();
    await writeFile(join(options.skuRoot, '04-environment.png'), source);
    await expect(validateCompositeArtworkReview(options.skuRoot, options.artworkReview)).rejects.toThrow('04-environment.png');
  });

  it('requires all four artwork reviews, including unchanged outputs', async () => {
    const { options } = await fixture();
    options.artworkReview.reviewedImages.pop();
    await expect(validateCompositeArtworkReview(options.skuRoot, options.artworkReview)).rejects.toThrow('all four');
  });

  it('rejects a reused raw scene across SKUs even when the composite final is new', async () => {
    const { options, base } = await fixture();
    options.owners.set(sha256(base), '730999');
    await expect(validateGalleryProvenance(options)).rejects.toThrow('730999');
  });

  it.each(['pure-first', 'composite-first'])('rejects mixed pure/composite raw reuse in %s order', async order => {
    const { options, base } = await fixture();
    const pureRoot = join(options.jobRoot, 'skus', '730999');
    await mkdir(pureRoot);
    await writeFile(join(pureRoot, galleryFiles[0]), base);
    const pure = {
      ...options, sku: '730999', skuRoot: pureRoot,
      image: { file: galleryFiles[0], originalPath: options.image.originalPath, qa: { accepted: true, visuallyInspected: true } },
    };
    const [first, second] = order === 'pure-first' ? [pure, options] : [options, pure];
    await expect(validateGalleryProvenance(first)).resolves.toBeUndefined();
    await expect(validateGalleryProvenance(second)).rejects.toThrow('reused from SKU');
  });

  it('requires the same owner to visually inspect the final and qualify each source', async () => {
    const { options } = await fixture();
    options.image.provenance!.reviewedSources[0].reviewer = 'different-owner';
    await expect(validateGalleryProvenance(options)).rejects.toThrow('identity/revision');
    options.image.provenance!.reviewedSources[0].reviewer = options.artworkReview.reviewedBy;
    options.image.qa!.visuallyInspected = false;
    await expect(validateGalleryProvenance(options)).rejects.toThrow('visual acceptance');
  });

  it('rejects incorrect dimensions even when bytes and hashes still match', async () => {
    const { options, receipt, receiptPath } = await fixture();
    receipt.final.dimensions.width = 9;
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('dimensions mismatch');
  });

  it('rejects a receipt pointing to a different stable output', async () => {
    const { options, receipt, receiptPath } = await fixture();
    receipt.final.path = join(options.skuRoot, '02-kitchen.png');
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('actual stable final');
  });

  it('accepts a preserved same-SKU candidate promoted byte-for-byte to the stable final', async () => {
    const { options, receipt, receiptPath, config, configPath, final } = await fixture();
    const candidate = join(options.skuRoot, 'label-candidate.png');
    await writeFile(candidate, final);
    config.output_path = candidate;
    receipt.final.path = candidate;
    options.image.provenance!.promotedFrom = candidate;
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).resolves.toBeUndefined();
    await writeFile(candidate, 'candidate changed after promotion');
    await expect(validateGalleryProvenance(options)).rejects.toThrow('hash mismatch');
  });

  it('refuses a promoted candidate from another SKU even when its bytes match', async () => {
    const { options, receipt, receiptPath, final } = await fixture();
    const otherRoot = join(options.jobRoot, 'skus', '730999');
    await mkdir(otherRoot);
    const candidate = join(otherRoot, 'candidate.png');
    await writeFile(candidate, final);
    receipt.final.path = candidate;
    options.image.provenance!.promotedFrom = candidate;
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('outside its SKU');
  });

  it('rejects an unqualified source from another SKU even when its source hash is valid', async () => {
    const { options, receipt, receiptPath, config, configPath, source } = await fixture();
    const otherRoot = join(options.jobRoot, 'skus', '730999');
    await mkdir(otherRoot);
    const otherPath = join(otherRoot, 'source.png');
    await writeFile(otherPath, source);
    receipt.sources[0].path = otherPath;
    options.image.provenance!.reviewedSources[0].path = otherPath;
    config.patches[0].source_path = otherPath;
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('own-SKU');
  });

  it('rejects patch configuration that names a different source than the receipt', async () => {
    const { options, receipt, receiptPath, config, configPath } = await fixture();
    config.patches[0].source_path = receipt.base.path;
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('patch sources disagree');
  });

  it.each(['own-original', 'qualified-component'])('accepts a reviewed %s source with matching actual evidence', async kind => {
    const { options, receipt, receiptPath, config, configPath, source } = await fixture();
    const sourceRoot = kind === 'own-original' ? options.skuRoot : join(options.jobRoot, 'artwork-source-recovery', options.sku);
    await mkdir(sourceRoot, { recursive: true });
    const sourcePath = join(sourceRoot, kind === 'own-original' ? 'source-original.png' : 'qualified-label.png');
    await writeFile(sourcePath, source);
    receipt.sources[0].path = sourcePath;
    receipt.patches[0].source_path = sourcePath;
    config.patches[0].source_path = sourcePath;
    options.image.provenance!.reviewedSources[0].path = sourcePath;
    if (kind === 'qualified-component') {
      options.image.provenance!.reviewedSources[0].scope = 'qualified-component';
      options.image.provenance!.reviewedSources[0].status = 'matched-components';
      options.image.provenance!.reviewedSources[0].notes = 'Exact certification component compared against the original package; full flat layout is not package authority.';
    }
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).resolves.toBeUndefined();
  });

  it('rejects a transformation receipt that differs from the hashed configuration', async () => {
    const { options, receipt, receiptPath } = await fixture();
    receipt.patches[0].target_quad = [[1, 1], [7, 1], [7, 7], [1, 7]];
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('transform differs');
  });
});

async function alphaFixture() {
  const parent = await fixture();
  const { options } = parent;
  const helperPath = join(parent.root, 'source-photo-alpha.py');
  await writeFile(helperPath, await readFile(resolve('scripts/source-photo-alpha.py')));
  const parentCandidate = join(options.skuRoot, 'immutable-parent.png');
  await writeFile(parentCandidate, parent.final);
  parent.config.output_path = parentCandidate;
  parent.receipt.final.path = parentCandidate;
  await saveJson(parent.configPath, parent.config);
  parent.receipt.config.sha256 = sha256(await readFile(parent.configPath));
  await saveJson(parent.receiptPath, parent.receipt);
  const parentImage: GalleryReceiptImage = { ...options.image, file: 'immutable-parent.png' };
  const sourcePath = join(options.skuRoot, 'source-original.png');
  const pixels = Buffer.alloc(8 * 8 * 4);
  for (let index = 0; index < 64; index++) {
    pixels.set([30, 90, 170, index % 8 < 3 ? 0 : 255], index * 4);
  }
  const source = await sharp(pixels, { raw: { width: 8, height: 8, channels: 4 } }).png().toBuffer();
  await writeFile(sourcePath, source);
  const configPath = join(options.skuRoot, 'alpha-config.json');
  const receiptPath = join(options.skuRoot, 'alpha-receipt.json');
  const candidate = join(options.skuRoot, 'alpha-candidate.png');
  const config = {
    schema_version: 'source-photo-alpha/v1', sku: options.sku,
    parent: { receipt_path: parent.receiptPath, receipt_sha256: sha256(await readFile(parent.receiptPath)), candidate_path: parentCandidate, candidate_sha256: sha256(parent.final) },
    source: { path: sourcePath, sha256: sha256(source) },
    source_quad: [[0, 0], [8, 0], [8, 8], [0, 8]], target_quad: [[0, 0], [8, 0], [8, 8], [0, 8]],
    output_path: candidate, receipt_path: receiptPath, review: parent.config.review,
  };
  await saveJson(configPath, config);
  const python = process.platform === 'win32' ? join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe') : 'python3';
  await promisify(execFile)(python, [helperPath, configPath], { windowsHide: true });
  const final = await readFile(candidate);
  await writeFile(join(options.skuRoot, galleryFiles[0]), final);
  options.artworkReview.reviewedImageHashes[galleryFiles[0]] = sha256(final);
  options.image = {
    file: galleryFiles[0], originalPath: parentImage.originalPath, qa: { accepted: true, visuallyInspected: true },
    provenance: {
      kind: 'source-photo-alpha-restoration', receiptPath, promotedFrom: candidate, parentImage,
      reviewedSources: [{ path: sourcePath, sha256: sha256(source), scope: 'exact-package', status: 'matched', reviewer: options.artworkReview.reviewedBy, notes: 'Original own-SKU photographic alpha inspected against the exact product outline.' }],
    },
  };
  const approval = {
    schema_version: 'source-photo-alpha-approval/v1', approved: true, approvedBy: 'user', approvedAt: '2026-10-19T12:00:00Z',
    method: 'deterministic-original-photo-alpha-homography', toolkit: { path: helperPath, sha256: sha256(await readFile(helperPath)) },
    skus: [options.sku], owners: { [options.sku]: options.artworkReview.reviewedBy },
  };
  await saveJson(join(options.jobRoot, 'source-photo-alpha-approval.json'), approval);
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  return { ...parent, options, helperPath, parentCandidate, sourcePath, configPath, receiptPath, candidate, config, receipt, approval };
}

describe('source-photo alpha provenance', () => {
  it('accepts an explicitly approved studio alpha restored by the pinned helper with the complete v1 parent chain', async () => {
    const { options } = await alphaFixture();
    await expect(validateGalleryProvenance(options)).resolves.toBeUndefined();
  });

  it.each(['source-photo-alpha-approval.json', 'source-preserving-approval.json'])('requires the %s approval', async file => {
    const { options } = await alphaFixture();
    await rm(join(options.jobRoot, file));
    await expect(validateGalleryProvenance(options)).rejects.toThrow();
  });

  it('rejects parent candidate tampering before considering alpha evidence', async () => {
    const { options, parentCandidate } = await alphaFixture();
    await writeFile(parentCandidate, 'tampered original v1 pixels');
    await expect(validateGalleryProvenance(options)).rejects.toThrow('parent evidence hash');
  });

  it('rejects a changed parent receipt even if its final candidate is unchanged', async () => {
    const { options, config } = await alphaFixture();
    await writeFile(config.parent.receipt_path, 'tampered original v1 receipt');
    await expect(validateGalleryProvenance(options)).rejects.toThrow('parent evidence hash');
  });

  it('does not let an alpha receipt bypass a broken v1 parent source review', async () => {
    const { options } = await alphaFixture();
    if (options.image.provenance?.kind !== 'source-photo-alpha-restoration') throw new Error('Expected alpha fixture');
    options.image.provenance.parentImage.provenance!.reviewedSources[0].reviewer = 'wrong-owner';
    await expect(validateGalleryProvenance(options)).rejects.toThrow('source identity/revision');
  });

  it.each(['source', 'reviewer'] as const)('rejects the wrong alpha %s', async kind => {
    const { options } = await alphaFixture();
    const source = options.image.provenance!.reviewedSources[0];
    if (kind === 'source') source.sha256 = 'a'.repeat(64);
    else source.reviewer = 'wrong-owner';
    await expect(validateGalleryProvenance(options)).rejects.toThrow('source identity/reviewer');
  });

  it('rejects RGB changes even with refreshed final and channel hashes', async () => {
    const { options, candidate, receipt, receiptPath } = await alphaFixture();
    const raw = await sharp(candidate).raw().toBuffer({ resolveWithObject: true });
    raw.data[0] ^= 255;
    const changed = await sharp(raw.data, { raw: raw.info }).png().toBuffer();
    await writeFile(candidate, changed);
    await writeFile(join(options.skuRoot, galleryFiles[0]), changed);
    receipt.final.sha256 = sha256(changed);
    receipt.decoded_rgb_sha256 = sha256(await sharp(changed).removeAlpha().raw().toBuffer());
    options.artworkReview.reviewedImageHashes[galleryFiles[0]] = sha256(changed);
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('changed parent RGB');
  });

  it('rejects geometry tampering even when config and receipt agree and all RGB/alpha hashes are refreshed', async () => {
    const { options, config, configPath, receipt, receiptPath } = await alphaFixture();
    config.target_quad = [[1, 1], [7, 1], [7, 7], [1, 7]];
    receipt.target_quad = config.target_quad;
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('Pinned alpha helper');
  });

  it('rejects manually changed alpha despite unchanged RGB and refreshed candidate/channel/review hashes', async () => {
    const { options, candidate, receipt, receiptPath } = await alphaFixture();
    const raw = await sharp(candidate).raw().toBuffer({ resolveWithObject: true });
    raw.data[3] = 127;
    const changed = await sharp(raw.data, { raw: raw.info }).png().toBuffer();
    await writeFile(candidate, changed);
    await writeFile(join(options.skuRoot, galleryFiles[0]), changed);
    receipt.final.sha256 = sha256(changed);
    receipt.alpha_sha256 = sha256(await sharp(changed).extractChannel('alpha').raw().toBuffer());
    options.artworkReview.reviewedImageHashes[galleryFiles[0]] = sha256(changed);
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('Pinned alpha helper');
  });

  it('rejects a helper changed after root approval', async () => {
    const { options, helperPath } = await alphaFixture();
    await writeFile(helperPath, '# changed helper');
    await expect(validateGalleryProvenance(options)).rejects.toThrow('helper path or hash');
  });

  it('rejects an actual alpha source from another SKU even with valid byte hashes', async () => {
    const { options, config, configPath, receipt, receiptPath, sourcePath } = await alphaFixture();
    const otherSkuRoot = join(options.jobRoot, 'skus', '730999');
    await mkdir(otherSkuRoot);
    const otherSource = join(otherSkuRoot, 'source-original.png');
    await writeFile(otherSource, await readFile(sourcePath));
    config.source.path = otherSource;
    receipt.source.path = otherSource;
    options.image.provenance!.reviewedSources[0].path = otherSource;
    await saveJson(configPath, config);
    receipt.config.sha256 = sha256(await readFile(configPath));
    await saveJson(receiptPath, receipt);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('own-SKU exact photograph');
  });

  it('requires fresh all-four owner hashes after changing the studio image', async () => {
    const { options } = await alphaFixture();
    options.artworkReview.reviewedImageHashes['04-environment.png'] = '0'.repeat(64);
    await expect(validateGalleryProvenance(options)).rejects.toThrow('04-environment.png');
  });

  it('refuses alpha restoration on a lifestyle slot', async () => {
    const { options } = await alphaFixture();
    options.image.file = '02-kitchen.png';
    await expect(validateGalleryProvenance(options)).rejects.toThrow('studio-only');
  });
});
