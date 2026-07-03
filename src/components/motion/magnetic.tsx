"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { SPRING_MOUSE } from "src/lib/ease";
import { useHoverCapable } from "src/lib/hooks/use-hover-capable";
import { cn } from "src/lib/utils";

export interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  // Decorative cursor-follow: skip on touch (phantom hover) and reduced motion.
  const enabled = !reduce && canHover;
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);
  const springX = useSpring(translateX, SPRING_MOUSE);
  const springY = useSpring(translateY, SPRING_MOUSE);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || !enabled) return;
    const rect = element.getBoundingClientRect();
    translateX.set((event.clientX - rect.left - rect.width / 2) * strength);
    translateY.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    translateX.set(0);
    translateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
