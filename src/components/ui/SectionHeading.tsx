import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  /** Small uppercase kicker above the title. Omit for sections that lead with the title. */
  eyebrow?: string;
  title: ReactNode;
  /** Section titles are upright Bodoni by default; italic is an opt-in accent. */
  italic?: boolean;
  /** Trailing action, right-aligned on the baseline. */
  action?: { label: string; to: string } | {
    label: string;
    onClick: () => void;
    expanded?: boolean;
    controls?: string;
  };
  /** Hairline under the heading. Gold on cream sections, ink on the deeper earth tones. */
  rule?: "gold" | "ink";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  italic = false,
  action,
  rule = "gold",
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-5 border-b ${
        rule === "gold" ? "border-ink/15" : "border-on-surface/16"
      } ${className}`}
    >
      <div>
        {eyebrow && (
          <span className="block mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-tomato">
            {eyebrow}
          </span>
        )}
        <h2
          className={`font-headline font-medium text-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[0.95] tracking-[-0.025em] ${
            italic ? "italic" : ""
          }`}
        >
          {title}
        </h2>
      </div>
      {action && ("to" in action ? (
        <Link
          to={action.to}
          className="shrink-0 whitespace-nowrap text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink transition-colors"
        >
          {action.label} &rarr;
        </Link>
      ) : (
        <button
          type="button"
          onClick={action.onClick}
          aria-expanded={action.expanded}
          aria-controls={action.controls}
          className="min-h-11 shrink-0 whitespace-nowrap text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink transition-colors cursor-pointer"
        >
          {action.label} &rarr;
        </button>
      ))}
    </div>
  );
}
