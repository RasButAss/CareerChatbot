from beanie import Document, Indexed, Link
from typing import List
from models.chat import Chat
from datetime import datetime
from pydantic import Field

class User(Document):
    time: datetime = Field(default_factory=datetime.now)
    name: str
    email: Indexed(str, unique=True)
    picture : str
    chats : List[Link[Chat]] = []

async def find_by_email(email : str):
    user = await User.find_one(User.email == email)
    return user