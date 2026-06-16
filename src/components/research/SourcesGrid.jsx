import { motion } from "framer-motion";
import { ExternalLink, Shield, Globe } from "lucide-react";
import { getTrustColor } from "../../utils";

function SourceCard({ source, index }) {
  const trustColor = getTrustColor(source.trustScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group rounded-2xl bg-[#1A1A1A] border border-white/[0.08] p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 hover:border-white/15 hover:bg-[#242424] transition-all duration-200"
    >
      {/* Domain + trust badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#242424] flex items-center justify-center border border-white/[0.08] shrink-0">
            <Globe size={11} className="text-[#A1A1AA]" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-[#A1A1AA] truncate">
            {source.domain}
          </span>
        </div>
        <div
          className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
          style={{
            background: `${trustColor}15`,
            border: `1px solid ${trustColor}30`,
            color: trustColor,
          }}
        >
          <Shield size={8} />
          {source.trustScore}
        </div>
      </div>

      {/* Title */}
      <div className="text-xs sm:text-sm font-semibold text-[#F5F5F5] leading-snug line-clamp-2 group-hover:text-white transition-colors">
        {source.title}
      </div>

      {/* Summary */}
      <p className="text-[11px] sm:text-xs text-[#71717A] leading-relaxed line-clamp-3 flex-1">
        {source.summary}
      </p>

      {/* Link */}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors mt-auto"
        aria-label={`Visit ${source.title}`}
      >
        <ExternalLink size={11} />
        Visit Source
      </a>
    </motion.div>
  );
}

export function SourcesGrid({ sources }) {
  if (!sources.length)
    return (
      <div className="text-center py-12 text-[#71717A] text-sm">
        No sources discovered yet.
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs sm:text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Research Sources
        </span>
        <span className="text-xs text-[#71717A] font-mono">
          {sources.length} sources
        </span>
      </div>

      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
        }}
      >
        {sources.map((source, i) => (
          <SourceCard key={source.id} source={source} index={i} />
        ))}
      </div>
    </div>
  );
}
