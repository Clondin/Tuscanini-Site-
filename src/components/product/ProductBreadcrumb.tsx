import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  productName: string;
}

export default function ProductBreadcrumb({ categoryName, categorySlug, productName }: ProductBreadcrumbProps) {
  return (
    <div className="bg-aged-cream border-b border-on-surface/10">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center gap-2 overflow-x-auto">
        <Link
          to="/"
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/55 hover:text-primary transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-on-surface/35" />
        <Link
          to={`/category/${categorySlug}`}
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/55 hover:text-primary transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-on-surface/35" />
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-olive-accent">
          {productName}
        </span>
      </nav>
    </div>
  );
}
