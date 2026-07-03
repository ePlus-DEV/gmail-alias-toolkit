// Source adapted from beUI Motion Empty State: https://beui.dev/components/motion/empty-state
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_PRESS } from "../../lib/ease";

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={SPRING_PRESS}
      className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-center dark:border-gray-700 dark:bg-gray-900/50"
    >
      <motion.div
        whileHover={reduce ? undefined : { scale: 1.1 }}
        transition={SPRING_PRESS}
        className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-gray-800"
      >
        {icon}
      </motion.div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}
