import { motion } from "framer-motion";
import { cn } from "../../utils";

const variantStyles = {
  default: "bg-[#1A1A1A] text-[#A1A1AA] border border-white/[0.08]",
  success: "bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30",
  warning: "bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30",
  error: "bg-[#A3A3A3]/15 text-[#A3A3A3] border border-[#A3A3A3]/30",
  info: "bg-[#FFFFFF]/15 text-[#FFFFFF] border border-[#FFFFFF]/30",
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
                ? "bg-[#FFFFFF]"
                : variant === "warning"
                  ? "bg-[#FFFFFF]"
                  : variant === "error"
                    ? "bg-[#A3A3A3]"
                    : "bg-[#FFFFFF]",
            )}
          />

          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              variant === "success"
                ? "bg-[#FFFFFF]"
                : variant === "warning"
                  ? "bg-[#FFFFFF]"
                  : variant === "error"
                    ? "bg-[#A3A3A3]"
                    : "bg-[#FFFFFF]",
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
