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
  void mode;
  void delay;
  void staggerDelay;
  return <Tag className={className}>{text}</Tag>;
}
