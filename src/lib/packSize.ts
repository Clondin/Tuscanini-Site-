/**
 * The v2 shelf shows packs at relative height. We have no physical dimensions in the
 * catalogue, only the printed pack size ("25.4 fl oz (750ml)", "1 L", "4.6oz"), so we
 * approximate: parse a volume, then scale height by its cube root — the dimensionally
 * correct relation between a volume and a linear dimension. Within a single category,
 * where pack formats are alike, this orders and spaces the packs believably.
 */

const UNIT_TO_ML: Record<string, number> = {
  l: 1000,
  liter: 1000,
  litre: 1000,
  ml: 1,
  kg: 1000,
  g: 1,
  oz: 29.57,
  lb: 453.6,
};

const SIZE_TOKEN = /(\d+(?:[.,]\d+)?)\s*(fl\s*oz|oz|ml|l(?![a-z])|liters?|litres?|kg|g(?![a-z])|lb)/gi;

/** Largest volume-equivalent in ml mentioned in a pack-size string, or null. */
export function parseVolumeMl(size?: string): number | null {
  if (!size) return null;

  let largest: number | null = null;
  for (const match of size.matchAll(SIZE_TOKEN)) {
    const amount = Number.parseFloat(match[1].replace(",", "."));
    if (!Number.isFinite(amount)) continue;

    const unit = match[2].toLowerCase().replace(/\s+/g, "").replace("floz", "oz");
    const factor = UNIT_TO_ML[unit] ?? UNIT_TO_ML[unit.replace(/s$/, "")];
    if (!factor) continue;

    const ml = amount * factor;
    if (largest === null || ml > largest) largest = ml;
  }
  return largest;
}

export type ShelfSizing = {
  /** Rendered pack height in px. */
  height: number;
  /** Column width in px, kept proportional so packs do not crowd. */
  width: number;
};

type SizingOptions = {
  /** Height for a pack of median volume. */
  base?: number;
  min?: number;
  max?: number;
};

/**
 * Height for each pack, keyed by product id. Packs with no parseable size fall back to
 * the median so they sit sensibly on the shelf rather than collapsing.
 */
export function shelfSizing<T extends { id: string; size?: string }>(
  products: T[],
  { base = 220, min = 130, max = 300 }: SizingOptions = {},
): Record<string, ShelfSizing> {
  const volumes = products
    .map((p) => parseVolumeMl(p.size))
    .filter((v): v is number => v !== null && v > 0)
    .sort((a, b) => a - b);

  const median = volumes.length
    ? volumes[Math.floor((volumes.length - 1) / 2)]
    : null;

  const sizing: Record<string, ShelfSizing> = {};
  for (const product of products) {
    const volume = parseVolumeMl(product.size);
    let height = base;

    if (median && volume && volume > 0) {
      height = base * Math.cbrt(volume / median);
      height = Math.min(max, Math.max(min, height));
    }

    sizing[product.id] = {
      height: Math.round(height),
      // Wide enough for the pack plus breathing room, and never narrower than a label.
      width: Math.round(Math.max(150, height * 0.78)),
    };
  }
  return sizing;
}
