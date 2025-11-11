from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

BACKEND_SERVICE_URL = "http://backend:8000"

@app.get("/")
def read_root():
    return {"message": "Welcome to the API Gateway"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH", "TRACE"])
async def catch_all(request: Request, path: str):
    url = f"{BACKEND_SERVICE_URL}/{path}"
    headers = dict(request.headers)
    if 'host' in headers:
        del headers['host']

    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                params=request.query_params,
                content=await request.body()
            )
            return JSONResponse(content=response.json(), status_code=response.status_code)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"Backend service unavailable: {exc}")
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {exc}")