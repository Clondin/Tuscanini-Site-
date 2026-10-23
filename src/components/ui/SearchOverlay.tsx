import { getResponsiveImageProps } from "../../lib/productImage";
import { formatProductSize } from "../../lib/formatProductSize";
import { useState, useRef, useCallback, useEffect, useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, ArrowUpRight, Clock, Play, CornerDownLeft } from "lucide-react";
import { categories } from "../../data/products";
import { useModalDialog } from "../../hooks/useModalDialog";
import { POPULAR_SEARCHES, clearRecentSearches, getRecentSearches, saveRecentSearch } from "../../lib/searchText";

type Engine = typeof import("../../lib/siteSearch");
let enginePromise: Promise<Engine> | null = null;
/** The search index (catalog, recipes, videos) loads on first open, keeping it out of the main bundle. */
const loadEngine = () => (enginePromise ??= import("../../lib/siteSearch"));
import { formatVideoDuration, kosherVideoPosterUrl, type KosherVideo } from "../../lib/kosherVideo";
import { formatRecipeTime } from "../../lib/recipeTime";
import KosherVideoModal from "../kosher/KosherVideoModal";
import Highlight from "./Highlight";

type Option = {
  id: string;
  group: string;
  /** Internal path, external URL, or a video to play. */
  to?: string;
  href?: string;
  video?: KosherVideo;
};

