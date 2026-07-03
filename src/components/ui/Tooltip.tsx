// Source adapted from beUI Motion Tooltip: https://beui.dev/components/motion/tooltip
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { SPRING_PANEL } from "../../lib/ease";
export default function Tooltip({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 4, scale: 0.96, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 4, scale: 0.96, filter: "blur(4px)" }
            }
            transition={SPRING_PANEL}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-gray-900"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
