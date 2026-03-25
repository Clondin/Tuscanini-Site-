import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryBreadcrumbsProps {
  categoryName: string;
}

export default function CategoryBreadcrumbs({ categoryName }: CategoryBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/"
        className="text-on-surface/50 hover:text-primary transition-colors font-body uppercase tracking-widest text-[10px]"
      >
        Home
      </Link>
      <ChevronRight className="w-3 h-3 text-on-surface/30" />
      <span className="text-primary font-body uppercase tracking-widest text-[10px]">
        {categoryName}
      </span>
    </nav>
  );
}
