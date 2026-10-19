import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const jobRoot = resolve(process.argv[2] ?? 'output/tuscanini-imagegen-20261016');
const manifest = JSON.parse(await readFile(join(jobRoot, 'manifest.json'), 'utf8')) as { items: Array<{ sku: string; id: string; name: string }> };
const names = ['01-studio.png', '02-kitchen.png', '03-table.png', '04-environment.png'];
const captions = ['Enhanced original', 'Kitchen', 'At the table', 'Environment'];
const ready: string[] = [];
const packagingAuditPending: string[] = [];
const producing: string[] = [];
const blocked: Array<{ sku: string; reason: string }> = [];
const cards: string[] = [];
let acceptedIndividualImages = 0;
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

for (const item of manifest.items) {
  const directory = join(jobRoot, 'skus', item.sku);
  let receipt: { status: string; reason?: string; blockedReason?: string; parentReview?: { reason?: string }; blockers?: Array<string | { reason?: string }>; images?: Array<{ file: string; qa?: { accepted?: boolean } }>; detailReferenceReview?: { status: string; reviewedImages?: string[] } };
  try { receipt = JSON.parse(await readFile(join(directory, 'receipt.json'), 'utf8')); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') producing.push(item.sku);
    continue;
  }
  acceptedIndividualImages += receipt.images?.filter(image => image.qa?.accepted === true).length ?? 0;
  if (receipt.status === 'blocked') {
    const blockerText = Array.isArray(receipt.blockers)
      ? receipt.blockers.map(entry => typeof entry === 'string' ? entry : entry?.reason).filter(Boolean).join(' ') : '';
    blocked.push({ sku: item.sku, reason: receipt.parentReview?.reason ?? receipt.blockedReason ?? receipt.reason ?? (blockerText || 'See SKU receipt') });
    continue;
  }
  if (receipt.status !== 'ready') { producing.push(item.sku); continue; }
  const complete = await Promise.all(names.map(async file => {
    if (!Array.isArray(receipt.images) || !receipt.images.some(image => image.file === file && image.qa?.accepted === true)) return false;
    try { return (await stat(join(directory, file))).size > 0; } catch { return false; }
  }));
  if (!complete.every(Boolean)) { producing.push(item.sku); continue; }
  ready.push(item.sku);
  const files = await readdir(directory);
  const source = files.find(file => /^source\.(png|webp|jpe?g)$/.test(file));
  const originals = files.filter(file => /^source-original\.(png|webp|jpe?g)$/.test(file));
  const detailCandidates = files.filter(file => /^source-detail-.*\.(png|webp|jpe?g)$/.test(file));
  if (detailCandidates.length && (!receipt.detailReferenceReview
    || !['matched', 'different-revision'].includes(receipt.detailReferenceReview.status)
    || !names.every(file => receipt.detailReferenceReview?.reviewedImages?.includes(file)))) {
    packagingAuditPending.push(item.sku);
  }
  const apiReference = files.find(file => /^api-reference\.(png|webp|jpe?g)$/.test(file));
  const references = [apiReference, source, ...originals, ...detailCandidates].filter((file): file is string => Boolean(file));
  const referenceCaption = (file: string) => file === apiReference ? 'Saved API photo'
    : file.startsWith('source-original.') ? 'Company original'
      : file.startsWith('source-detail-') ? 'Sharper candidate — compare label revision' : 'Staged original';
  const approvedReferenceOverride = files.includes('reference-override.json')
    && JSON.parse((await readFile(join(directory, 'reference-override.json'), 'utf8')).replace(/^\uFEFF/, '')).parentReviewed === true;
  const overrideNote = approvedReferenceOverride
    ? '<p>The saved catalog photo showed another product. A matching company original was verified for this SKU; the mismatched reference is retained below.</p>' : '';
  cards.push(`<article id="sku-${item.sku}">
    <header><div><small>SKU ${item.sku}</small><h2>${escape(item.name)}</h2></div><a href="/product/${escape(item.id)}" target="_blank" rel="noopener">Open product ↗</a></header>
    <div class="images">${names.map((file, index) => `<figure><a href="skus/${item.sku}/${file}" target="_blank" rel="noopener"><img src="skus/${item.sku}/${file}" loading="lazy" alt="${escape(item.name)} — ${captions[index]}"></a><figcaption>${captions[index]}</figcaption></figure>`).join('')}</div>
    <details><summary>Compare original references</summary>${overrideNote}<div class="references">${references.map(file => `<figure><a href="skus/${item.sku}/${file}" target="_blank" rel="noopener"><img src="skus/${item.sku}/${file}" loading="lazy" alt="${referenceCaption(file)} for ${escape(item.name)}"></a><figcaption>${referenceCaption(file)}</figcaption></figure>`).join('')}</div></details></article>`);
}

