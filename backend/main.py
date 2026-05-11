from fastapi import FastAPI

app = FastAPI(title="RAKSHAK.AI API")

@app.get("/")
def read_root():
    return {"message": "Welcome to RAKSHAK.AI API"}
