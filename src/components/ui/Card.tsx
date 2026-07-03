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
        "rounded-2xl border border-white/70 bg-white/80 shadow-soft backdrop-blur dark:border-gray-700/70 dark:bg-gray-900/70",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
