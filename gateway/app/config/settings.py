from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    spring_backend_url: str
    node_backend_url: str
    gateway_port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
