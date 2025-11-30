import httpx
from src.config import settings

class EvolutionClient:
    def __init__(self, base_url: str = settings.EVOLUTION_API_URL, api_key: str = settings.EVOLUTION_API_KEY):
        self.base_url = base_url.rstrip('/')
        self.headers = {
            "apikey": api_key,
            "Content-Type": "application/json"
        }

    async def send_text_message(self, instance_id: str, number: str, text: str) -> dict:
        url = f"{self.base_url}/message/sendText/{instance_id}"
        payload = {
            "number": number,
            "options": {
                "delay": 1200,
                "presence": "composing",
                "linkPreview": False
            },
            "textMessage": {
                "text": text
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
