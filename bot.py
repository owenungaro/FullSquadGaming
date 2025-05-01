import os
import asyncio
from typing import List

import discord
from discord import Intents, NotFound
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")


intents = Intents.default()
intents.members = True

bot = discord.Client(intents=intents)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


class MessageRequest(BaseModel):
    guild_id: int
    user_ids: List[int]
    selected_user: int
    promptA: str
    promptB: str


@app.get("/api/users/{guild_id}")
async def list_server_users(guild_id: int):
    guild = bot.get_guild(guild_id) or await bot.fetch_guild(guild_id)
    members = []

    async for member in guild.fetch_members(limit=None):
        members.append({
            "id": str(member.id),
            "name": f"{member.name}#{member.discriminator}"
        })

    return members


@app.post("/api/message")
async def send_messages(req: MessageRequest):
    guild = bot.get_guild(req.guild_id) or await bot.fetch_guild(req.guild_id)

    for uid in req.user_ids:
        try:
            member = await guild.fetch_member(uid)
        except NotFound:
            continue

        if uid == req.selected_user:
            msg = req.promptB
        else:
            msg = req.promptA

        try:
            await member.send(msg)
        except Exception:
            continue

    return {"detail": "Messages sent"}


async def message_user(user: discord.User, message: str):
    await user.send(message)


@app.on_event("startup")
async def startup_bot():
    if DISCORD_TOKEN:
        asyncio.create_task(bot.start(DISCORD_TOKEN))


if __name__ == "__main__":
    uvicorn.run("bot:app", host="0.0.0.0", port=8000)

#DEPLOY
#flyctl deploy --remote-only -a fullsquad-bot   
#
#LOGS
#flyctl logs -a fullsquad-bot --no-tail  