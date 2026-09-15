import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Expand, Flag, MapPin, ShieldCheck, ShoppingCart } from "lucide-react";
import type { Product } from "../../data/products";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import ImageLightbox from "../ui/ImageLightbox";

interface ProductDossierProps {
  product: Product;
  categoryName: string;
  categorySlug: string;
  /** Other products in the same category, used for the thumbnail rail. */
  siblings: Product[];
}

const frozenCategoryIds = new Set(["pizza", "gelato", "bread-frozen-appetizers"]);
const amazonStoreUrl =
  "https://www.amazon.com/stores/Tuscanini/page/63CC7208-7FF4-4C25-B5F7-CAC5D4CA1C9A?lp_asin=B07KYWQ22X&store_ref=bl_ast_dp_brandlogo_sto&linkCode=ll2&tag=kaycopromo-20&linkId=723bc4fbe21f9f690cf8fd07d0c98802&language=en_US&ref_=as_li_ss_tl";

type SpecRow = { label: string; value: string };

export default function ProductDossier({
  product,
  categoryName,
  categorySlug,
  siblings,
}: ProductDossierProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const isFrozen = product.frozen || frozenCategoryIds.has(product.categoryId);
  const buyUrl = isFrozen ? "https://tuscaninifoods.com" : amazonStoreUrl;

  const detailRows: SpecRow[] = [
    product.size ? { label: "Format", value: product.size } : null,
    { label: "Collection", value: categoryName },
    product.madeInItaly ? { label: "Origin", value: "Made in Italy" } : null,
    product.kosher ? { label: "Certification", value: "Certified kosher" } : null,
  ].filter((r): r is SpecRow => r !== null);

  const panels: { label: string; rows: SpecRow[] }[] = [
    { label: "Detail", rows: detailRows },
    ...(product.ingredients
      ? [{ label: "Ingredients", rows: [{ label: "Contains", value: product.ingredients }] }]
      : []),
  ];

  const activePanel = panels[Math.min(tab, panels.length - 1)];
  const thumbs = siblings.filter((p) => p.image).slice(0, 4);

  const eyebrow = [categoryName, product.size].filter(Boolean).join(" · ");

  return (
    <section className="grid lg:grid-cols-2 lg:min-h-[640px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-aged-cream lg:border-r border-on-surface/14 px-6 py-10 md:px-11 md:py-12 flex flex-col"
      >
        <div className="flex-1 min-h-[320px] md:min-h-[380px] flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_45%,var(--color-olive-wash)_0%,var(--color-aged-cream)_78%)]">
          {product.image ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`View larger image of ${product.name}`}
              className="group relative w-full h-full flex items-center justify-center cursor-zoom-in bg-transparent border-0 p-0"
            >
              <ImageWithSkeleton
                src={product.image}
                alt={product.name}
                className="max-h-[360px] w-auto max-w-full object-contain drop-shadow-[0_22px_30px_rgba(42,31,22,0.22)]"
                wrapperClassName="flex items-center justify-center"
                skeletonClassName="aspect-auto"
              />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-on-surface/10 text-on-surface text-xs uppercase tracking-widest font-semibold shadow-lg">
                  <Expand className="w-4 h-4" />
                  View image
                </span>
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <span className="font-headline text-3xl text-heading/30">{product.name}</span>
              <span className="mt-3 text-primary/40 text-xs uppercase tracking-[0.3em]">
                Image coming soon
              </span>
            </div>
          )}
        </div>

        {thumbs.length > 0 && (
          <div className="flex gap-2.5 mt-6 overflow-x-auto">
            {thumbs.map((sibling) => (
              <Link
                key={sibling.id}
                to={`/product/${sibling.id}`}
                aria-label={sibling.name}
                className="w-[70px] h-[70px] shrink-0 bg-surface border border-on-surface/12 flex items-center justify-center hover:border-olive-accent/60 transition-colors"
              >
                <img
                  src={sibling.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-contain p-2"
                />
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="px-6 py-10 md:px-11 md:py-12 flex flex-col"
      >
        <span className="block mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-olive-accent">
          {eyebrow}
        </span>
        <h1 className="mb-4 font-headline font-normal text-heading text-[clamp(2.125rem,4vw,3rem)] leading-[1.04]">
          {product.name}
        </h1>
        <p className="mb-7 text-[17px] leading-[1.8] text-on-surface/72 max-w-[48ch] text-pretty">
          {product.description}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <a
            href={buyUrl}
            target="_blank"
            rel={isFrozen ? "noopener noreferrer" : "sponsored noopener noreferrer"}
            className="inline-flex min-h-11 items-center gap-2.5 px-[30px] py-4 bg-olive-accent text-white text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-olive-accent-dark transition-colors"
          >
            {isFrozen ? <MapPin className="w-[15px] h-[15px]" /> : <ShoppingCart className="w-[15px] h-[15px]" />}
            {isFrozen ? "Where to buy" : "Buy on Amazon"}
          </a>
          <span className="flex flex-wrap gap-3.5">
            {product.madeInItaly && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-olive-accent">
                <Flag className="w-[13px] h-[13px]" />
                Made in Italy
              </span>
            )}
            {product.kosher && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-olive-accent">
                <ShieldCheck className="w-[13px] h-[13px]" />
                Certified Kosher
              </span>
            )}
          </span>
        </div>

        {panels.length > 1 && (
          <div className="flex flex-wrap border-b border-on-surface/16">
            {panels.map((panel, idx) => (
              <button
                key={panel.label}
                type="button"
                onClick={() => setTab(idx)}
                aria-pressed={idx === tab}
                className={`bg-transparent border-0 border-b-2 pb-3.5 mr-[30px] text-[11px] font-bold uppercase tracking-[0.18em] cursor-pointer transition-colors ${
                  idx === tab
                    ? "border-olive-accent text-heading"
                    : "border-transparent text-on-surface/50 hover:text-heading"
                }`}
              >
                {panel.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 pt-6">
          {activePanel.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr] gap-6 py-3.5 border-b border-on-surface/10"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface/45">
                {row.label}
              </span>
              <span className="text-[15px] leading-[1.7] text-on-surface/78">{row.value}</span>
            </div>
          ))}
        </div>

        {!isFrozen && (
          <p className="mt-6 text-[10px] leading-relaxed text-on-surface/45">
            As an Amazon Associate, Tuscanini may earn from qualifying purchases.
          </p>
        )}

        <Link
          to={`/category/${categorySlug}`}
          className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-burnt-terracotta hover:text-primary transition-colors"
        >
          &larr; Back to {categoryName}
        </Link>
      </motion.div>

      {product.image && (
        <ImageLightbox
          src={product.image}
          alt={product.name}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
