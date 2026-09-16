import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Category } from "../../data/products";

interface CategoryClosingProps {
  category: Category;
}

/** Only claims what the catalogue actually records for every item on the shelf. */
function closingLine(category: Category): string {
  const products = category.products;
  if (products.length === 0) return "Browse more Tuscanini products.";

  const allItalian = products.every((p) => p.madeInItaly);
  const allKosher = products.every((p) => p.kosher);

  if (allItalian && allKosher) {
    return "Everything on this shelf is made in Italy and certified kosher.";
  }
  if (allItalian) return "Everything on this shelf is made in Italy.";
  if (allKosher) return "Everything on this shelf is certified kosher.";
  return "Browse more Tuscanini products.";
}

export default function CategoryClosing({ category }: CategoryClosingProps) {
  return (
    <section className="bg-dark py-14 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-10">
        <p className="font-script italic text-2xl text-italia-white/75 max-w-[40ch]">
          {closingLine(category)}
        </p>
        <Link
          to="/products?view=collections"
          className="inline-flex items-center gap-2.5 whitespace-nowrap px-8 py-[17px] bg-gold text-dark text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
        >
          All collections
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
