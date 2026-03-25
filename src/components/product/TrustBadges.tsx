import { Flag, ShieldCheck } from "lucide-react";

interface TrustBadgesProps {
  madeInItaly?: boolean;
  kosher?: boolean;
}

export default function TrustBadges({ madeInItaly, kosher }: TrustBadgesProps) {
  return (
    <div className="flex flex-wrap gap-6 pt-4">
      {madeInItaly && (
        <div className="flex items-center gap-3 px-5 py-3 border border-primary/20 bg-earth-dark/50">
          <Flag className="w-5 h-5 text-primary" />
          <span className="text-on-surface/70 text-xs uppercase tracking-widest font-bold">Made in Italy</span>
        </div>
      )}
      {kosher && (
        <div className="flex items-center gap-3 px-5 py-3 border border-primary/20 bg-earth-dark/50">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-on-surface/70 text-xs uppercase tracking-widest font-bold">Certified Kosher</span>
        </div>
      )}
    </div>
  );
}
