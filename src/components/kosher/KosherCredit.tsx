import { KOSHER_COM_HOME } from "../../lib/kosherVideo";

/** "Recipes & stories from Kosher.com": a visible, followed credit link to kosher.com. */
export default function KosherCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs md:text-sm text-on-surface/75 ${className}`}>
      Recipes &amp; stories from{" "}
      <a
        href={KOSHER_COM_HOME}
        target="_blank"
        rel="noopener"
        className="font-semibold text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep"
      >
        Kosher.com
      </a>
    </p>
  );
}
