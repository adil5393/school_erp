from fastapi import FastAPI

app = FastAPI(
    title="School ERP API",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "message": "School ERP API is running 🚀"
    }