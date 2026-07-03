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
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 dark:hover:bg-primary/80",
  secondary:
    "border border-border bg-card text-foreground shadow-sm hover:bg-card/80",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-primary/5",
  outline: "border border-border bg-transparent text-foreground hover:bg-primary/5",
  danger:
    "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/15",
  success:
    "bg-accent/10 text-accent hover:bg-accent/20 dark:hover:bg-accent/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-xs gap-1.5",
  md: "h-10 rounded-lg px-4 text-sm gap-2",
  lg: "h-12 rounded-xl px-5 text-base gap-2",
  icon: "h-10 w-10 rounded-lg p-0",
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
          "inline-flex items-center justify-center font-semibold select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-background",
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
