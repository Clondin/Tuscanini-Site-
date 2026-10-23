import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Play, Search, X } from "lucide-react";
import { categories } from "../data/products";
import CatalogCard from "../components/category/CatalogCard";
import KosherVideoModal from "../components/kosher/KosherVideoModal";
import Highlight from "../components/ui/Highlight";
import { POPULAR_SEARCHES, saveRecentSearch, searchSite, suggestQuery } from "../lib/siteSearch";
import { formatVideoDuration, kosherVideoPosterUrl, type KosherVideo } from "../lib/kosherVideo";
import { formatRecipeTime } from "../lib/recipeTime";

const PAGE = 24;
type Tab = "all" | "products" | "recipes" | "videos";

/** Full search results: products grid with collection filters, plus recipes and kosher.com videos. */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const tab = (params.get("type") as Tab) || "all";
  const collection = params.get("category") || "";
  const [draft, setDraft] = useState(q);
  const [limit, setLimit] = useState(PAGE);
  const [playing, setPlaying] = useState<KosherVideo | null>(null);
  useEffect(() => setDraft(q), [q]);
  useEffect(() => setLimit(PAGE), [q, tab, collection]);
  useEffect(() => {
    if (q) saveRecentSearch(q);
  }, [q]);

  const results = useMemo(() => searchSite(q), [q]);
  const suggestion = useMemo(() => (q && !results.total ? suggestQuery(q) : null), [q, results]);
  const set = (next: Record<string, string>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };
  const productCollections = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    results.products.forEach(({ category }) => {
      const c = counts.get(category.slug) || { name: category.name, count: 0 };
      c.count++;
      counts.set(category.slug, c);
    });
    return [...counts.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [results]);
  const products = results.products.filter((r) => !collection || r.category.slug === collection);
  const show = (t: Tab) => tab === "all" || tab === t;
  const tabs: [Tab, string, number][] = [
    ["all", "All", results.products.length + results.recipes.length + results.videos.length],
    ["products", "Products", results.products.length],
    ["recipes", "Recipes", results.recipes.length],
    ["videos", "Videos", results.videos.length],
  ];
  const chip = (activeChip: boolean) =>
    `shrink-0 inline-flex items-center gap-2 min-h-10 px-4 border text-sm whitespace-nowrap transition-colors ${
      activeChip ? "bg-olive-deep border-olive-deep text-white" : "bg-surface border-on-surface/20 text-heading hover:border-olive-accent"
    }`;
  const heading = "font-headline text-2xl md:text-3xl text-heading";

  return (
    <div className="bg-aged-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-9 pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-olive-deep">Search</p>
        <h1 className="font-headline text-4xl md:text-6xl text-heading mt-2 break-words">
          {q ? <>“{q}”</> : "What are you looking for?"}
        </h1>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            set({ q: draft.trim(), category: "", type: "" });
          }}
          className="mt-6 max-w-2xl"
        >
          <label className="flex items-center gap-3 bg-surface border border-on-surface/25 focus-within:border-olive-deep focus-within:ring-1 focus-within:ring-olive-deep px-4 h-14">
            <Search size={20} aria-hidden="true" className="text-olive-deep shrink-0" />
            <span className="sr-only">Search products, recipes and videos</span>
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search pasta, olive oil, recipes…"
              enterKeyHint="search"
              className="min-w-0 w-full bg-transparent text-lg outline-none focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {draft && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setDraft("")}
                className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full text-on-surface/70 hover:bg-on-surface/10"
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="shrink-0 h-10 px-4 bg-olive-deep text-white text-sm font-semibold">
              Search
            </button>
          </label>
        </form>

        {!q || !results.total ? (
          <div className="mt-10 max-w-2xl">
            {q && (
              <>
                <h2 role="status" className={heading}>
                  No results for “{q}”
                </h2>
                {suggestion ? (
                  <p className="mt-3 text-on-surface/85">
                    Did you mean{" "}
                    <Link to={`/search?q=${encodeURIComponent(suggestion)}`} className="font-semibold text-olive-deep underline underline-offset-4">
                      {suggestion}
                    </Link>
                    ?
                  </p>
                ) : (
                  <p className="mt-3 text-on-surface/80">Check the spelling, try a shorter word, or start from one of these.</p>
                )}
              </>
            )}
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-deep mt-8 mb-3">Popular searches</h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className={chip(false)}>
                  {term}
                </Link>
              ))}
            </div>
            <Link
              to="/products?view=collections"
              className="inline-flex min-h-11 items-center mt-6 text-olive-deep font-semibold underline underline-offset-4"
            >
              Browse all collections
            </Link>
          </div>
        ) : (
          <>
            <nav aria-label="Result type" className="flex gap-6 mt-8 border-b border-on-surface/20 overflow-x-auto">
              {tabs.map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  aria-current={tab === key ? "page" : undefined}
                  disabled={!count}
                  onClick={() => set({ type: key === "all" ? "" : key })}
                  className={`pb-3.5 text-sm font-semibold border-b-2 whitespace-nowrap disabled:opacity-40 ${
                    tab === key ? "border-olive-deep text-olive-deep" : "border-transparent text-heading"
                  }`}
                >
                  {label} <span className="font-normal text-on-surface/60">{count}</span>
                </button>
              ))}
            </nav>

            {results.categories.length > 0 && tab === "all" && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-on-surface/75 mr-1">Collections:</span>
                {results.categories.slice(0, 5).map(({ category }) => (
                  <Link key={category.slug} to={`/category/${category.slug}`} className={chip(false)}>
                    <Highlight text={category.name} query={q} />
                  </Link>
                ))}
              </div>
            )}

            {show("products") && results.products.length > 0 && (
              <section className="mt-9" aria-labelledby="sr-products">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                  <h2 id="sr-products" className={heading}>
                    Products
                  </h2>
                  <p role="status" className="text-sm text-on-surface/80">
                    {products.length} {products.length === 1 ? "product" : "products"}
                    {results.approximate && " · including close matches"}
                  </p>
                </div>
                {productCollections.length > 1 && (
                  <div role="group" aria-label="Filter by collection" className="-mx-5 md:mx-0 mb-6 flex gap-2 overflow-x-auto px-5 md:px-0 pb-2">
                    <button type="button" aria-pressed={!collection} onClick={() => set({ category: "" })} className={chip(!collection)}>
                      All
                    </button>
                    {productCollections.map(([slug, { name, count }]) => (
                      <button
                        key={slug}
                        type="button"
                        aria-pressed={collection === slug}
                        onClick={() => set({ category: collection === slug ? "" : slug })}
                        className={chip(collection === slug)}
                      >
                        {name} <span className={collection === slug ? "text-white/75" : "text-on-surface/55"}>{count}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.slice(0, tab === "all" ? Math.min(limit, 8) : limit).map(({ product }) => (
                    <CatalogCard key={product.id} product={product} />
                  ))}
                </div>
                {tab === "all" && products.length > 8 ? (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => set({ type: "products" })}
                      className="min-h-12 px-8 border border-olive-deep text-olive-deep text-sm font-semibold hover:bg-olive-deep hover:text-white transition-colors"
                    >
                      See all {products.length} products
                    </button>
                  </div>
                ) : tab === "products" && products.length > limit ? (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setLimit((n) => n + PAGE)}
                      className="min-h-12 px-8 border border-olive-deep text-olive-deep text-sm font-semibold hover:bg-olive-deep hover:text-white transition-colors"
                    >
                      Show more products
                    </button>
                  </div>
                ) : null}
              </section>
            )}

            {show("recipes") && results.recipes.length > 0 && (
              <section className="mt-12" aria-labelledby="sr-recipes">
                <h2 id="sr-recipes" className={`${heading} mb-4`}>
                  Recipes
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {results.recipes.slice(0, tab === "all" ? 4 : 48).map((recipe) => {
                    const body = (
                      <>
                        <div className="aspect-[4/3] overflow-hidden bg-aged-cream">
                          {recipe.image && (
                            <img src={recipe.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[15px] text-heading leading-snug line-clamp-2">
                            <Highlight text={recipe.title} query={q} />
                          </p>
                          <p className="mt-1.5 text-xs text-on-surface/70 inline-flex items-center gap-1">
                            {recipe.external ? (
                              <>
                                Kosher.com <ArrowUpRight size={12} aria-hidden="true" />
                              </>
                            ) : (
                              ["Recipe", recipe.minutes ? formatRecipeTime(recipe.minutes) : ""].filter(Boolean).join(" · ")
                            )}
                          </p>
                        </div>
                      </>
                    );
                    const cls = "group block bg-surface ring-1 ring-on-surface/12 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] transition-shadow";
                    return recipe.external ? (
                      <a key={recipe.href} href={recipe.href} target="_blank" rel="noopener" className={cls}>
                        {body}
                      </a>
                    ) : (
                      <Link key={recipe.href} to={recipe.href} className={cls}>
                        {body}
                      </Link>
                    );
                  })}
                </div>
                {tab === "all" && results.recipes.length > 4 && (
                  <button type="button" onClick={() => set({ type: "recipes" })} className="mt-5 text-sm font-semibold text-olive-deep underline underline-offset-4">
                    See all {results.recipes.length} recipes
                  </button>
                )}
              </section>
            )}

            {show("videos") && results.videos.length > 0 && (
              <section className="mt-12" aria-labelledby="sr-videos">
                <h2 id="sr-videos" className={`${heading} mb-4`}>
                  Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {results.videos.slice(0, tab === "all" ? 3 : 48).map(({ video }) => (
                    <button
                      key={video.jw}
                      type="button"
                      onClick={() => setPlaying(video)}
                      className="group text-left bg-surface ring-1 ring-on-surface/12 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] transition-shadow"
                    >
                      <span className="relative block aspect-video overflow-hidden bg-dark">
                        <img src={kosherVideoPosterUrl(video.jw, 640)} alt="" loading="lazy" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Play size={18} className="ml-0.5 fill-current text-dark" aria-hidden="true" />
                          </span>
                        </span>
                        <span className="absolute bottom-2 right-2 bg-dark/80 text-white text-[11px] px-1.5 py-0.5">
                          {formatVideoDuration(video.duration)}
                        </span>
                      </span>
                      <span className="block p-4 text-[15px] text-heading leading-snug">
                        <Highlight text={video.title} query={q} />
                      </span>
                    </button>
                  ))}
                </div>
                {tab === "all" && results.videos.length > 3 && (
                  <button type="button" onClick={() => set({ type: "videos" })} className="mt-5 text-sm font-semibold text-olive-deep underline underline-offset-4">
                    See all {results.videos.length} videos
                  </button>
                )}
              </section>
            )}
          </>
        )}
      </div>
      {playing && <KosherVideoModal video={playing} poster={kosherVideoPosterUrl(playing.jw)} onClose={() => setPlaying(null)} />}
    </div>
  );
}
