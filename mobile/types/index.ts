export interface Student {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  referral_code: string;
  referred_by?: string;
  source: string;
  created_at: string;
  referral_count?: number;
  rank?: number;
}

export interface StudentRegistrationInput {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  referral_code_used?: string;
  source?: string;
  auth_uid?: string;
}

export interface ReferralDetail {
  id: string | number;
  referred_student_name: string;
  referred_student_college: string;
  date: string;
  status: string;
}

export interface StudentReferralStats {
  student_id: string | number;
  name: string;
  referral_code: string;
  total_referrals: number;
  rank: number;
  next_milestone: number;
  referrals_needed_for_milestone: number;
  recent_referrals: ReferralDetail[];
}

export interface LeaderboardEntry {
  rank: number;
  student_name: string;
  college: string;
  branch: string;
  referral_count: number;
  is_current_user?: boolean;
}

export interface CollegeLeaderboardEntry {
  rank: number;
  college_name: string;
  total_referrals: number;
  student_count: number;
}

export interface LeaderboardResponse {
  top_referrers: LeaderboardEntry[];
  top_colleges?: CollegeLeaderboardEntry[];
  user_rank?: LeaderboardEntry;
  total_participants: number;
  milestone_tiers: {
    milestone: number;
    reward: string;
    icon: string;
  }[];
}

export interface ProjectRecommendation {
  project_title: string;
  tagline: string;
  difficulty: string;
  estimated_build_time: string;
  tech_stack: string[];
  what_you_will_learn: string[];
  why_this_fits_you: string;
  prerequisites: string;
  starter_code_preview?: string;
  cta_text: string;
}

export interface ProjectRecommendInput {
  branch: string;
  year: string;
  coding_experience: string;
  preferred_area: string;
  ai_experience: string;
  what_to_build?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggested_actions?: string[];
  recommended_project?: ProjectRecommendation;
  quick_cta?: {
    label: string;
    action: string;
  };
}

export interface ChannelMetric {
  channel: string;
  registrations: number;
  conversion_rate: number;
  cost_inr: number;
  cost_per_reg: number;
}

export interface DailyProgress {
  day: string;
  day_number: number;
  target_cumulative: number;
  actual_cumulative: number;
  daily_registrations: number;
}

export interface GrowthAnalyticsResponse {
  total_registrations: number;
  target_registrations: number;
  registration_rate_pct: number;
  budget_total_inr: number;
  budget_spent_inr: number;
  cost_per_reg_overall: number;
  referral_registrations: number;
  organic_registrations: number;
  whatsapp_registrations: number;
  college_clubs_registrations: number;
  email_registrations: number;
  other_registrations: number;
  viral_coefficient_k: number;
  daily_trends: DailyProgress[];
  channel_performance: ChannelMetric[];
  simulation_mode: boolean;
}

export interface GrowthCopilotResponse {
  analysis: string;
  key_findings: string[];
  recommended_experiments: {
    title: string;
    hypothesis: string;
    target_channel: string;
    estimated_impact: string;
    budget_needed: string;
  }[];
  generated_copy?: string;
}
