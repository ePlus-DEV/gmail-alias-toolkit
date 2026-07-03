// Source adapted from beUI Motion Card: https://beui.dev/components/motion/card
import { motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes } from "react";
import { SPRING_PRESS } from "../../lib/ease";
import { cn } from "./utils";
export default function Card({
  className,
  children,
}: HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={SPRING_PRESS}
      className={cn(
        "rounded-xl border border-border bg-card shadow-soft backdrop-blur",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
