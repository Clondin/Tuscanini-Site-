#!/usr/bin/env node
/**
 * Regenerates src/data/kosherFeatures.ts: kosher.com recipes, articles and
 * episodes that name a specific Tuscanini product, keyed by product id.
 *
 * Run from a machine that holds the Kosher.com Developer API key (never commit it):
 *   KOSHER_API_KEY=kosher_ap-... node scripts/refresh-kosher-features.mjs [--cache DIR] [--dry-run]
 *   (or KOSHER_API_KEY_FILE=/path/to/keyfile)
 *
 * --cache DIR  stores every raw API response under DIR and reuses it on the next run
 *              (so a re-run after a matching-rule change costs 0 API calls).
 * Budget: one full run is about 90 API calls (the key allows 1,000 a month).
 *
 * Matching is deliberately conservative: an item counts for a product only when the
 * text says "Tuscanini" immediately followed by that product's name (e.g. "Tuscanini
 * Truffle Salt"). Brand-only mentions ("Sponsored by Tuscanini") and generic lines that
 * span several products ("Tuscanini olive oil", "Tuscanini gnocchi") are ignored.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/kosherFeatures.ts");
const BASE = "https://www.kosher.com/wp-json/kosher/v1";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const PER_PRODUCT = 8;

const args = process.argv.slice(2);
const argVal = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const CACHE = argVal("--cache");
const DRY = args.includes("--dry-run");
let calls = 0;

function apiKey() {
  if (process.env.KOSHER_API_KEY) return process.env.KOSHER_API_KEY.trim();
  if (process.env.KOSHER_API_KEY_FILE) return fs.readFileSync(process.env.KOSHER_API_KEY_FILE, "utf8").trim();
  return null;
}

async function kget(endpoint, params, name) {
  const file = CACHE ? path.join(CACHE, `${name}.json`) : null;
  if (file && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")).body;
  if (file && fs.existsSync(`${file}.gz`)) return JSON.parse(zlib.gunzipSync(fs.readFileSync(`${file}.gz`)).toString("utf8")).body;
  const key = apiKey();
  if (!key) throw new Error(`No cached ${name} and no KOSHER_API_KEY / KOSHER_API_KEY_FILE set`);
  const url = new URL(BASE + endpoint);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  calls++;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}`, "User-Agent": UA, Accept: "application/json" } });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
  if (file) { fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(`${file}.gz`, zlib.gzipSync(JSON.stringify({ status: res.status, body }))); }
  return body;
}

// Recipe search on kosher.com matches titles only, so recipes are found through dish-type
// searches and then kept only when their ingredients name a Tuscanini product.
const RECIPE_TERMS = [
  "truffle salt", "gnocchi", "tomato paste", "crushed tomatoes", "balsamic glaze", "calabrian", "marinara",
  "truffle", "chestnuts", "pesto", "cooking wine", "lemon juice", "sea salt", "parmesan", "fruit spread",
  "tomato sauce", "pasta", "spaghetti", "penne", "lasagna", "balsamic", "olive", "tuna", "pizza", "chocolate",
  "sorbet", "gelato", "jam", "garlic", "chili", "tomato", "risotto", "focaccia", "crackers", "shakshuka",
  "bruschetta", "caprese", "fettuccine", "rigatoni", "ziti", "ravioli", "mozzarella", "eggplant",
  "olive oil cake", "vinaigrette", "dressing",
];
const MAX_PAGES = 3;

// Ordered rules: the text right after "Tuscanini " is tested against each, first match wins.
const R = (re, ...ids) => [new RegExp("^(?:" + re + ")\\b", "i"), ids];
const RULES = [
  // salts & truffles
  R("(?:reserve )?(?:black )?truffle salt", "truffle-salt"),
  R("smoked (?:sea )?salt(?: flakes)?", "smoked-sea-salt-flakes"),
  R("sea salt flakes|flaky (?:sea )?salt|flaked sea salt", "sea-salt-flakes"),
  R("fine (?:mediterranean )?sea salt", "fine-mediterranean-sea-salt"),
  R("coarse (?:mediterranean )?sea salt", "coarse-mediterranean-sea-salt"),
  R("(?:mediterranean )?sea salt", "fine-mediterranean-sea-salt", "coarse-mediterranean-sea-salt"),
  R("minced (?:black )?truffles?", "minced-black-truffle"),
  R("(?:reserve )?(?:italian )?sliced (?:black )?truffles?", "sliced-black-truffle"),
  R("(?:black )?truffle (?:infused )?(?:extra[- ]virgin )?olive oil|(?:black )?truffle oil|extra[- ]virgin olive oil with (?:black )?truffle|black truffle extra[- ]virgin", "evoo-black-truffle-250ml"),
  R("(?:black )?truffle sauce", "black-truffle-sauce", "large-black-truffle-sauce"),
  // olive oils
  R("garlic[- ]infused (?:extra[- ]virgin )?olive oil|garlic (?:extra[- ]virgin )?olive oil|extra[- ]virgin olive oil with garlic", "evoo-garlic-250ml"),
  R("lemon[- ]infused (?:extra[- ]virgin )?olive oil|lemon (?:extra[- ]virgin )?olive oil|extra[- ]virgin olive oil with lemon", "evoo-lemon-250ml"),
  R("sicilian (?:extra[- ]virgin olive oil|evoo|olive oil)", "sicilian-extra-virgin-olive-oil-730406"),
  R("(?:extra[- ])?light(?:[- ]tasting)? olive oil", "extra-light-olive-oil-1l", "extra-light-olive-oil-2l", "extra-light-olive-oil-3l"),
  R("(?:cold[- ]pressed )?(?:ultra[- ]premium )?extra[- ]virgin olive oil|evoo", "evoo-750ml"),
  // vinegars & glazes
  R("raspberry balsamic(?: vinegar)?(?: glaze)?", "raspberry-balsamic-glaze-modena"),
  R("caramel balsamic(?: vinegar)?(?: glaze)?", "caramel-balsamic-glaze-modena"),
  R("balsamic (?:vinegar )?glaze variety", ),
  R("balsamic (?:vinegar )?(?:glaze|reduction)", "balsamic-glaze-modena"),
  R("balsamic (?:vinegar )?spray", "balsamic-vinegar-spray"),
  R("balsamic(?: vinegar)?", "balsamic-vinegar-modena-8oz", "balsamic-vinegar-modena-500ml"),
  R("(?:organic )?apple cider vinegar", "organic-apple-cider-vinegar"),
  R("red wine vinegar", "red-wine-vinegar"),
  R("white wine vinegar", "white-wine-vinegar"),
  R("red cooking wine", "red-cooking-wine"),
  R("white cooking wine", "white-cooking-wine"),
  R("lemon juice", "lemon-juice-6oz", "lemon-juice-16oz"),
  R("lime juice", "lime-juice-730288", "lime-juice-large-730289"),
  // tomatoes & sauces
  R("organic tomato paste", "organic-tomato-paste-tube"),
  R("tomato paste", "tomato-paste-tube"),
  R("crushed tomatoes", "crushed-tomatoes-14oz", "crushed-tomatoes-24oz"),
  R("diced tomatoes", "diced-tomatoes-14oz", "diced-tomatoes-24oz"),
  R("(?:whole )?peeled tomatoes", "peeled-tomatoes", "whole-peeled-tomatoes-large-730215"),
  R("(?:whole )?cherry tomatoes", "whole-cherry-tomatoes"),
  R("tomato puree", "tomato-puree"),
  R("(?:tomato )?passata|tomato sauce", "tomato-sauce-box"),
  R("sun[- ]dried tomato pesto", "sun-dried-tomato-pesto"),
  R("sun[- ]dried tomatoes", "sun-dried-tomatoes"),
  R("(?:basil )?pesto", "basil-pesto"),
  R("(?:savory )?tomato (?:savory )?jam", "tomato-savory-jam"),
  R("(?:calabrian )?(?:chili )?hot pepper jam", "calabrian-chili-hot-pepper-jam"),
  R("chopped calabrian", "chopped-calabrian-chili-peppers"),
  R("calabrian", "calabrian-chili-peppers"),
  R("chili (?:pepper )?paste", "chili-pepper-paste-730495"),
  R("garlic paste", "garlic-paste-730496"),
  R("zesty marinara", "zesty-marinara-sauce"),
  R("(?:classic )?marinara", "classic-marinara-sauce"),
  R("napoletana", "napoletana-pasta-sauce"),
  R("(?:traditional )?pizza sauce", "traditional-pizza-sauce"),
  R("vodka sauce", "vodka-sauce-730228"),
  R("mushroom alfredo", "mushroom-alfredo-sauce-730227"),
  R("alfredo(?: sauce)?", "alfredo-sauce-730226"),
  R("mac (?:['‘’]?n['‘’]?|and|&) cheese(?: sauce)?", "mac-cheese-sauce-730225"),
  // gnocchi & pasta
  R("frozen cauliflower gnocchi", "frozen-cauliflower-gnocchi-730553"),
  R("cauliflower gnocchi", "cauliflower-gnocchi"),
  R("mini (?:potato )?gnocchi", "mini-gnocchi"),
  R("gluten[- ]free (?:potato )?gnocchi", "gluten-free-potato-gnocchi"),
  R("(?:potato )?gnocchi with spinach|spinach gnocchi", "frozen-potato-gnocchi-with-spinach-730552"),
  R("potato gnocchi", "potato-gnocchi"),
  R("(?:oven[- ]ready )?lasagna", "oven-ready-lasagna"),
  R("bronze[- ]cut spaghetti", "spaghetti"),
  R("spaghetti", "spaghetti-pasta-730320", "spaghetti"),
  R("bronze[- ]cut fettuccine", "fettuccine"),
  R("fettuccine", "fettuccine-pasta-730321", "fettuccine"),
  R("bronze[- ]cut penne", "penne"),
  R("penne", "penne-pasta-730322", "penne"),
  R("bronze[- ]cut fusilli", "fusilli"),
  R("fusilli", "fusilli-pasta-730325", "fusilli"),
  R("elbows?(?: macaroni)?", "elbows"),
  R("rigatoni", "rigatoni"),
  R("(?:bronze[- ]cut )?cavatappi", "bronze-cut-cavatappi-730604"),
  R("(?:bronze[- ]cut )?farfalle", "bronze-cut-farfalle-730605"),
  R("(?:bronze[- ]cut )?pappardelle", "bronze-cut-pappardelle-730606"),
  // cheese, olives, chestnuts
  R("parmesan|parmigiano", "parmesan-cheese-wedge-5oz", "parmesan-cheese-wedge-8oz"),
  R("kalamata olive (?:snack(?:ing)? )?pouch", "pitted-kalamata-olives-pouch-730196"),
  R("pitted kalamata", "pitted-kalamata"),
  R("kalamata", "kalamata-olives-14oz", "pitted-kalamata"),
  R("(?:pitted )?(?:green )?castelvetrano", "pitted-green-castelvetrano", "sweet-sicilian-castelvetrano"),
  R("(?:green )?cerignola", "green-cerignola"),
  R("cracked (?:marinated )?olives", "cracked-marinated-olives"),
  R("(?:pitted )?bella italia", "pitted-bella-italia-mix"),
  R("capers", "capers-in-brine"),
  R("(?:spicy )?pimiento", "spicy-pimiento-stuffed-olives"),
  R("roasted chestnuts with salt|salt (?:and|&) (?:black )?pepper (?:roasted )?chestnuts", "roasted-chestnuts-salt-black-pepper"),
  R("(?:roasted )?chestnuts", "roasted-chestnuts"),
  // spreads, sweets
  R("apricot (?:fruit spread|preserves|jam)", "apricot-fruit-spread-preserves"),
  R("forest fruits? (?:fruit )?(?:spread|preserves|jam)", "forest-fruits-fruit-spread-preserves"),
  R("lemon ginger(?: fruit spread| preserves| jam)?", "lemon-ginger-fruit-spread-preserves"),
  R("raspberry (?:fruit spread|preserves|jam)", "raspberry-fruit-spread-preserves"),
  R("strawberry (?:fruit spread|preserves|jam)", "strawberry-fruit-spread-preserves"),
  R("chocolate (?:dessert )?sauce", "chocolate-dessert-sauce-730620"),
  R("caramel (?:dessert )?sauce", "caramel-dessert-sauce-730621"),
  R("raspberry (?:dessert )?sauce", "raspberry-dessert-sauce-730622"),
  R("(?:italian )?pistachio (?:milk )?chocolate truffles", "chocolate-truffle-pistachio"),
  R("(?:italian )?hazelnut (?:milk )?chocolate truffles", "chocolate-truffle-hazelnut"),
  R("(?:fine )?(?:italian )?dark chocolate truffles", "chocolate-truffle-dark"),
  R("(?:fine )?(?:italian )?milk chocolate truffles", "chocolate-truffle-milk"),
  R("assorted (?:chocolate )?truffles", "assorted-chocolate-truffles-gift-box"),
  R("gianduiotti", "chocolate-gianduiotti"),
  R("lemon sorbetto", "lemon-sorbetto-730533"),
  // flour & bakery
  R("all[- ]purpose flour", "all-purpose-flour-2-2lb"),
  R("high[- ]gluten flour", "high-gluten-flour-5lb"),
  R("spelt (?:white )?flour", "spelt-white-flour-5lb"),
  R("focaccia(?: bread)?", "focaccia-bread-730010"),
  R("panini(?: bread)?", "panini-bread-730012"),
  R("pizza (?:crust|dough)", "pizza-crust-730011"),
  R("truffle parchment crackers", "truffle-parchment-crackers-730333", "truffle-parchment-crackers-small-730337"),
  R("oregano parchment crackers", "oregano-parchment-crackers-730331", "oregano-parchment-crackers-small-730335"),
  R("rosemary parchment crackers", "rosemary-parchment-crackers-730332", "rosemary-parchment-crackers-small-730336"),
  // frozen
  R("(?:breaded )?mozzarella sticks", "breaded-mozzarella-sticks-730140", "breaded-mozzarella-sticks-family-pack-730141"),
  R("(?:breaded )?eggplant cutlets", "breaded-eggplant-cutlets"),
  R("four cheese pizza", "four-cheese-pizza"),
  R("grilled vegetable pizza", "grilled-vegetable-pizza"),
  R("mushroom pizza", "mushroom-pizza"),
  R("bianca", "bianca-white-thin-crust-pizza"),
  R("personal pie", "personal-pie-thin-crust-pizza"),
  R("reserve supermargherita|supermargherita", "reserve-supermargherita-pizza"),
  R("reserve margherita", "reserve-margherita-pizza"),
  R("classico margherita", "classico-margherita-pizza"),
  R("margherita pizza", "classico-margherita-pizza", "reserve-margherita-pizza"),
  R("(?:reserve )?bbq (?:ground beef )?(?:meat )?pizza", "reserve-bbq-ground-beef-pizza"),
  R("mini margherita calzones?", "mini-margherita-calzones"),
  R("mini mushroom (?:pizza )?calzones?", "mini-mushroom-pizza-calzones"),
  R("crinkle[- ]cut fries", "fries-crinkle-cut"),
  R("shoestring fries", "fries-shoestring"),
  R("straight[- ]cut fries", "fries-straight-cut"),
  R("gondola fries", "fries-gondola"),
  // tuna
  R("tuna ventresca|ventresca", "tuna-ventresca-olive-oil-tall-jar"),
  R("tuna fillets?", "tuna-fillet-olive-oil-tall-jar"),
  R("(?:solid light )?tuna (?:in olive oil )?with chil[ie]", "solid-light-tuna-olive-oil-chili-peppers-can", "solid-light-tuna-olive-oil-chili-peppers-three-pack"),
  R("(?:solid light )?tuna in water", "tuna-solid-light-water-can", "solid-light-tuna-in-water-three-pack-730424"),
  // beverages
  R("moscato ros[eé]", "moscato-rose-juice"),
  R("(?:sparkling )?moscato", "moscato-grape-juice"),
  R("(?:sparkling )?malvasia", "sparkling-malvasia-grape-juice-730472"),
  R("(?:sparkling )?rosato", "sparkling-rosato-grape-juice"),
  R("(?:sparkling )?bianco", "sparkling-bianco-grape-juice"),
  R("sparkling apple cider", "sparkling-apple-cider"),
  R("(?:organic )?(?:sparkling )?blood orange aranciata|aranciata", "sparkling-blood-orange-aranciata-730386", "sparkling-blood-orange-aranciata-large-730387"),
  R("(?:organic )?sparkling blood orange", "sparkling-blood-orange"),
  R("blood orange juice", "blood-orange-juice"),
  R("pomegranate juice", "pomegranate-juice"),
  R("mandarin juice", "mandarin-juice"),
  R("tomato juice", "tomato-juice", "tomato-juice-small-730236"),
  R("diet cola", "diet-cola"),
  R("(?:organic )?(?:italian )?cola", "italian-cola"),
  R("sparkling lemonade", "sparkling-lemonade-730384", "sparkling-lemonade-large-730385"),
  R("(?:organic )?sparkling lemon", "sparkling-lemonade"),
  R("lemonade", "lemonade-730394"),
  // grinders
  R("peppercorn medley", "peppercorn-medley-grinder"),
  R("italian (?:herb )?medley", "italian-medley-grinder"),
  R("chili pepper (?:spice )?grinder", "chili-pepper-grinder"),
  R("(?:ground )?black pepper", "black-pepper-grinder"),
];
const LEAD = /^(?:(?:italian|premium|imported|brand|new|authentic|kosher|pure|100%)\s+)+/i;

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…", eacute: "é", egrave: "è", reg: "®", trade: "™" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m);
const clean = (s) => decode(String(s ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function texts(item) {
  const acf = (item.custom_fields && item.custom_fields.acf) || {};
  const out = [{ text: clean(item.title), inTitle: true }];
  const add = (v) => { if (v) out.push({ text: clean(typeof v === "string" ? v : JSON.stringify(v)), inTitle: false }); };
  if (item.type === "recipes") {
    add(acf.recipe_description);
    for (const group of Array.isArray(acf.ingredients) ? acf.ingredients : [])
      for (const ing of Array.isArray(group.ingredients) ? group.ingredients : []) { add(ing.pop_up_title); add(ing.ingredient_description); }
    if (Array.isArray(acf.directions)) for (const d of acf.directions) add(typeof d === "string" ? d : Object.values(d || {}).filter((x) => typeof x === "string").join(" "));
    else add(acf.directions);
  } else {
    add(item.excerpt); add(item.content); add(acf.episode_description);
  }
  return out;
}

function matchItem(item, known) {
  const hits = new Map(); // id -> score (2 = named in the title, 1 = named in the body)
  for (const { text, inTitle } of texts(item)) {
    for (const m of text.matchAll(/\bTuscanini(?:['’]s)?\s+/gi)) {
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 80).replace(LEAD, "");
      for (const [re, ids] of RULES) {
        if (!re.test(after)) continue;
        for (const id of ids) if (known.has(id)) hits.set(id, Math.max(hits.get(id) ?? 0, inTitle ? 2 : 1));
        break;
      }
    }
  }
  return hits;
}

async function productIds() {
  const res = await fetch("https://tuscaninifoods.com/sitemap.xml", { headers: { "User-Agent": UA } });
  const xml = await res.text();
  return new Set([...xml.matchAll(/\/product\/([^<]+)<\/loc>/g)].map((m) => m[1]));
}

async function main() {
  const known = await productIds();
  const missing = [...new Set(RULES.flatMap(([, ids]) => ids))].filter((id) => !known.has(id));
  if (missing.length) console.warn("rule ids not on the live sitemap (skipped):", missing.join(", "));

  const items = new Map();
  const keep = (x) => { if (x && x.status === "publish" && x.link) items.set(`${x.type}:${x.id}`, x); };
  for (const type of ["articles", "episodes"]) {
    for (let page = 1; page <= 10; page++) {
      const body = await kget(`/${type}`, { search: "tuscanini", per_page: 50, page }, `coll_${type}_search_tuscanini_p${page}`);
      (body.items || []).forEach(keep);
      if (page >= (body.total_pages || 1)) break;
    }
  }
  (await kget("/recipes", { search: "tuscanini", per_page: 50, page: 1 }, "coll_recipes_search_tuscanini_p1")).items.forEach(keep);
  for (const term of RECIPE_TERMS) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const name = `recipes_search_${term.replace(/ /g, "_")}${page > 1 ? `_p${page}` : ""}`;
      const body = await kget("/recipes", { search: term, per_page: 50, page }, name);
      const list = body.items || [];
      const tusc = list.filter((x) => /tuscanini/i.test(JSON.stringify(x.custom_fields?.acf?.ingredients ?? "") + x.title));
      tusc.forEach(keep);
      if (page >= (body.total_pages || 1) || tusc.length < 10) break;
    }
  }

  const byProduct = new Map();
  let matchedItems = 0;
  for (const item of items.values()) {
    const hits = matchItem(item, known);
    if (!hits.size) continue;
    matchedItems++;
    for (const [id, score] of hits) {
      if (!byProduct.has(id)) byProduct.set(id, []);
      byProduct.get(id).push({ item, score });
    }
  }

  const TYPE = { recipes: "recipe", articles: "article", episodes: "episode" };
  const typeRank = { episodes: 0, articles: 1, recipes: 2 };
  const table = [];
  const index = new Map();
  const productMap = {};
  for (const id of [...byProduct.keys()].sort()) {
    const ranked = byProduct.get(id).sort((a, b) =>
      b.score - a.score || typeRank[a.item.type] - typeRank[b.item.type] || String(b.item.date).localeCompare(String(a.item.date)));
    // Keep a mix: title matches first, then at most 3 of any one type.
    const picked = []; const perType = {};
    for (const r of ranked) {
      if (picked.length >= PER_PRODUCT) break;
      const t = r.item.type;
      if (r.score < 2 && (perType[t] ?? 0) >= 3 && ranked.length > PER_PRODUCT) continue;
      perType[t] = (perType[t] ?? 0) + 1; picked.push(r);
    }
    for (const r of ranked) { if (picked.length >= PER_PRODUCT) break; if (!picked.includes(r)) picked.push(r); }
    productMap[id] = { total: ranked.length, items: picked.map(({ item }) => {
      const key = `${item.type}:${item.id}`;
      if (!index.has(key)) {
        const img = item.images?.featured || {};
        index.set(key, table.length);
        table.push({
          title: clean(item.title),
          url: item.link,
          image: img.large || img.url || item.featured_media || undefined,
          thumb: img.medium || undefined,
          type: TYPE[item.type],
          date: String(item.date || "").slice(0, 10),
        });
      }
      return index.get(key);
    }) };
  }

  const today = new Date().toISOString().slice(0, 10);
  const SITE = "https://www.kosher.com/";
  const IMG = "https://images.kosher.com/uploads/";
  const strip = (u, base) => (u && u.startsWith(base) ? u.slice(base.length) : u || "");
  const rows = table.map((t) => JSON.stringify([t.type[0], t.title, strip(t.url, SITE), strip(t.image, IMG), strip(t.thumb, IMG), t.date]));
  const ts = `// Generated by scripts/refresh-kosher-features.mjs on ${today}. Do not edit by hand.
// kosher.com recipes, articles and episodes that name a specific Tuscanini product.
// Public fields only (title, link, image, type, date).
import { canonicalProductId } from "../lib/productAliases.js";

export type KosherFeatureType = "recipe" | "article" | "episode";

export interface KosherFeature {
  title: string;
  url: string;
  image?: string;
  thumb?: string;
  type: KosherFeatureType;
  date: string;
}

export const kosherFeaturesUpdated = ${JSON.stringify(today)};

const SITE = ${JSON.stringify(SITE)};
const IMG = ${JSON.stringify(IMG)};
const TYPES: Record<string, KosherFeatureType> = { r: "recipe", a: "article", e: "episode" };

/** [type, title, path on kosher.com, image, thumbnail, date]; relative image paths live under IMG. */
const rows: [string, string, string, string, string, string][] = [
${rows.join(",\n")},
];

