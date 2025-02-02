from fastapi import APIRouter
import os
from fastapi import Depends
from starlette.requests import Request
from starlette.responses import RedirectResponse
import logging
from models.user import User, find_by_email
from middlewares import authentication
from models.chat import Chat, Message
from pydantic import BaseModel, Field
from typing import Annotated

router = APIRouter(prefix='/chat')

@router.post('/')
async def create_chat(email : str):
    user = await find_by_email(email = email)
    if user:
        new_chat = Chat()
        await new_chat.create()
        user.chats.append(new_chat)
        await user.save()
        return new_chat
    else:
        return {"Error" : "User does not exist"}
    
@router.get('/')
async def get_chats(email : str):
    user = await User.find_one(
        User.email == email,
        fetch_links = True,
        nesting_depth=1
    )
    if user:
        response = []
        for chat in user.chats:
            new_chat = {'id': str(chat.id), 'topic' : chat.topic}
            response.append(new_chat)
        return response
    else:
        return {"Error" : "User does not exist"}

class MessageRequest(BaseModel):
    content: Annotated[str, Field(max_length=5000)]

@router.post('/{id}/')
async def create_message(id : str, message: MessageRequest):
    new_message = Message(content=message.content)
    await new_message.create()
    chat = await Chat.get(id)
    chat.messages.append(new_message)
    await chat.save()
    return chat

@router.get('/{id}/')
async def get_chat(id : str):
    chat = await Chat.get(id, fetch_links=True)
    return chat