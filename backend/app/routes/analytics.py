from datetime import datetime
from fastapi import APIRouter, status
from ..firebase import get_firestore
from ..schemas import (
    GrowthAnalyticsResponse,
    DailyProgress,
    ChannelMetric,
    GrowthCopilotRequest,
    GrowthCopilotResponse,
    CampaignEventCreate
)
from ..ai.service import ai_service

router = APIRouter(prefix="/api", tags=["Growth Analytics & AI Copilot"])

@router.post("/events", status_code=status.HTTP_201_CREATED)
def track_campaign_event(event: CampaignEventCreate):
    """Telemetry endpoint for growth funnel events."""
    db = get_firestore()
    events_col = db.collection("campaign_events")
    now_iso = datetime.utcnow().isoformat()
    
    events_col.add({
        "eventType": event.eventType,
        "studentId": event.studentId,
        "source": event.source or "Organic",
        "metadata": event.metadata or {},
        "createdAt": now_iso
    })
    return {"status": "recorded", "eventType": event.eventType, "timestamp": now_iso}

@router.get("/stats", response_model=GrowthAnalyticsResponse)
def get_growth_stats():
    total_regs = 327
    budget_spent = 1250.0
    cost_per_reg = round(budget_spent / total_regs, 2) # 3.82
    k_factor = 0.26

    # Channels strictly summing to 327 registrations and ₹1,250 spend
    channels = [
        ChannelMetric(channel="WhatsApp Groups", registrations=76, conversion_rate=18.4, cost_inr=250.0, cost_per_reg=3.29),
        ChannelMetric(channel="Campus Referrals", registrations=67, conversion_rate=24.2, cost_inr=0.0, cost_per_reg=0.0),
        ChannelMetric(channel="Organic / Direct", registrations=91, conversion_rate=12.5, cost_inr=0.0, cost_per_reg=0.0),
        ChannelMetric(channel="College Tech Clubs", registrations=38, conversion_rate=15.1, cost_inr=400.0, cost_per_reg=10.53),
        ChannelMetric(channel="Email Newsletters", registrations=31, conversion_rate=4.2, cost_inr=350.0, cost_per_reg=11.29),
        ChannelMetric(channel="Instagram / LinkedIn", registrations=24, conversion_rate=6.8, cost_inr=250.0, cost_per_reg=10.42),
    ]

    daily_trends = [
        DailyProgress(day="Day 1", day_number=1, target_cumulative=71, actual_cumulative=45, daily_registrations=45),
        DailyProgress(day="Day 2", day_number=2, target_cumulative=142, actual_cumulative=98, daily_registrations=53),
        DailyProgress(day="Day 3", day_number=3, target_cumulative=214, actual_cumulative=154, daily_registrations=56),
        DailyProgress(day="Day 4", day_number=4, target_cumulative=285, actual_cumulative=220, daily_registrations=66),
        DailyProgress(day="Day 5", day_number=5, target_cumulative=357, actual_cumulative=285, daily_registrations=65),
        DailyProgress(day="Day 6 (Today)", day_number=6, target_cumulative=428, actual_cumulative=327, daily_registrations=42),
        DailyProgress(day="Day 7 (Sprint End)", day_number=7, target_cumulative=500, actual_cumulative=0, daily_registrations=0),
    ]

    return GrowthAnalyticsResponse(
        total_registrations=total_regs,
        target_registrations=500,
        registration_rate_pct=65.4,
        budget_total_inr=2000.0,
        budget_spent_inr=budget_spent,
        cost_per_reg_overall=cost_per_reg,
        referral_registrations=67,
        organic_registrations=91,
        whatsapp_registrations=76,
        college_clubs_registrations=38,
        email_registrations=31,
        other_registrations=24,
        viral_coefficient_k=k_factor,
        daily_trends=daily_trends,
        channel_performance=channels,
        simulation_mode=True
    )

@router.post("/growth/copilot", response_model=GrowthCopilotResponse)
async def get_growth_copilot(request: GrowthCopilotRequest):
    return await ai_service.growth_copilot(request.action_type, request.custom_prompt)

@router.get("/sources")
def get_sources():
    return [
        "Organic",
        "Referral",
        "WhatsApp",
        "College Clubs",
        "Email",
        "Instagram / LinkedIn"
    ]
