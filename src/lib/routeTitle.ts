const compactProductNames: Record<string, string> = {
  "Solid Light Tuna in Olive Oil with Chili Peppers - Can": "Tuna in Olive Oil with Chili - Can",
  "Solid Light Tuna in Olive Oil with Chili Peppers - Three Pack": "Tuna in Olive Oil with Chili - 3 Pack",
};

export function productRouteTitle(name: string, siteTitle = "Tuscanini"): string {
  return `${compactProductNames[name] ?? name} | ${siteTitle}`;
}
