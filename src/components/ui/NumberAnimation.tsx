// Source adapted from beUI Motion Number Animation: https://beui.dev/components/motion/number
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { SPRING_SWAP } from "../../lib/ease";
export default function NumberAnimation({ value, className }: { value: number | string; className?: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  useEffect(() => setDisplay(value), [value]);
  return <motion.span key={String(display)} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={SPRING_SWAP} className={className}>{display}</motion.span>;
}
