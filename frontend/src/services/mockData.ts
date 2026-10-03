import { GrowthAnalyticsResponse, LeaderboardResponse, ProjectRecommendation } from '../types';

export const INITIAL_ANALYTICS: GrowthAnalyticsResponse = {
  total_registrations: 327,
  target_registrations: 500,
  registration_rate_pct: 65.4,
  budget_total_inr: 2000.0,
  budget_spent_inr: 1250.0,
  cost_per_reg_overall: 3.82,
  referral_registrations: 84,
  organic_registrations: 121,
  whatsapp_registrations: 96,
  college_clubs_registrations: 51,
  email_registrations: 35,
  other_registrations: 24,
  viral_coefficient_k: 0.26,
  simulation_mode: true,
  daily_trends: [
    { day: "Day 1", day_number: 1, target_cumulative: 71, actual_cumulative: 45, daily_registrations: 45 },
    { day: "Day 2", day_number: 2, target_cumulative: 142, actual_cumulative: 98, daily_registrations: 53 },
    { day: "Day 3", day_number: 3, target_cumulative: 214, actual_cumulative: 154, daily_registrations: 56 },
    { day: "Day 4", day_number: 4, target_cumulative: 285, actual_cumulative: 220, daily_registrations: 66 },
    { day: "Day 5", day_number: 5, target_cumulative: 357, actual_cumulative: 285, daily_registrations: 65 },
    { day: "Day 6 (Today)", day_number: 6, target_cumulative: 428, actual_cumulative: 327, daily_registrations: 42 },
    { day: "Day 7 (Sprint End)", day_number: 7, target_cumulative: 500, actual_cumulative: 0, daily_registrations: 0 },
  ],
  channel_performance: [
    { channel: "WhatsApp Groups", registrations: 96, conversion_rate: 18.4, cost_inr: 300.0, cost_per_reg: 3.12 },
    { channel: "Campus Referrals", registrations: 84, conversion_rate: 24.2, cost_inr: 0.0, cost_per_reg: 0.0 },
    { channel: "Organic / Direct", registrations: 121, conversion_rate: 12.5, cost_inr: 0.0, cost_per_reg: 0.0 },
    { channel: "College Tech Clubs", registrations: 51, conversion_rate: 15.1, cost_inr: 400.0, cost_per_reg: 7.84 },
    { channel: "Email Newsletters", registrations: 35, conversion_rate: 4.2, cost_inr: 350.0, cost_per_reg: 10.00 },
    { channel: "Instagram / LinkedIn", registrations: 24, conversion_rate: 6.8, cost_inr: 200.0, cost_per_reg: 8.33 },
  ]
};

export const INITIAL_LEADERBOARD: LeaderboardResponse = {
  top_referrers: [
    { rank: 1, student_name: "Arjun Sharma", college: "VIT Vellore", branch: "CSE", referral_count: 24 },
    { rank: 2, student_name: "Priya Patel", college: "Amrita University", branch: "AI & Data Science", referral_count: 19 },
    { rank: 3, student_name: "Rahul Verma", college: "SRM University", branch: "CSE", referral_count: 17 },
    { rank: 4, student_name: "Ananya Reddy", college: "IIT Madras", branch: "ECE", referral_count: 14 },
    { rank: 5, student_name: "Karthik Iyer", college: "BITS Pilani", branch: "IT", referral_count: 11 },
    { rank: 6, student_name: "Neha Gupta", college: "DTU Delhi", branch: "CSE", referral_count: 9 },
    { rank: 7, student_name: "Sachin Kumar", college: "RVCE Bangalore", branch: "CSE", referral_count: 7 },
  ],
  total_participants: 327,
  milestone_tiers: [
    { milestone: 3, reward: "AI Starter Toolkit & Certificate", icon: "award" },
    { milestone: 5, reward: "Production Python AI Boilerplate Repo", icon: "code" },
    { milestone: 10, reward: "1-on-1 AI Resume & Portfolio Review", icon: "sparkles" },
    { milestone: 20, reward: "Direct Fast-Track Interview Recommendation", icon: "zap" }
  ]
};

export const SAMPLE_PROJECT: ProjectRecommendation = {
  project_title: "AI Resume Analyzer & ATS Score Matcher",
  tagline: "Upload a PDF resume and job description to get instant match scores, gap analysis, and tailored AI suggestions.",
  difficulty: "Beginner",
  estimated_build_time: "60 minutes",
  tech_stack: ["Python", "FastAPI", "LLM API", "Tailwind UI"],
  what_you_will_learn: [
    "Extracting and parsing text from PDF resumes with PyPDF2",
    "Designing structured system prompts for semantic job matching",
    "Connecting an LLM API to a clean student web interface",
    "Displaying visual score badges and skill gap breakdowns"
  ],
  why_this_fits_you: "You selected beginner-level AI and showed interest in web applications. This builds a tangible tool every college student can showcase.",
  prerequisites: "Basic Python syntax (variables, functions, API requests)",
  starter_code_preview: "import google.generativeai as genai\n\ndef analyze_resume(resume_text, job_desc):\n    prompt = f'Analyze this resume for this job:\\n{job_desc}\\nResume:\\n{resume_text}'\n    response = model.generate_content(prompt)\n    return response.text",
  cta_text: "Build This at the Workshop"
};
