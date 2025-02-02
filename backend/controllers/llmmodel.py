from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ollama import AsyncClient
from langchain.utilities import SerpAPIWrapper
from models.chat import Chat, Message
from typing import List
import json

router = APIRouter(prefix="/model")
llm = AsyncClient(host="http://localhost:11434")
serpapi = SerpAPIWrapper()

@router.websocket("/generate")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)  # Parse the JSON data
            user_query = data.get("prompt", "").strip()

            if not user_query:
                await websocket.send_text("Error: No query provided")
                await websocket.close()
                return

            # User profile (should be fetched from DB in production)
            educational_degree = "B.E Computer Science"
            skill_set = "Machine Learning, Software Development"
            location = "New York, USA"

            # Get job recommendations using SerpAPI
            try:
                job_search_results = serpapi.run(f"{skill_set} jobs in {location}")
                
                # Debugging: Print raw response
                print("Raw SerpAPI response:", job_search_results)
                
                # Ensure response is parsed properly
                job_results = extract_job_listings(job_search_results)
            except Exception as e:
                print(f"Job search error: {e}")
                job_results = []

            job_recommendations = format_job_results(job_results)

            prompt = f"""
            User Profile:
            - Education: {educational_degree}
            - Skills: {skill_set}
            - Location: {location}

            Query: {user_query}

            Job Recommendations:
            {job_recommendations}

            From the job recommendations above, analyze and select the 5 most relevant job opportunities based on the user profile and query. Provide the selected jobs along with detailed insights:
            1. Why these jobs were selected
            2. How they align with the user's skills and experience
            3. Any skill gaps that need to be addressed
            4. Salary expectations for the chosen roles
            5. Career growth potential in these roles
            6. Active job links for applications, if available
            """

            message = {'role': 'user', 'content': prompt}
            llm_response = ""
            
            async for chunk in await llm.chat(
                model=data.get("model", "mistral"),
                messages=[message],
                stream=True
            ):
                content_chunk = chunk['message']['content']
                llm_response += content_chunk
                await websocket.send_text(content_chunk)
            
            await websocket.send_text('||END||')
            
            await create_message(role='user', content=user_query, id=data['id'])
            await create_message(role='assistant', content=llm_response, id=data['id'])
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f'WebSocket error: {str(e)}')
        await websocket.send_text(f'Error: {str(e)}')
    finally:
        await websocket.close()

async def create_message(role: str, content: str, id: str):
    new_message = Message(role=role, content=content)
    await new_message.create()
    chat = await Chat.get(id)
    chat.messages.append(new_message)
    await chat.save()

def extract_job_listings(job_search_results: str) -> List[dict]:
    """Extracts job listings from raw search results."""
    try:
        job_data = json.loads(job_search_results) if isinstance(job_search_results, str) else job_search_results
    except json.JSONDecodeError:
        print("Error: SerpAPI response is not valid JSON")
        return []

    if not isinstance(job_data, list):
        return []

    job_results = []
    for item in job_data:
        if isinstance(item, dict):
            title = item.get("title", "N/A")
            company = item.get("company_name", "Unknown")
            location = item.get("location", "New York")
            link = item.get("link", "N/A")
            job_results.append({"title": title, "company_name": company, "location": location, "link": link})
    
    return job_results

def format_job_results(job_results: List[dict]) -> str:
    """Formats job results into readable text."""
    if not job_results:
        return "No relevant jobs found."

    formatted = []
    for i, job in enumerate(job_results[:10], 1):  
        title = job.get("title", "N/A")
        company = job.get("company_name", "N/A")
        location = job.get("location", "N/A")
        link = job.get("link", "N/A")
        formatted.append(f"{i}. {title} at {company} ({location}) - Apply here: {link}")

    return "\n".join(formatted)