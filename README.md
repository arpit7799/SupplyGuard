# SupplyGuard — AI-Powered Supply Chain Risk Intelligence

## What is this?
SupplyGuard is a real-time supply chain risk monitoring dashboard. It scans global news headlines, classifies them by risk level using a local AI model, and displays threats on an interactive map with live updates.

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Dev server and bundler |
| Recharts | Bar charts and trend graphs |
| react-globe.gl | 3D interactive globe |
| react-countup | Animated number counters |
| react-router-dom | Page routing (Home / Dashboard) |
| Tailwind CSS | Utility styling |

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Ollama + phi3:mini | Local LLM for headline classification |
| NewsAPI | Real news headlines (falls back to sample data) |
| Python requests | HTTP calls to Ollama and NewsAPI |

---

## Project Structure
```
hack/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app, CORS, route registration
│       ├── routes/
│       │   ├── news.py          # GET /api/news
│       │   └── risk.py          # GET /api/risk
│       ├── services/
│       │   ├── news_service.py  # Fetches headlines from NewsAPI or sample JSON
│       │   ├── nlp_service.py   # Sends headlines to Ollama, parses JSON response
│       │   └── risk_engine.py   # Aggregates risk per country
│       ├── models/
│       │   └── event_model.py   # Pydantic data models
│       └── data/
│           └── sample_news.json # Fallback headlines when NewsAPI key is missing
└── frontend/
    ├── index.html               # Entry HTML, favicon, page title
    ├── vite.config.js           # Vite config, proxy /api → localhost:8000
    ├── src/
    │   ├── main.jsx             # React root, router setup
    │   ├── App.jsx              # Main dashboard page, data fetching, layout
    │   ├── index.css            # CSS variables, dark/light themes, animations
    │   ├── pages/
    │   │   └── Home.jsx         # Landing page with 3D video globe and stats
    │   ├── components/
    │   │   ├── AIChat.jsx       # Floating AI chatbot (talks to Ollama)
    │   │   ├── AlertCard.jsx    # Single news event card in the feed
    │   │   ├── Dashboard.jsx    # (legacy) original dashboard component
    │   │   ├── DashboardControls.jsx  # Search and filter controls
    │   │   ├── DashboardHeader.jsx    # Top bar with search and refresh
    │   │   ├── EventList.jsx    # Scrollable list of AlertCards
    │   │   ├── Navbar.jsx       # Top nav with dark/light toggle
    │   │   ├── RiskAlertBanner.jsx   # Red banner for critical alerts
    │   │   ├── RiskHeatmap.jsx  # Heatmap visualization
    │   │   ├── RiskMap.jsx      # 3D globe with risk points and trade routes
    │   │   ├── RiskTrend.jsx    # Weekly risk trend line chart
    │   │   ├── Skeleton.jsx     # Shimmer loading placeholder
    │   │   └── Toast.jsx        # Bottom toast notification system
    │   └── services/
    │       └── api.js           # fetchNews(), fetchRisk(), fetchTrend() with mock fallbacks
```

---

## How Data Flows
```
NewsAPI (or sample_news.json)
        ↓
  news_service.py        ← fetches raw headlines
        ↓
  nlp_service.py         ← sends each headline to Ollama phi3:mini
        ↓                   gets back { risk, category, country }
  risk_engine.py         ← picks highest risk event per country
        ↓
  FastAPI /api/news      ← returns enriched headlines
  FastAPI /api/risk      ← returns per-country risk summary
        ↓
  api.js (frontend)      ← fetches both endpoints, falls back to mock data
        ↓
  App.jsx                ← holds state, passes to all components
        ↓
  RiskMap / Charts / Feed / AIChat
```

---

## Key Files Explained

### `nlp_service.py`
The brain of the backend. Takes a headline like:
> "Major flood disrupts Yangtze River ports in China"

Sends it to Ollama with a prompt asking for JSON:
```json
{ "risk": "high", "category": "weather", "country": "China" }
```

If Ollama is offline, falls back to keyword matching (_fallback function).

**Critical bug that was fixed:**
- Variable was named `OLLAMA_OLLAMA_MODEL` but used as `OLLAMA_MODEL` → NameError crash
- Base URL had `/api/generate` baked in, then `/api/generate` was appended again → 404

### `api.js`
All frontend API calls live here. Every function has a try/catch that falls back to mock data so the UI never breaks even when the backend is down.
```js
export async function fetchNews() {
  try {
    const res = await fetch('/api/news')
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    return MOCK_NEWS  // always works
  }
}
```

### `RiskMap.jsx`
Uses `react-globe.gl` (built on Three.js) to render a 3D Earth with:
- **Points** — colored dots at each risk country (red/amber/green)
- **Arcs** — animated trade route lines between countries
- **Auto-rotate** — globe spins slowly

