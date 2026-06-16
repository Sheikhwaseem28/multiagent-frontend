import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Download,
  Share2,
  Check,
  BookOpen,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

function extractTOC(markdown) {
  const headings = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m)
      headings.push({
        level: m[1].length,
        title: m[2],
        id: m[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
  }
  return headings;
}

export function ReportViewer({ result, topic }) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const toc = extractTOC(result.report);

  const scoreColor = "#F59E0B";

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [result.report]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([result.report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-${topic.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.report, topic]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Task Report: ${topic}`,
          text: result.report,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
      alert(
        "Sharing is not supported on your device. The report has been copied to your clipboard instead.",
      );
    }
  }, [result.report, topic, handleCopy]);

  return (
    <div className="flex gap-5 xl:gap-8 w-full">
      {/* ── Sticky TOC sidebar (xl+) ── */}
      {toc.length > 0 && (
        <aside className="hidden xl:block w-44 2xl:w-52 shrink-0">
          <div className="sticky top-20 rounded-2xl bg-[#1A1A1A] border border-white/[0.08] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <BookOpen size={10} className="text-[#A1A1AA]" />
              <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                Contents
              </span>
            </div>
            <nav aria-label="Table of contents">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`block py-1 leading-snug transition-colors hover:text-[#F5F5F5] ${
                    activeSection === item.id
                      ? "text-[#6366F1]"
                      : "text-[#71717A]"
                  } ${
                    item.level === 2 ? "pl-2.5" : item.level === 3 ? "pl-4" : ""
                  }`}
                  style={{ fontSize: item.level === 1 ? "0.68rem" : "0.62rem" }}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* ── Main report column ── */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {/* Quality score */}
          <div
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold"
            style={{
              background: `${scoreColor}15`,
              border: `1px solid ${scoreColor}40`,
              color: scoreColor,
            }}
            aria-label={`Quality score: ${result.score} out of 10`}
          >
            <Star size={12} fill={scoreColor} />
            {result.score}/10
          </div>
          <span className="text-xs text-[#A1A1AA] hidden sm:inline">
            Quality Score
          </span>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#242424] border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-white/20 transition-all min-h-[34px]"
              aria-label="Copy report"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="c"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check size={12} className="text-[#6366F1]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="n"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy size={12} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Copy"}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#6366F1] hover:bg-[#6366F1]/25 transition-all min-h-[34px]"
              aria-label="Download report as text file"
            >
              <Download size={12} />
              <span className="hidden sm:inline">Download .txt</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#242424] border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F5] transition-all min-h-[34px]"
              aria-label="Share report"
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile TOC (accordion) */}
        {toc.length > 0 && (
          <details className="xl:hidden mb-4 rounded-2xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden">
            <summary className="px-4 py-3 cursor-pointer text-xs font-semibold text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors select-none flex items-center gap-2">
              <BookOpen size={12} />
              Table of Contents
            </summary>
            <div className="px-4 pb-4 space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-[11px] py-0.5 text-[#71717A] hover:text-[#A1A1AA] transition-colors ${
                    item.level === 2 ? "pl-3" : item.level === 3 ? "pl-5" : ""
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </details>
        )}

        {/* Report markdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl bg-[#1A1A1A] border border-white/[0.08] p-4 sm:p-6 lg:p-8 mb-5 sm:mb-6 overflow-hidden"
        >
          <div className="prose-research">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1
                    id={String(children)
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    id={String(children)
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    id={String(children)
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                  >
                    {children}
                  </h3>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                    <ExternalLink
                      size={10}
                      className="inline ml-1 opacity-50"
                    />
                  </a>
                ),
              }}
            >
              {result.report}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* Critic Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="rounded-2xl bg-[#1A1A1A] border border-[#F59E0B]/20 p-4 sm:p-6 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-7 w-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
              <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
            </div>
            <span className="text-sm font-semibold text-[#F5F5F5]">
              Critic Feedback
            </span>
            <ChevronRight size={13} className="text-[#71717A]" />
            <span className="text-xs text-[#71717A]">AI Review</span>
          </div>
          <div className="prose-research">
            <ReactMarkdown>{result.criticFeedback}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
