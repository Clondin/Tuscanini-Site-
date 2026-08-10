import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  /** Small uppercase kicker above the title. Omit for sections that lead with the title. */
  eyebrow?: string;
  title: ReactNode;
  /** v2 sets most section titles in italic Playfair; page-level headings stay upright. */
  italic?: boolean;
  /** Trailing "View all →" style link, right-aligned on the baseline. */
  action?: { label: string; to: string };
  /** Hairline under the heading. Gold on cream sections, ink on the deeper earth tones. */
  rule?: "gold" | "ink";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  italic = true,
  action,
  rule = "gold",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-baseline justify-between gap-8 pb-5 border-b ${
        rule === "gold" ? "border-gold/50" : "border-on-surface/16"
      } ${className}`}
    >
      <div>
        {eyebrow && (
          <span className="block mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-burnt-terracotta">
            {eyebrow}
          </span>
        )}
        <h2
          className={`font-headline font-normal text-heading text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight ${
            italic ? "italic" : ""
          }`}
        >
          {title}
        </h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-burnt-terracotta hover:text-primary transition-colors"
        >
          {action.label} &rarr;
        </Link>
      )}
    </div>
  );
}
