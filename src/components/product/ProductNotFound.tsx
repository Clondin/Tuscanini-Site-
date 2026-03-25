import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="font-headline text-5xl text-heading mb-6">Product Not Found</h1>
        <p className="text-on-surface/60 mb-10 font-body text-lg">
          We couldn't find the product you're looking for. It may have been removed or the link is incorrect.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-body uppercase tracking-widest text-xs hover:bg-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
