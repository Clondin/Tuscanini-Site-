import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "../../data/products";

export default function CollectionCards({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
      {categories.map((category) => {
        const image = category.products.find((product) => product.image)?.image;
        const count = category.products.filter(
          (product) => product.image,
        ).length;
        if (!image) return null;
        return (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group bg-surface border border-on-surface/15 hover:border-olive-accent transition-colors"
          >
            <div className="aspect-[4/3] p-5 md:p-8 bg-aged-cream/50">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform motion-reduce:transform-none"
              />
            </div>
            <div className="p-4 md:p-5 flex justify-between gap-2">
              <div>
                <h3 className="font-headline text-lg md:text-2xl text-heading">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-on-surface/75">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 shrink-0 text-olive-deep" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
