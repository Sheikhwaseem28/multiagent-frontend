import { Zap, Menu } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function TopNav() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <header
      className="sticky top-0 z-20 h-14 sm:h-16 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 border-b border-white/[0.06] shrink-0"
      style={{
        background: "rgba(17,17,17,0.85)",
        backdropFilter: "blur(12px)",
      }}
      role="banner"
    >
      {/* ── Mobile Menu Toggle ── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 -ml-2 rounded-xl text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.08] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile Title & Logo ── */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="h-6 w-6 rounded-md overflow-hidden flex items-center justify-center bg-black/20">
          <img src="/logo.png" alt="DeepScout Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-[#F5F5F5] text-sm">DeepScout</span>
      </div>

      {/* ── Model badge ── */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 shrink-0 ml-auto">
        <Zap size={11} className="text-[#FFFFFF]" />
        <span className="text-[11px] font-semibold text-[#FFFFFF] whitespace-nowrap">
          Gemini-2.5-Flash
        </span>
      </div>
    </header>
  );
}
