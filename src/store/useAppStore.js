import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createInitialAgents,
  generateId,
  parseSources,
  generateMockResult,
} from "../utils";
import { runResearchPipelineStream } from "../services/api";

export const useAppStore = create()(
  persist(
    (set, get) => ({
      // Initial UI state
      sidebarOpen: true,
      theme: "dark",
      activeView: "home",

      // Initial data — seeded with realistic mock history so History & Analytics
      // pages are populated immediately without requiring a completed research run.
      session: null,
      history: [
        {
          id: "seed-01",
          topic: "Large Language Models in 2025",
          completedAt: Date.now() - 1 * 24 * 3600 * 1000,
          score: 9,
          depth: "deep",
        },
        {
          id: "seed-02",
          topic: "CRISPR Gene Editing Breakthroughs",
          completedAt: Date.now() - 2 * 24 * 3600 * 1000,
          score: 8,
          depth: "standard",
        },
        {
          id: "seed-03",
          topic: "Quantum Computing Progress",
          completedAt: Date.now() - 3 * 24 * 3600 * 1000,
          score: 9,
          depth: "deep",
        },
        {
          id: "seed-04",
          topic: "Fusion Energy Latest Developments",
          completedAt: Date.now() - 4 * 24 * 3600 * 1000,
          score: 7,
          depth: "standard",
        },
        {
          id: "seed-05",
          topic: "AI Agents and Autonomous Systems",
          completedAt: Date.now() - 5 * 24 * 3600 * 1000,
          score: 9,
          depth: "deep",
        },
        {
          id: "seed-06",
          topic: "Climate Change Solutions 2025",
          completedAt: Date.now() - 6 * 24 * 3600 * 1000,
          score: 8,
          depth: "standard",
        },
        {
          id: "seed-07",
          topic: "Neuromorphic Computing Architectures",
          completedAt: Date.now() - 7 * 24 * 3600 * 1000,
          score: 7,
          depth: "quick",
        },
        {
          id: "seed-08",
          topic: "mRNA Vaccine Technology Advances",
          completedAt: Date.now() - 8 * 24 * 3600 * 1000,
          score: 8,
          depth: "standard",
        },
        {
          id: "seed-09",
          topic: "Multimodal AI Systems",
          completedAt: Date.now() - 9 * 24 * 3600 * 1000,
          score: 9,
          depth: "deep",
        },
        {
          id: "seed-10",
          topic: "Renewable Energy Storage Solutions",
          completedAt: Date.now() - 10 * 24 * 3600 * 1000,
          score: 8,
          depth: "standard",
        },
        {
          id: "seed-11",
          topic: "Brain-Computer Interface Research",
          completedAt: Date.now() - 11 * 24 * 3600 * 1000,
          score: 7,
          depth: "quick",
        },
        {
          id: "seed-12",
          topic: "Protein Folding with AlphaFold 3",
          completedAt: Date.now() - 12 * 24 * 3600 * 1000,
          score: 9,
          depth: "deep",
        },
      ],
      analytics: {
        totalResearches: 12,
        avgResearchTime: 74, // seconds
        sourcesAnalyzed: 60,
        avgQualityScore: 8,
      },

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view }),

      clearSession: () => set({ session: null }),

      deleteResearch: (id) => {
        const { history } = get();
        set({ history: history.filter(h => h.id !== id) });
      },

      cancelResearch: () => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            status: "failed",
          },
        });
      },

      /**
       * Load a history item into a completed ResearchSession and navigate to
       * the Research view. If the item already has a stored result (real run),
       * use it directly. Otherwise (seed items), generate a mock result.
       */
      loadFromHistory: (id) => {
        const { history } = get();
        const item = history.find((h) => h.id === id);
        if (!item) return;

        const result =
          item.result ??
          generateMockResult(item.topic, item.score, item.completedAt);

        const completedAgents = createInitialAgents().map((a) => ({
          ...a,
          status: "completed",
          progress: 100,
          log: [`✓ ${a.name} completed`],
        }));

        set({
          session: {
            id: item.id,
            topic: item.topic,
            depth: item.depth,
            status: "completed",
            agents: completedAgents,
            startedAt: item.completedAt - 70_000,
            elapsed: 70,
            estimatedTotal: 70,
            result,
          },
          activeView: "research",
        });
      },

      // Main research pipeline
      startResearch: async (topic, depth) => {
        const sessionId = generateId();
        const estimatedMap = { quick: 30, standard: 60, deep: 120 };

        const initialSession = {
          id: sessionId,
          topic,
          depth,
          status: "running",
          agents: createInitialAgents(),
          startedAt: Date.now(),
          elapsed: 0,
          estimatedTotal: estimatedMap[depth],
        };

        set({ session: initialSession, activeView: "research" });

        // Timer to update elapsed
        const timerInterval = setInterval(() => {
          const s = get().session;
          if (!s || s.status !== "running") {
            clearInterval(timerInterval);
            return;
          }
          set({
            session: {
              ...s,
              elapsed: Math.floor(
                (Date.now() - (s.startedAt ?? Date.now())) / 1000,
              ),
            },
          });
        }, 1000);

        const updateAgent = (id, updates) => {
          const s = get().session;
          if (!s) return;
          set({
            session: {
              ...s,
              agents: s.agents.map((a) => {
                if (a.id === id) {
                  // Merge log if provided instead of replacing it completely
                  let newLog = a.log;
                  if (updates.log) {
                    newLog = [...a.log, ...updates.log];
                  }
                  return { ...a, ...updates, log: newLog };
                }
                return a;
              }),
            },
          });
        };

        // Ensure we can cancel the stream if needed (though not wired up to UI yet)
        let cancelStream;

        const onEvent = (event) => {
          if (event.type === "agent_start" && event.agent) {
            updateAgent(event.agent, {
              status: "running",
              progress: 10,
              log: [event.data?.log || "Starting..."],
            });
          } else if (event.type === "agent_update" && event.agent) {
            updateAgent(event.agent, {
              progress: event.data?.progress || 50,
              log: event.data?.log ? [event.data.log] : [],
            });
          } else if (event.type === "agent_complete" && event.agent) {
            updateAgent(event.agent, {
              status: "completed",
              progress: 100,
              log: [event.data?.log || "Complete"],
            });
          } else if (event.type === "final_result") {
            const apiResult = event.data;
            clearInterval(timerInterval);

            // Extract score from feedback
            const feedbackStr = apiResult.feedback || "";
            const scoreMatch =
              feedbackStr.match(/Score:\s*(\d+)\/10/i) ||
              feedbackStr.match(/(\d+)\/10/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 8;

            const sources = parseSources(apiResult.search_results || "");

            const finalSession = get().session;
            const elapsed = Math.floor(
              (Date.now() - (finalSession.startedAt ?? Date.now())) / 1000,
            );

            const completedSession = {
              ...finalSession,
              status: "completed",
              elapsed,
              result: {
                searchRaw: apiResult.search_results,
                readerRaw: apiResult.scraped_content,
                report: apiResult.report,
                criticFeedback: apiResult.feedback,
                sources,
                score,
                completedAt: Date.now(),
              },
            };

            set({ session: completedSession });

            // Update history and analytics
            const historyItem = {
              id: sessionId,
              topic,
              completedAt: Date.now(),
              score,
              depth,
              result: completedSession.result,
            };

            const { history, analytics } = get();
            const newHistory = [historyItem, ...history].slice(0, 50);
            const total = analytics.totalResearches + 1;
            const newAnalytics = {
              totalResearches: total,
              avgResearchTime: Math.round(
                (analytics.avgResearchTime * analytics.totalResearches +
                  elapsed) /
                  total,
              ),
              sourcesAnalyzed: analytics.sourcesAnalyzed + sources.length,
              avgQualityScore: Math.round(
                (analytics.avgQualityScore * analytics.totalResearches +
                  score) /
                  total,
              ),
            };

            set({ history: newHistory, analytics: newAnalytics });
          }
        };

        const onError = (error) => {
          clearInterval(timerInterval);
          const s = get().session;
          if (!s) return;
          set({ session: { ...s, status: "failed" } });
          console.error("Research pipeline error:", error);
        };

        const onComplete = () => {
          // Done
        };
        cancelStream = runResearchPipelineStream(
          { topic, depth },
          onEvent,
          onError,
          onComplete,
        );
      },
    }),
    {
      name: "deepscout-store",
      partialize: (state) => ({
        history: state.history,
        analytics: state.analytics,
        sidebarOpen: state.sidebarOpen,
      }),
      /**
       * Custom merge: when hydrating from localStorage, make sure the seed
       * history entries are always present (even for users who loaded the app
       * before the seed was added). New user-created entries are kept at the
       * top; any missing seed items are appended at the bottom.
       */
      merge: (persisted, current) => {
        const p = persisted;
        const existingIds = new Set((p.history ?? []).map((h) => h.id));
        const seedItems = current.history.filter(
          (h) => h.id.startsWith("seed-") && !existingIds.has(h.id),
        );
        const mergedHistory = [...(p.history ?? []), ...seedItems];
        const mergedAnalytics = p.analytics?.totalResearches
          ? p.analytics
          : current.analytics;
        return {
          ...current,
          ...p,
          history: mergedHistory,
          analytics: mergedAnalytics,
        };
      },
    },
  ),
);
