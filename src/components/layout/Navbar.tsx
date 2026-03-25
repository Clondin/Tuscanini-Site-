import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search } from "lucide-react";
import { categories } from "../../data/products";
import TuscaniniLogo from "../TuscaniniLogo";
import SearchOverlay from "../ui/SearchOverlay";

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

const mobilePageLinks = [
  { label: "The Pantry", to: "/#collections" },
  { label: "Our Story", to: "/about" },
];

const mobileCategoryLinks = categories.map((c) => ({
  label: c.name,
  to: `/category/${c.slug}`,
}));

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
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
    >
      <div className="italia-stripe w-full" />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="select-none text-heading">
          <TuscaniniLogo className="h-8 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {topNavLinks.map((link) => {
            const active = isActive(link.to, location.pathname);
            return (
              <Link
                key={link.to}
                to={link.to}
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
            className="text-on-surface/70 hover:text-gold transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="text-on-surface/70 hover:text-gold transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            className="text-on-surface/70 hover:text-gold transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

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
