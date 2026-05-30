from fastapi import APIRouter, Query
from app.services.risk_engine import calculate_risk

router = APIRouter()


@router.get("/risk")
def get_risk(limit: int = Query(default=50, le=500, description="Headlines to process")):
    """
    Returns the highest-risk supply chain event per country.
    Lower `limit` = faster response with local Ollama.
    """
    return calculate_risk(limit=limit)