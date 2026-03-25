import { Link } from "react-router-dom";
import { Instagram, Youtube, Share2 } from "lucide-react";
import { categories } from "../../data/products";
import TuscaniniLogo from "../TuscaniniLogo";

const footerCategories = categories.slice(0, 8);

export default function Footer() {
  return (
    <footer className="bg-earth-dark border-t border-on-surface/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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

        <div className="mt-12 pt-8 border-t border-on-surface/10 text-center">
          <p className="text-on-surface/30 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Tuscanini. All rights reserved. Authentic Italian
            Excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
