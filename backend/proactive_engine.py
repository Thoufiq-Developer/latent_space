import os
import requests
import uuid
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging
from qdrant_client import models
from qdrant_db import client
from llm_orchestrator import openai_client

logger = logging.getLogger(__name__)

VAPI_API_KEY = os.getenv("VAPI_API_KEY", "")
VAPI_ASSISTANT_ID = os.getenv("VAPI_ASSISTANT_ID", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4-turbo")

def get_high_risk_users(risk_threshold=0.7, idle_hours=48):
    cutoff_ts = (datetime.utcnow() - timedelta(hours=idle_hours)).isoformat()
    try:
        results = client.scroll(
            collection_name='user_profiles',
            scroll_filter=models.Filter(
                should=[
                    models.FieldCondition(key='risk_score_health',
                        range=models.Range(gte=risk_threshold)),
                    models.FieldCondition(key='risk_score_financial',
                        range=models.Range(gte=risk_threshold)),
                ],
                must=[models.FieldCondition(key='last_call_ts',
                        range=models.Range(lt=cutoff_ts))]
            ),
            with_payload=True,
            limit=100
        )
        return [r.payload for r in results[0]]
    except Exception as e:
        logger.error(f"Error fetching high risk users: {e}")
        return []

async def generate_call_script(user: dict, trigger_reason: str, past_events: list[str]) -> str:
    prompt = f"""
Generate a warm, concise 2-sentence opening for an outbound welfare check call in {user.get('language', 'Hindi')}.
User context: {past_events[:3]}
Trigger: {trigger_reason}
"""
    try:
        response = await openai_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error generating call script: {e}")
        return "Namaste! Main VAANI hoon. Aap kaise hain?"

async def check_proactive_triggers():
    users = get_high_risk_users(risk_threshold=0.7, idle_hours=48)
    for user in users:
        # Generate reason
        reason = "health_risk" if user.get('risk_score_health', 0.0) >= 0.7 else "financial_risk"
        script = await generate_call_script(user, reason, [])
        
        # Schedule with VAPI
        payload = {
            "assistantId": VAPI_ASSISTANT_ID,
            "customer": { "number": str(user.get("user_id", "")) },
            "assistantOverrides": { "firstMessage": script }
        }
        
        headers = {
            "Authorization": f"Bearer {VAPI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        vapi_call_id = None
        try:
            if VAPI_API_KEY and VAPI_ASSISTANT_ID:
                resp = requests.post("https://api.vapi.ai/call/phone", json=payload, headers=headers)
                if resp.status_code == 201:
                    vapi_call_id = resp.json().get("id")
                    logger.info(f"Triggered call for user {user.get('user_id')} - ID: {vapi_call_id}")
                else:
                    logger.warning(f"VAPI call failed: {resp.text}")
        except Exception as e:
            logger.error(f"Error calling VAPI: {e}")

        # Store trigger in qdrant
        trigger_payload = {
            "user_id": user.get('user_id'),
            "trigger_type": "proactive_outbound",
            "trigger_reason": reason,
            "scheduled_ts": datetime.utcnow().isoformat(),
            "status": "sent" if vapi_call_id else "failed",
            "call_script": script,
            "vapi_call_id": vapi_call_id
        }
        
        client.upsert(
            collection_name='proactive_triggers',
            points=[
                models.PointStruct(
                    id=str(uuid.uuid4()),
                    vector=[0.0] * 1536, # Placeholder vector since we don't query triggers semantically usually
                    payload=trigger_payload
                )
            ]
        )

scheduler = AsyncIOScheduler()
scheduler.add_job(check_proactive_triggers, 'interval', hours=6)
