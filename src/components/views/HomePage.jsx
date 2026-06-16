import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Search,
  BookOpen,
  PenLine,
  Star,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils";

const EXAMPLES = [
  "Large Language Models in 2025",
  "CRISPR gene editing breakthroughs",
  "Quantum computing progress",
  "Fusion energy latest developments",
  "AI agents and autonomous systems",
  "Climate change solutions 2025",
];

const DEPTH_OPTIONS = [
  {
    value: "quick",
    label: "Quick",
    desc: "Fast overview",
    time: "~30s",
    icon: <Zap size={14} />,
  },
  {
    value: "standard",
    label: "Standard",
    desc: "Balanced depth",
    time: "~1min",
    icon: <Search size={14} />,
  },
  {
    value: "deep",
    label: "Deep",
    desc: "Comprehensive",
    time: "~2min",
    icon: <Star size={14} />,
  },
];

const AGENT_STEPS = [
  { icon: Search, label: "Search Agent", color: "#6366F1" },
  { icon: BookOpen, label: "Reading Agent", color: "#6366F1" },
  { icon: PenLine, label: "Writing Agent", color: "#6366F1" },
  { icon: Star, label: "Review Agent", color: "#F59E0B" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function HomePage() {
  const { startResearch, analytics } = useAppStore();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [focused, setFocused] = useState(false);
  const [depthOpen, setDepthOpen] = useState(false);

  const handleStart = useCallback(async () => {
    if (!topic.trim()) return;
    await startResearch(topic.trim(), depth);
  }, [topic, depth, startResearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  const selectedDepth = DEPTH_OPTIONS.find((d) => d.value === depth);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full w-full"
    >
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <motion.section
        variants={itemVariants}
        className="relative text-center overflow-hidden pt-10 sm:pt-14 lg:pt-2 pb-8 sm:pb-12"
      >
        {/* Dot-grid background */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

        {/* Glow blob */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,90vw)] h-[min(400px,60vw)] rounded-full bg-[#6366F1]/20 blur-3xl pointer-events-none"
        />

        {/* Headline — fluid clamp typography */}
        <h1
          className="relative font-bold text-[#F5F5F5] leading-[1.05] tracking-tight mb-4 sm:mb-5 text-balance px-4"
          style={{ fontSize: "var(--text-hero)" }}
        >
          AgentCore
          <br />
          <span className="text-[#6366F1]">AI Workflows</span>
        </h1>

        {/* Sub */}
        <p
          className="relative text-[#A1A1AA] max-w-full mx-auto leading-relaxed mb-8 sm:mb-12 px-6"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.125rem)" }}
        >
          Let our specialized AI agents work together to handle your complex
          tasks and research.
        </p>

        {/* Agent flow pills — scroll horizontally on mobile */}
        <div className="relative flex items-center justify-start sm:justify-center gap-2 mb-8 sm:mb-12 px-4 overflow-x-auto scrollbar-hide pb-1">
          {AGENT_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl glass border border-white/[0.08]"
              >
                <step.icon size={13} style={{ color: step.color }} />
                <span className="text-[#F5F5F5] font-medium text-xs whitespace-nowrap">
                  {step.label}
                </span>
              </motion.div>
              {i < AGENT_STEPS.length - 1 && (
                <ArrowRight size={13} className="text-[#71717A] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Research Input Card ────────────────────────────────────────── */}
      <motion.section variants={itemVariants} className="w-full pb-8 sm:pb-12">
        {/* Border wrapper */}
        <div
          className={cn(
            "rounded-2xl p-[1px] transition-all duration-300",
            focused
              ? "bg-[#6366F1]/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
              : "bg-white/[0.08] hover:bg-white/[0.12]",
          )}
        >
          <div className="rounded-[15px] bg-[#1A1A1A] overflow-hidden">
            {/* Textarea row */}
            <div className="relative flex items-start gap-3 p-3 sm:p-4">
              <div className="mt-1 h-8 w-8 rounded-lg bg-[#6366F1] flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Search size={14} className="text-white" />
              </div>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="What task should the AI agents work on today?"
                rows={2}
                className={cn(
                  "flex-1 bg-transparent text-[#F5F5F5] placeholder:text-[#71717A]",
                  "leading-relaxed resize-none outline-none font-medium py-1",
                  "text-sm sm:text-base",
                )}
                aria-label="Research topic input"
              />
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/[0.06] pt-2.5 sm:pt-3">
              {/* Depth selector */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDepthOpen(!depthOpen)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium",
                    "bg-[#242424] border border-white/[0.08] text-[#F5F5F5]",
                    "hover:border-[#6366F1]/50 transition-all min-h-[36px]",
                  )}
                  aria-haspopup="listbox"
                  aria-expanded={depthOpen}
                  aria-label="Research depth"
                >
                  {selectedDepth.icon}
                  <span>{selectedDepth.label}</span>
                  <span className="hidden sm:inline text-[#71717A]">·</span>
                  <span className="hidden sm:inline text-[#A1A1AA] text-xs">
                    {selectedDepth.time}
                  </span>
                  <ChevronDown
                    size={13}
                    className={cn(
                      "text-[#71717A] transition-transform",
                      depthOpen && "rotate-180",
                    )}
                  />
                </motion.button>

                <AnimatePresence>
                  {depthOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.14 }}
                      className="absolute bottom-full mb-2 left-0 w-52 sm:w-56 rounded-2xl glass border border-white/[0.08] p-2 shadow-2xl z-50"
                      role="listbox"
                      aria-label="Select research depth"
                    >
                      {DEPTH_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          role="option"
                          aria-selected={depth === opt.value}
                          onClick={() => {
                            setDepth(opt.value);
                            setDepthOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px]",
                            depth === opt.value
                              ? "bg-[#6366F1]/20 text-[#6366F1]"
                              : "text-[#A1A1AA] hover:bg-white/[0.05] hover:text-[#F5F5F5]",
                          )}
                        >
                          <span
                            className={
                              depth === opt.value
                                ? "text-[#6366F1]"
                                : "text-[#71717A]"
                            }
                          >
                            {opt.icon}
                          </span>
                          <div className="text-left">
                            <div className="font-semibold text-xs sm:text-sm">
                              {opt.label}
                            </div>
                            <div className="text-[11px] text-[#71717A]">
                              {opt.desc} · {opt.time}
                            </div>
                          </div>
                          {depth === opt.value && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Estimated time */}
              <div className="flex items-center gap-1 text-xs text-[#71717A]">
                <Clock size={11} />
                <span>Est. {selectedDepth.time}</span>
              </div>

              <div className="flex-1" />

              {/* Start Research CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                disabled={!topic.trim()}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm",
                  "transition-all duration-200 min-h-[36px]",
                  topic.trim()
                    ? "bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-[#4F46E5] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    : "bg-[#242424] text-[#71717A] cursor-not-allowed border border-white/[0.08]",
                )}
                aria-label="Start Task"
                aria-disabled={!topic.trim()}
              >
                <Sparkles size={13} />
                <span className="whitespace-nowrap">Start Task</span>
                {topic.trim() && <ArrowRight size={13} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Example chips */}
        <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 justify-center px-1">
          <span className="text-xs text-[#71717A] self-center font-medium mr-0.5">
            Try →
          </span>
          {EXAMPLES.map((ex) => (
            <motion.button
              key={ex}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTopic(ex)}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium",
                "bg-[#1A1A1A] border border-white/[0.08] text-[#A1A1AA]",
                "hover:border-[#6366F1]/40 hover:text-[#F5F5F5] hover:bg-[#242424]",
                "transition-all duration-200",
              )}
            >
              {ex}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Stats Row (shown after first research) ─────────────────── */}
      {analytics.totalResearches > 0 && (
        <motion.section
          variants={itemVariants}
          className="w-full pb-12 sm:pb-16"
        >
          {/* 1-col mobile → 3-col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Tasks Completed", value: analytics.totalResearches },
              { label: "Sources Analyzed", value: analytics.sourcesAnalyzed },
              {
                label: "Avg Quality Score",
                value: `${analytics.avgQualityScore}/10`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-[#1A1A1A] border border-white/[0.08] px-4 py-4 text-center hover:border-white/[0.15] hover:bg-[#242424] transition-all"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-[#A1A1AA] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
