import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-aged-cream flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center max-w-xl"
      >
        <h1 className="font-headline text-3xl md:text-4xl text-heading italic mb-4">
          Page not found
        </h1>
        <p className="text-on-surface/70 leading-relaxed mb-10">
          This page doesn't exist or has moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-3 px-8 py-3.5 bg-primary text-white font-body uppercase tracking-[0.16em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            to="/#collections"
            className="inline-flex min-h-11 items-center gap-2 px-8 py-3.5 border border-on-surface/20 text-on-surface/80 font-body uppercase tracking-[0.16em] text-xs hover:border-gold hover:text-gold transition-colors"
          >
            Browse collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