const TOP_CATEGORY_SLUGS = ["pasta-gnocchi", "olive-oil", "pasta-sauces", "seasonings-truffles", "pesto", "potato-chips"];

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [playing, setPlaying] = useState<KosherVideo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setQuery("");
    setActive(-1);
    onClose();
  }, [onClose]);
  const dialogRef = useModalDialog<HTMLDivElement>({
    isOpen,
    onClose: close,
    initialFocusRef: inputRef,
    inertAppRoot: true,
  });
  const [engine, setEngine] = useState<Engine | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    setRecent(getRecentSearches());
    let live = true;
    loadEngine().then((loaded) => live && setEngine(loaded));
    return () => {
      live = false;
    };
  }, [isOpen]);

  const debounced = useDebounced(query, 90);
  const q = debounced.trim();
  const results = useMemo(() => (q && engine ? engine.searchSite(q) : null), [q, engine]);
  const suggestion = useMemo(() => (engine && results && !results.total ? engine.suggestQuery(q) : null), [engine, results, q]);

  const products = results?.products.slice(0, 6) ?? [];
  const collections = results?.categories.slice(0, 3) ?? [];
  const recipes = results?.recipes.slice(0, 3) ?? [];
  const videos = results?.videos.slice(0, 3) ?? [];

  const options: Option[] = useMemo(() => {
    const list: Option[] = [];
    products.forEach(({ product }) => list.push({ id: `p-${product.id}`, group: "product", to: `/product/${product.id}` }));
    collections.forEach(({ category }) => list.push({ id: `c-${category.slug}`, group: "category", to: `/category/${category.slug}` }));
    recipes.forEach((r, i) => list.push({ id: `r-${i}`, group: "recipe", ...(r.external ? { href: r.href } : { to: r.href }) }));
    videos.forEach(({ video }) => list.push({ id: `v-${video.jw}`, group: "video", video }));
    if (q) list.push({ id: "all", group: "all", to: `/search?q=${encodeURIComponent(q)}` });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);
  useEffect(() => setActive(-1), [results]);
  useEffect(() => {
    if (active < 0) return;
    listRef.current?.querySelector(`#so-${options[active]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [active, options]);

  const optionIndex = (id: string) => options.findIndex((o) => o.id === id);
  const choose = (option: Option | undefined) => {
    if (!option) return;
    if (q) saveRecentSearch(q);
    if (option.video) {
      setPlaying(option.video);
      close();
      return;
    }
    if (option.href) {
      window.open(option.href, "_blank", "noopener");
      return;
    }
    close();
    if (option.to) navigate(option.to);
  };
  const submit = () => {
    const value = query.trim();
    if (!value) return;
    saveRecentSearch(value);
    close();
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (options.length ? (i + 1) % options.length : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (active >= 0) choose(options[active]);
      else submit();
    }
  };
  const optionProps = (id: string) => {
    const index = optionIndex(id);
    return {
      id: `so-${id}`,
      role: "option" as const,
      "aria-selected": index === active,
      onMouseMove: () => index !== active && setActive(index),
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        choose(options[index]);
      },
      className: `flex w-full items-center gap-4 px-3 py-2.5 text-left cursor-pointer transition-colors ${
        index === active ? "bg-aged-cream" : "hover:bg-aged-cream/60"
      }`,
    };
  };

  const topCategories = TOP_CATEGORY_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is (typeof categories)[number] => Boolean(c),
  );
  const fill = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };
  const chip =
    "inline-flex min-h-10 items-center gap-2 px-4 border border-on-surface/20 bg-surface text-sm text-heading hover:border-olive-accent hover:text-olive-deep transition-colors";
  const groupTitle = "px-3 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-deep";

  if (!isOpen)
    return playing ? (
      <KosherVideoModal video={playing} poster={kosherVideoPosterUrl(playing.jw)} onClose={() => setPlaying(null)} />
    ) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-dark/60 backdrop-blur-sm sm:px-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search Tuscanini"
        tabIndex={-1}
        className="w-full h-[100dvh] sm:h-auto sm:max-w-3xl mx-auto sm:mt-[9vh] bg-surface sm:shadow-2xl sm:max-h-[78dvh] flex flex-col"
      >
        <div className="flex items-center gap-2 border-b border-on-surface/15 px-3 sm:px-5 py-3">
          <label className="flex flex-1 min-w-0 items-center gap-3 bg-aged-cream/70 border border-on-surface/15 focus-within:border-olive-deep px-3 sm:px-4 h-14">
            <Search size={20} aria-hidden="true" className="shrink-0 text-olive-deep" />
            <span className="sr-only">Search products, recipes and videos</span>
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={Boolean(q)}
              aria-controls="search-results"
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `so-${options[active]?.id}` : undefined}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search pasta, olive oil, recipes…"
              className="min-w-0 w-full bg-transparent text-lg sm:text-xl text-heading placeholder:text-on-surface/45 outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => fill("")}
                aria-label="Clear search"
                className="h-9 w-9 shrink-0 -mr-1 flex items-center justify-center rounded-full text-on-surface/70 hover:bg-on-surface/10"
              >
                <X size={18} />
              </button>
            )}
          </label>
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="h-14 shrink-0 px-2 sm:px-3 flex items-center gap-2 text-sm font-semibold text-olive-deep"
          >
            <span className="sm:hidden">Cancel</span>
            <kbd className="hidden sm:inline-flex items-center border border-on-surface/25 px-1.5 py-0.5 text-[11px] font-sans text-on-surface/70">
              Esc
            </kbd>
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-2 sm:px-3 pb-4">
          {!q ? (
            <div className="px-3 py-4 space-y-7">
              {recent.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-deep">Recent</h3>
                    <button
                      type="button"
                      onClick={() => {
                        clearRecentSearches();
                        setRecent([]);
                      }}
                      className="text-xs text-on-surface/70 underline underline-offset-2"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button key={term} type="button" onClick={() => fill(term)} className={chip}>
                        <Clock size={14} aria-hidden="true" className="text-on-surface/50" />
                        {term}
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-deep mb-3">Popular searches</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term} type="button" onClick={() => fill(term)} className={chip}>
                      {term}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive-deep mb-3">Shop by collection</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {topCategories.map((category) => {
                    const lead = category.products.find((p) => p.image);
                    return (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={close}
                        className="flex items-center gap-3 p-2 border border-on-surface/12 hover:border-olive-accent transition-colors"
                      >
                        {lead && (
                          <img
                            {...getResponsiveImageProps(lead.image, "48px")}
                            alt=""
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain shrink-0 mix-blend-multiply"
                          />
                        )}
                        <span className="text-sm text-heading leading-tight">{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  to="/products?view=collections"
                  onClick={close}
                  className="inline-flex min-h-11 items-center gap-2 mt-3 text-sm text-olive-deep font-semibold"
                >
                  All collections <ArrowRight size={16} />
                </Link>
              </section>
            </div>
          ) : results && results.total === 0 ? (
            <div className="px-3 py-8">
              <p role="status" className="font-headline text-2xl sm:text-3xl text-heading">
                No results for “{q}”
              </p>
              {suggestion ? (
                <p className="mt-3 text-on-surface/85">
                  Did you mean{" "}
                  <button type="button" onClick={() => fill(suggestion)} className="font-semibold text-olive-deep underline underline-offset-4">
                    {suggestion}
                  </button>
                  ?
                </p>
              ) : (
                <p className="mt-3 text-sm text-on-surface/80">Check the spelling, or try one of these.</p>
              )}
              <div className="flex flex-wrap gap-2 mt-5">
                {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                  <button key={term} type="button" onClick={() => fill(term)} className={chip}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results ? (
            <div id="search-results" role="listbox" aria-label="Search results">
              <p role="status" className="sr-only">
                {results.total} results
              </p>
              {products.length > 0 && (
                <div role="group" aria-labelledby="sg-products">
                  <p id="sg-products" className={groupTitle}>
                    Products{results.products.length > products.length ? ` · ${results.products.length}` : ""}
                    {results.approximate && <span className="ml-2 normal-case tracking-normal font-normal text-on-surface/60">including close matches</span>}
                  </p>
                  {products.map(({ product, category }) => (
                    <div key={product.id} {...optionProps(`p-${product.id}`)}>
                      <span className="w-14 h-14 shrink-0 flex items-center justify-center bg-aged-cream/70">
                        <img
                          {...getResponsiveImageProps(product.image, "56px")}
                          alt=""
                          width={56}
                          height={56}
                          className="w-12 h-12 object-contain mix-blend-multiply"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] text-heading leading-snug truncate">
                          <Highlight text={product.name} query={q} />
                        </span>
                        <span className="block text-xs text-on-surface/70 mt-0.5 truncate">
                          {[formatProductSize(product.size), category.name, product.sku ? `#${product.sku}` : ""].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-olive-deep/60" />
                    </div>
                  ))}
                </div>
              )}
              {collections.length > 0 && (
                <div role="group" aria-labelledby="sg-collections">
                  <p id="sg-collections" className={groupTitle}>Collections</p>
                  {collections.map(({ category, count }) => (
                    <div key={category.slug} {...optionProps(`c-${category.slug}`)}>
                      <span className="w-14 h-9 shrink-0 flex items-center justify-center border border-on-surface/15 text-[11px] text-on-surface/70">
                        {count}
                      </span>
                      <span className="flex-1 text-[15px] text-heading">
                        <Highlight text={category.name} query={q} />
                      </span>
                      <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-olive-deep/60" />
                    </div>
                  ))}
                </div>
              )}
              {recipes.length > 0 && (
                <div role="group" aria-labelledby="sg-recipes">
                  <p id="sg-recipes" className={groupTitle}>Recipes</p>
                  {recipes.map((recipe, i) => (
                    <div key={recipe.href} {...optionProps(`r-${i}`)}>
                      <span className="w-14 h-14 shrink-0 overflow-hidden bg-aged-cream">
                        {recipe.image && <img src={recipe.image} alt="" width={56} height={56} loading="lazy" className="w-full h-full object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] text-heading leading-snug line-clamp-2">
                          <Highlight text={recipe.title} query={q} />
                        </span>
                        <span className="block text-xs text-on-surface/70 mt-0.5">
                          {recipe.external ? "Recipe on Kosher.com" : ["Recipe", recipe.minutes ? formatRecipeTime(recipe.minutes) : ""].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      {recipe.external ? (
                        <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-olive-deep/60" />
                      ) : (
                        <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-olive-deep/60" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {videos.length > 0 && (
                <div role="group" aria-labelledby="sg-videos">
                  <p id="sg-videos" className={groupTitle}>Videos</p>
                  {videos.map(({ video }) => (
                    <div key={video.jw} {...optionProps(`v-${video.jw}`)}>
                      <span className="relative w-20 h-[45px] shrink-0 overflow-hidden bg-dark">
                        <img src={kosherVideoPosterUrl(video.jw, 320)} alt="" width={80} height={45} loading="lazy" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                            <Play size={11} className="ml-0.5 fill-current text-dark" aria-hidden="true" />
                          </span>
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] text-heading leading-snug line-clamp-2">
                          <Highlight text={video.title} query={q} />
                        </span>
                        <span className="block text-xs text-on-surface/70 mt-0.5">
                          {formatVideoDuration(video.duration)} · Kosher.com
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-1 pt-3">
                <div
                  {...optionProps("all")}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold cursor-pointer transition-colors ${
                    options[active]?.id === "all" ? "bg-olive-deep text-white" : "bg-olive-deep/95 text-white hover:bg-olive-deep"
                  }`}
                >
                  <span>
                    See all {results.total} results for “{q}”
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="hidden sm:flex items-center gap-5 border-t border-on-surface/12 px-5 py-2.5 text-[11px] text-on-surface/60">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="border border-on-surface/25 px-1">↑</kbd>
            <kbd className="border border-on-surface/25 px-1">↓</kbd> to move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="border border-on-surface/25 px-1">
              <CornerDownLeft size={10} className="inline" />
            </kbd>{" "}
            to open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="border border-on-surface/25 px-1">/</kbd> or <kbd className="border border-on-surface/25 px-1">⌘K</kbd> to search
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
