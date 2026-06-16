import { motion } from "framer-motion";
import { cn } from "../../utils";

const variantStyles = {
  default: "bg-[#1A1A1A] text-[#A1A1AA] border border-white/[0.08]",
  success: "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30",
  warning: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30",
  error: "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30",
  info: "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  pulse,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium font-mono tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <motion.span
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "success"
                ? "bg-[#22C55E]"
                : variant === "warning"
                  ? "bg-[#F59E0B]"
                  : variant === "error"
                    ? "bg-[#EF4444]"
                    : "bg-[#6366F1]",
            )}
          />

          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              variant === "success"
                ? "bg-[#22C55E]"
                : variant === "warning"
                  ? "bg-[#F59E0B]"
                  : variant === "error"
                    ? "bg-[#EF4444]"
                    : "bg-[#6366F1]",
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
