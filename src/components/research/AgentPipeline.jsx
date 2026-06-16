import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  PenLine,
  Star,
  Check,
  X as XIcon,
  Loader2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { ProgressBar } from "../ui/ProgressBar";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils";

/* ── Static agent metadata maps ─── */
const AGENT_ICONS = {
  search: Search,
  reader: BookOpen,
  writer: PenLine,
  critic: Star,
};
const AGENT_COLORS = {
  search: "#6366F1",
  reader: "#6366F1",
  writer: "#6366F1",
  critic: "#22C55E",
};
const AGENT_GLOW = {
  search: "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
  reader: "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
  writer: "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
  critic: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
};
const PROGRESS_VARIANT = {
  search: "indigo",
  reader: "indigo",
  writer: "indigo",
  critic: "success",
};

/* ── Status icon ──────────────────────── */
function StatusIcon({ status, color }) {
  if (status === "completed")
    return (
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="h-5 w-5 rounded-full flex items-center justify-center bg-[#22C55E]/15 border border-[#22C55E]/30"
      >
        <Check size={11} className="text-[#22C55E]" />
      </motion.div>
    );
  if (status === "failed")
    return (
      <div className="h-5 w-5 rounded-full flex items-center justify-center bg-[#EF4444]/15 border border-[#EF4444]/30">
        <XIcon size={11} className="text-[#EF4444]" />
      </div>
    );
  if (status === "running")
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={16} style={{ color }} />
      </motion.div>
    );
  return <Clock size={15} className="text-[#71717A]" />;
}

