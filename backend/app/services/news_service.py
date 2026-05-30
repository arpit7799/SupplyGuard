import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
SAMPLE_PATH  = Path(__file__).parent.parent / "data" / "sample_news.json"

SUPPLY_KEYWORDS = (
    "supply chain OR port OR shipping OR logistics OR trade "
    "OR factory OR flood OR strike OR earthquake OR tariff"
)


def fetch_headlines() -> list[dict]:
    """Fetch headlines from NewsAPI; falls back to sample_news.json if no key."""
    if not NEWS_API_KEY or NEWS_API_KEY.strip() == "":
        print("[NewsService] No NewsAPI key — using sample_news.json")
        return _load_sample()

    try:
        res = requests.get(
            "https://newsapi.org/v2/everything",
            params={
                "q":        SUPPLY_KEYWORDS,
                "language": "en",
                "pageSize": 20,
                "sortBy":   "publishedAt",
                "apiKey":   NEWS_API_KEY,
            },
            timeout=10,
        )
        articles = res.json().get("articles", [])
        if not articles:
            print("[NewsService] No articles returned — using sample data")
            return _load_sample()

        return [
            {
                "id":     i + 1,
                "title":  a["title"],
                "source": a["source"]["name"],
                "time":   a["publishedAt"][:10],
            }
            for i, a in enumerate(articles)
            if a.get("title")
        ]
    except Exception as e:
        print(f"[NewsService] NewsAPI error: {e} — using sample data")
        return _load_sample()


def _load_sample() -> list[dict]:
    with open(SAMPLE_PATH) as f:
        return json.load(f)