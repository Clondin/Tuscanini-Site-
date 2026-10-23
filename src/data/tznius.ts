// Tznius review (2026-10-23): kosher.com video posters that show a woman are swapped for a
// people-free Tuscanini image. The videos themselves still play; only the still frame changes.
export const TZNIUS_PLACEHOLDER_POSTERS = ["/assets/ads/tomato-group-tuscanini-web.jpg", "/assets/ads/beverages-wide.jpg", "/assets/ads/gnocchi-recipe.jpg", "/assets/ads/balsamic-parallax.jpg"];

// 2026-10-23: kosher.com posters are restored as-is (kosher.com already vets its images); none are hidden.
const HIDDEN_POSTER_IDS = new Set<string>([]);

/** A people-free Tuscanini poster for a JW media id whose own poster shows a woman, else undefined. */
export function tzniusPoster(jw: string): string | undefined {
  if (!HIDDEN_POSTER_IDS.has(jw)) return undefined;
  let h = 0;
  for (const c of jw) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TZNIUS_PLACEHOLDER_POSTERS[h % TZNIUS_PLACEHOLDER_POSTERS.length];
}
