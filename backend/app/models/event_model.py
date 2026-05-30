from pydantic import BaseModel
from typing import Optional


class NewsEvent(BaseModel):
    id:       int
    title:    str
    country:  str
    risk:     str        # high / medium / low
    category: str        # weather / war / transport / politics
    time:     Optional[str] = "just now"


class RiskResult(BaseModel):
    country: str
    risk:    str
    event:   str
    lat:     float
    lng:     float