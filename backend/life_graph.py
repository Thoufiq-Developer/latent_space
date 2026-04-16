import os
import time
import uuid
from datetime import datetime
from openai import AsyncOpenAI
from qdrant_client import models
from qdrant_db import client
from models import UserProfile, LifeEvent

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

async def embed(text: str) -> list[float]:
    try:
        response = await openai_client.embeddings.create(input=text, model=EMBEDDING_MODEL)
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error embedding text: {e}")
        return [0.0] * 1536  # Fallback

async def get_user_context(user_id: str, query: str, top_k: int = 5) -> list[dict]:
    query_vector = await embed(query)
    results = client.search(
        collection_name='life_events',
        query_vector=query_vector,
        query_filter=models.Filter(
            must=[models.FieldCondition(
                key='user_id', match=models.MatchValue(value=user_id)
            )]
        ),
        limit=top_k,
        with_payload=True
    )
    return [r.payload for r in results]

async def get_user_profile(user_id: str) -> dict:
    results = client.scroll(
        collection_name='user_profiles',
        scroll_filter=models.Filter(
            must=[models.FieldCondition(
                key='user_id', match=models.MatchValue(value=user_id)
            )]
        ),
        limit=1,
        with_payload=True
    )
    if results[0]:
        return results[0][0].payload
    
    # Default newly created profile
    return {
        "user_id": user_id,
        "name": "User",
        "language": "hi",
        "health_conditions": [],
        "risk_score_health": 0.0,
        "risk_score_financial": 0.0,
        "entitlements_identified": [],
        "entitlements_claimed": []
    }

async def update_user_profile(user_id: str, profile_data: dict):
    # Dummy text to embed
    embedding_text = f"User profile for {user_id}. {profile_data.get('language', '')} {','.join(profile_data.get('health_conditions', []))}"
    vector = await embed(embedding_text)
    
    client.upsert(
        collection_name='user_profiles',
        points=[
            models.PointStruct(
                id=str(uuid.uuid5(uuid.NAMESPACE_DNS, user_id)),
                vector=vector,
                payload=profile_data
            )
        ]
    )

async def upsert_life_event(event: LifeEvent):
    vector = await embed(event.embedding_text)
    client.upsert(
        collection_name='life_events',
        points=[
            models.PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload=event.model_dump()
            )
        ]
    )

async def domain_knowledge_search(query: str, top_k: int = 3) -> list[dict]:
    query_vector = await embed(query)
    results = client.search(
        collection_name='domain_knowledge',
        query_vector=query_vector,
        limit=top_k,
        with_payload=True
    )
    return [r.payload for r in results]
