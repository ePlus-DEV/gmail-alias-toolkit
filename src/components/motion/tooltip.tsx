"use client";
// beui.dev/components/motion/tooltip

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { EASE_OUT } from "src/lib/ease";
import { useHoverCapable } from "src/lib/hooks/use-hover-capable";
import { cn } from "src/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: Side;
  /** Delay before showing (ms). Default 120. */
  delay?: number;
  className?: string;
  /** Classes for the outer wrapper span. Use to fix baseline / fill parent. */
  wrapperClassName?: string;
}

type TooltipPosition = {
  top: number;
  left: number;
  transform: string;
};

const transformOrigin: Record<Side, string> = {
  top: "center bottom",
  bottom: "center top",
  left: "right center",
  right: "left center",
};

// Offset is in the direction *away* from the trigger — content originates near
// the trigger and rises into resting position.
const offsetFrom: Record<Side, { x?: number; y?: number }> = {
  top: { y: 10 },
  bottom: { y: -10 },
  left: { x: 10 },
  right: { x: -10 },
};

function buildVariants(side: Side): Variants {
  const offset = offsetFrom[side];
  return {
    initial: {
      opacity: 0,
      scale: 0.85,
      filter: "blur(10px)",
      x: offset.x ?? 0,
      y: offset.y ?? 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.7,
        opacity: { duration: 0.22, ease: EASE_OUT },
        filter: { duration: 0.3, ease: EASE_OUT },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      filter: "blur(6px)",
      x: (offset.x ?? 0) * 0.6,
      y: (offset.y ?? 0) * 0.6,
      transition: { duration: 0.14, ease: EASE_OUT },
    },
  };
}

const REDUCED_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } },
};

// Once any tooltip has just closed, neighbouring tooltips open without the
// initial delay — moving along a toolbar feels instant after the first one.
const WARM_WINDOW_MS = 300;
let lastHiddenAt = 0;

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 120,
  className,
  wrapperClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const node = wrapperRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const gap = 8;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const next: Record<Side, TooltipPosition> = {
        top: {
          top: rect.top - gap,
          left: centerX,
          transform: "translate(-50%, -100%)",
        },
        right: {
          top: centerY,
          left: rect.right + gap,
          transform: "translate(0, -50%)",
        },
        bottom: {
          top: rect.bottom + gap,
          left: centerX,
          transform: "translate(-50%, 0)",
        },
        left: {
          top: centerY,
          left: rect.left - gap,
          transform: "translate(-100%, -50%)",
        },
      };

      setPosition(next[side]);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, side]);

  const show = () => {
    if (!canHover) return;
    if (timer.current) clearTimeout(timer.current);
    const warm = Date.now() - lastHiddenAt < WARM_WINDOW_MS;
    timer.current = setTimeout(() => setOpen(true), warm ? 0 : delay);
  };
  const hide = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (open) lastHiddenAt = Date.now();
    setOpen(false);
  };

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(
    children as ReactElement<Record<string, unknown>>,
    {
      onMouseEnter: show,
      onMouseLeave: hide,
      onFocus: show,
      onBlur: hide,
      "aria-describedby": id,
    },
  );

  const variants = reduce ? REDUCED_VARIANTS : buildVariants(side);

  return (
    <span
      ref={wrapperRef}
      className={cn("relative inline-flex align-middle", wrapperClassName)}
    >
      {trigger}
      {typeof document === "undefined"
        ? null
        : createPortal(
            <AnimatePresence mode="wait">
              {open && position ? (
                <span
                  className="pointer-events-none fixed z-[9999]"
                  style={{
                    top: position.top,
                    left: position.left,
                    transform: position.transform,
                  }}
                >
                  <motion.span
                    id={id}
                    role="tooltip"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                      transformOrigin: transformOrigin[side],
                      willChange: "transform, opacity, filter",
                    }}
                    className={cn(
                      "block whitespace-nowrap rounded-lg border border-border bg-popover/85 px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-2xl backdrop-blur-xl",
                      className,
                    )}
                  >
                    {content}
                  </motion.span>
                </span>
              ) : null}
            </AnimatePresence>,
            document.body,
          )}
    </span>
  );
}
