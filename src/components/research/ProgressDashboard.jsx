import { motion } from "framer-motion";
import { Clock, TrendingUp, Layers, CheckCircle } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";
import { formatDuration } from "../../utils";

export function ProgressDashboard({ session }) {
  const completedAgents = session.agents.filter(
    (a) => a.status === "completed",
  ).length;
  const overallProgress = Math.round(
    (completedAgents / session.agents.length) * 100,
  );
  const runningAgent = session.agents.find((a) => a.status === "running");
  const estimatedRemaining = Math.max(
    0,
    session.estimatedTotal - session.elapsed,
  );

  const cards = [
    {
      label: "Overall Progress",
      icon: TrendingUp,
      color: "#6366F1",
      bg: "#4F46E5",
      content: (
        <div>
          <div className="flex items-end gap-1 mb-2">
            <motion.span
              key={overallProgress}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-none"
            >
              {overallProgress}
            </motion.span>
            <span className="text-base sm:text-lg font-bold text-[#71717A] mb-0.5">
              %
            </span>
          </div>
          <ProgressBar value={overallProgress} variant="indigo" size="sm" />
          <div className="text-[10px] sm:text-xs text-[#A1A1AA] mt-1.5 font-mono">
            {completedAgents} / {session.agents.length} agents
          </div>
        </div>
      ),
    },
    {
      label: "Elapsed",
      icon: Clock,
      color: "#3B82F6",
      bg: "#2563EB",
      content: (
        <div>
          <div className="text-xl sm:text-2xl font-bold text-[#F5F5F5] font-mono">
            {formatDuration(session.elapsed)}
          </div>
          <div className="text-[10px] sm:text-xs text-[#A1A1AA] mt-1">
            Est. remaining:{" "}
            <span className="text-[#A1A1AA] font-mono">
              {formatDuration(estimatedRemaining)}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: "Current Step",
      icon: Layers,
      color: "#06B6D4",
      bg: "#0891B2",
      content: runningAgent ? (
        <div>
          <div className="text-xs sm:text-sm font-semibold text-[#F5F5F5] leading-tight">
            {runningAgent.name}
          </div>
          <div className="text-[10px] sm:text-xs text-[#A1A1AA] mt-0.5 leading-tight line-clamp-2">
            {runningAgent.description}
          </div>
          <ProgressBar
            value={runningAgent.progress}
            variant="indigo"
            size="sm"
            className="mt-2"
          />
        </div>
      ) : session.status === "completed" ? (
        <div className="text-sm font-semibold text-[#22C55E]">All Done ✓</div>
      ) : (
        <div className="text-sm text-[#A1A1AA]">Starting...</div>
      ),
    },
    {
      label: "Agents",
      icon: CheckCircle,
      color: "#22C55E",
      bg: "#16A34A",
      content: (
        <div className="space-y-1.5">
          {session.agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2">
              <div
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  agent.status === "completed"
                    ? "bg-[#22C55E]"
                    : agent.status === "running"
                      ? "bg-[#6366F1]"
                      : agent.status === "failed"
                        ? "bg-[#EF4444]"
                        : "bg-[#242424]"
                }`}
              />
              <span className="text-[10px] sm:text-xs text-[#A1A1AA] flex-1 truncate">
                {agent.name}
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {agent.progress}%
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div
      className="grid gap-3 sm:gap-4 mb-5 sm:mb-6"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))",
      }}
    >
      {cards.map(({ label, icon: Icon, color, bg, content }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl bg-[#1A1A1A] border border-white/[0.08] p-3 sm:p-4 hover:border-white/[0.15] transition-all"
        >
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <div
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${bg}20`, border: `1px solid ${bg}30` }}
            >
              <Icon size={12} style={{ color }} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#A1A1AA] truncate">
              {label}
            </span>
          </div>
          {content}
        </motion.div>
      ))}
    </div>
  );
}
