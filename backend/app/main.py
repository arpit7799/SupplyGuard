from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.news import router as news_router
from app.routes.risk import router as risk_router

app = FastAPI(title="Supply Chain Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news_router, prefix="/api")
app.include_router(risk_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Supply Chain Risk API is running", "docs": "/docs"}