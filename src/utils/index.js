import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function formatTimestamp(ts) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function getTrustColor(score) {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function getStatusColor(status) {
  switch (status) {
    case "running":
      return "#4F46E5";
    case "completed":
      return "#10B981";
    case "failed":
      return "#EF4444";
    default:
      return "#94A3B8";
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case "running":
      return "Running";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Waiting";
  }
}

export function estimateResearchTime(depth) {
  switch (depth) {
    case "quick":
      return 30;
    case "deep":
      return 120;
    default:
      return 60;
  }
}

export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function parseSources(searchRaw) {
  const urlRegex = /URL:\s*(https?:\/\/[^\s\n]+)/g;
  const titleRegex = /Title:\s*([^\n]+)/g;
  const snippetRegex = /Snippet:\s*([\s\S]*?)(?=\n----|$)/g;

  const urls = [];
  const titles = [];
  const snippets = [];

  let m;
  while ((m = urlRegex.exec(searchRaw)) !== null) urls.push(m[1].trim());
  while ((m = titleRegex.exec(searchRaw)) !== null) titles.push(m[1].trim());
  while ((m = snippetRegex.exec(searchRaw)) !== null)
    snippets.push(m[1].trim());

  return urls.map((url, i) => ({
    id: generateId(),
    title: titles[i] || `Source ${i + 1}`,
    url,
    domain: extractDomain(url),
    trustScore: Math.floor(Math.random() * 30) + 65,
    summary: snippets[i] || "No summary available.",
  }));
}

/**
 * Instantly generate a complete ResearchResult for a given topic + score.
 * Used when loading seed / history items that don't have a stored result.
 */
export function generateMockResult(topic, score, completedAt) {
  const slug = topic.toLowerCase().replace(/\s+/g, "-");
  const searchRaw = `Title: ${topic} - Latest Research 2025
URL: https://arxiv.org/search/?query=${encodeURIComponent(topic)}
Snippet: Comprehensive overview of recent developments in ${topic}, covering key breakthroughs, methodologies and practical applications discovered by leading research institutions worldwide.

----
Title: ${topic} - Wikipedia
URL: https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, "_"))}
Snippet: ${topic} refers to a rapidly evolving field with significant implications across multiple domains including technology, science and industry.

----
Title: Understanding ${topic}: A Deep Dive
URL: https://medium.com/towards-data-science/${slug}
Snippet: In this article we explore the fundamental concepts behind ${topic} and provide expert analysis on current trends and future directions.

----
Title: ${topic} — State of the Art 2025
URL: https://paperswithcode.com/sota/${slug}
Snippet: Benchmarks and leaderboards for ${topic} tasks. Includes state-of-the-art results from top research labs.

----
Title: The Future of ${topic}
URL: https://techcrunch.com/tag/${slug}
Snippet: Industry experts weigh in on where ${topic} is headed, discussing potential impact, challenges, and the next frontier of innovation.`;

  const report = `# Research Report: ${topic}

## Introduction

${topic} represents one of the most dynamic and rapidly evolving areas of modern research. This report synthesizes findings from multiple authoritative sources to provide a comprehensive overview of the current state, key developments, and future directions of this field.

---

## Key Findings

### 1. Rapid Advancement in Core Methodologies

The foundational approaches within ${topic} have undergone substantial transformation. Researchers have moved beyond traditional paradigms toward more flexible, adaptive frameworks that generalize across diverse problem spaces.

**Notable developments include:**
- Significant increases in efficiency, with leading approaches achieving equivalent results using fewer computational resources
- Novel architectural innovations redefining baseline performance expectations
- Cross-disciplinary collaborations producing breakthrough insights

### 2. Real-World Deployment & Industry Adoption

${topic} is no longer confined to research laboratories. Enterprise adoption has accelerated dramatically across sectors:

- **Healthcare**: Diagnostic assistance, drug discovery acceleration, and personalized medicine
- **Finance**: Risk assessment, algorithmic optimization, and fraud detection
- **Technology**: Infrastructure automation, developer productivity tools, and intelligent search

### 3. Challenges and Open Problems

Despite impressive progress, significant challenges remain:

- **Interpretability**: Understanding *why* systems make specific decisions
- **Data Requirements**: High-quality data continues to be a bottleneck
- **Robustness**: Ensuring consistent performance across distribution shifts
- **Ethical Considerations**: Fairness, bias mitigation, and responsible deployment

### 4. Emerging Research Frontiers

Several exciting directions are gaining traction:

- Integration with symbolic reasoning systems
- Self-supervised and few-shot learning approaches
- Federated approaches enabling privacy-preserving collaboration
- Hardware-software co-design for next-generation compute

---

## Conclusion

${topic} stands at an inflection point. The convergence of improved algorithms, abundant data, and increasingly accessible compute infrastructure has created conditions for transformative advances.

---

## Sources

1. arxiv.org — ${topic} Latest Research 2025
2. en.wikipedia.org — ${topic} Overview
3. medium.com — Understanding ${topic}: A Deep Dive
4. paperswithcode.com — ${topic} State of the Art
5. techcrunch.com — The Future of ${topic}`;

  const criticFeedback = `## Score: ${score}/10

### Strengths
- **Comprehensive Coverage**: The report synthesizes information from multiple authoritative sources.
- **Clear Structure**: The Introduction → Key Findings → Conclusion format makes it easy to navigate.
- **Practical Relevance**: Real-world applications ground the research in tangible outcomes.
- **Balanced Perspective**: Challenges and limitations are acknowledged alongside achievements.

### Areas to Improve
- **Specific Citations**: More precise citations would strengthen credibility.
- **Quantitative Data**: Adding specific metrics and benchmark numbers would make claims more concrete.
- **Counterarguments**: Exploring dissenting views would add intellectual depth.

### One-Line Verdict
A solid, well-structured research report that covers essential ground with clarity.`;

  return {
    searchRaw,
    readerRaw: `## Extracted Content\n\nComprehensive analysis of ${topic} from primary sources reveals significant developments across multiple dimensions of research and application.`,
    report,
    criticFeedback,
    sources: parseSources(searchRaw),
    score,
    completedAt,
  };
}

export function createInitialAgents() {
  return [
    {
      id: "search",
      name: "Search Agent",
      description: "Finds the best information and data across the web",
      icon: "🔍",
      status: "idle",
      progress: 0,
      log: [],
    },
    {
      id: "reader",
      name: "Reading Agent",
      description: "Reads and understands the details from top sources",
      icon: "📄",
      status: "idle",
      progress: 0,
      log: [],
    },
    {
      id: "writer",
      name: "Writing Agent",
      description: "Turns raw information into clear, creative solutions",
      icon: "✍️",
      status: "idle",
      progress: 0,
      log: [],
    },
    {
      id: "critic",
      name: "Review Agent",
      description: "Checks for accuracy, creativity, and overall excellence",
      icon: "🧐",
      status: "idle",
      progress: 0,
      log: [],
    },
  ];
}
