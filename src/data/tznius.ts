// Tznius review (2026-10-23): kosher.com video posters that show a woman are swapped for a
// people-free Tuscanini image. The videos themselves still play; only the still frame changes.
export const TZNIUS_PLACEHOLDER_POSTERS = ["/assets/ads/tomato-group-tuscanini-web.jpg", "/assets/ads/beverages-wide.jpg", "/assets/ads/gnocchi-recipe.jpg", "/assets/ads/balsamic-parallax.jpg"];

const HIDDEN_POSTER_IDS = new Set<string>(["1GyCH8KI", "2LIEQeQG", "2WLv4lwr", "2v2G8Xdh", "3k9XNGyL", "54ihtMEP", "5YgHuOWW", "60oWAHzZ", "6ffF5kpu", "82L6oG2Q", "86lJKgWn", "Awc3JKzM", "Ba2IGCNQ", "C6wwr0Lv", "D7rWZWWm", "D8spWoC3", "E059dV41", "EQiBS4Go", "GDujS4tn", "IUsSduyy", "IlElnqBj", "K03DcJ94", "K3MgiVjw", "KMq4ng7Y", "KcFkc3Jp", "MrcFOB0U", "PfqP4y58", "QH5GSzqY", "T3kBUNFJ", "TTBlGS5b", "UMaN6DDe", "V1ITMGy0", "VsW3VR4d", "Vz6rM0RV", "Wpo3QI45", "YD9IYaBa", "aDqdDFXb", "b1Hi93rW", "bP5yrX4C", "cXzlb5Zu", "chyKMPJz", "dLhTsPjy", "fCYv0LOI", "fzZ58k7S", "gWbXBoJd", "hS42iUSU", "kRBfcUw9", "lPboFVrB", "ltjVQEOB", "m70OMPSZ", "mwulhDv7", "p5u25B0e", "pVOusTmI", "qswgcHUc", "rNtKLMQ4", "sPSY9fFY", "tOiGB1De", "u4eqrQXg", "vTHpe53H", "x5mQ4IVy", "zRjDe3Bs"]);

/** A people-free Tuscanini poster for a JW media id whose own poster shows a woman, else undefined. */
export function tzniusPoster(jw: string): string | undefined {
  if (!HIDDEN_POSTER_IDS.has(jw)) return undefined;
  let h = 0;
  for (const c of jw) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TZNIUS_PLACEHOLDER_POSTERS[h % TZNIUS_PLACEHOLDER_POSTERS.length];
}
