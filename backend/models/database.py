from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import User
from models.chat import Chat, Message
import os

client = None

async def init():
    # Create Motor client
    global client
    client = AsyncIOMotorClient(
        os.getenv("MONGODB_CONNECTION_STRING")
    )

    # Initialize beanie with the Sample document class and a database
    await init_beanie(database=client.db_name, document_models=[User, Chat, Message])

    print("MongoDB connected")

async def close():
    global client
    if client:
        client.close()
        client = None