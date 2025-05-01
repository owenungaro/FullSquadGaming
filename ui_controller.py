import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import httpx

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def dashboard():
    return open("static/index.html", encoding="utf-8").read()

@app.get("/api/users/{guild_id}")
async def api_users(guild_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://fullsquad-bot.fly.dev/api/users/{guild_id}")
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, resp.text)
    return resp.json()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
