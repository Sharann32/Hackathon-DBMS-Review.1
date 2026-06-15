from fastapi import APIRouter, Header
from typing import Optional
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("")
async def get_audit_logs(authorization: Optional[str] = Header(None)):
    headers = {"Authorization": authorization} if authorization else {}
    url = f"{settings.spring_backend_url}/audit"
    response = await forward_request(url, "GET", headers=headers)
    return response.json()
