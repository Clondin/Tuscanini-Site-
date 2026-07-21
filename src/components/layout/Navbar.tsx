import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { pantryCategories } from "../../data/categories-pantry";
import { mealCategories } from "../../data/categories-meals";
import { snackCategories } from "../../data/categories-snacks";
import { foodserviceCategories } from "../../data/categories-foodservice";
import { getCategoryAccent } from "../../data/category-accents";
import { getCmsLinks } from "../../data/cms";
import TuscaniniLogo from "../TuscaniniLogo";
import SearchOverlay from "../ui/SearchOverlay";

const topNavLinks = [
  { label: "Beverages", to: "/category/beverages" },
  { label: "Pasta", to: "/category/pasta-gnocchi" },
  { label: "Olive Oil", to: "/category/olive-oil" },
  { label: "Chocolate", to: "/category/chocolate" },
  { label: "Our Story", to: "/about" },
];

const mobilePageLinks = [
  { label: "The Pantry", to: "/#collections" },
  { label: "Our Story", to: "/about" },
];

const pantryCategoryIds = new Set(pantryCategories.map((category) => category.id));
const mealCategoryIds = new Set(mealCategories.map((category) => category.id));
const snackCategoryIds = new Set(snackCategories.map((category) => category.id));
const foodserviceCategoryIds = new Set(foodserviceCategories.map((category) => category.id));
const knownGroupIds = new Set([
  ...pantryCategoryIds,
  ...mealCategoryIds,
  ...snackCategoryIds,
  ...foodserviceCategoryIds,
]);

function isActive(linkTo: string, pathname: string): boolean {
  if (linkTo === "/#collections") {
    return pathname === "/";
  }
  if (linkTo === "/about") {
    return pathname === "/about";
  }
  if (linkTo.startsWith("/category/")) {
    return pathname === linkTo;
  }
  return false;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const cmsNavLinks = getCmsLinks("navigation", "primary");
  const displayedTopNavLinks = cmsNavLinks.length > 0 ? cmsNavLinks : topNavLinks;
  const mobileCategoryLinks = categories.map((category) => ({
    label: category.name,
    to: `/category/${category.slug}`,
  }));
  const megaGroups = [
    {
      label: "The Pantry",
      items: categories.filter(
        (category) => pantryCategoryIds.has(category.id) || !knownGroupIds.has(category.id),
      ),
    },
    { label: "Meals", items: categories.filter((category) => mealCategoryIds.has(category.id)) },
    { label: "Snacks & Sweets", items: categories.filter((category) => snackCategoryIds.has(category.id)) },
    { label: "Foodservice", items: categories.filter((category) => foodserviceCategoryIds.has(category.id)) },
  ];

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-surface" : "bg-surface/90"
      }`}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="italia-stripe w-full" />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="select-none text-heading">
          <TuscaniniLogo className="h-8 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <button
            className={`inline-flex items-center gap-1.5 uppercase tracking-[0.2em] text-[10px] transition-colors ${
              megaOpen ? "text-gold" : "text-on-surface/70 hover:text-gold"
            }`}
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((v) => !v)}
            aria-expanded={megaOpen}
            aria-haspopup="true"
          >
            Shop
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
            />
          </button>
          {displayedTopNavLinks.map((link) => {
            const active = isActive(link.to, location.pathname);
            return (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setMegaOpen(false)}
                className={`uppercase tracking-[0.2em] text-[10px] transition-colors ${
                  active
                    ? "text-gold"
                    : "text-on-surface/70 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            className="min-w-11 min-h-11 inline-flex items-center justify-center text-on-surface/75 hover:text-primary transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="min-w-11 min-h-11 inline-flex items-center justify-center text-on-surface/75 hover:text-primary transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            className="min-w-11 min-h-11 inline-flex items-center justify-center text-on-surface/75 hover:text-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden lg:block absolute inset-x-0 top-full bg-surface border-t border-on-surface/10 shadow-[0_30px_60px_rgba(42,31,22,0.18)]"
          >
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-[1fr_1fr_1fr_1fr_280px] gap-10">
              {megaGroups.map((group) => (
                <div key={group.label}>
                  <h4 className="uppercase tracking-[0.25em] text-[9px] text-on-surface/40 font-bold mb-4">
                    {group.label}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.items.map((cat) => {
                      const accent = getCategoryAccent(cat.slug);
                      return (
                        <li key={cat.slug}>
                          <Link
                            to={`/category/${cat.slug}`}
                            className="group/item inline-flex items-center gap-2.5 text-[13px] text-on-surface/75 hover:text-heading transition-colors"
                          >
                            <span
                              aria-hidden
                              className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all"
                              style={{ backgroundColor: accent.accent }}
                            />
                            <span className="group-hover/item:translate-x-0.5 transition-transform">
                              {cat.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <Link
                to="/#collections"
                className="group/feature relative overflow-hidden ring-1 ring-on-surface/10 self-stretch min-h-[260px] block"
              >
                <img
                  src="/assets/ads/marinara-banner.jpg"
                  alt="Tuscanini pantry collection"
                  className="absolute inset-0 w-full h-full object-cover group-hover/feature:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <span className="text-gold uppercase tracking-[0.25em] text-[9px] font-bold block mb-1.5">
                    The Full Pantry
                  </span>
                  <span className="font-headline text-xl text-italia-white block mb-2 leading-snug">
                    Explore Every Collection
                  </span>
                  <span className="inline-flex items-center gap-2 text-italia-white/80 text-[10px] uppercase tracking-[0.2em] group-hover/feature:gap-3 transition-all">
                    Browse All
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
            <div className="italia-stripe w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-surface/95 backdrop-blur-md border-t border-on-surface/10"
          >
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-3 mb-4">
                {mobilePageLinks.map((link) => {
                  const active = isActive(link.to, location.pathname);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`uppercase tracking-[0.2em] text-[11px] transition-colors ${
                        active
                          ? "text-gold"
                          : "text-on-surface/70 hover:text-gold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-on-surface/10 my-4" />

              <h4 className="uppercase tracking-[0.2em] text-[9px] text-on-surface/40 mb-3">
                Categories
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {mobileCategoryLinks.map((link) => {
                  const active = isActive(link.to, location.pathname);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`uppercase tracking-[0.2em] text-[11px] transition-colors ${
                        active
                          ? "text-gold"
                          : "text-on-surface/70 hover:text-gold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
