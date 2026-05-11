from fastapi import FastAPI
from backend.routers import webhook

app = FastAPI(title="RAKSHAK.AI API")

app.include_router(webhook.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to RAKSHAK.AI API"}
