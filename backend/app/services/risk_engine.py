import json
from collections import defaultdict
from pathlib import Path
from app.services.nlp_service import classify_headline
from app.services.news_service import fetch_headlines

SAMPLE_PATH = Path(__file__).parent.parent / "data" / "sample_news.json"

COUNTRY_COORDS = {
    "China":         {"lat": 35.8,  "lng": 104.1},
    "Germany":       {"lat": 51.1,  "lng": 10.4},
    "Japan":         {"lat": 36.2,  "lng": 138.2},
    "Taiwan":        {"lat": 23.7,  "lng": 121.0},
    "India":         {"lat": 20.6,  "lng": 78.9},
    "United States": {"lat": 37.1,  "lng": -95.7},
    "Europe":        {"lat": 54.5,  "lng": 15.2},
    "Southeast Asia":{"lat": 12.5,  "lng": 101.9},
    "Middle East":   {"lat": 29.3,  "lng": 42.5},
    "Africa":        {"lat": 8.7,   "lng": 34.5},
    "South America": {"lat": -8.7,  "lng": -55.4},
    "Global":        {"lat": 0.0,   "lng": 0.0},
}

RISK_PRIORITY = {"low": 1, "medium": 2, "high": 3}


def _load_news() -> list[dict]:
    with open(SAMPLE_PATH) as f:
        return json.load(f)


def calculate_risk(limit: int = 50) -> list[dict]:
    """
    Classify a sample of news items and return the highest-risk event per country.
    limit: how many headlines to process (keep low for speed with local Ollama).
    """
    news = fetch_headlines()[:limit]

    country_events: dict[str, list[dict]] = defaultdict(list)

    for item in news:
        headline = item.get("title", "").strip()
        if not headline:
            continue

        result  = classify_headline(headline)
        country = result.get("country", "Global")
        risk    = result.get("risk",    "medium")
        category= result.get("category","transport")

        country_events[country].append({
            "headline": headline,
            "risk":     risk,
            "category": category,
        })

    results = []
    for country, events in country_events.items():
        highest = max(events, key=lambda x: RISK_PRIORITY.get(x["risk"], 1))
        coords  = COUNTRY_COORDS.get(country, {"lat": 0.0, "lng": 0.0})

        results.append({
            "country":  country,
            "risk":     highest["risk"],
            "category": highest["category"],
            "event":    highest["headline"],
            "lat":      coords["lat"],
            "lng":      coords["lng"],
            "total_events": len(events),
        })

    # Sort by risk descending
    results.sort(key=lambda x: RISK_PRIORITY.get(x["risk"], 1), reverse=True)
    return results