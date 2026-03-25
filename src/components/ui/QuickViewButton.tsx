import type { MouseEvent } from "react";
import { Eye } from "lucide-react";

interface QuickViewButtonProps {
  onClick: (e: MouseEvent) => void;
}

export default function QuickViewButton({ onClick }: QuickViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      aria-label="Quick view"
    >
      <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-on-surface/10 text-on-surface text-xs uppercase tracking-widest font-body font-semibold shadow-lg hover:bg-white transition-colors">
        <Eye className="w-4 h-4" />
        Quick View
      </span>
    </button>
  );
}