/* ── Horizontal connector (desktop / laptop) ── */
function ConnectorH({ active, done }) {
  return (
    <div className="flex items-center justify-center w-6 lg:w-8 shrink-0">
      <div className="relative h-0.5 w-full bg-[#242424] overflow-hidden rounded-full">
        <AnimatePresence>
          {(active || done) && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: done ? "0%" : ["-100%", "100%", "-100%"] }}
              transition={
                done
                  ? { duration: 0.5 }
                  : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              }
              className={cn(
                "absolute inset-0 rounded-full",
                done
                  ? "bg-[#22C55E]"
                  : "bg-gradient-to-r from-transparent via-[#6366F1] to-transparent",
              )}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Vertical connector (mobile) ── */
function ConnectorV({ active, done }) {
  return (
    <div className="flex justify-center py-0.5">
      <div className="relative w-0.5 h-5 bg-[#242424] overflow-hidden rounded-full">
        {(active || done) && (
          <motion.div
            animate={{ y: done ? "0%" : ["-100%", "100%"] }}
            transition={
              done
                ? { duration: 0.4 }
                : { duration: 0.9, repeat: Infinity, ease: "linear" }
            }
            className={cn(
              "absolute inset-0 rounded-full",
              done
                ? "bg-[#22C55E]"
                : "bg-gradient-to-b from-transparent via-[#6366F1] to-transparent",
            )}
          />
        )}
      </div>
    </div>
  );
}

/* ── Individual Agent Card ──────────────── */
function AgentCard({ agent, index, compact = false }) {
  const [logsOpen, setLogsOpen] = useState(false);
  const Icon = AGENT_ICONS[agent.id] || Search;
  const agentColor = AGENT_COLORS[agent.id] || AGENT_COLORS.search;
  const glow = AGENT_GLOW[agent.id] || AGENT_GLOW.search;
  // Custom status color mapping
  const statusColor =
    agent.status === "completed"
      ? "#22C55E"
      : agent.status === "running"
        ? "#6366F1"
        : agent.status === "failed"
          ? "#EF4444"
          : "#71717A";

  const borderCls =
    agent.status === "running"
      ? `border-[${statusColor}]/50 shadow-lg ${glow}`
      : agent.status === "completed"
        ? "border-[#22C55E]/30"
        : agent.status === "failed"
          ? "border-[#EF4444]/30"
          : "border-white/[0.08]";

  const badgeVariant =
    agent.status === "completed"
      ? "success"
      : agent.status === "running"
        ? "info"
        : agent.status === "failed"
          ? "error"
          : "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        "relative rounded-2xl border transition-all duration-300 bg-[#1A1A1A]",
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5",
        borderCls,
        "w-full",
      )}
    >
      {/* Pulse ring when running */}
      {agent.status === "running" && (
        <motion.div
          animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
          style={{ borderColor: statusColor }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className={cn(
              "rounded-xl flex items-center justify-center shrink-0 shadow-md",
              compact ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10",
              agent.status === "running" ? `shadow-lg ${glow}` : "",
            )}
            style={{ backgroundColor: agentColor }}
          >
            <Icon size={compact ? 14 : 16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[#F5F5F5] text-xs sm:text-sm leading-tight truncate">
              {agent.name}
            </div>
            <div className="text-[10px] sm:text-xs text-[#A1A1AA] mt-0.5 leading-snug line-clamp-2">
              {agent.description}
            </div>
          </div>
        </div>
        <StatusIcon status={agent.status} color={statusColor} />
      </div>

      {/* Status badge */}
      <div className="mb-2.5 sm:mb-3">
        <Badge
          variant={badgeVariant}
          pulse={agent.status === "running"}
          size="sm"
        >
          {agent.status === "idle"
            ? "Waiting"
            : agent.status === "running"
              ? "Running"
              : agent.status === "completed"
                ? "Done"
                : "Failed"}
        </Badge>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={agent.progress}
        variant={PROGRESS_VARIANT[agent.id] ?? "indigo"}
        animated={agent.status === "running"}
        size="sm"
      />

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#71717A] font-mono">
          {agent.progress}%
        </span>
        {agent.status === "completed" && (
          <span className="text-[10px] text-[#22C55E] font-mono">
            ✓ Complete
          </span>
        )}
      </div>

      {/* Activity log */}
      {agent.log.length > 0 && (
        <div className="mt-2.5 sm:mt-3">
          <button
            onClick={() => setLogsOpen(!logsOpen)}
            className="flex items-center gap-1 text-[10px] text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors font-mono"
            aria-expanded={logsOpen}
          >
            <ChevronDown
              size={10}
              className={cn("transition-transform", logsOpen && "rotate-180")}
            />
            Activity log ({agent.log.length})
          </button>
          <AnimatePresence>
            {logsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-0.5 max-h-24 overflow-y-auto scrollbar-hide">
                  {agent.log.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      className="text-[10px] font-mono text-[#71717A] leading-relaxed flex gap-1.5"
                    >
                      <span className="text-[#242424] shrink-0">›</span>
                      <span className="break-all">{line}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export function AgentPipeline({ agents }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <div className="text-xs sm:text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Agent Pipeline
        </div>
        <div className="flex-1 h-px bg-white/[0.08]" />
        <span className="text-[10px] font-mono text-[#71717A]">
          {agents.filter((a) => a.status === "completed").length}/
          {agents.length} done
        </span>
      </div>

      <div className="flex flex-col gap-0 sm:hidden">
        {agents.map((agent, i) => (
          <div key={agent.id}>
            <AgentCard agent={agent} index={i} />
            {i < agents.length - 1 && (
              <ConnectorV
                active={agents[i + 1].status === "running"}
                done={agents[i].status === "completed"}
              />
            )}
          </div>
        ))}
      </div>

      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      <div className="hidden lg:flex items-stretch gap-0">
        {agents.map((agent, i) => (
          <div key={agent.id} className="flex items-stretch flex-1 min-w-0">
            <AgentCard agent={agent} index={i} />
            {i < agents.length - 1 && (
              <ConnectorH
                active={agents[i + 1].status === "running"}
                done={
                  agents[i].status === "completed" &&
                  agents[i + 1].status !== "idle"
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
