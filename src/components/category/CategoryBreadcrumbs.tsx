import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryBreadcrumbsProps {
  categoryName: string;
}

/** Inherits the surrounding text color, so it reads on paper and on aisle colors alike. */
export default function CategoryBreadcrumbs({ categoryName }: CategoryBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[11px] uppercase tracking-[0.2em]">
      <Link to="/" className="opacity-90 hover:opacity-100 hover:underline underline-offset-4 transition-opacity">
        Home
      </Link>
      <ChevronRight aria-hidden="true" className="w-3 h-3 opacity-80" />
      <span aria-current="page" className="font-semibold">
        {categoryName}
      </span>
    </nav>
  );
}
