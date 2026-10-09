import { useEffect, useRef, useState } from "react";
import {
  Flag,
  LayoutGrid,
  Package,
  ShieldCheck,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";
import { formatProductSize } from "../../lib/formatProductSize";
import { isMissingProductImage } from "../../lib/productImage";
import { getProductPurchaseLink } from "../../lib/productPurchaseLink";

export interface ProductFact {
  label: string;
  value: string;
  icon: LucideIcon;
}

/**
 * Everything the product detail layouts share: purchase link, facts built
 * only from recorded flags, share/copy, the lightbox, and the mobile buy bar
 * that appears once the main buy button scrolls under the navigation.
 */
export function useProductDossier(product: Product, categoryName: string) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [copied, setCopied] = useState(false);
  const buyingRef = useRef<HTMLAnchorElement>(null);
  const frozen = isFrozenProduct(product);
  const purchaseLink = getProductPurchaseLink(product);
  const size = formatProductSize(product.size);

  useEffect(() => {
    const button = buyingRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setShowSticky(
          !entry.isIntersecting && entry.boundingClientRect.top < 75,
        ),
      { rootMargin: "-75px 0px 0px 0px" },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const share = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: shareUrl });
      } catch {
        // Dismissing the share sheet is not an error worth surfacing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; the address bar still has the link.
    }
  };

  const facts = (
    [
      { label: "Pack size", value: size, icon: Package },
      {
        label: "Origin",
        value: product.madeInItaly ? "Made in Italy" : undefined,
        icon: Flag,
      },
      {
        label: "Certification",
        value: product.kosher === true ? "Certified kosher" : undefined,
        icon: ShieldCheck,
      },
      { label: "Storage", value: frozen ? "Frozen" : undefined, icon: Snowflake },
      { label: "Collection", value: categoryName, icon: LayoutGrid },
    ] as { label: string; value: string | undefined; icon: LucideIcon }[]
  ).filter((fact): fact is ProductFact => Boolean(fact.value));

  // The ref travels separately so the plain state object stays render-safe.
  const state = {
    facts,
    size,
    frozen,
    hasImage: !isMissingProductImage(product.image),
    purchase: {
      href: purchaseLink.href,
      label: purchaseLink.label,
      sponsored: purchaseLink.sponsored,
      rel: purchaseLink.sponsored
        ? "sponsored noopener noreferrer"
        : "noopener noreferrer",
    },
    showSticky,
    share,
    copied,
    lightboxOpen,
    openLightbox: () => setLightboxOpen(true),
    closeLightbox: () => setLightboxOpen(false),
  };
  return { state, buyingRef };
}

export type ProductDossierState = ReturnType<typeof useProductDossier>["state"];
