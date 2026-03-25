import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  [key: string]: unknown;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.1 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.1 });

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -maxTilt * 2);
    rotateY.set((px - 0.5) * maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <div style={{ perspective: 800 }} className={className} {...props}>
      <motion.div
        ref={ref}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full"
      >
        {children}
        {isHovering && <GlareOverlay glareX={glareX} glareY={glareY} />}
      </motion.div>
    </div>
  );
}

function GlareOverlay({ glareX, glareY }: { glareX: MotionValue<number>; glareY: MotionValue<number> }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const unsubX = glareX.on("change", (v) => setPos((p) => ({ ...p, x: v })));
    const unsubY = glareY.on("change", (v) => setPos((p) => ({ ...p, y: v })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [glareX, glareY]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 rounded-sm"
      style={{
        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`,
      }}
    />
  );
}
