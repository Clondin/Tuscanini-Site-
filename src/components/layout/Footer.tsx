import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
import { categories } from "../../data/products";
import { getCmsData, getCmsLinks } from "../../data/cms";
import TuscaniniLogo from "../TuscaniniLogo";

export default function Footer() {
  const footerCategories = categories.slice(0, 8);
  const cms = getCmsData("footer", "main");
  const siteSettings = getCmsData("site_settings", "general");
  const cmsLinks = getCmsLinks("footer", "main");
  const siteTitle =
    typeof siteSettings?.site_title === "string"
      ? siteSettings.site_title
      : "Tuscanini";
  const tagline =
    typeof siteSettings?.tagline === "string"
      ? siteSettings.tagline
      : "Taste Tuscanini. Know Italy.";
  const logo = typeof siteSettings?.logo === "string" ? siteSettings.logo : "";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Pasta, sauces, olive oils, drinks, snacks, and frozen foods from Tuscanini.";
  return (
    <footer className="bg-dark-surface text-italia-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            {logo ? (
              <img
                src={logo}
                alt={siteTitle}
                loading="lazy"
                decoding="async"
                className="h-7 max-w-[180px] w-auto object-contain"
              />
            ) : (
              <TuscaniniLogo className="h-7 w-auto text-italia-white" />
            )}
            <p className="mt-4 text-italia-white/85 text-sm leading-relaxed max-w-xs">
              {body}
            </p>
            <p className="mt-3.5 font-script italic text-gold text-lg">
              {tagline}
            </p>
          </div>

          <div>
            <h4 className="uppercase tracking-[0.2em] text-[10px] text-italia-white/85 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 columns-2 gap-x-8">
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="inline-flex min-h-6 items-center text-sm text-italia-white/70 hover:text-gold transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            {categories.length > 8 && (
              <Link
                to="/products?view=collections"
                className="inline-block mt-3 text-xs text-gold/70 hover:text-gold transition-colors uppercase tracking-[0.15em]"
              >
                View All Categories &rarr;
              </Link>
            )}
          </div>

          <div>
            <h4 className="uppercase tracking-[0.2em] text-[10px] text-italia-white/85 mb-4">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/tuscaninifoods/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center border border-italia-white/18 text-italia-white/70 hover:text-gold hover:border-gold/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@TuscaniniFoods"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center border border-italia-white/18 text-italia-white/70 hover:text-gold hover:border-gold/50 transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
            <p className="mt-5 text-xs text-italia-white/85">
              TuscaniniFoods.com
            </p>
            {cmsLinks.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {cmsLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-6 items-center text-xs text-italia-white/85 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-11 pt-7 border-t border-italia-white/10 flex flex-wrap justify-between gap-6">
          <p className="text-italia-white/85 text-xs">
            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70">
            Made in Italy
          </p>
        </div>
      </div>
      <div className="italia-stripe w-full" />
    </footer>
  );
}