if (packagingAuditPending.length) cards.unshift(`<article><h2>Sharper-reference comparison in progress</h2><p>${packagingAuditPending.length} sets with four accepted images still need comparison against newly discovered company front photos before publication. Existing files are retained unless that comparison confirms a label error.</p></article>`);
if (blocked.length) cards.push(`<article><details><summary>${blocked.length} SKU sets held for repair</summary><ul>${blocked.map(item => `<li><a href="skus/${item.sku}/receipt.json" target="_blank" rel="noopener">SKU ${item.sku}</a>: ${escape(item.reason)}</li>`).join('')}</ul></details></article>`);

const progress = { updatedAt: new Date().toISOString(), totalSkus: manifest.items.length, targetImages: manifest.items.length * 4, readySkus: ready.length, readyImages: ready.length * 4, acceptedIndividualImages, fullyReviewedSkus: ready.length - packagingAuditPending.length, packagingAuditPendingSkus: packagingAuditPending.length, packagingAuditPending, producingSkus: producing.length, blockedSkus: blocked.length, pendingSkus: manifest.items.length - ready.length - producing.length - blocked.length, ready, producing, blocked, publishedImages: 0 };
await writeFile(join(jobRoot, 'progress.json'), JSON.stringify(progress, null, 2) + '\n');
try {
  const statusFile = join(jobRoot, 'job-status.json');
  const status = JSON.parse(await readFile(statusFile, 'utf8'));
  await writeFile(statusFile, JSON.stringify({ ...status, updatedAt: progress.updatedAt, readySkuCount: ready.length, readyImageCount: ready.length * 4, readySkus: ready, packagingAuditPendingSkus: packagingAuditPending }, null, 2) + '\n');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}
await writeFile(join(jobRoot, 'review.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tuscanini image review</title><style>*{box-sizing:border-box}body{margin:0;background:#f7f4ed;color:#211f1b;font:15px/1.5 system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:32px 24px}h1{font:500 clamp(32px,5vw,58px)/1.1 Georgia,serif;margin:12px 0}h2{font:500 27px/1.2 Georgia,serif;margin:4px 0}p{color:#5a574e}.summary{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0 36px}.summary strong{border:1px solid #bcb7aa;padding:12px 18px;font-size:17px;background:#fffdf8}article{background:#fffdf8;border:1px solid #ccc7bb;margin:24px 0;padding:20px}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}small{letter-spacing:.12em;color:#666046}a{color:#314d37;text-underline-offset:4px}.images{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}figure{margin:0}img{width:100%;aspect-ratio:1;object-fit:contain;background:#edeae2;display:block}figcaption{padding:10px 0;font-size:13px;font-weight:600}details{margin-top:12px}summary{cursor:pointer;color:#5a574e}.references{display:flex;gap:16px;margin-top:16px}.references img{max-width:220px;max-height:240px}footer{color:#716c61;font-size:13px}@media(max-width:700px){main{padding:20px 12px}article{padding:12px}.images{grid-template-columns:repeat(2,minmax(0,1fr))}header{align-items:start;flex-direction:column}}</style><main><small>TUSCANINI · IMAGE PRODUCTION</small><h1>Product image review</h1><p>One faithful enhanced original and three placements per SKU. Click any image for its full size.</p><div class="summary"><strong>${progress.readySkus} / ${progress.totalSkus} four-image sets accepted</strong><strong>${progress.fullyReviewedSkus} sets have completed source review</strong><strong>${progress.acceptedIndividualImages} / ${progress.targetImages} individual images accepted</strong><strong>${progress.producingSkus} sets in progress</strong><strong>${progress.blockedSkus} sets need attention</strong></div><p>Local review only. Publication is tracked separately. Refresh this page after the review file is regenerated.</p>${cards.join('\n')}<footer>Updated ${escape(progress.updatedAt)}. Originals and generation records are retained with each SKU.</footer></main></html>`);
console.log(JSON.stringify({ readySkus: progress.readySkus, readyImages: progress.readyImages, producingSkus: progress.producingSkus, blockedSkus: progress.blockedSkus, pendingSkus: progress.pendingSkus }));
