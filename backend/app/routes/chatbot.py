from fastapi import APIRouter, HTTPException, status
from app.schemas.chatbot import ChatRequest, ChatResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv
import uuid
import os

load_dotenv()
router = APIRouter(prefix="/api")
sessions = {}
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
instruction_path = os.path.join(BASE_DIR, "../config/chat_bot.txt")
with open(instruction_path, "r", encoding="utf-8") as f:
    SYSTEM_INSTRUCTION = f.read()


@router.post("/chat/bot", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def api_chat_bot(
    request: ChatRequest,
):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    session_id = request.session_id or str(uuid.uuid4())
    chat_history = sessions.get(session_id, [])
    chat_history.append({"role": "user", "content": request.prompt})
    chat_history = chat_history[-20:]
    context_messages = [f"{m['role']}: {m['content']}" for m in chat_history]
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=context_messages,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=1500),
                system_instruction=SYSTEM_INSTRUCTION,
            ),
        )
        reply_text = response.text if hasattr(response, "text") else str(response)
        chat_history.append({"role": "assistant", "content": reply_text})
        sessions[session_id] = chat_history
        return {"reply": reply_text}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error, Please try again later",
        )
