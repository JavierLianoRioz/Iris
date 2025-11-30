import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.infrastructure.evolution_client import EvolutionClient
from src.services.evolution import EvolutionService

@pytest.mark.asyncio
async def test_evolution_client_send_text_message():
    mock_response = {"key": {"id": "123"}, "message": "sent"}
    
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_response_obj = MagicMock()
        mock_response_obj.status_code = 200
        mock_response_obj.json.return_value = mock_response
        mock_post.return_value = mock_response_obj
        
        client = EvolutionClient(base_url="http://test-url", api_key="test-key")
        result = await client.send_text_message("instance1", "1234567890", "Hello")
        
        assert result == mock_response
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        assert kwargs["json"]["textMessage"]["text"] == "Hello"
        assert kwargs["headers"]["apikey"] == "test-key"

@pytest.mark.asyncio
async def test_evolution_service_send_notification():
    mock_client = AsyncMock(spec=EvolutionClient)
    mock_client.send_text_message.return_value = {"status": "success"}
    
    service = EvolutionService(client=mock_client)
    await service.send_notification("instance1", "1234567890", "Hello Service")
    
    mock_client.send_text_message.assert_called_once_with("instance1", "1234567890", "Hello Service")
