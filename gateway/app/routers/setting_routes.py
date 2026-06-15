from fastapi import APIRouter, Request, Header
from typing import Optional
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.post("")
async def create_setting(request: Request, authorization: Optional[str] = Header(None)):
    body = await request.json()
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings"
    response = await forward_request(url, "POST", headers=headers, data=body)
    return response.json()

@router.get("")
async def get_settings(authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings"
    response = await forward_request(url, "GET", headers=headers)
    
    if response.status_code == 200 and response.content:
        try:
            return response.json()
        except Exception as e:
            return {"success": False, "message": f"Error parsing response: {str(e)}", "data": []}
    else:
        return {"success": False, "message": "No data received from backend", "data": []}

@router.get("/{setting_id}")
async def get_setting_by_id(setting_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings/{setting_id}"
    response = await forward_request(url, "GET", headers=headers)
    
    if response.status_code == 200 and response.content:
        try:
            return response.json()
        except Exception:
            return {"success": False, "message": "Error parsing response"}
    else:
        return {"success": False, "message": "Setting not found"}

@router.put("/{setting_id}")
async def update_setting(setting_id: int, request: Request, authorization: Optional[str] = Header(None)):
    body = await request.json()
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings/{setting_id}"
    response = await forward_request(url, "PUT", headers=headers, data=body)
    return response.json()

@router.delete("/{setting_id}")
async def delete_setting(setting_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings/{setting_id}"
    response = await forward_request(url, "DELETE", headers=headers)
    return response.json()

@router.get("/category/{category_id}")
async def get_settings_by_category(category_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings/category/{category_id}"
    response = await forward_request(url, "GET", headers=headers)
    return response.json()

@router.get("/scope/{scope}")
async def get_settings_by_scope(scope: str, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/settings/scope/{scope}"
    response = await forward_request(url, "GET", headers=headers)
    return response.json()
