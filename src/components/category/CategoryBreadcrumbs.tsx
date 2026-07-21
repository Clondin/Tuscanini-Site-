import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryBreadcrumbsProps {
  categoryName: string;
  inverted?: boolean;
}

export default function CategoryBreadcrumbs({ categoryName, inverted = false }: CategoryBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/"
        className={`${inverted ? "text-white/70 hover:text-white" : "text-on-surface/60 hover:text-primary"} transition-colors font-body uppercase tracking-widest text-[10px]`}
      >
        Home
      </Link>
      <ChevronRight className={`w-3 h-3 ${inverted ? "text-white/45" : "text-on-surface/35"}`} />
      <span className={`${inverted ? "text-white/85" : "text-primary"} font-body uppercase tracking-widest text-[10px]`}>
        {categoryName}
      </span>
    </nav>
  );
}
