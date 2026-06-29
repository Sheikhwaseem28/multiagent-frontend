import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  History,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { cn, formatTimestamp } from "../../utils";

/** Reactive check: are we on a desktop viewport (≥ 1024px)? */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

const navItems = [
  { id: "home", icon: Sparkles, label: "New Task" },
  { id: "research", icon: Brain, label: "Active Work" },
  { id: "history", icon: History, label: "History" },
];

export function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    history,
    session,
    loadFromHistory,
  } = useAppStore();

  const isDesktop = useIsDesktop();

  // How many recent history items are visible in the sidebar
  const BATCH = 10;
  const [visibleCount, setVisibleCount] = useState(BATCH);

  // Reset visible count when sidebar closes so it's fresh on re-open
  useEffect(() => {
    if (!sidebarOpen) setVisibleCount(BATCH);
  }, [sidebarOpen]);

  /** Shared click handler: navigate + close sidebar on mobile */
  const navigate = (id) => {
    setActiveView(id);
    if (!isDesktop) setSidebarOpen(false);
  };

  return (
    <>
      {/* ── Mobile / Tablet backdrop overlay ─────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ─────────────────────────────────────────────── */}
      <motion.aside
        /*
         * lg+: push-sidebar — width animates between 72px (collapsed)
         *      and 280px (expanded), content shifts via margin-left on .app-main.
         * <lg: full-screen overlay drawer — translateX hides/shows it,
         *      content behind does NOT shift.
         */
        animate={{
          width: isDesktop
            ? sidebarOpen
              ? 280
              : 72 /* push layout widths */
            : 280 /* drawer always 280px wide */,
          x: !isDesktop && !sidebarOpen ? "-100%" : "0%",
        }}
        initial={false}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-full z-30 flex flex-col",
          "bg-[#111111] border-r border-white/[0.06]",
          "overflow-hidden",
          !isDesktop && "shadow-2xl shadow-black/60",
        )}
        aria-label="Sidebar navigation"
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0">
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-neutral-200/20">
              <img src="/logo.png" alt="DeepScout Logo" className="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#FFFFFF]"
            />
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="font-bold text-[#F5F5F5] text-base leading-tight tracking-tight whitespace-nowrap">
                  DeepScout
                </div>
                <div className="text-[10px] font-semibold text-[#FFFFFF] tracking-widest uppercase">
                  AI Agents
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="px-3 py-2 space-y-0.5 flex-1 overflow-y-auto scrollbar-hide"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeView === id;
            const isDisabled = id === "research" && !session;

            return (
              <motion.button
                key={id}
                whileHover={!isDisabled ? { x: 2 } : {}}
                whileTap={!isDisabled ? { scale: 0.97 } : {}}
                onClick={() => {
                  if (!isDisabled) navigate(id);
                }}
                disabled={isDisabled}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl text-sm font-medium",
                  "transition-all duration-200 min-h-[44px]",
                  sidebarOpen ? "px-3" : "justify-center px-0",
                  isDisabled
                    ? "text-[#71717A] cursor-not-allowed"
                    : isActive
                      ? "text-[#F5F5F5]"
                      : "text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.04]",
                )}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-left truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && sidebarOpen && (
                  <div className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0" />
                )}
              </motion.button>
            );
          })}

          {/* ── Recent history (only when expanded) ── */}
          <AnimatePresence>
            {sidebarOpen && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-3 pb-2">
                  <Clock size={11} className="text-[#71717A]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Recent
                  </span>
                </div>

                {/* Show up to visibleCount items */}
                {history.slice(0, visibleCount).map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      loadFromHistory(item.id);
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#FFFFFF]/10 border border-transparent hover:border-[#FFFFFF]/20 transition-all duration-200 group min-h-[40px]"
                    aria-label={`Open: ${item.topic}`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen
                        size={11}
                        className="shrink-0 text-[#71717A] group-hover:text-[#FFFFFF]"
                      />
                      <span className="truncate flex-1 group-hover:text-[#F5F5F5]">
                        {item.topic}
                      </span>
                      <span className="ml-auto shrink-0 text-[#FFFFFF] font-semibold text-[10px] flex items-center gap-0.5">
                        <Star size={9} className="fill-[#FFFFFF]" />
                        {item.score}/10
                      </span>
                    </div>
                    <div className="text-[10px] text-[#71717A] mt-0.5 pl-[19px]">
                      {formatTimestamp(item.completedAt)}
                    </div>
                  </motion.button>
                ))}

                {/* Load more / Collapse controls */}
                {history.length > BATCH && (
                  <div className="pt-1 pb-0.5">
                    {visibleCount < history.length ? (
                      <button
                        onClick={() =>
                          setVisibleCount((c) =>
                            Math.min(c + BATCH, history.length),
                          )
                        }
                        className="w-full text-center text-[10px] font-semibold text-[#FFFFFF] hover:text-[#A3A3A3] py-1.5 rounded-lg hover:bg-[#FFFFFF]/10 transition-all"
                      >
                        Load {Math.min(BATCH, history.length - visibleCount)}{" "}
                        more &nbsp;({history.length - visibleCount} remaining)
                      </button>
                    ) : (
                      <button
                        onClick={() => setVisibleCount(BATCH)}
                        className="w-full text-center text-[10px] font-semibold text-[#71717A] hover:text-[#A1A1AA] py-1.5 rounded-lg hover:bg-white/[0.03] transition-all"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── Session count ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 border-t border-white/[0.06] shrink-0"
            >
              <div className="flex items-center gap-2 text-xs text-[#71717A]">
                <TrendingUp size={12} />
                <span>
                  {history.length} task{history.length !== 1 ? "s" : ""}{" "}
                  completed
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Collapse / Expand toggle (desktop only) ── */}
        <div className="hidden lg:block px-3 pb-4 shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "w-full flex items-center rounded-xl py-2 text-[#71717A]",
              "hover:text-[#A1A1AA] hover:bg-white/[0.04]",
              "transition-all duration-200 min-h-[44px]",
              sidebarOpen ? "gap-3 px-3" : "justify-center px-2",
            )}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Safe-area spacer for iOS ── */}
        <div className="safe-bottom lg:hidden" />
      </motion.aside>
    </>
  );
}
