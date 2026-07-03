// Source adapted from beUI Motion Section Header: https://beui.dev/components/motion/section
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_PRESS } from "../../lib/ease";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}
export default function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-start justify-between gap-3">
      <motion.div
        initial={reduce ? undefined : { opacity: 0, x: -4 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={SPRING_PRESS}
      >
        <h2 className="text-sm font-bold text-gray-950 dark:text-gray-50">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </motion.div>
      {action && (
        <motion.div whileHover={reduce ? undefined : { scale: 1.05 }} transition={SPRING_PRESS}>
          {action}
        </motion.div>
      )}
    </div>
  );
}
