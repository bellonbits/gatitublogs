import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from groq import Groq
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/api/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        
        # Filter out empty assistant messages to prevent 'blank' responses from model
        messages = [m for m in messages if m.get("content") or m.get("role") == "user"]

        async def generate():
            try:
                # Use a stable, high-performance model
                chat_completion = client.chat.completions.create(
                    messages=messages,
                    model="llama-3.3-70b-versatile",
                    stream=True,
                )
                
                for chunk in chat_completion:
                    if hasattr(chunk.choices[0], 'delta') and hasattr(chunk.choices[0].delta, 'content'):
                        content = chunk.choices[0].delta.content
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                        
            except Exception as e:
                logger.error(f"Groq Stream Error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Chat Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
