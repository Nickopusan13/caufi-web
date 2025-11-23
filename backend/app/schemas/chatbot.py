from app.schemas.to_camel import BaseConfigModel
from typing import Optional
from pydantic import Field


class ChatRequest(BaseConfigModel):
    prompt: str = Field(min_length=1)
    session_id: Optional[str] = Field(default=None)


class ChatResponse(BaseConfigModel):
    reply: str = Field(min_length=1)
    session_id: Optional[str] = Field(default=None)
