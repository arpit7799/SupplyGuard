import os
import json
import requests
from dotenv import load_dotenv


load_dotenv()

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "phi3:mini"
PROMPT_TEMPLATE = """\
Classify this supply chain news headline and return ONLY valid JSON — no explanation, no markdown, no extra text.

Output format:
{{"risk":"high","category":"weather","country":"China"}}

Rules:
- risk must be one of: high, medium, low
- category must be one of: weather, war, transport, politics
- country must be the main country/region mentioned (use "Global" if unclear)

Headline: {headline}

JSON:"""


def classify_headline(headline: str) -> dict:
    """Send headline to local Ollama model and parse JSON response."""
    prompt = PROMPT_TEMPLATE.format(headline=headline)

    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model":  OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0,
                    "num_predict": 60,   # JSON is short, no need for more
                }
            },
            timeout=60,
        )

        if response.status_code != 200:
            print(f"Ollama HTTP error {response.status_code}: {response.text}")
            return _fallback(headline)

        data = response.json()
        raw  = data.get("response", "").strip()
        print(f"[Ollama] raw response: {raw}")

        # Extract first JSON object from the response (handles extra text)
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(raw[start:end])

        print("[Ollama] No JSON found in response, using fallback")
        return _fallback(headline)

    except requests.exceptions.ConnectionError:
        print(f"[Ollama] Cannot connect to {OLLAMA_BASE_URL} — is Ollama running?")
        return _fallback(headline)
    except Exception as e:
        print(f"[Ollama] Request failed: {e}")
        return _fallback(headline)


def _fallback(headline: str) -> dict:
    """Rule-based fallback when Ollama is unavailable."""
    h = headline.lower()

    if any(w in h for w in ["flood", "flooding", "typhoon", "hurricane", "earthquake", "wildfire"]):
        country = _guess_country(h)
        return {"risk": "high", "category": "weather", "country": country}

    if any(w in h for w in ["strike", "port", "shipping", "logistics", "transport"]):
        country = _guess_country(h)
        return {"risk": "high", "category": "transport", "country": country}

    if any(w in h for w in ["war", "conflict", "military", "attack", "cyber"]):
        country = _guess_country(h)
        return {"risk": "high", "category": "war", "country": country}

    if any(w in h for w in ["sanction", "tariff", "trade", "political", "election", "reform"]):
        country = _guess_country(h)
        return {"risk": "medium", "category": "politics", "country": country}

    return {"risk": "medium", "category": "transport", "country": _guess_country(h)}


def _guess_country(headline: str) -> str:
    mapping = {
        "china":         "China",
        "germany":       "Germany",
        "japan":         "Japan",
        "taiwan":        "Taiwan",
        "india":         "India",
        "europe":        "Europe",
        "united states": "United States",
        "southeast asia":"Southeast Asia",
        "middle east":   "Middle East",
        "africa":        "Africa",
        "south america": "South America",
    }
    for keyword, country in mapping.items():
        if keyword in headline:
            return country
    return "Global"