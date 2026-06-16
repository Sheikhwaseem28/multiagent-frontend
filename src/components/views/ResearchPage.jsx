import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, ArrowLeft, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { AgentPipeline } from "../research/AgentPipeline";
import { ProgressDashboard } from "../research/ProgressDashboard";
import { ReportViewer } from "../research/ReportViewer";
import { SourcesGrid } from "../research/SourcesGrid";
import { SkeletonReport } from "../ui/Skeleton";
import { cn } from "../../utils";

const TABS = [
  { id: "pipeline", label: "Pipeline" },
  { id: "report", label: "Report" },
  { id: "sources", label: "Sources" },
  { id: "raw", label: "Raw Data" },
];

function EmptyResearch() {
  const { setActiveView } = useAppStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4"
    >
      <div className="relative mb-6 sm:mb-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-20 w-20 sm:h-28 sm:w-28 rounded-3xl bg-[#6366F1]/15 border border-[#6366F1]/20 flex items-center justify-center mx-auto"
        >
          <Brain size={36} className="text-[#6366F1] sm:hidden" />
          <Brain size={48} className="text-[#6366F1] hidden sm:block" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/30 flex items-center justify-center"
        >
          <Sparkles size={12} className="text-[#06B6D4]" />
        </motion.div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-2 sm:mb-3">
        No active tasks
      </h2>
      <p className="text-sm text-[#A1A1AA] max-w-xs sm:max-w-sm leading-relaxed mb-6 sm:mb-8">
        Start a new task and let the AI agents do the heavy lifting for you.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveView("home")}
        className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold text-sm bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] min-h-[44px]"
      >
        <ArrowLeft size={15} />
        Start New Task
      </motion.button>
    </motion.div>
  );
}

export function ResearchPage() {
  const { session, setActiveView, clearSession } = useAppStore();

  const [activeTab, setActiveTab] = useState(
    session?.status === "completed" ? "report" : "pipeline",
  );

  useEffect(() => {
    if (session?.status === "completed") {
      setActiveTab("report");
    }
  }, [session?.status]);

  if (!session) return <EmptyResearch />;

  const isRunning = session.status === "running";
  const isCompleted = session.status === "completed";
  const isFailed = session.status === "failed";

  const availableTabs = TABS.filter((t) =>
    t.id === "pipeline" ? true : isCompleted,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* ── Page header ── */}
      <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveView("home")}
          className="mt-1 p-1.5 rounded-lg text-[#71717A] hover:text-[#F5F5F5] hover:bg-white/5 transition-all shrink-0 touch-target"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] sm:text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">
            Task Name
          </div>
          <h1
            className="font-bold text-[#F5F5F5] leading-tight"
            style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)" }}
          >
            {session.topic}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span
              className={cn(
                "text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full",
                isRunning
                  ? "bg-[#06B6D4]/15 text-[#06B6D4]"
                  : isCompleted
                    ? "bg-[#6366F1]/15 text-[#6366F1]"
                    : isFailed
                      ? "bg-[#EF4444]/15 text-[#EF4444]"
                      : "bg-[#1A1A1A] text-[#A1A1AA] border border-white/[0.08]",
              )}
            >
              {isRunning
                ? "● Running"
                : isCompleted
                  ? "✓ Completed"
                  : isFailed
                    ? "✗ Failed"
                    : "Idle"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#71717A] font-mono capitalize">
              {session.depth} depth analysis
            </span>
          </div>
        </div>
        {!isRunning && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              clearSession();
              setActiveView("home");
            }}
            className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold text-[#A1A1AA] border border-white/[0.08] hover:border-white/[0.15] hover:text-[#F5F5F5] transition-all min-h-[36px]"
          >
            New
          </motion.button>
        )}
      </div>

      {/* ── Error banner ── */}
      {isFailed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/25 mb-4 sm:mb-6"
        >
          <AlertTriangle size={15} className="text-[#EF4444] shrink-0" />
          <div>
            <div className="text-sm font-semibold text-[#FCA5A5]">
              Task Failed
            </div>
            <div className="text-xs text-[#EF4444]/70">
              An error occurred. Please try again.
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Progress dashboard (running only) ── */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ProgressDashboard session={session} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completion banner ── */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-3 p-3 sm:p-4 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/25 mb-4 sm:mb-6"
          >
            <Sparkles size={15} className="text-[#6366F1] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#6366F1]">
                Task Complete!
              </div>
              <div className="text-[11px] sm:text-xs text-[#6366F1]/70">
                Report generated · Quality score {session.result?.score}/10 ·
                All 4 agents done
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("report")}
              className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#6366F1] border border-[#6366F1]/30 hover:bg-[#6366F1]/10 transition-all min-h-[36px]"
            >
              View Report →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <div className="overflow-x-auto scrollbar-hide mb-4 sm:mb-6 -mx-1 px-1">
        <div className="flex items-center gap-1 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-1 w-fit min-w-full sm:min-w-0">
          {availableTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap min-h-[36px]",
                activeTab === tab.id
                  ? "bg-[#242424] text-[#F5F5F5] shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#F5F5F5]",
              )}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Tab panels ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {activeTab === "pipeline" && (
            <AgentPipeline agents={session.agents} />
          )}

          {activeTab === "report" && isCompleted && session.result && (
            <ReportViewer result={session.result} topic={session.topic} />
          )}

          {activeTab === "report" && isRunning && (
            <div className="rounded-2xl bg-[#1A1A1A] border border-white/[0.08] p-5 sm:p-8">
              <div className="text-sm text-[#A1A1AA] mb-5 font-medium">
                Generating your final output…
              </div>
              <SkeletonReport />
            </div>
          )}

          {activeTab === "sources" && isCompleted && session.result && (
            <SourcesGrid sources={session.result.sources} />
          )}

          {activeTab === "raw" && isCompleted && session.result && (
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "Search Agent Output",
                  content: session.result.searchRaw,
                },
                {
                  title: "Reading Agent Output",
                  content: session.result.readerRaw,
                },
              ].map(({ title, content }) => (
                <details
                  key={title}
                  className="rounded-2xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden"
                >
                  <summary className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer text-xs sm:text-sm font-semibold text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors select-none">
                    {title}
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <pre className="text-[10px] sm:text-xs text-[#71717A] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-80 sm:max-h-96 overflow-y-auto scrollbar-hide">
                      {content}
                    </pre>
                  </div>
                </details>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
