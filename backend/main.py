from fastapi import FastAPI
from backend.routers import webhook, reports

app = FastAPI(title="RAKSHAK.AI API")

app.include_router(webhook.router)
app.include_router(reports.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to RAKSHAK.AI API"}
