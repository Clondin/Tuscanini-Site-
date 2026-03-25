import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  mode?: "word" | "letter";
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export default function TextReveal({
  text,
  mode = "word",
  className = "",
  delay = 0,
  staggerDelay,
  as: Tag = "h2",
}: TextRevealProps) {
  const defaultStagger = mode === "word" ? 0.08 : 0.03;
  const stagger = staggerDelay ?? defaultStagger;

  const units = mode === "word" ? text.split(/(\s+)/) : text.split("");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {units.map((unit, i) => {
          // For word mode, whitespace tokens render as-is
          if (mode === "word" && /^\s+$/.test(unit)) {
            return <span key={`ws-${i}`}>{unit}</span>;
          }

          // Count only non-whitespace units for stagger index
          const animIndex =
            mode === "word"
              ? units.slice(0, i).filter((u) => !/^\s+$/.test(u)).length
              : i;

          return (
            <motion.span
              key={`${unit}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: delay + animIndex * stagger,
              }}
            >
              {unit}
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}
