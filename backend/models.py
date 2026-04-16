from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class LifeEvent(BaseModel):
    user_id: str
    timestamp: datetime
    domain: str
    utterance: str
    summary: str
    embedding_text: str

class UserProfile(BaseModel):
    user_id: str
    name: Optional[str] = None
    language: Optional[str] = None
    dialect: Optional[str] = None
    village: Optional[str] = None
    age: Optional[int] = None
    literacy_level: Optional[str] = None
    preferred_call_time: Optional[str] = None
    health_conditions: List[str] = Field(default_factory=list)
    financial_tier: Optional[str] = None
    risk_score_health: float = 0.0
    risk_score_financial: float = 0.0
    risk_score_seasonal: float = 0.0
    last_call_ts: Optional[str] = None  # Using ISO string for easier comparison
    entitlements_identified: List[str] = Field(default_factory=list)
    entitlements_claimed: List[str] = Field(default_factory=list)

class DomainKnowledge(BaseModel):
    domain: str
    title: str
    content: str
    language: str
    source: str
    chunk_id: str

class ProactiveTrigger(BaseModel):
    user_id: str
    trigger_type: str
    trigger_reason: str
    scheduled_ts: str
    status: str
    call_script: str
    vapi_call_id: Optional[str] = None

class VapiCallCustomer(BaseModel):
    number: Optional[str] = None

class VapiCall(BaseModel):
    id: str
    customer: Optional[VapiCallCustomer] = None

class VapiMessage(BaseModel):
    role: str
    content: str

class VapiWebhookPayload(BaseModel):
    message: Dict[str, Any]
