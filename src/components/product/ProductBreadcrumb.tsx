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
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-5 md:px-10 py-3.5 flex flex-wrap items-center gap-2">
        <Link
          to="/"
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/80 hover:text-primary transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-on-surface/80" />
        <Link
          to={`/category/${categorySlug}`}
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/80 hover:text-primary transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="hidden md:block w-3 h-3 shrink-0 text-on-surface/80" />
        <span aria-current="page" className="hidden md:inline text-xs tracking-wide text-olive-deep">
          {productName}
        </span>
      </nav>
    </div>
  );
}
