from fastapi import APIRouter, Request, Header
from typing import Optional
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("")
async def create_category(request: Request, authorization: Optional[str] = Header(None)):
    body = await request.json()
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/categories"
    response = await forward_request(url, "POST", headers=headers, data=body)
    return response.json()

@router.get("")
async def get_categories(authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/categories"
    response = await forward_request(url, "GET", headers=headers)
    
    if response.status_code == 200 and response.content:
        try:
            return response.json()
        except Exception as e:
            return {"success": False, "message": f"Error parsing response: {str(e)}", "data": []}
    else:
        return {"success": False, "message": "No data received from backend", "data": []}

@router.get("/{category_id}")
async def get_category_by_id(category_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/categories/{category_id}"
    response = await forward_request(url, "GET", headers=headers)
    return response.json()

@router.put("/{category_id}")
async def update_category(category_id: int, request: Request, authorization: Optional[str] = Header(None)):
    body = await request.json()
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/categories/{category_id}"
    response = await forward_request(url, "PUT", headers=headers, data=body)
    return response.json()

@router.delete("/{category_id}")
async def delete_category(category_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/categories/{category_id}"
    response = await forward_request(url, "DELETE", headers=headers)
    return response.json()
