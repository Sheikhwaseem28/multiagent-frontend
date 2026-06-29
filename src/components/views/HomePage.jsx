import { useState, useCallback, useRef, useEffect } from "react";
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
  { icon: Search, label: "Search Agent", color: "#FFFFFF" },
  { icon: BookOpen, label: "Reading Agent", color: "#FFFFFF" },
  { icon: PenLine, label: "Writing Agent", color: "#FFFFFF" },
  { icon: Star, label: "Review Agent", color: "#FFFFFF" },
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
  const { startResearch } = useAppStore();
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [focused, setFocused] = useState(false);
  const [depthOpen, setDepthOpen] = useState(false);
  const [usage, setUsage] = useState(null);
  const depthDropdownRef = useRef(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    fetch(`${API_BASE}/usage`)
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch((err) => console.error("Error fetching usage status:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (depthDropdownRef.current && !depthDropdownRef.current.contains(event.target)) {
        setDepthOpen(false);
      }
    }
    if (depthOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [depthOpen]);

  const handleStart = useCallback(async () => {
    if (!topic.trim() || (usage && usage.reached)) return;
    await startResearch(topic.trim(), depth);
  }, [topic, depth, startResearch, usage]);

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
      className="w-full flex flex-col min-h-[calc(100dvh-7rem)] sm:min-h-[calc(100vh-10rem)]"
    >
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <motion.section
        variants={itemVariants}
        className="relative text-center overflow-hidden flex-1 flex flex-col justify-center py-4 sm:py-8"
      >
        {/* Glow blob */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,90vw)] h-[min(400px,60vw)] rounded-full bg-[#FFFFFF]/20 blur-3xl pointer-events-none"
        />

        {/* Enhanced Headline */}
        <h1
          className="relative font-bold text-[#F5F5F5] leading-[1.05] tracking-tight mb-2 sm:mb-3 text-balance px-4"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
        >
          DeepScout
        </h1>

        {/* Sub */}
        <p
          className="relative text-[#A1A1AA] font-medium max-w-full mx-auto leading-relaxed mb-8 sm:mb-12 px-6"
          style={{ fontSize: "clamp(1.1rem, 2vw, 1.75rem)" }}
        >
          What would you like to research today?
        </p>

        {/* Agent flow pills — scroll horizontally on mobile */}
        <div className="relative flex items-center justify-start sm:justify-center gap-2 mb-4 px-4 overflow-x-auto scrollbar-hide pb-1">
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
      <motion.section variants={itemVariants} className="w-full mt-auto pb-4 px-4 sm:px-6">
        {/* Border wrapper */}
        <div
          className={cn(
            "rounded-2xl p-[1px] transition-all duration-300",
            focused
              ? "bg-[#FFFFFF]/50 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              : "bg-white/[0.08] hover:bg-white/[0.12]"
          )}
        >
          <div className="rounded-[15px] bg-[#1A1A1A]">
            {/* Textarea row */}
            <div className="relative flex items-start gap-3 p-3 sm:p-4">
              <div className="mt-1 h-8 w-8 rounded-lg bg-[#FFFFFF] flex items-center justify-center shrink-0 shadow-md shadow-neutral-200/20">
                <Search size={14} className="text-[#0F0F0F]" />
              </div>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={usage && usage.reached ? "API and search limit of 50 reached. Search disabled." : "Message DeepScout..."}
                disabled={usage && usage.reached}
                rows={2}
                className={cn(
                  "flex-1 bg-transparent text-[#F5F5F5] placeholder:text-[#71717A]",
                  "leading-relaxed resize-none outline-none font-medium py-1",
                  "text-sm sm:text-base",
                  usage && usage.reached && "cursor-not-allowed opacity-50"
                )}
                aria-label="Research topic input"
              />
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/[0.06] pt-2.5 sm:pt-3">
              {/* Depth selector */}
              <div className="relative" ref={depthDropdownRef}>
                <motion.button
                  whileHover={usage && usage.reached ? {} : { scale: 1.02 }}
                  whileTap={usage && usage.reached ? {} : { scale: 0.98 }}
                  disabled={usage && usage.reached}
                  onClick={() => setDepthOpen(!depthOpen)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium",
                    "bg-[#242424] border border-white/[0.08] text-[#F5F5F5]",
                    "hover:border-[#FFFFFF]/50 transition-all min-h-[36px]",
                    usage && usage.reached && "cursor-not-allowed opacity-50"
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
                      depthOpen && "rotate-180"
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
                              ? "bg-[#FFFFFF]/20 text-[#FFFFFF]"
                              : "text-[#A1A1AA] hover:bg-white/[0.05] hover:text-[#F5F5F5]"
                          )}
                        >
                          <span
                            className={
                              depth === opt.value
                                ? "text-[#FFFFFF]"
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
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FFFFFF]" />
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

              <div className="flex-1 hidden sm:block" />

              {/* Start Research CTA */}
              <motion.button
                whileHover={!topic.trim() || (usage && usage.reached) ? {} : { scale: 1.03 }}
                whileTap={!topic.trim() || (usage && usage.reached) ? {} : { scale: 0.97 }}
                onClick={handleStart}
                disabled={!topic.trim() || (usage && usage.reached)}
                className={cn(
                  "flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm",
                  "transition-all duration-200 min-h-[44px] sm:min-h-[36px] w-full sm:w-auto mt-2 sm:mt-0",
                  topic.trim() && !(usage && usage.reached)
                    ? "bg-[#FFFFFF] text-[#0F0F0F] shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-[#D4D4D4] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    : "bg-[#242424] text-[#71717A] cursor-not-allowed border border-white/[0.08]"
                )}
                aria-label="Start Task"
                aria-disabled={!topic.trim() || (usage && usage.reached)}
              >
                <Sparkles size={13} />
                <span className="whitespace-nowrap">Start Task</span>
                {topic.trim() && <ArrowRight size={13} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Example chips */}
        <div className="mt-3 flex flex-wrap gap-2 justify-center px-1">
          <span className="text-xs text-[#71717A] self-center font-medium mr-0.5">
            Try →
          </span>
          {EXAMPLES.slice(0, 3).map((ex) => (
            <motion.button
              key={ex}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTopic(ex)}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium",
                "bg-[#1A1A1A] border border-white/[0.08] text-[#A1A1AA]",
                "hover:border-[#FFFFFF]/40 hover:text-[#F5F5F5] hover:bg-[#242424]",
                "transition-all duration-200"
              )}
            >
              {ex}
            </motion.button>
          ))}
        </div>

        {/* Usage / Limit Notification */}
        {usage && (
          <div className="mt-4 flex justify-center px-4">
            <div className={cn(
              "text-[11px] sm:text-xs text-center max-w-md flex flex-col gap-1 border rounded-xl px-4 py-3 w-full",
              usage.reached
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-white/[0.03] border-white/[0.08] text-[#A1A1AA]"
            )}>
              <div className="font-semibold flex items-center justify-center gap-1.5">
                <span>{usage.reached ? "🛑 Search & API Call Limit Reached" : "📊 API Usage Status"}</span>
                <span className="text-xs">({usage.searches}/50 searches, {usage.api_calls}/50 API calls)</span>
              </div>
              <p className="text-[10px] opacity-80 leading-relaxed">
                {usage.reached
                  ? "To prevent API abuse, further searches are disabled. Please contact administrator to reset."
                  : "Each research task utilizes multiple agents & API requests. Limit is set to 50 calls to avoid spamming."}
              </p>
            </div>
          </div>
        )}

        {/* Render deployment notice */}
        <div className="mt-6 flex justify-center px-4">
          <p className="text-[11px] sm:text-xs text-[#71717A] text-center max-w-md flex items-center justify-center gap-2 bg-[#1A1A1A]/80 border border-white/[0.08] rounded-xl px-4 py-2.5">
            <span className="text-[#06B6D4] text-sm shrink-0 font-bold">ℹ</span> 
            <span className="leading-relaxed">Note: The backend is deployed on Render. It may take 1-2 minutes to start up if it's been inactive.</span>
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}
