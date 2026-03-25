import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  productName: string;
}

export default function ProductBreadcrumb({ categoryName, categorySlug, productName }: ProductBreadcrumbProps) {
  return (
    <div className="pt-28 pb-4 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-xs font-body uppercase tracking-widest"
      >
        <Link to="/" className="text-on-surface/50 hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-on-surface/30" />
        <Link
          to={`/category/${categorySlug}`}
          className="text-on-surface/50 hover:text-primary transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-on-surface/30" />
        <span className="text-primary">{productName}</span>
      </motion.nav>
    </div>
  );
}
