import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, Text
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    college = Column(String(150), nullable=False)
    branch = Column(String(100), nullable=False)
    year = Column(String(50), nullable=False) # e.g. "Final Year", "3rd Year"
    referral_code = Column(String(30), unique=True, index=True, nullable=False)
    referred_by = Column(String(30), nullable=True, index=True) # Referral code used during signup
    source = Column(String(50), default="Organic") # Organic, Referral, WhatsApp, College Clubs, Email, Other
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    referrals_made = relationship("Referral", foreign_keys="Referral.referrer_id", back_populates="referrer")
    referred_in = relationship("Referral", foreign_keys="Referral.referred_student_id", back_populates="referred_student", uselist=False)

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    referrer_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    referred_student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    status = Column(String(20), default="confirmed") # confirmed, pending
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    referrer = relationship("Student", foreign_keys=[referrer_id], back_populates="referrals_made")
    referred_student = relationship("Student", foreign_keys=[referred_student_id], back_populates="referred_in")

class CampaignDailyMetric(Base):
    __tablename__ = "campaign_daily_metrics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    day_number = Column(Integer, nullable=False) # Day 1 to Day 7
    date_str = Column(String(30), nullable=False)
    target_cumulative = Column(Integer, default=0)
    actual_cumulative = Column(Integer, default=0)
    daily_registrations = Column(Integer, default=0)
    referral_shares = Column(Integer, default=0)
