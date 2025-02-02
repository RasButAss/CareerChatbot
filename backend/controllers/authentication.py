from fastapi import APIRouter
import os
from fastapi import Depends
from starlette.requests import Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from middlewares import authentication
import logging
from models.user import User, find_by_email
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix='/auth')

oauth = OAuth()

# logging.basicConfig(level=logging.DEBUG)

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params={"scope": "openid email profile"},
    access_token_url="https://oauth2.googleapis.com/token",
    client_kwargs={"scope": "openid email profile"},
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
)

@router.get("/login")
async def login(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    state = await oauth.google.authorize_redirect(request, redirect_uri)
    return state

@router.get("/callback")
async def auth_callback(request: Request):
    try: 
        token = await oauth.google.authorize_access_token(request)
        new_user = await find_by_email(token['userinfo']['email'])
        if new_user == None:
            new_user = User(
                name = token['userinfo']['name'],
                email = token['userinfo']['email'],
                picture = token['userinfo']['picture']
            )
            await new_user.create()
        response = RedirectResponse(url="http://localhost:5173/chat")
        response.set_cookie(
            key="user_info",
            value=token['userinfo'],
            httponly=False,
            secure=True,
            samesite="lax"
        )
        return response
    except:
        # TODO : make a login failed page or something and redirect them to that of back to login
        reponse = RedirectResponse(url="http://localhost:5173/login")
        return reponse
    

@router.get("/protected")
async def protected_route(token: str = Depends(authentication.oauth2_scheme)):
    return {"message": "You have accessed a protected route!", "token": token}

@router.get("/logout")
async def logout():
    response = RedirectResponse(url="/")
    response.delete_cookie("Authorization")
    return response

