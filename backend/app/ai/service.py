import os
import logging
from typing import Dict, Any, List, Optional
import httpx

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from ..schemas import ProjectRecommendation, ChatResponse, GrowthCopilotResponse
from .mock_engine import (
    get_mock_project_recommendation,
    get_mock_chat_response,
    get_mock_growth_copilot
)

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.mode = os.getenv("AI_MODE", "mistral").lower()
        self.mistral_key = os.getenv("MISTRAL_API_KEY", "").strip()
        self.gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()

        self._init_providers()

    def _init_providers(self):
        self.active_provider = "mock"

        if self.mistral_key and self.mode in ["mistral", "auto"]:
            self.active_provider = "mistral"
            logger.info("AIService configured with Mistral AI provider.")
        elif self.gemini_key and self.mode == "gemini":
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                self.gemini_client = genai.GenerativeModel("gemini-1.5-flash")
                self.active_provider = "gemini"
                logger.info("AIService configured with Gemini provider.")
            except Exception:
                logger.info("AI provider unavailable; switched to mock mode.")
                self.active_provider = "mock"
        elif self.openai_key and self.mode == "openai":
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=self.openai_key)
                self.active_provider = "openai"
                logger.info("AIService configured with OpenAI provider.")
            except Exception:
                logger.info("AI provider unavailable; switched to mock mode.")
                self.active_provider = "mock"
        else:
            self.active_provider = "mock"
            logger.info("AIService running in resilient Mock mode.")

    async def chat(self, message: str, history: Optional[List[Any]] = None) -> ChatResponse:
        """Chatbot response with Mistral AI or resilient Mock fallback."""
        if self.active_provider == "mistral" and self.mistral_key:
            try:
                system_prompt = (
                    "You are Nova AI, the intelligent workshop assistant for NovaSpark.\n"
                    "Tagline: 'Turn your idea into an AI project.'\n"
                    "Workshop: 'Build Your First AI Project in 60 Minutes' (100% Free, live interactive session).\n"
                    "Simulation Stats (Single Source of Truth):\n"
                    "- Target: 500 registrations | Current: 327 (65.4%) | Seats Left: 173 | Day 6 of 7 (1 day remaining)\n"
                    "- Budget: Rs. 2,000 total | Spent: Rs. 1,250 | Remaining: Rs. 750 | Blended CPA: Rs. 3.82 | Viral K-factor: 0.26\n\n"
                    "STRUCTURED PROJECT CATALOG:\n"
                    "1. Multimodal RAG Resume Screener (GenAI / Career, Intermediate, Python/FastAPI/PyPDF2/LLM)\n"
                    "2. AI Network Anomaly Detector (Cybersecurity, Intermediate, Python/ML/Scikit-Learn/FastAPI)\n"
                    "3. Edge AI Anomaly Detector (Edge AI / IoT, Intermediate, Python/ML/sensors/MQTT)\n"
                    "4. AI Document & Image Analyzer (Computer Vision / GenAI, Beginner-Intermediate, Python/OCR/OpenCV/LLM)\n"
                    "5. AI Personal Finance Analyzer (Finance / AI, Beginner-Intermediate, Python/ML/Pandas/FastAPI)\n"
                    "6. RAG Knowledge Assistant (GenAI, Intermediate, Python/embeddings/LangChain/ChromaDB)\n"
                    "7. AI Sentiment Analysis Dashboard (NLP, Beginner, Python/NLTK/Transformers/FastAPI)\n"
                    "8. AI Study Assistant (Education / GenAI, Beginner-Intermediate, Python/LLM/RAG/FastAPI)\n"
                    "9. Predictive Maintenance System (IoT / ML, Intermediate, Python/time-series ML/Pandas)\n"
                    "10. Computer Vision Object Detection App (Computer Vision, Intermediate, Python/OpenCV/YOLO)\n"
                    "11. AI Healthcare Symptom & Triage Assistant (Healthcare / AI, Beginner-Intermediate, Python/NLP/LLM)\n\n"
                    "RECOMMENDATION RULES:\n"
                    "1. Never claim a project is universally 'best'. Say: 'Based on what you've told me, I'd recommend...'\n"
                    "2. BROAD REQUESTS (e.g. 'Give me an AI project'): Return 3 options (1. Best match, 2. Alternative, 3. More challenging option) with brief difference explanation and ask user's skills/goals to narrow down.\n"
                    "3. SPECIFIC REQUESTS: Present 1 targeted match with 'Why it fits', '60-minute MVP pipeline', and a contextual closing question (e.g. 'Want to see another cybersecurity project or explore this one?').\n"
                    "4. NEVER use generic 'What would you like to explore?' unless user provided zero information.\n"
                    "5. MULTI-TURN CONTEXT:\n"
                    "   - If user says 'Tell me about another one' or 'Give me another project', do NOT repeat the previous project. Propose a DIFFERENT suitable project.\n"
                    "   - If user says 'Something easier', lower difficulty to Beginner.\n"
                    "   - If user says 'Something more impressive', pick an advanced/complex project.\n"
                    "   - If user asks follow-up questions ('What technologies?', 'How long?'), answer directly based on the previously discussed project without restarting."
                )
                
                messages = [{"role": "system", "content": system_prompt}]
                if history:
                    for h in history:
                        messages.append({
                            "role": getattr(h, "role", "user"),
                            "content": getattr(h, "content", "")
                        })
                messages.append({"role": "user", "content": message})

                # 15s timeout with single request limit
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        "https://api.mistral.ai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {self.mistral_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "mistral-small-latest",
                            "messages": messages,
                            "temperature": 0.7,
                            "max_tokens": 450
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["choices"][0]["message"]["content"]
                        
                        # Determine intelligent suggestions & CTA based on reply content
                        lower_reply = reply.lower()
                        suggested_actions = ["What will I build?", "Is the workshop free?", "Find my project"]
                        quick_cta = {"label": "Build This Project →", "action": "/project"}

                        if "resume" in lower_reply or "placement" in lower_reply:
                            suggested_actions = ["What technologies would I need?", "How long will it take?", "Show starter code"]
                            quick_cta = {"label": "Build This Project →", "action": "/project"}
                        elif "register" in lower_reply or "seat" in lower_reply:
                            suggested_actions = ["How does referral work?", "View Leaderboard", "Is it free?"]
                            quick_cta = {"label": "Reserve Seat (Free) →", "action": "/register"}
                        elif "referral" in lower_reply or "leaderboard" in lower_reply:
                            suggested_actions = ["How do milestones work?", "Find my project", "Reserve Free Seat"]
                            quick_cta = {"label": "View Leaderboard →", "action": "/leaderboard"}

                        return ChatResponse(
                            reply=reply,
                            suggested_actions=suggested_actions,
                            quick_cta=quick_cta
                        )
                    else:
                        logger.info("AI provider unavailable; switched to mock mode.")
            except Exception:
                logger.info("AI provider unavailable; switched to mock mode.")

        # Seamless and rich Mock response (zero user-facing errors)
        return get_mock_chat_response(message, history)

    async def recommend_project(
        self,
        branch: str,
        year: str,
        coding_experience: str,
        preferred_area: str,
        ai_experience: str,
        what_to_build: Optional[str] = None
    ) -> ProjectRecommendation:
        """Personalized AI project generator with fallback."""
        return get_mock_project_recommendation(
            branch, year, coding_experience, preferred_area, ai_experience, what_to_build
        )

    async def growth_copilot(self, action_type: str = "insights", custom_prompt: Optional[str] = None) -> GrowthCopilotResponse:
        """AI Growth Copilot for campaign insights and copy generation."""
        return get_mock_growth_copilot(action_type)

ai_service = AIService()
