import { getResponsiveImageProps } from "../../lib/productImage";
import { useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { collectionGroups } from "../../data/collection-groups";
import { getCmsData, getCmsLinks } from "../../data/cms";
import TuscaniniLogo from "../TuscaniniLogo";
import SearchOverlay from "../ui/SearchOverlay";
import { useModalDialog } from "../../hooks/useModalDialog";

const topNavLinks = [
  { label: "Pasta", to: "/category/pasta-gnocchi" },
  { label: "Olive Oil", to: "/category/olive-oil" },
  { label: "Chocolate", to: "/category/chocolate" },
  { label: "Our Story", to: "/about" },
];
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopMenuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  const dialogRef = useModalDialog<HTMLDivElement>({
    isOpen: mobileOpen,
    onClose: closeMobileMenu,
    returnFocusRef: mobileMenuButtonRef,
    inertPageContent: true,
  });
  const { pathname } = useLocation();
  const settings = getCmsData("site_settings", "general");
  const siteTitle =
    typeof settings?.site_title === "string"
      ? settings.site_title
      : "Tuscanini";
  const logo = typeof settings?.logo === "string" ? settings.logo : "";
  const cmsLinks = getCmsLinks("navigation", "primary");
  const links = cmsLinks.length ? cmsLinks : topNavLinks;
  const groups = collectionGroups(categories);
  const closeMenus = () => {
    setMegaOpen(false);
    setMobileOpen(false);
  };
  const active = (to: string) => pathname === to;
  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed top-0 inset-x-0 z-50 bg-dark text-italia-white shadow-sm"
        onKeyDown={(event) => {
          if (event.key === "Escape" && megaOpen) {
            setMegaOpen(false);
            desktopMenuButtonRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMegaOpen(false);
        }}
      >
        <div className="italia-stripe" />
        <div
          aria-hidden={mobileOpen || undefined}
          inert={mobileOpen || undefined}
          className="max-w-7xl mx-auto px-5 md:px-6 h-[72px] flex items-center justify-between gap-5"
        >
          <Link
            to="/"
            onClick={closeMenus}
            aria-label={`${siteTitle} home`}
            className="shrink-0"
          >
            {logo ? (
              <img
                {...getResponsiveImageProps(logo, "100vw")}
                alt={siteTitle}
                className="h-8 max-w-[180px] object-contain"
              />
            ) : (
              <TuscaniniLogo className="h-8 w-auto" />
            )}
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <button
              ref={desktopMenuButtonRef}
              aria-expanded={megaOpen}
              aria-controls="desktop-shop-menu"
              onClick={() => setMegaOpen((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold"
            >
              Explore products <ChevronDown size={15} />
            </button>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenus}
                aria-current={active(link.to) ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-sm ${active(link.to) ? "text-gold" : "text-italia-white/90 hover:text-gold"}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              aria-label="Search"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => {
                setMegaOpen(false);
                setSearchOpen(true);
              }}
              className="inline-flex min-h-11 items-center gap-2 border border-white/30 px-4 text-sm hover:border-gold"
            >
              <Search size={17} />
              Search
            </button>
          </div>
          <div className="lg:hidden flex items-center gap-1">
            <button
              aria-label="Search"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className="w-11 h-11 flex items-center justify-center"
            >
              <Search size={21} />
            </button>
            <button
              ref={mobileMenuButtonRef}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-dialog"
              onClick={() => setMobileOpen(true)}
              className="w-11 h-11 flex items-center justify-center"
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
        {megaOpen && (
          <div
            id="desktop-shop-menu"
            className="hidden lg:block absolute top-full inset-x-0 max-h-[calc(100dvh-75px)] overflow-y-auto bg-dark-surface border-t border-white/20 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-7 py-8">
              <div className="flex justify-between items-center border-b border-white/20 pb-5 mb-7">
                <Link
                  to="/products"
                  onClick={closeMenus}
                  className="font-headline text-3xl text-italia-white inline-flex items-center gap-4"
                >
                  All products <ArrowRight size={21} />
                </Link>
                <Link
                  to="/products?view=collections"
                  onClick={closeMenus}
                  className="text-sm text-gold underline underline-offset-4"
                >
                  All collections
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-7">
                {groups.map((group) => (
                  <div key={group.label}>
                    <h2 className="text-sm font-semibold text-gold mb-3">
                      {group.label}
                    </h2>
                    <ul>
                      {group.items.map((category) => (
                        <li key={category.slug}>
                          <Link
                            to={`/category/${category.slug}`}
                            onClick={closeMenus}
                            className="inline-flex min-h-10 items-center py-1 text-sm text-italia-white/90 hover:text-gold"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {mobileOpen && (
          <div
            ref={dialogRef}
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            tabIndex={-1}
            className="lg:hidden fixed inset-0 bg-dark overflow-y-auto overscroll-contain"
          >
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-6">
                <p className="font-headline text-3xl">Tuscanini</p>
                <button
                  aria-label="Close menu"
                  onClick={closeMobileMenu}
                  className="w-11 h-11 flex items-center justify-center"
                >
                  <X size={23} />
                </button>
              </div>
              <Link
                to="/products"
                onClick={closeMenus}
                className="flex items-center justify-between min-h-12 mb-3 px-4 bg-gold text-dark text-sm font-semibold"
              >
                All products <ArrowRight size={18} />
              </Link>
              {groups.map((group) => (
                <details key={group.label} className="border-b border-white/20">
                  <summary className="cursor-pointer py-5 text-lg font-headline">
                    {group.label}
                  </summary>
                  <ul className="pb-4">
                    {group.items.map((category) => (
                      <li key={category.slug}>
                        <Link
                          to={`/category/${category.slug}`}
                          onClick={closeMenus}
                          className="flex min-h-11 items-center px-3 text-sm text-italia-white/90"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <Link
                to="/products?view=collections"
                onClick={closeMenus}
                className="flex min-h-12 items-center mt-4 text-gold"
              >
                All collections
              </Link>
              <Link
                to="/about"
                onClick={closeMenus}
                className="flex min-h-12 items-center"
              >
                Our story
              </Link>
            </div>
          </div>
        )}
      </nav>
      {megaOpen && (
        <button
          aria-label="Close product menu"
          tabIndex={-1}
          onClick={() => setMegaOpen(false)}
          className="hidden lg:block fixed inset-0 bg-black/25 z-40 cursor-default"
        />
      )}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
