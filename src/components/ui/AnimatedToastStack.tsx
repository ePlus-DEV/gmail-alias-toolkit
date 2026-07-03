// Source adapted from beUI Motion Animated Toast Stack: https://beui.dev/components/motion/animated-toast-stack
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { SPRING_PANEL } from "../../lib/ease";
import { cn } from "../../lib/utils";

export type ToastStatus =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "neutral"
  | "loading";

export interface ToastItem {
  id: string;
  message: string;
  status?: ToastStatus;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const statusConfig = {
  success: {
    icon: Check,
    border: "border-accent/30",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  error: {
    icon: AlertCircle,
    border: "border-destructive/30",
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-destructive/30",
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
  info: {
    icon: Info,
    border: "border-primary/30",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  neutral: {
    icon: Info,
    border: "border-muted",
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
  loading: {
    icon: Loader,
    border: "border-primary/30",
    bg: "bg-primary/10",
    text: "text-primary",
  },
};

export default function AnimatedToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss?: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex w-[min(340px,calc(100%-2rem))] -translate-x-1/2 flex-col-reverse gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const status = (toast.status || "info") as ToastStatus;
          const config = statusConfig[status];
          const Icon = config.icon;
          const isLoading = status === "loading";

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
                "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl",
                config.border,
                config.bg,
                config.text,
              )}
            >
              <div className="flex shrink-0 items-center">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span className="min-w-0 flex-1">{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss?.(toast.id);
                  }}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold transition-colors hover:bg-white/10 dark:hover:bg-white/5"
                >
                  {toast.action.label}
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="shrink-0 rounded-lg p-1 transition-colors hover:bg-white/10 dark:hover:bg-white/5"
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
