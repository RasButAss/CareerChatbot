from fastapi import APIRouter, WebSocket
from ollama import AsyncClient
from models.chat import Chat, Message

router = APIRouter(prefix="/model")
llm = AsyncClient(host="http://localhost:11434")

# TODO: Raise Exception if chat of given id does not exist
async def create_message(role: str, content : str, id : str):
    new_message = Message(role=role, content=content)
    await new_message.create()
    chat = await Chat.get(id)
    chat.messages.append(new_message)
    await chat.save()

@router.websocket("/generate")
async def generate_text(websocket : WebSocket):
    await websocket.accept()
    try:
        query = await websocket.receive_json()
        message = {'role' : 'user', 'content' : query['prompt']}
        llm_response = ""
        async for chunk in await llm.chat(model=query['model'], messages=[message], stream=True):
            llm_response += chunk['message']['content']
            await websocket.send_text(chunk['message']['content'])
        await websocket.send_text('**||END||**')
        print(llm_response)
        await create_message(role='user', content=query['prompt'], id=query['id'])
        await create_message(role='assistant', content=llm_response, id=query['id'])
    except Exception as e:
        print(f'WebSocket error: {str(e)}')
    finally:
        await websocket.close()
