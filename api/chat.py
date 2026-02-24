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
        
        async def generate():
            try:
                chat_completion = client.chat.completions.create(
                    messages=messages,
                    model="meta-llama/llama-4-scout-17b-16e-instruct",
                    stream=True,
                )
                
                for chunk in chat_completion:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        # Standard SSE format: data: <payload>\n\n
                        yield f"data: {json.dumps({'content': content})}\n\n"
                        
            except Exception as e:
                logger.error(f"Groq Stream Error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Chat Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
