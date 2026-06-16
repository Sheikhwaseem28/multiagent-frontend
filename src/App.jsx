import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "./store/useAppStore";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { HomePage } from "./components/views/HomePage";
import { ResearchPage } from "./components/views/ResearchPage";
import { HistoryPage } from "./components/views/HistoryPage";

/** Reactive desktop breakpoint check */
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

/* ─── Page transition variants ───────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

/* ─── Main routed content ────────────────────────────────────── */
function MainContent() {
  const { activeView } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeView}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full min-h-full"
      >
        {activeView === "home" && <HomePage />}
        {activeView === "research" && <ResearchPage />}
        {activeView === "history" && <HistoryPage />}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Root App ───────────────────────────────────────────────── */
export function App() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const isDesktop = useIsDesktop();

  /**
   * On screens < 1024px the sidebar behaves as a full overlay drawer.
   * The main content does NOT shift — the sidebar floats on top.
   * On lg+ screens the classic push-layout is used.
   *
   * We auto-close the sidebar on mount for mobile viewports so that
   * first-time mobile visitors aren't met with a blocked screen.
   */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => {
      if (e.matches) setSidebarOpen(false); // mobile → closed
    };
    handler(mql); // run on mount
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setSidebarOpen]);

  return (
    <div className="app-shell mesh-bg">
      {/* ── Sidebar (fixed, always rendered) ── */}
      <Sidebar />

      {/**
       * Main area.
       * lg+  → pushed right by sidebar width via margin-left (animated).
       * <lg  → no margin at all (sidebar is a floating overlay drawer).
       *
       * `min-width: 0` is critical — prevents flex children from expanding
       * beyond the available space and causing horizontal scrollbars.
       */}
      <motion.div
        animate={{
          marginLeft: isDesktop ? (sidebarOpen ? 280 : 72) : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="app-main"
      >
        {/* Sticky top navigation */}
        <TopNav />

        {/* Scrollable page content — full width, no max-width cap */}
        <main id="main-content" role="main" className="page-content">
          <div className="w-full">
            <MainContent />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