/** product id -> [total matches on kosher.com, row indexes (best first)] */
const byProduct: Record<string, [number, number[]]> = {
${Object.entries(productMap).map(([k, v]) => `  ${JSON.stringify(k)}: [${v.total}, [${v.items.join(", ")}]]`).join(",\n")},
};

const abs = (path: string, base: string) => (!path ? undefined : /^https?:/.test(path) ? path : base + path);

function toFeature([type, title, path, image, thumb, date]: (typeof rows)[number]): KosherFeature {
  return { type: TYPES[type], title, url: abs(path, SITE)!, image: abs(image, IMG), thumb: abs(thumb, IMG), date };
}

export function getKosherFeaturesForProduct(id: string): KosherFeature[] {
  return (byProduct[canonicalProductId(id)]?.[1] ?? []).map((i) => toFeature(rows[i]));
}

export function getKosherFeatureCount(id: string): number {
  return byProduct[canonicalProductId(id)]?.[0] ?? 0;
}
`;
  const summary = Object.entries(productMap).map(([k, v]) => `${k}: ${v.total}`).join("\n");
  console.log(`items scanned ${items.size}, items matched ${matchedItems}, products ${Object.keys(productMap).length}, cards ${table.length}, API calls this run ${calls}`);
  console.log(summary);
  if (!DRY) { fs.writeFileSync(OUT, ts); console.log("wrote", path.relative(ROOT, OUT)); }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
