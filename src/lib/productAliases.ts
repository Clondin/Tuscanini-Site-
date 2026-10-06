export const productAliases: Record<string, string> = {
  "all-purpose-flour-1kg": "all-purpose-flour-2-2lb",
  "high-gluten-flour-2-27kg": "high-gluten-flour-5lb",
  "spelt-white-flour-2-27kg": "spelt-white-flour-5lb",
};

export function canonicalProductId(id: string): string {
  return productAliases[id] ?? id;
}
