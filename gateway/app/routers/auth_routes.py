from fastapi import APIRouter, Request
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(request: Request):
    body = await request.json()
    url = f"{settings.spring_backend_url}/auth/register"
    response = await forward_request(url, "POST", data=body)
    return response.json()

@router.post("/login")
async def login(request: Request):
    body = await request.json()
    url = f"{settings.spring_backend_url}/auth/login"
    response = await forward_request(url, "POST", data=body)
    return response.json()
