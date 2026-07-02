// Source adapted from beUI Motion Animated Toast Stack: https://beui.dev/components/motion/animated-toast-stack
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { SPRING_PANEL } from "../../lib/ease";
import { cn } from "../../lib/utils";
export interface ToastItem {
  id: string;
  message: string;
  status?: "success" | "error" | "info";
}
export default function AnimatedToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss?: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 flex w-[min(340px,calc(100%-2rem))] -translate-x-1/2 flex-col-reverse gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon =
            toast.status === "error"
              ? AlertCircle
              : toast.status === "info"
                ? Info
                : Check;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10, scale: 0.96, filter: "blur(4px)" }
              }
              transition={SPRING_PANEL}
              className={cn(
                "pointer-events-auto flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold shadow-xl backdrop-blur",
                toast.status === "error"
                  ? "border-red-300/50 bg-red-600/95 text-white"
                  : toast.status === "info"
                    ? "border-blue-300/50 bg-blue-600/95 text-white"
                    : "border-emerald-300/50 bg-emerald-600/95 text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{toast.message}</span>
              {onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="rounded-lg p-1 hover:bg-white/15"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
