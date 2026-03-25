import { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Instagram, Youtube, Share2, ChevronUp } from "lucide-react";
import { categories } from "../data/products";
import TuscaniniLogo from "./TuscaniniLogo";

const topNavLinks = [
  { label: "The Pantry", to: "/#collections" },
  { label: "Beverages", to: "/category/beverages" },
  { label: "Pasta", to: "/category/pasta-gnocchi" },
  { label: "Pizza", to: "/category/pizza" },
  { label: "Olive Oil", to: "/category/olive-oil-vinegars" },
  { label: "Chocolate", to: "/category/chocolate" },
  { label: "Gelato", to: "/category/gelato" },
  { label: "Our Story", to: "/about" },
];

// Footer: show top 8 categories, then "View All"
const footerCategories = categories.slice(0, 8);

// Mobile menu grouping
const mobilePageLinks = [
  { label: "The Pantry", to: "/#collections" },
  { label: "Our Story", to: "/about" },
];

const mobileCategoryLinks = categories.map((c) => ({
  label: c.name,
  to: `/category/${c.slug}`,
}));

/** Check if a nav link matches the current location */
function isActive(linkTo: string, pathname: string): boolean {
  if (linkTo === "/#collections") {
    return pathname === "/";
  }
  if (linkTo === "/about") {
    return pathname === "/about";
  }
  // For category links like "/category/beverages"
  if (linkTo.startsWith("/category/")) {
    return pathname === linkTo;
  }
  return false;
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Scroll listener for nav opacity + scroll-to-top button
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
    setShowScrollTop(window.scrollY > 500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Body scroll lock when mobile menu is open
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ───── Navigation ───── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-on-surface/10 transition-colors duration-300 ${
          scrolled ? "bg-surface" : "bg-surface/90"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="select-none text-heading">
            <TuscaniniLogo className="h-8 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {topNavLinks.map((link) => {
              const active = isActive(link.to, location.pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`uppercase tracking-[0.2em] text-[10px] transition-colors ${
                    active
                      ? "text-primary"
                      : "text-on-surface/70 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-on-surface/70 hover:text-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
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
                {/* Page links */}
                <div className="flex flex-col gap-3 mb-4">
                  {mobilePageLinks.map((link) => {
                    const active = isActive(link.to, location.pathname);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`uppercase tracking-[0.2em] text-[11px] transition-colors ${
                          active
                            ? "text-primary"
                            : "text-on-surface/70 hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-on-surface/10 my-4" />

                {/* Categories header */}
                <h4 className="uppercase tracking-[0.2em] text-[9px] text-on-surface/40 mb-3">
                  Categories
                </h4>

                {/* Categories 2-column grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {mobileCategoryLinks.map((link) => {
                    const active = isActive(link.to, location.pathname);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`uppercase tracking-[0.2em] text-[11px] transition-colors ${
                          active
                            ? "text-primary"
                            : "text-on-surface/70 hover:text-primary"
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
      </nav>

      {/* ───── Main Content ───── */}
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>

      {/* ───── Footer ───── */}
      <footer className="bg-earth-dark border-t border-on-surface/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <TuscaniniLogo className="h-7 w-auto text-heading" />
              <p className="mt-3 text-on-surface/50 text-sm leading-relaxed max-w-xs">
                Authentic Italian excellence, from our family to yours. Every product tells a story
                of tradition, quality, and the Italian art of living well.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-on-surface/40 text-xs tracking-wide">TuscaniniFoods.com</span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-primary/80 border border-primary/30 rounded-full px-2.5 py-0.5">
                  <span>Made in Italy</span>
                </span>
              </div>
            </div>

            {/* Category links — top 8 + View All */}
            <div>
              <h4 className="uppercase tracking-[0.2em] text-[10px] text-on-surface/40 mb-4">
                Categories
              </h4>
              <ul className="space-y-2 columns-2 gap-x-8">
                {footerCategories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/category/${c.slug}`}
                      className="text-sm text-on-surface/60 hover:text-primary transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {categories.length > 8 && (
                <Link
                  to="/#collections"
                  className="inline-block mt-3 text-xs text-primary/70 hover:text-primary transition-colors uppercase tracking-[0.15em]"
                >
                  View All Categories &rarr;
                </Link>
              )}
            </div>

            {/* Social */}
            <div>
              <h4 className="uppercase tracking-[0.2em] text-[10px] text-on-surface/40 mb-4">
                Connect
              </h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface/50 hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface/50 hover:text-primary transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="#"
                  className="text-on-surface/50 hover:text-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-on-surface/10 text-center">
            <p className="text-on-surface/30 text-xs tracking-wide">
              &copy; {new Date().getFullYear()} Tuscanini. All rights reserved. Authentic Italian
              Excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* ───── Scroll to Top Button ───── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
