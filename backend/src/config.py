from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./iris.db"

    class Config:
        env_file = ".env"

settings = Settings()
