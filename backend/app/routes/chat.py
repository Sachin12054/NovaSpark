from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse
from ..ai.service import ai_service

router = APIRouter(prefix="/api", tags=["AI Chatbot Nova"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_nova(request: ChatRequest):
    response = await ai_service.chat(request.message, request.history)
    return response