**Globe loading bug that was fixed:**
- No error handling → if WebGL fails or texture doesn't load, shows "LOADING GLOBE..." forever
- Fix: added 8 second timeout + `.catch()` that sets an error state

### `AIChat.jsx`
Floating chatbot in bottom-right corner. On send:
1. Builds a system prompt with current `risks` and `news` data as JSON context
2. POSTs to `http://localhost:11434/api/chat` (Ollama)
3. Uses `phi3:mini` model, `stream: false`
4. Displays response in chat bubble UI

### `App.jsx`
The main orchestrator:
- Fetches data on mount with `loadData()`
- Auto-refreshes every 30 seconds via `setInterval`
- Flash animation on refresh (blue outline pulse)
- Keyboard shortcut: press `R` to manually refresh
- Renders: Navbar → AlertBanner → Feed → AISummary → StatCards → Map → Chart → Trend → AIChat

### `Navbar.jsx`
Dark/Light mode toggle works by setting `data-theme` attribute on `<html>`:
```js
document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
```
CSS variables in `index.css` switch automatically under `[data-theme="light"]`.

### `Toast.jsx`
Uses a module-level variable `_addToast` as a simple global event bus:
```js
let _addToast = null
export function toast(msg, type) { _addToast?.({msg, type, id: Date.now()}) }
```
Call `toast('text', 'success')` from anywhere in the app.

### `Skeleton.jsx`
Shows shimmer placeholder cards while data loads instead of a spinner. Uses a CSS `shimmer` keyframe animation on gradient backgrounds.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | Returns headlines with AI risk classification |
| GET | `/api/news?limit=10` | Limit number of headlines processed |
| GET | `/api/risk` | Returns highest risk event per country |
| GET | `/api/risk?limit=50` | Control how many headlines to analyze |
| GET | `/` | Health check |
| GET | `/docs` | Auto-generated Swagger UI |

---

## Environment Variables

Create a `.env` file in `backend/`:
```
NEWS_API_KEY=your_key_from_newsapi.org
```
Without it, the app uses `sample_news.json` as fallback — fully functional for demos.

---

## Running Locally
```bash
# Terminal 1 — Local LLM
ollama serve
ollama pull phi3:mini

# Terminal 2 — Backend
cd ~/hack/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 3 — Frontend
cd ~/hack/frontend
npm run dev
```

Open: http://localhost:3000

---

## Vite Proxy

`vite.config.js` proxies all `/api` calls to the backend:
```js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```
This means the frontend calls `/api/news` and Vite forwards it to `http://localhost:8000/api/news`. No CORS issues in development.

---

## Features Added During Development

| Feature | File | How it works |
|---------|------|-------------|
| AI Chatbot | AIChat.jsx | Sends context + question to Ollama phi3:mini |
| Dark/Light mode | Navbar.jsx + index.css | data-theme attribute on html element |
| Skeleton loader | Skeleton.jsx | Shimmer CSS animation on placeholder cards |
| Toast notifications | Toast.jsx | Global event bus pattern |
| Keyboard shortcut R | App.jsx | window keydown listener |
| Auto-refresh | App.jsx | setInterval every 30s |
| Flash on refresh | App.jsx | outline CSS transition |
| 3D video globe | Home.jsx | HTML video + CSS perspective/rotateY |
| Animated counters | Home.jsx | react-countup with enableScrollSpy |
| Favicon + title | index.html | SVG data URL favicon |

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED :8000` | Backend not running | `cd backend && uvicorn app.main:app --reload --port 8000` |
| `Address already in use` | Port 8000 taken | `lsof -ti:8000 \| xargs kill -9` |
| `LOADING GLOBE...` forever | WebGL/network issue | Fixed with 8s timeout + error state |
| `NameError: OLLAMA_MODEL` | Typo in variable name | Fixed: renamed OLLAMA_OLLAMA_MODEL → OLLAMA_MODEL |
| Globe URL 404 | Double /api/generate in URL | Fixed: base URL is now just host:port |
| `npm error no package.json` | Wrong directory | Always run npm commands from `frontend/` |
| `sed: extra characters` | macOS sed needs `''` after `-i` | Use `sed -i '' '...'` on Mac |

---

## Concepts to Study

- **FastAPI** — how routes, routers, and middleware work
- **Pydantic** — data validation models in Python
- **Ollama** — running LLMs locally, the `/api/chat` endpoint format
- **React hooks** — useState, useEffect, useRef, useCallback, useMemo
- **CSS variables** — theming with :root and data-theme
- **Vite proxy** — why it's needed and how it prevents CORS errors
- **WebGL / Three.js** — what react-globe.gl uses under the hood
- **Module-level singletons** — how Toast uses a global variable as an event bus
