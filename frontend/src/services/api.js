const BASE = '/api'

// ─── MOCK DATA ───────────────────────────────────────────
// Use this while backend is not ready. Swap to real API calls later.

export const MOCK_NEWS = [
  { id: 1, title: "Major flood disrupts Yangtze River ports in China", country: "China",   risk: "high",   category: "weather",   time: "2 min ago" },
  { id: 2, title: "Dock workers strike at Rotterdam port",             country: "Germany",  risk: "high",   category: "transport", time: "15 min ago" },
  { id: 3, title: "Taiwan Strait tensions rise amid military drills",  country: "Taiwan",   risk: "high",   category: "politics",  time: "1 hr ago" },
  { id: 4, title: "Monsoon delays affect India logistics networks",    country: "India",    risk: "medium", category: "weather",   time: "2 hr ago" },
  { id: 5, title: "Ukraine grain export corridor partially restored",  country: "Ukraine",  risk: "medium", category: "war",       time: "3 hr ago" },
  { id: 6, title: "US-Mexico border delays ease after negotiations",   country: "USA",      risk: "low",    category: "politics",  time: "5 hr ago" },
]

export const MOCK_RISK = [
  { country: "China",   risk: "high",   event: "Flood + port disruption", lat: 35.86,  lng: 104.19 },
  { country: "Germany", risk: "high",   event: "Dock worker strike",       lat: 51.16,  lng: 10.45  },
  { country: "Taiwan",  risk: "high",   event: "Military tensions",        lat: 23.69,  lng: 120.96 },
  { country: "India",   risk: "medium", event: "Monsoon delays",           lat: 20.59,  lng: 78.96  },
  { country: "Ukraine", risk: "medium", event: "War disruption",           lat: 48.37,  lng: 31.16  },
  { country: "USA",     risk: "low",    event: "Border delay easing",      lat: 37.09,  lng: -95.71 },
]

// ─── REAL API CALLS ──────────────────────────────────────
// Uncomment these when backend is ready

export async function fetchNews() {
  try {
    const res = await fetch(`${BASE}/news`)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    console.warn('Backend not ready — using mock news data')
    return MOCK_NEWS
  }
}

export async function fetchRisk() {
  try {
    const res = await fetch(`${BASE}/risk`)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    console.warn('Backend not ready — using mock risk data')
    return MOCK_RISK
  }
}

export async function fetchTrend() {
  try {
    const res = await fetch(`${BASE}/trend`)
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    console.warn('Trend data not available')
    return []
  }
}
