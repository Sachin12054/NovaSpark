/**
 * NovaSpark Canonical Campaign Simulation Constants
 * Single source of truth for all simulation metrics.
 */
export const CAMPAIGN_CONFIG = {
  TARGET_REGISTRATIONS: 500,
  CURRENT_REGISTRATIONS: 327,
  GOAL_ACHIEVED_PCT: 65.4,
  REGISTRATIONS_REMAINING: 173,
  SEATS_LEFT: 173,
  TOTAL_BUDGET_INR: 2000.0,
  BUDGET_SPENT_INR: 1250.0,
  BUDGET_REMAINING_INR: 750.0,
  BLENDED_CPA_INR: 3.82,
  TARGET_CPA_LABEL: '< ₹4.00',
  VIRAL_K_FACTOR: 0.26,
  TOTAL_DAYS: 7,
  CURRENT_DAY: 6,
  REMAINING_DAYS: 1,
  
  // Exact Channel Breakdown (Sum = 327, Spend Sum = ₹1,250.00)
  CHANNELS: [
    { channel: "WhatsApp Groups", registrations: 76, conversion_rate: 18.4, cost_inr: 250.0, cost_per_reg: 3.29 },
    { channel: "Campus Referrals", registrations: 67, conversion_rate: 24.2, cost_inr: 0.0, cost_per_reg: 0.0 },
    { channel: "Organic / Direct", registrations: 91, conversion_rate: 12.5, cost_inr: 0.0, cost_per_reg: 0.0 },
    { channel: "College Tech Clubs", registrations: 38, conversion_rate: 15.1, cost_inr: 400.0, cost_per_reg: 10.53 },
    { channel: "Email Newsletters", registrations: 31, conversion_rate: 4.2, cost_inr: 350.0, cost_per_reg: 11.29 },
    { channel: "Instagram / LinkedIn", registrations: 24, conversion_rate: 6.8, cost_inr: 250.0, cost_per_reg: 10.42 },
  ],

  // 7-Day Velocity Tracking
  DAILY_TRENDS: [
    { day: "Day 1", day_number: 1, target_cumulative: 71, actual_cumulative: 45, daily_registrations: 45 },
    { day: "Day 2", day_number: 2, target_cumulative: 142, actual_cumulative: 98, daily_registrations: 53 },
    { day: "Day 3", day_number: 3, target_cumulative: 214, actual_cumulative: 154, daily_registrations: 56 },
    { day: "Day 4", day_number: 4, target_cumulative: 285, actual_cumulative: 220, daily_registrations: 66 },
    { day: "Day 5", day_number: 5, target_cumulative: 357, actual_cumulative: 285, daily_registrations: 65 },
    { day: "Day 6 (Today)", day_number: 6, target_cumulative: 428, actual_cumulative: 327, daily_registrations: 42 },
    { day: "Day 7 (Sprint End)", day_number: 7, target_cumulative: 500, actual_cumulative: 0, daily_registrations: 0 },
  ]
};
