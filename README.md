# DeepScout Frontend - Premium AI Research Interface

Welcome to the frontend repository for **DeepScout**. This beautifully designed, highly responsive web application serves as the client-side portal for interacting with the DeepScout multi-agent backend. It allows users to initiate complex AI research tasks, monitor agent progress in real-time, and read beautifully formatted Markdown reports.

## ✨ Key Features

- **Premium Monochrome Aesthetics**: A sleek, dark-mode exclusive UI featuring a strict black, white, and grayscale palette, frosted glassmorphism, and elegant typography.
- **Real-Time Pipeline Tracking**: Watch the AI agents (Search, Reader, Writer, Reviewer) work in real-time. Features live progress bars, status indicators, and streaming agent logs via Server-Sent Events (SSE).
- **Responsive & Mobile First**: Meticulously crafted for all screen sizes. Features a dynamic layout, hamburger mobile navigation, and tailored viewport ergonomics to ensure a native-like experience on phones and tablets.
- **Beautiful Report Rendering**: Parses complex Markdown reports seamlessly, complete with tables, formatting, and a dedicated grid for cited sources.
- **Local History Management**: Automatically saves all completed research tasks locally. Users can browse past tasks, view their AI-generated quality scores, or delete them via the Past Researches dashboard.

## 🛠️ Technology Stack

- **Core Framework**: React 18, Vite (Fast HMR and optimal build speeds)
- **Styling**: Tailwind CSS (Utility-first styling, custom monochrome tokens)
- **State Management**: Zustand (Includes local persistence for session and history management)
- **Animations**: Framer Motion (Smooth page transitions, micro-interactions, and staggered reveals)
- **Icons**: Lucide React (Clean, scalable SVG icons)
- **Content Rendering**: React Markdown, Remark GFM (For rendering the final AI research reports)

## 🗺️ User Workflow & Use Cases

1. **Initiation**: The user visits the **HomePage**, enters an inquiry (e.g., "Future of Fusion Energy"), selects a research depth (Quick, Standard, Deep), and starts the task.
2. **Real-Time Monitoring**: The app seamlessly transitions to the **Active Work** dashboard. The user watches the Agent Pipeline progress from Search to Review, streaming real-time JSON logs from the backend.
3. **Synthesis & Review**: Once the agents complete their jobs, the interface displays the final Markdown report, the list of scraped web sources, and a quality critique score out of 10.
4. **History & Persistence**: The user can navigate to the **Past Researches** page to view previous tasks, reload their results instantly without hitting the backend, or delete outdated research.

## 📦 Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 2. Clone and Install Dependencies
```bash
# Clone the repository and navigate to the frontend folder
cd Multi-agent-frontend

# Install the necessary NPM packages
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the frontend directory (you can copy `.env.example` if available) and add your backend API URL:
```env
VITE_API_URL="http://localhost:8000"
```

## 🚀 Running the Application

Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.
