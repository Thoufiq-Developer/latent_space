import os
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
import phonenumbers

from qdrant_db import init_collections, client
from models import LifeEvent, UserProfile, VapiWebhookPayload
from life_graph import get_user_context, get_user_profile, update_user_profile, upsert_life_event, domain_knowledge_search
from llm_orchestrator import generate_response, extract_risk_signals
from proactive_engine import scheduler
from domain_loaders import seed_domain_knowledge

app = FastAPI(title="VAANI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_collections()
    scheduler.start()

@app.get("/")
def read_root():
    return {"message": "VAANI Backend is Running"}

@app.post("/webhook/vapi")
async def vapi_webhook(request: Request):
    payload = await request.json()
    msg_type = payload.get("message", {}).get("type", payload.get("type", ""))
    
    # Process assistant request to generate a system message
    if msg_type == "assistant-request" or msg_type == "function-call":
        call_info = payload.get("message", {}).get("call", {})
        customer_number = call_info.get("customer", {}).get("number", "unknown")
        
        # normalize number
        user_id = customer_number
        if user_id != "unknown":
            try:
                parsed = phonenumbers.parse(user_id, None)
                user_id = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
            except:
                pass
                
        # for testing/demo purposes if unknown
        if user_id == "unknown":
            user_id = "+919999999999"

        messages = payload.get("message", {}).get("messages", [])
        current_utterance = ""
        if messages and isinstance(messages, list):
            current_utterance = messages[-1].get("content", "")
        
        # Retrieve context
        past_events = await get_user_context(user_id, current_utterance, top_k=5)
        user_profile = await get_user_profile(user_id)
        knowledge_chunks = await domain_knowledge_search(current_utterance, top_k=3)
        
        # Generate response
        llm_response = await generate_response(user_profile, past_events, knowledge_chunks, current_utterance, domain="general")
        
        # Store life event async
        event = LifeEvent(
            user_id=user_id,
            timestamp=datetime.utcnow(),
            domain="general",
            utterance=current_utterance,
            summary=llm_response,
            embedding_text=current_utterance + " " + llm_response
        )
        await upsert_life_event(event)
        
        # Update risk scores
        signals = await extract_risk_signals(current_utterance)
        user_profile["risk_score_health"] = 0.7 * user_profile.get("risk_score_health", 0.0) + 0.3 * signals.get("health_risk", 0.0)
        user_profile["risk_score_financial"] = 0.7 * user_profile.get("risk_score_financial", 0.0) + 0.3 * signals.get("financial_risk", 0.0)
        user_profile["last_call_ts"] = datetime.utcnow().isoformat()
        
        if "entitlements_identified" not in user_profile:
            user_profile["entitlements_identified"] = []
        if "entitlements_claimed" not in user_profile:
            user_profile["entitlements_claimed"] = []
            
        await update_user_profile(user_id, user_profile)
        
        return {
            "messageResponse": {
                "results": [{"toolCallId": msg.get("toolCallId") for msg in messages if msg.get("role") == "tool"}],
                "error": None
            },
            "response": {
                "message": llm_response
            }
        }
        
    return {"status": "ignored"}

@app.post("/webhook/vapi/call-end")
async def vapi_call_end(request: Request):
    payload = await request.json()
    # Handle post call logic
    return {"status": "ok"}

@app.get("/users/{user_id}/life-graph")
async def get_life_graph(user_id: str):
    user_profile = await get_user_profile(user_id)
    # Get last events
    results = client.scroll(
        collection_name='life_events',
        scroll_filter=models.Filter(
            must=[models.FieldCondition(key='user_id', match=models.MatchValue(value=user_id))]
        ),
        limit=20,
        with_payload=True
    )
    events = [r.payload for r in results[0]]
    # Sort events by ts
    events.sort(key=lambda x: x.get("timestamp"), reverse=True)
    
    return {
        "profile": user_profile,
        "events": events
    }

@app.get("/users/{user_id}/profile")
async def get_profile(user_id: str):
    return await get_user_profile(user_id)

@app.post("/admin/knowledge/seed")
async def seed_knowledge():
    seed_domain_knowledge()
    return {"status": "success", "message": "Knowledge seeded."}

@app.get("/admin/stats")
async def get_stats():
    # Return mock stats for dashboard
    return {
        "total_calls_today": 243,
        "active_users": 12400,
        "proactive_calls_sent": 89,
        "issues_resolved_percent": 94
    }

@app.get("/proactive/pending")
async def get_pending_proactive():
    results = client.scroll(
        collection_name='proactive_triggers',
        limit=50,
        with_payload=True
    )
    return [r.payload for r in results[0]]

# Helper for frontend mocking
@app.get("/users")
async def get_all_users():
    results = client.scroll(
        collection_name='user_profiles',
        limit=50,
        with_payload=True
    )
    return [r.payload for r in results[0]]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
