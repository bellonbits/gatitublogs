import os
import time
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from groq import AsyncGroq
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/api/chat")
async def chat_endpoint(request: Request):
    try:
        start_time = time.time()
        data = await request.json()
        messages = data.get("messages", [])
        
        # Filter out empty assistant messages
        messages = [m for m in messages if m.get("content") or m.get("role") == "user"]
        
        logger.info(f"Chat request started with {len(messages)} messages")

        async def generate():
            try:
                # Use the ultra-fast Scout-tier model
                stream = await client.chat.completions.create(
                    messages=messages,
                    model="llama-3.1-8b-instant",
                    stream=True,
                )
                
                first_chunk = True
                async for chunk in stream:
                    if hasattr(chunk.choices[0], 'delta') and hasattr(chunk.choices[0].delta, 'content'):
                        content = chunk.choices[0].delta.content
                        if content:
                            if first_chunk:
                                latency = time.time() - start_time
                                logger.info(f"First token received. Latency: {latency:.4f}s")
                                first_chunk = False
                            yield f"data: {json.dumps({'content': content})}\n\n"
                        
                logger.info(f"Stream completed in {time.time() - start_time:.4f}s")
                
            except Exception as e:
                logger.error(f"Groq Stream Error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Chat Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
