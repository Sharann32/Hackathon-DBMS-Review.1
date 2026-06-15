from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from app.config.settings import settings
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from app.routers import (
    auth_routes,
    user_routes,
    category_routes,
    setting_routes,
    audit_routes,
    assistant_routes
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Settings Management API Gateway",
    description="FastAPI Gateway for Settings and Configuration Management System",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middleware
app.add_middleware(LoggingMiddleware)

# Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include Routers
app.include_router(auth_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/api")
app.include_router(category_routes.router, prefix="/api")
app.include_router(setting_routes.router, prefix="/api")
app.include_router(audit_routes.router, prefix="/api")
app.include_router(assistant_routes.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Settings Management API Gateway",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "success": True,
        "message": "Gateway is healthy",
        "services": {
            "spring_backend": settings.spring_backend_url,
            "node_backend": settings.node_backend_url
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.gateway_port)
