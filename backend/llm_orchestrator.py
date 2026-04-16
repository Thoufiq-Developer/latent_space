import os
import json
from openai import AsyncOpenAI
import logging

logger = logging.getLogger(__name__)

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4-turbo")

async def generate_response(user_profile: dict, past_events: list[dict], knowledge_chunks: list[dict], current_utterance: str, domain: str = "general") -> str:
    system_prompt = f"""
You are VAANI, a warm and caring voice AI companion for rural and underserved communities in India.
You speak {user_profile.get('language', 'Hindi')} ({user_profile.get('dialect', 'standard')} dialect). You ALWAYS address the user by their first name ({user_profile.get('name', 'User')}).
You NEVER use jargon. You explain everything as if talking to a respected elder who has never used technology.
You are patient, never rush, and ask only ONE question at a time.
You remember everything the user has told you. If they mention something from a past call, acknowledge it.
You are proactive: if you notice a health or financial risk in what they say, gently surface it.
You speak in short sentences. Max 3 sentences per response. Always end with a question or a clear next step.
Current domain context: {domain}
"""

    past_events_text = "\n".join([f"- {ev.get('summary', ev.get('utterance', ''))}" for ev in past_events])
    knowledge_text = "\n".join([f"- {k.get('content', '')}" for k in knowledge_chunks])
    
    user_context = f"""
User profile: Name={user_profile.get('name')}, Age={user_profile.get('age')}, Village={user_profile.get('village')}, Language={user_profile.get('language')},
Health conditions={user_profile.get('health_conditions', [])}, Financial tier={user_profile.get('financial_tier')}
Risk scores: Health={user_profile.get('risk_score_health', 0.0)}/1.0, Financial={user_profile.get('risk_score_financial', 0.0)}/1.0
Entitlements not yet claimed: {set(user_profile.get('entitlements_identified', [])) - set(user_profile.get('entitlements_claimed', []))}
Recent life events (from memory):
{past_events_text}
Relevant knowledge:
{knowledge_text}
"""

    try:
        response = await openai_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt + "\n" + user_context},
                {"role": "user", "content": current_utterance}
            ],
            max_tokens=250,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error calling LLM: {e}")
        return "I'm sorry, I am having trouble understanding you right now. Can we talk again in a little while?"

async def extract_risk_signals(transcript: str) -> dict:
    prompt = f"""
From this call transcript, extract risk signals as JSON:
{{ "health_risk": 0.0-1.0, "financial_risk": 0.0-1.0, "triggers": ["list of concern keywords"] }}

Transcript:
{transcript}
"""
    try:
        response = await openai_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"Error extracting risk signals: {e}")
        return {"health_risk": 0.0, "financial_risk": 0.0, "triggers": []}
