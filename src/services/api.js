/**
 * API service that communicates with the Python FastAPI/Streamlit backend.
 * Uses Server-Sent Events (SSE) to stream real-time progress.
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function runResearchPipelineStream(
  payload,
  onEvent,
  onError,
  onComplete,
) {
  const url = `${API_BASE}/research/stream?topic=${encodeURIComponent(payload.topic)}&depth=${encodeURIComponent(payload.depth)}`;
  const source = new EventSource(url);

  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
      if (data.type === "final_result" || data.type === "error") {
        source.close();
        if (data.type === "error") {
          onError(new Error(data.data?.message || "Unknown error"));
        } else {
          onComplete();
        }
      }
    } catch (err) {
      console.error("Failed to parse SSE message:", err);
    }
  };

  source.onerror = (err) => {
    console.error("SSE Error:", err);
    source.close();
    onError(new Error("Connection to backend failed or was interrupted."));
  };

  // Return a cancellation function
  return () => {
    source.close();
  };
}
