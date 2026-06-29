import { motion } from "framer-motion";
import {
  Clock,
  Star,
  Zap,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { formatTimestamp } from "../../utils";

const PAGE_SIZE = 10;

export function HistoryPage() {
  const { history, setActiveView, loadFromHistory, deleteResearch } = useAppStore();
  const [page, setPage] = useState(0);

  if (!history.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4"
      >
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#1A1A1A] border border-white/[0.08] flex items-center justify-center mb-5 sm:mb-6">
          <Clock size={28} className="text-[#71717A] sm:hidden" />
          <Clock size={32} className="text-[#71717A] hidden sm:block" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-2 sm:mb-3">
          No past Researches
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-xs leading-relaxed">
          Your completed Researches and reports will appear here for easy reference.
        </p>
        <button
          onClick={() => setActiveView("home")}
          className="mt-5 sm:mt-6 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#FFFFFF] text-[#0F0F0F] hover:bg-[#D4D4D4] transition-colors min-h-[44px]"
        >
          Start New Research
        </button>
      </motion.div>
    );
  }

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const pageItems = history.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1
            className="font-bold text-[#F5F5F5] mb-1"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
          >
            Past Researches
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            {history.length} task{history.length !== 1 ? "s" : ""} &mdash; click
            any to open results
          </p>
        </div>

        {/* Page indicator (top) */}
        {totalPages > 1 && (
          <div className="text-xs text-[#71717A] font-medium shrink-0">
            Page {page + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* ── List ── */}
      <div className="space-y-2 sm:space-y-3">
        {pageItems.map((item, i) => {
          const scoreColor = "#FFFFFF"; // Premium Gold for ratings

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-[#1A1A1A] border border-white/[0.08] hover:border-[#FFFFFF]/40 hover:bg-[#242424] transition-all duration-200 cursor-pointer group"
              onClick={() => loadFromHistory(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && loadFromHistory(item.id)}
              aria-label={`Open task: ${item.topic}`}
            >
              {/* Icon */}
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#242424] flex items-center justify-center shrink-0 border border-white/[0.08] group-hover:bg-[#FFFFFF]/20 group-hover:border-[#FFFFFF]/30 transition-all">
                <Search
                  size={14}
                  className="text-[#71717A] group-hover:text-[#FFFFFF] transition-colors"
                />
              </div>

              {/* Index number */}
              <span className="hidden sm:flex text-[11px] font-mono text-[#71717A] w-5 shrink-0 justify-center">
                {page * PAGE_SIZE + i + 1}
              </span>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#F5F5F5] truncate text-xs sm:text-sm group-hover:text-white transition-colors">
                  {item.topic}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
                  <span className="text-[10px] sm:text-xs text-[#71717A] flex items-center gap-1">
                    <Clock size={10} />
                    {formatTimestamp(item.completedAt)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#71717A] capitalize flex items-center gap-1">
                    <Zap size={10} />
                    {item.depth}
                  </span>
                </div>
              </div>

              {/* Score badge */}
              <div
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0"
                style={{
                  background: `${scoreColor}15`,
                  border: `1px solid ${scoreColor}30`,
                  color: scoreColor,
                }}
              >
                <Star size={11} fill={scoreColor} />
                {item.score}/10
              </div>

              {/* Open arrow */}
              <ExternalLink
                size={13}
                className="text-[#71717A] group-hover:text-[#FFFFFF] transition-colors shrink-0"
              />
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResearch(item.id);
                }}
                className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#FF453A]/10 hover:text-[#FF453A] transition-colors shrink-0"
                title="Delete research"
                aria-label={`Delete task: ${item.topic}`}
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Pagination controls ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {/* Prev */}
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[36px]"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, p) => {
              const showPage =
                p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1;

              const showEllipsisLeft = p === 1 && page > 3;
              const showEllipsisRight =
                p === totalPages - 2 && page < totalPages - 4;

              if (!showPage && (showEllipsisLeft || showEllipsisRight)) {
                return (
                  <span
                    key={p}
                    className="text-[#71717A] text-xs px-1 select-none"
                  >
                    …
                  </span>
                );
              }
              if (!showPage) return null;

              return (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page
                    ? "bg-[#FFFFFF] text-[#0F0F0F] shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.05]"
                    }`}
                  aria-label={`Page ${p + 1}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p + 1}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[36px]"
            aria-label="Next page"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* ── Results summary ── */}
      <p className="text-center text-[10px] text-[#71717A] mt-3">
        Showing {page * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE + PAGE_SIZE, history.length)} of{" "}
        {history.length} Researches
      </p>
    </motion.div>
  );
}
