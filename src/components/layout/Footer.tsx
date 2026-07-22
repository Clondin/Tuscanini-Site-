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
  const siteTitle = typeof siteSettings?.site_title === "string" ? siteSettings.site_title : "Tuscanini";
  const tagline = typeof siteSettings?.tagline === "string"
    ? siteSettings.tagline
    : "Taste Tuscanini. Know Italy.";
  const logo = typeof siteSettings?.logo === "string" ? siteSettings.logo : "";
  const body = typeof cms?.body === "string"
    ? cms.body
    : "Authentic Italian excellence, from our family to yours. Every product tells a story of tradition, quality, and the Italian art of living well.";
  return (
    <footer className="dark-section text-italia-white">
      <div className="italia-stripe w-full" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            {logo ? (
              <img src={logo} alt={siteTitle} loading="lazy" decoding="async" className="h-7 max-w-[180px] w-auto object-contain" />
            ) : (
              <TuscaniniLogo className="h-7 w-auto text-italia-white" />
            )}
            <p className="mt-3 text-italia-white/50 text-sm leading-relaxed max-w-xs">
              {body}
            </p>
            <p className="mt-3 font-script italic text-gold text-lg">
              {tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-italia-white/40 text-xs tracking-wide">TuscaniniFoods.com</span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-gold/80 border border-gold/30 rounded-full px-2.5 py-0.5">
                <span>Made in Italy</span>
              </span>
            </div>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.2em] text-[10px] text-italia-white/60 mb-4">
              Categories
            </h3>
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
                to="/#collections"
                className="inline-block mt-3 text-xs text-gold/70 hover:text-gold transition-colors uppercase tracking-[0.15em]"
              >
                View All Categories &rarr;
              </Link>
            )}
          </div>

          <div>
            <h3 className="uppercase tracking-[0.2em] text-[10px] text-italia-white/60 mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/tuscaninifoods/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center text-italia-white/60 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@TuscaniniFoods"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center text-italia-white/60 hover:text-gold transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
            {cmsLinks.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {cmsLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="inline-flex min-h-6 items-center text-xs text-italia-white/60 hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-italia-white/10 text-center">
          <p className="text-italia-white/30 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved. Authentic Italian
            Excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
