// Source adapted from beUI Motion Input: https://beui.dev/components/motion/input
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode, useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { SPRING_PRESS } from "../../lib/ease";
import { cn } from "../../lib/utils";

export interface InputProps extends Omit<HTMLMotionProps<"input">, "onChange"> { label?: string; leftIcon?: ReactNode; rightIcon?: ReactNode; error?: string; success?: boolean; onChange?: (value: string) => void; }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, leftIcon, rightIcon, error, success, className, id, onChange, onFocus, onBlur, ...props }, ref) {
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  return <div className="space-y-1.5">
    {label && <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
    <motion.div animate={error && !reduce ? { x: [0, -3, 3, -2, 2, 0] } : undefined} transition={{ duration: 0.32 }} className="relative">
      {leftIcon && <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">{leftIcon}</span>}
      <input ref={ref} id={id} onChange={(e) => onChange?.(e.target.value)} onFocus={(e) => { setFocused(true); onFocus?.(e); }} onBlur={(e) => { setFocused(false); onBlur?.(e); }} className={cn("w-full rounded-xl border border-gray-200/90 bg-white/85 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700/80 dark:bg-gray-800/85 dark:text-gray-100", leftIcon && "pl-10", (rightIcon || error || success) && "pr-10", focused && "border-blue-400 ring-2 ring-blue-500/20", error && "border-red-400 ring-2 ring-red-500/10", success && "border-emerald-400", className)} {...props} />
      {success ? <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" /> : error ? <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" /> : rightIcon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</span> : null}
      {focused && !reduce && <motion.span layoutId="beui-input-caret" className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-blue-400/40" transition={SPRING_PRESS} />}
    </motion.div>
    {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
  </div>;
});
export default Input;
