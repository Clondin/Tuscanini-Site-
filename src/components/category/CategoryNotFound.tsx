import { Link } from "react-router-dom";

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center still-life-frame max-w-md mx-auto py-16 px-10">
        <h1 className="font-headline text-4xl text-primary mb-4">Category Not Found</h1>
        <p className="text-on-surface/60 font-body mb-8">
          The category you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-primary text-white font-body text-sm uppercase tracking-widest hover:bg-primary/80 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
