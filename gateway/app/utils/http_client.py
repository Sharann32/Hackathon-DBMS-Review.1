import httpx
from fastapi import HTTPException

async def forward_request(url: str, method: str, headers: dict = None, data: dict = None, params: dict = None):
    """
    Forward HTTP request to backend services
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "GET":
                response = await client.get(url, headers=headers, params=params)
            elif method == "POST":
                response = await client.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = await client.put(url, headers=headers, json=data)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
            
            return response
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(exc)}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(exc)}")
