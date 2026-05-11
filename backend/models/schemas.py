from pydantic import BaseModel
from typing import Optional
from enum import Enum

class SeverityEnum(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ExtractedIncident(BaseModel):
    intent: str
    severity: SeverityEnum
    location: str

class TwilioWebhookPayload(BaseModel):
    SmsMessageSid: str
    NumMedia: str
    ProfileName: Optional[str] = None
    SmsSid: str
    WaId: str
    SmsStatus: str
    Body: str
    To: str
    NumSegments: str
    MessageSid: str
    AccountSid: str
    From: str
    ApiVersion: str
    MediaUrl0: Optional[str] = None
    MediaContentType0: Optional[str] = None
