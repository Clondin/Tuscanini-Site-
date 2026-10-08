import { getResponsiveImageProps } from "../../lib/productImage";
import type { ImgHTMLAttributes } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category } from "../../data/products";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";

/** Settles each pack onto the shelf as it arrives instead of popping in. */
function ShelfImage({ className = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...props}
      ref={(image) => {
        if (image?.complete && image.naturalWidth > 0) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
      className={`${className} transition duration-500 ease-out motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0 translate-y-2"}`}
    />
  );
}

export default function CategoryShelf({
  category,
}: {
  category: Category;
  compact?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const sizing = useMemo(
    () => shelfSizing(category.products, { base: 185, min: 130, max: 240 }),
    [category.products],
  );
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft < 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);
  const move = (direction: number) =>
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  return (
    <section aria-label={`${category.name} shelf`} className="py-5">
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm text-on-surface/85">
          Choose a product to see the details.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => move(-1)}
            disabled={edges.start}
            aria-label="Previous products"
            className="w-11 h-11 flex items-center justify-center border border-on-surface/30 disabled:opacity-35"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => move(1)}
            disabled={edges.end}
            aria-label="Next products"
            className="w-11 h-11 flex items-center justify-center border border-on-surface/30 disabled:opacity-35"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={rail}
        className="overflow-x-auto snap-x snap-proximity pb-5"
        tabIndex={0}
        aria-label="Product shelf, scroll horizontally"
      >
        <div className="flex w-max min-w-full">
          {category.products
            .filter((product) => product.image)
            .map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ width: sizing[product.id].width }}
                className="group shrink-0 snap-start text-center"
              >
                <div className="h-[270px] px-5 flex items-end justify-center pb-3">
                  <ShelfImage
                    {...getResponsiveImageProps(product.image, "100vw")}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ maxHeight: sizing[product.id].height }}
                    className="max-w-full w-auto object-contain mix-blend-multiply group-hover:-translate-y-2 motion-reduce:transform-none"
                  />
                </div>
                <div className="h-4 shelf-edge" />
                <div className="px-4 pt-5">
                  <h3 className="font-headline text-lg text-heading leading-snug group-hover:text-olive-accent">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-on-surface/80">
                    {formatProductSize(product.size)}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
