from fastapi import APIRouter, Request, Header
from typing import Optional
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("")
async def get_users(authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/users"
    response = await forward_request(url, "GET", headers=headers)
    
    # Check if response has content before parsing JSON
    if response.status_code == 200 and response.content:
        try:
            return response.json()
        except Exception as e:
            return {"success": False, "message": f"Error parsing response: {str(e)}", "data": []}
    else:
        return {"success": False, "message": "No data received from backend", "data": []}

@router.get("/{user_id}")
async def get_user_by_id(user_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/users/{user_id}"
    response = await forward_request(url, "GET", headers=headers)
    
    if response.status_code == 200 and response.content:
        try:
            return response.json()
        except Exception:
            return {"success": False, "message": "Error parsing response"}
    else:
        return {"success": False, "message": "User not found"}

@router.delete("/{user_id}")
async def delete_user(user_id: int, authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/users/{user_id}"
    response = await forward_request(url, "DELETE", headers=headers)
    
    if response.status_code in [200, 204]:
        if response.content:
            try:
                return response.json()
            except Exception:
                return {"success": True, "message": "User deleted successfully"}
        else:
            return {"success": True, "message": "User deleted successfully"}
    else:
        return {"success": False, "message": "Failed to delete user"}
