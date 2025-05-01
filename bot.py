 # bot.py
import os
import asyncio
import discord
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

intents = discord.Intents.default()
intents.members = True
bot = discord.Client(intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user} (ID: {bot.user.id})")

@app.get("/api/users/{guild_id}")
async def listserverusers(guild_id: int):
    guild = bot.get_guild(guild_id) or await bot.fetch_guild(guild_id)
    members = []
    async for m in guild.fetch_members(limit=None):
        members.append({"id": m.id, "name": f"{m.name}#{m.discriminator}"})
    return members

@app.on_event("startup")
async def startup_bot():
    token = os.getenv("DISCORD_TOKEN")
    asyncio.create_task(bot.start(token))

@app.on_event("shutdown")
async def shutdown_bot():
    await bot.close()

if __name__ == "__main__":
     uvicorn.run("bot:app", host="0.0.0.0", port=8000)
