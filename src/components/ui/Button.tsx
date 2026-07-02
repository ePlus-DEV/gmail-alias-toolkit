// Source adapted from beUI Motion Button: https://beui.dev/components/motion/button
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { EASE_OUT, SPRING_PRESS } from "../../lib/ease";
import { cn } from "../../lib/utils";
import { useHoverCapable } from "../../lib/hooks/use-hover-capable";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pressScale?: number;
  ripple?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

type Ripple = { id: number; x: number; y: number; size: number };

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-soft hover:from-blue-700 hover:to-violet-700",
  secondary:
    "border border-gray-200/80 bg-white/85 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700/80 dark:bg-gray-800/85 dark:text-gray-200 dark:hover:bg-gray-700/80",
  ghost:
    "text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80",
  outline:
    "border border-gray-200/80 bg-transparent text-gray-700 hover:bg-blue-50/70 dark:border-gray-700/80 dark:text-gray-200 dark:hover:bg-blue-950/30",
  danger:
    "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50",
  success:
    "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-xl px-3 text-xs gap-1.5",
  md: "h-10 rounded-xl px-4 text-sm gap-2",
  lg: "h-12 rounded-2xl px-5 text-base gap-2",
  icon: "h-10 w-10 rounded-xl p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      pressScale = 0.93,
      ripple = false,
      fullWidth = false,
      icon,
      className,
      children,
      onPointerDown,
      type = "button",
      disabled,
      ...rest
    },
    ref,
  ) {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const nextId = useRef(0);
    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        if (ripple && !reduce) {
          const rect = event.currentTarget.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          setRipples((prev) => [
            ...prev,
            {
              id: nextId.current++,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              size,
            },
          ]);
        }
        onPointerDown?.(event);
      },
      [onPointerDown, reduce, ripple],
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        whileTap={reduce ? undefined : { scale: pressScale }}
        whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
        transition={SPRING_PRESS}
        onPointerDown={handlePointerDown}
        className={cn(
          "inline-flex items-center justify-center font-semibold select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-gray-950",
          ripple && "relative overflow-hidden",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          disabled && "opacity-50",
          className,
        )}
        {...rest}
      >
        {ripple && !reduce ? (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <AnimatePresence>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  className="absolute rounded-full bg-current"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: r.size,
                    height: r.size,
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ scale: 0, opacity: 0.3 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: EASE_OUT }}
                  onAnimationComplete={() =>
                    setRipples((prev) => prev.filter((x) => x.id !== r.id))
                  }
                />
              ))}
            </AnimatePresence>
          </span>
        ) : null}
        {icon && (
          <span className="inline-grid shrink-0 place-items-center">
            {icon}
          </span>
        )}
        {children}
      </motion.button>
    );
  },
);

export default Button;
