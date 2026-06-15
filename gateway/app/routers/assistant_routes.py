from fastapi import APIRouter, Request
from app.config.settings import settings
from app.utils.http_client import forward_request

router = APIRouter(prefix="/assistant", tags=["Configuration Assistant"])

@router.post("/query")
async def query_assistant(request: Request):
    body = await request.json()
    url = f"{settings.node_backend_url}/assistant/query"
    response = await forward_request(url, "POST", data=body)
    return response.json()

@router.post("/explanations")
async def create_explanation(request: Request):
    body = await request.json()
    url = f"{settings.node_backend_url}/explanations"
    response = await forward_request(url, "POST", data=body)
    return response.json()

@router.get("/explanations")
async def get_explanations():
    url = f"{settings.node_backend_url}/explanations"
    response = await forward_request(url, "GET")
    return response.json()

@router.get("/explanations/search")
async def search_explanations(q: str):
    url = f"{settings.node_backend_url}/explanations/search"
    response = await forward_request(url, "GET", params={"q": q})
    return response.json()

@router.post("/faqs")
async def create_faq(request: Request):
    body = await request.json()
    url = f"{settings.node_backend_url}/faqs"
    response = await forward_request(url, "POST", data=body)
    return response.json()

@router.get("/faqs")
async def get_faqs():
    url = f"{settings.node_backend_url}/faqs"
    response = await forward_request(url, "GET")
    return response.json()
