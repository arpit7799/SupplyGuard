from fastapi import APIRouter, Query
from app.services.news_service import fetch_headlines
from app.services.nlp_service  import classify_headline

router = APIRouter()


@router.get("/news")
def get_news(limit: int = Query(default=20, le=100)):
    """Return headlines enriched with AI risk classification via local Ollama."""
    headlines = fetch_headlines()[:limit]
    result = []

    for i, item in enumerate(headlines):
        classification = classify_headline(item["title"])
        result.append({
            "id":       i + 1,
            "title":    item["title"],
            "country":  classification.get("country",  "Unknown"),
            "risk":     classification.get("risk",     "medium"),
            "category": classification.get("category", "transport"),
            "time":     item.get("time", "recent"),
        })

    return result