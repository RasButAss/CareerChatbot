from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel
import requests
from ollama import AsyncClient

router = APIRouter(prefix="/model")
llm = AsyncClient(host="http://localhost:11434")

class Query(BaseModel):
    prompt: str
    model: str = "mistral"

@router.websocket("/generate")
async def generate_text(websocket : WebSocket):
    await websocket.accept()
    try:
        query = await websocket.receive_json()
        message = {'role' : 'user', 'content' : query['prompt']}
        async for chunk in await llm.chat(model=query['model'], messages=[message], stream=True):
            print(chunk['message']['content'], end='', flush=True)
            await websocket.send_text(chunk['message']['content'])
        await websocket.send_text('**||END||**')
    except Exception as e:
        print(f'WebSocket error: {str(e)}')
    finally:
        await websocket.close()
