import { Zap } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function TopNav() {
  const { session } = useAppStore();

  return (
    <header
      className="sticky top-0 z-20 h-14 sm:h-16 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 border-b border-white/[0.06] shrink-0"
      style={{
        background: "rgba(17,17,17,0.85)",
        backdropFilter: "blur(12px)",
      }}
      role="banner"
    >
      {/* ── Model badge ── */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 shrink-0 ml-auto">
        <Zap size={11} className="text-[#6366F1]" />
        <span className="text-[11px] font-semibold text-[#6366F1] whitespace-nowrap">
          GPT-4o-mini
        </span>
      </div>
    </header>
  );
}
