import { normalizeSearch } from "./catalog-search";

/** Lightweight text matching shared by the search overlay, results page and highlighter. */

/** Light English stemming so "olives" finds "olive", "tomatoes" finds "tomato", "cherries" finds "cherry". */
export function stem(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (/(oes|ches|shes|sses|xes|zes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us") && !word.endsWith("is")) return word.slice(0, -1);
  return word;
}

/** Edit distance with transpositions, stopping early once it passes `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    rows[i] = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      if (i === 0) { rows[0][j] = j; continue; }
      let v = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, rows[i - 2][j - 2] + 1);
      rows[i][j] = v;
      if (v < best) best = v;
    }
    if (i > 0 && best > max) return max + 1;
  }
  return rows[a.length][b.length];
}

const typoBudget = (token: string) => (token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0);

/** How well one query token matches one indexed word: 1 exact, lower for prefix / inside / typo, 0 none. */
export function tokenMatch(token: string, word: string): number {
  if (!token || !word) return 0;
  if (word === token) return 1;
  const ts = stem(token);
  const ws = stem(word);
  if (ws === ts) return 0.95;
  if (word.startsWith(token)) return token.length >= 3 ? 0.85 : 0.6;
  // Item numbers and sizes match exactly or by prefix, never by a typo.
  if (/\d/.test(token)) return token.length >= 4 && word.includes(token) ? 0.5 : 0;
  if (token.length >= 4 && word.startsWith(ts)) return 0.8;
  if (token.length >= 4 && word.includes(token)) return 0.55;
  const budget = typoBudget(token);
  if (budget && editDistance(ts, ws, budget) <= budget) return 0.62;
  // a typo inside a word the person is still typing ("spagh" vs "spaghetti" is a prefix; "spagett" a near prefix)
  if (token.length >= 5 && word.length > token.length && editDistance(token, word.slice(0, token.length), 1) <= 1) return 0.5;
  return 0;
}

/** Ranges of `text` to highlight for the query: word prefixes, inner matches and fuzzy whole words. */
export function highlightRanges(text: string, query: string): [number, number][] {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const ranges: [number, number][] = [];
  const re = /[\p{L}\p{N}]+/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const w = normalizeSearch(raw).replace(/ /g, "");
    if (!w || w.length !== raw.length) {
      if (tokens.some((t) => tokenMatch(t, w) >= 0.5)) ranges.push([m.index, m.index + raw.length]);
      continue;
    }
    let hit: [number, number] | null = null;
    for (const t of tokens) {
      if (w.startsWith(t)) { hit = [m.index, m.index + Math.max(t.length, hit ? hit[1] - m.index : 0)]; continue; }
      const at = t.length >= 3 ? w.indexOf(t) : -1;
      if (at >= 0 && !hit) { hit = [m.index + at, m.index + at + t.length]; continue; }
      if (!hit && tokenMatch(t, w) >= 0.5) hit = [m.index, m.index + raw.length];
    }
    if (hit) ranges.push(hit);
  }
  return ranges;
}

export const POPULAR_SEARCHES = ["Penne", "Olive oil", "Vodka sauce", "Pesto", "Truffle", "Gnocchi", "Balsamic", "Chocolate"];

const RECENT_KEY = "tuscanini:recent-searches";
export function getRecentSearches(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}
export function saveRecentSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) return;
  try {
    const next = [q, ...getRecentSearches().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}
export function clearRecentSearches() {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
}

