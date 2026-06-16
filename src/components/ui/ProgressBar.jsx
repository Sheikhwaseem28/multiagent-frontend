import { motion } from "framer-motion";
import { cn } from "../../utils";

const variantColors = {
  indigo: "bg-[#6366F1]",
  blue: "bg-[#3B82F6]",
  cyan: "bg-[#06B6D4]",
  success: "bg-[#22C55E]",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

export function ProgressBar({
  value,
  variant = "indigo",
  size = "md",
  animated = true,
  showLabel = false,
  className,
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs font-medium text-[#A1A1AA]">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-white/[0.08] overflow-hidden",
          sizeClasses[size],
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            variantColors[variant],
            animated && clamped < 100 && "relative overflow-hidden",
          )}
        >
          {animated && clamped > 0 && clamped < 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
