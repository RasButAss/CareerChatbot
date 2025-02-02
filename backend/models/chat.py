from pydantic import Field, BaseModel
from typing import List, Annotated, Optional
from beanie import Document, Indexed, Link, PydanticObjectId
from datetime import datetime

# TODO : for content we have to fit the maximum context length of the model
class Message(Document):
    time: datetime = Field(default_factory=datetime.now)
    role: str
    content: Annotated[str, Field(max_length=5000)]

class Chat(Document):
    time: datetime = Field(default_factory=datetime.now)
    topic: Annotated[str, Field(max_length=200)] = "New Chat"
    messages: List[Link[Message]] = []
    
