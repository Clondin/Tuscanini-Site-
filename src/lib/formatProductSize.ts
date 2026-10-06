const SIZE_UNIT = /\b(\d+(?:[.,]\d+)?)\s*(fl\s*oz|kg|ml|liters?|litres?|l|g|oz|lbs?|pt)\b/gi;

const units: Record<string, string> = {
  floz: "fl oz",
  oz: "oz",
  g: "g",
  kg: "kg",
  lb: "lb",
  lbs: "lb",
  ml: "mL",
  l: "L",
  liter: "L",
  liters: "L",
  litre: "L",
  litres: "L",
  pt: "pt",
};

const singleSize = /^\d+(?:[.,]\d+)? (?:fl oz|oz|g|kg|lb|mL|L|pt)(?: \(\d+(?:[.,]\d+)? (?:fl oz|oz|g|kg|lb|mL|L|pt)\))?$/;

/** Display formatting only: preserve the catalogue's amounts and units, without conversions. */
export function formatProductSize(size?: string): string {
  if (!size) return "";

  const formatted = size.trim().replace(/\s+/g, " ").replace(
    SIZE_UNIT,
    (_token, amount: string, unit: string) => `${amount} ${units[unit.toLowerCase().replace(/\s/g, "")]}`,
  ).replace(/(\d+)\s*[x×]\s*(?=\d)/gi, "$1 × ");

  if (/^Available in /i.test(formatted)) {
    const options = formatted.replace(/^Available in /i, "").split(/\s+and\s+/i);
    if (options.every((option) => singleSize.test(option))) return options.join(" / ");
  }

  return formatted;
}
