from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from controllers import authentication
from fastapi.middleware.cors import CORSMiddleware
from models import database
from contextlib import asynccontextmanager
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.init()
    yield
    await database.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URLs in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(authentication.router)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))


@app.get("/")
async def root():
    return {"message": "Hello Career Chatbot!"}