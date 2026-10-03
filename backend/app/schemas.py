from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Student Schemas
class StudentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    phone: str = Field(..., min_length=10, max_length=15)
    college: str = Field(..., min_length=2, max_length=150)
    branch: str = Field(..., min_length=2, max_length=100)
    year: str = Field(default="Final Year")
    referral_code_used: Optional[str] = None
    source: Optional[str] = "Organic"
    auth_uid: Optional[str] = None

class StudentResponse(BaseModel):
    id: Union[str, int]
    name: str
    email: str
    phone: str
    college: str
    branch: str
    year: str
    referral_code: str
    referred_by: Optional[str] = None
    source: str
    created_at: str
    referral_count: int = 0
    rank: Optional[int] = None

# Referral Stats
class ReferralDetail(BaseModel):
    id: Union[str, int]
    referred_student_name: str
    referred_student_college: str
    date: str
    status: str

class StudentReferralStats(BaseModel):
    student_id: Union[str, int]
    name: str
    referral_code: str
    total_referrals: int
    rank: int
    next_milestone: int
    referrals_needed_for_milestone: int
    recent_referrals: List[ReferralDetail]

# Leaderboard
class LeaderboardEntry(BaseModel):
    rank: int
    student_name: str
    college: str
    branch: str
    referral_count: int
    is_current_user: bool = False

class CollegeLeaderboardEntry(BaseModel):
    rank: int
    college_name: str
    total_referrals: int
    student_count: int

class LeaderboardResponse(BaseModel):
    top_referrers: List[LeaderboardEntry]
    top_colleges: Optional[List[CollegeLeaderboardEntry]] = None
    user_rank: Optional[LeaderboardEntry] = None
    total_participants: int
    milestone_tiers: List[Dict[str, Any]]

# Project Recommendation
class ProjectRecommendRequest(BaseModel):
    branch: str
    year: str
    coding_experience: str
    preferred_area: str
    ai_experience: str
    what_to_build: Optional[str] = None

class ProjectRecommendation(BaseModel):
    project_title: str
    tagline: str
    difficulty: str
    estimated_build_time: str
    tech_stack: List[str]
    what_you_will_learn: List[str]
    why_this_fits_you: str
    prerequisites: str
    starter_code_preview: Optional[str] = None
    cta_text: str = "Build This at the Workshop"

# Chatbot
class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    user_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = []
    recommended_project: Optional[ProjectRecommendation] = None
    quick_cta: Optional[Dict[str, str]] = None

# Growth Analytics
class ChannelMetric(BaseModel):
    channel: str
    registrations: int
    conversion_rate: float
    cost_inr: float
    cost_per_reg: float

class DailyProgress(BaseModel):
    day: str
    day_number: int
    target_cumulative: int
    actual_cumulative: int
    daily_registrations: int

class GrowthAnalyticsResponse(BaseModel):
    total_registrations: int
    target_registrations: int = 500
    registration_rate_pct: float
    budget_total_inr: float = 2000.0
    budget_spent_inr: float = 1250.0
    cost_per_reg_overall: float
    referral_registrations: int
    organic_registrations: int
    whatsapp_registrations: int
    college_clubs_registrations: int
    email_registrations: int
    other_registrations: int
    viral_coefficient_k: float
    daily_trends: List[DailyProgress]
    channel_performance: List[ChannelMetric]
    simulation_mode: bool = True

# Growth Copilot
class GrowthCopilotRequest(BaseModel):
    action_type: str = "insights"
    custom_prompt: Optional[str] = None

class GrowthCopilotResponse(BaseModel):
    analysis: str
    key_findings: List[str]
    recommended_experiments: List[Dict[str, Any]]
    generated_copy: Optional[str] = None

# Event Tracking Telemetry
class CampaignEventCreate(BaseModel):
    eventType: str # PAGE_VIEW, PROJECT_GENERATED, CHAT_STARTED, REGISTRATION_STARTED, REGISTRATION_COMPLETED, REFERRAL_CREATED, WHATSAPP_SHARE, LEADERBOARD_VIEWED, PROJECT_CTA_CLICKED
    studentId: Optional[str] = None
    source: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
