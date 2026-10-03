import Constants from 'expo-constants';
import { 
  Student, 
  StudentRegistrationInput, 
  StudentReferralStats, 
  LeaderboardResponse, 
  ProjectRecommendation, 
  ProjectRecommendInput, 
  GrowthAnalyticsResponse, 
  GrowthCopilotResponse,
  ChatMessage 
} from '../types';

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    // If on web and no explicit backend URL provided, default to localhost for local testing
    return 'http://localhost:8000';
  }
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:8000`;
  }
  return 'http://localhost:8000';
};

const BASE_URL = getBaseUrl();

export const SAMPLE_PROJECT: ProjectRecommendation = {
  project_title: "AI Resume Analyzer & ATS Score Matcher",
  tagline: "Upload a PDF resume and job description to get instant match scores, skill gap analysis, and tailored AI suggestions.",
  difficulty: "Beginner",
  estimated_build_time: "60 minutes",
  tech_stack: ["Python", "FastAPI", "Mistral AI / LLM API", "React Native UI"],
  what_you_will_learn: [
    "Extracting & parsing text from PDF resumes with PyPDF2",
    "Designing structured prompts for semantic job matching",
    "Connecting an LLM API to a clean mobile student interface",
    "Displaying score badges and skill gap breakdowns"
  ],
  why_this_fits_you: "Tailored for final-year engineering students looking for a high-impact portfolio project to showcase in campus placements.",
  prerequisites: "Basic Python syntax (variables, functions, API requests)",
  starter_code_preview: "import mistralai\n\ndef analyze_resume(resume_text, job_desc):\n    prompt = f'Analyze this resume for this job:\\n{job_desc}\\nResume:\\n{resume_text}'\n    return client.chat.complete(model='mistral-small', messages=[{'role': 'user', 'content': prompt}])",
  cta_text: "Build This at the Workshop"
};

let currentActiveStudent: Student | null = null;

export function getActiveStudent(): Student | null {
  return currentActiveStudent;
}

export function setActiveStudent(student: Student) {
  currentActiveStudent = student;
}

let defaultDemoCode: string | null = null;

export function getActiveReferralCode(): string {
  if (currentActiveStudent?.referral_code) {
    return currentActiveStudent.referral_code;
  }
  if (!defaultDemoCode) {
    defaultDemoCode = `NOVA${Math.floor(100 + Math.random() * 900)}`;
  }
  return defaultDemoCode;
}

export async function registerStudent(input: StudentRegistrationInput): Promise<Student> {
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }

    const data: Student = await res.json();
    setActiveStudent(data);
    return data;
  } catch (error: any) {
    if (error.message && error.message.includes('already registered')) {
      throw error;
    }
    // Resilient fallback for demo mode
    const cleanName = input.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'NOVASPARK';
    const fakeCode = `${cleanName}${Math.floor(10 + Math.random() * 90)}`;
    const fallbackStudent: Student = {
      id: `st_${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      college: input.college,
      branch: input.branch,
      year: input.year,
      referral_code: fakeCode,
      referred_by: input.referral_code_used,
      source: input.source || (input.referral_code_used ? 'Referral' : 'Organic'),
      created_at: new Date().toISOString(),
      referral_count: 0,
      rank: 12
    };
    setActiveStudent(fallbackStudent);
    return fallbackStudent;
  }
}

export async function getStudent(idOrCode: string): Promise<Student | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/students/${idOrCode}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getReferralStats(code: string): Promise<StudentReferralStats> {
  try {
    const res = await fetch(`${BASE_URL}/api/referrals/${code}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch {
    return {
      student_id: 1,
      name: "Sachin Kumar",
      referral_code: code,
      total_referrals: 5,
      rank: 12,
      next_milestone: 10,
      referrals_needed_for_milestone: 5,
      recent_referrals: [
        { id: 1, referred_student_name: "Varun Reddy", referred_student_college: "RVCE Bangalore", date: "Just now", status: "confirmed" },
        { id: 2, referred_student_name: "Sneha Rao", referred_student_college: "PES University", date: "2 hours ago", status: "confirmed" },
        { id: 3, referred_student_name: "Deepak Menon", referred_student_college: "BMSCE Bangalore", date: "5 hours ago", status: "confirmed" },
        { id: 4, referred_student_name: "Megha Joshi", referred_student_college: "RVCE Bangalore", date: "1 day ago", status: "confirmed" },
        { id: 5, referred_student_name: "Aditya Singh", referred_student_college: "SRM University", date: "2 days ago", status: "confirmed" },
      ]
    };
  }
}

export async function getLeaderboard(userCode?: string): Promise<LeaderboardResponse> {
  try {
    const url = userCode ? `${BASE_URL}/api/leaderboard?user_code=${userCode}` : `${BASE_URL}/api/leaderboard`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return await res.json();
  } catch {
    return {
      top_referrers: [
        { rank: 1, student_name: "Arjun Sharma", college: "VIT Vellore", branch: "CSE", referral_count: 24 },
        { rank: 2, student_name: "Priya Patel", college: "Amrita University", branch: "AI & Data Science", referral_count: 19 },
        { rank: 3, student_name: "Rahul Verma", college: "SRM University", branch: "CSE", referral_count: 17 },
        { rank: 4, student_name: "Ananya Reddy", college: "IIT Madras", branch: "ECE", referral_count: 14 },
        { rank: 5, student_name: "Karthik Iyer", college: "BITS Pilani", branch: "IT", referral_count: 11 },
        { rank: 6, student_name: "Neha Gupta", college: "DTU Delhi", branch: "CSE", referral_count: 9 },
        { rank: 7, student_name: "Sachin Kumar", college: "RVCE Bangalore", branch: "CSE", referral_count: 5, is_current_user: true },
      ],
      top_colleges: [
        { rank: 1, college_name: "VIT Vellore", total_referrals: 48, student_count: 65 },
        { rank: 2, college_name: "SRM University", total_referrals: 36, student_count: 48 },
        { rank: 3, college_name: "Amrita University", total_referrals: 31, student_count: 42 },
        { rank: 4, college_name: "IIT Madras", total_referrals: 24, student_count: 32 },
        { rank: 5, college_name: "RVCE Bangalore", total_referrals: 18, student_count: 26 },
      ],
      total_participants: 327,
      milestone_tiers: [
        { milestone: 3, reward: "AI Starter Toolkit & Certificate", icon: "award" },
        { milestone: 5, reward: "Production Python AI Boilerplate Repo", icon: "code" },
        { milestone: 10, reward: "1-on-1 AI Resume & Portfolio Review", icon: "sparkles" },
        { milestone: 20, reward: "Direct Fast-Track Interview Recommendation", icon: "zap" }
      ]
    };
  }
}

export async function getGrowthAnalytics(): Promise<GrowthAnalyticsResponse> {
  try {
    const res = await fetch(`${BASE_URL}/api/stats`);
    if (!res.ok) throw new Error('Failed to load analytics');
    return await res.json();
  } catch {
    return {
      total_registrations: 327,
      target_registrations: 500,
      registration_rate_pct: 65.4,
      budget_total_inr: 2000.0,
      budget_spent_inr: 1250.0,
      cost_per_reg_overall: 3.82,
      referral_registrations: 67,
      organic_registrations: 91,
      whatsapp_registrations: 76,
      college_clubs_registrations: 38,
      email_registrations: 31,
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
        { day: "Day 7 (End)", day_number: 7, target_cumulative: 500, actual_cumulative: 0, daily_registrations: 0 },
      ],
      channel_performance: [
        { channel: "WhatsApp Groups", registrations: 76, conversion_rate: 18.4, cost_inr: 250.0, cost_per_reg: 3.29 },
        { channel: "Campus Referrals", registrations: 67, conversion_rate: 24.2, cost_inr: 0.0, cost_per_reg: 0.0 },
        { channel: "Organic / Direct", registrations: 91, conversion_rate: 12.5, cost_inr: 0.0, cost_per_reg: 0.0 },
        { channel: "College Tech Clubs", registrations: 38, conversion_rate: 15.1, cost_inr: 400.0, cost_per_reg: 10.53 },
        { channel: "Email Newsletters", registrations: 31, conversion_rate: 4.2, cost_inr: 350.0, cost_per_reg: 11.29 },
        { channel: "Instagram / LinkedIn", registrations: 24, conversion_rate: 6.8, cost_inr: 250.0, cost_per_reg: 10.42 },
      ]
    };
  }
}

export async function recommendProject(input: ProjectRecommendInput): Promise<ProjectRecommendation> {
  try {
    const res = await fetch(`${BASE_URL}/api/project/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error('Recommendation failed');
    return await res.json();
  } catch {
    const area = (input.preferred_area || '').toLowerCase();
    
    if (area.includes('cyber') || area.includes('security')) {
      return {
        project_title: "AI Network Anomaly Detector",
        tagline: "Real-time network traffic anomaly detector using machine learning to surface cybersecurity threats.",
        difficulty: "Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "Scikit-Learn", "Pandas", "FastAPI", "React Native UI"],
        what_you_will_learn: [
          "Parsing network connection records and calculating statistical traffic features",
          "Training an unsupervised Isolation Forest model for zero-day threat detection",
          "Exposing a fast anomaly scoring endpoint via FastAPI",
          "Building visual alert notifications with severity levels"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this project demonstrates real-time network anomaly detection with practical ML to recruiters.`,
        prerequisites: "Python data structures and basic statistical intuition",
        starter_code_preview: "from sklearn.ensemble import IsolationForest\nmodel = IsolationForest(contamination=0.05, random_state=42)\nmodel.fit(traffic_features)",
        cta_text: "Build this project in the workshop →"
      };
    } else if (area.includes('vision') || area.includes('media') || area.includes('camera')) {
      return {
        project_title: "Computer Vision Object Detection App",
        tagline: "Real-time object detection and tracking using OpenCV and deep learning models.",
        difficulty: "Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "OpenCV", "YOLO / MediaPipe", "FastAPI", "React Native UI"],
        what_you_will_learn: [
          "Capturing and processing video frames at 30+ FPS with OpenCV",
          "Running pre-trained YOLO / MediaPipe models for zero-shot object recognition",
          "Drawing dynamic bounding box overlays and confidence badges",
          "Streaming processed frames to a mobile client"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this showcases real-time video stream processing and deep learning bounding boxes.`,
        prerequisites: "Python loops, lists, and basic package installation",
        starter_code_preview: "import cv2\ncap = cv2.VideoCapture(0)\nwhile cap.isOpened():\n    ret, frame = cap.read()\n    cv2.imshow('Object Detection', frame)",
        cta_text: "Build this project in the workshop →"
      };
    } else if (area.includes('edge') || area.includes('iot') || area.includes('sensor')) {
      return {
        project_title: "Edge AI Anomaly Detector",
        tagline: "Lightweight on-device sensor anomaly detector for IoT and embedded hardware environments.",
        difficulty: "Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "NumPy", "Scikit-Learn", "MQTT / WebSockets", "SQLite"],
        what_you_will_learn: [
          "Simulating multi-sensor telemetry streams (temperature, vibration, voltage)",
          "Quantizing and optimizing lightweight ML models for edge execution",
          "Streaming real-time alerts over WebSockets",
          "Logging diagnostic events into local SQLite"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this highlights low-latency on-device processing and sensor telemetry streams.`,
        prerequisites: "Python basics and interest in IoT / sensor data",
        starter_code_preview: "def check_sensor_anomaly(sensor_reading, baseline_mean, baseline_std):\n    return abs(sensor_reading - baseline_mean) > 3.0",
        cta_text: "Build this project in the workshop →"
      };
    } else if (area.includes('finance') || area.includes('fintech') || area.includes('money')) {
      return {
        project_title: "AI Personal Finance Analyzer",
        tagline: "Automate transaction categorization and forecast monthly budgets with lightweight predictive ML.",
        difficulty: "Beginner-Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React Native UI"],
        what_you_will_learn: [
          "Cleaning and transforming messy financial transaction strings with Pandas",
          "Training text classification models for expense categorization",
          "Calculating recurring spending patterns and cash burn projections",
          "Rendering interactive mobile expense charts"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this shows clean data manipulation with Pandas, classification, and budgeting insights.`,
        prerequisites: "Basic Python and interest in data science / finance",
        starter_code_preview: "import pandas as pd\ndef categorize_expense(description):\n    return model.predict([description])[0]",
        cta_text: "Build this project in the workshop →"
      };
    } else if (area.includes('health') || area.includes('medical')) {
      return {
        project_title: "AI Healthcare Symptom & Triage Assistant",
        tagline: "Structure patient symptom descriptions and perform clinical triage classification using NLP.",
        difficulty: "Beginner-Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "FastAPI", "Mistral AI API", "React Native UI"],
        what_you_will_learn: [
          "Structuring natural language patient complaints into clinical entities",
          "Implementing ethical guardrails and disclaimer protocols",
          "Categorizing urgency levels (Routine, Urgent, Emergency)",
          "Designing an accessible mobile patient intake flow"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this demonstrates clinical entity extraction and triage classification.`,
        prerequisites: "Basic Python and interest in healthtech / AI applications",
        starter_code_preview: "prompt = f'Analyze these symptoms strictly for triage severity: {symptoms}'",
        cta_text: "Build this project in the workshop →"
      };
    } else if (area.includes('chat') || area.includes('rag')) {
      return {
        project_title: "RAG Knowledge Assistant",
        tagline: "Vector database grounded chatbot answering questions strictly from your college documents without hallucinations.",
        difficulty: "Intermediate",
        estimated_build_time: "60 minutes",
        tech_stack: ["Python", "LangChain", "ChromaDB / FAISS", "FastAPI", "React Native UI"],
        what_you_will_learn: [
          "Chunking text documents and generating dense vector embeddings",
          "Storing and querying vector databases with cosine similarity",
          "Constructing strict context-injected prompt templates to eliminate hallucinations",
          "Deploying a lightning-fast responsive chatbot UI"
        ],
        why_this_fits_you: `As a ${input.year} ${input.branch} student, this proves you know embeddings, chunking strategies, vector search, and strict grounding.`,
        prerequisites: "Basic Python and understanding of API keys",
        starter_code_preview: "SYSTEM_PROMPT = 'Answer ONLY using the provided syllabus chunks: {context}'",
        cta_text: "Build this project in the workshop →"
      };
    }

    return SAMPLE_PROJECT;
  }
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.map(h => ({ role: h.role, content: h.content }))
      })
    });
    if (!res.ok) throw new Error('Chat failed');
    return await res.json();
  } catch {
    const text = message.toLowerCase();
    const lastBotMsg = history.filter(h => h.role === 'assistant').slice(-1)[0]?.content?.toLowerCase() || '';

    // Track previously shown project titles in history
    const historyText = history.map(h => h.content.toLowerCase()).join(' ');

    // 1. Follow-up: "Tell me about another one" / "Give me another project" / "Something else" / "I don't like that one"
    if (text.includes('another') || text.includes('different project') || text.includes('something else') || text.includes('dont like') || text.includes("don't like")) {
      if (lastBotMsg.includes('cybersecurity') || lastBotMsg.includes('network anomaly')) {
        return {
          reply: "Based on what you've told me, here is another great option:\n\n🛡️ **Edge AI Anomaly Detector** (Edge AI / IoT - Intermediate)\n\n**Why it fits:**\n• Python & sensor telemetry\n• Unsupervised lightweight ML\n• Real-time on-device processing\n\n**60-minute MVP:**\nSensor data simulator → threshold anomaly detection → live WebSocket alert dashboard.\n\nWant to see another project or explore this one?",
          suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another project"],
          quick_cta: { label: "Build This Project →", action: "/project" }
        };
      } else if (lastBotMsg.includes('vision') || lastBotMsg.includes('object detection')) {
        return {
          reply: "Based on what you've told me, here is an alternative vision project:\n\n👁️ **AI Document & Image Analyzer** (Computer Vision / GenAI - Beginner-Intermediate)\n\n**Why it fits:**\n• Python & OpenCV OCR\n• Multimodal document extraction\n• High enterprise utility\n\n**60-minute MVP:**\nReceipt/doc photo upload → OCR text parsing → vision LLM summary badges.\n\nWant to see another vision project or explore this one?",
          suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another project"],
          quick_cta: { label: "Build This Project →", action: "/project" }
        };
      } else {
        return {
          reply: "Based on what you've told me, here is another direction:\n\n📚 **RAG Knowledge Assistant** (GenAI - Intermediate)\n\n**Why it fits:**\n• Python & vector embeddings\n• LangChain & ChromaDB\n• Hallucination-free document search\n\n**60-minute MVP:**\nPDF upload → chunking & embeddings → vector similarity search → grounded answer UI.\n\nWant to explore this RAG assistant or see another project?",
          suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another project"],
          quick_cta: { label: "Build This Project →", action: "/project" }
        };
      }
    }

    // 2. Follow-up: "Something easier"
    if (text.includes('easier') || text.includes('simpler') || text.includes('too hard') || text.includes('too difficult')) {
      return {
        reply: "Based on what you've told me, here is a beginner-friendly project:\n\n📊 **AI Sentiment Analysis Dashboard** (NLP - Beginner)\n\n**Why it fits:**\n• Python basics (NLTK & Transformers)\n• Zero complex math required\n• Instant visual results\n\n**60-minute MVP:**\nText input → sentiment polarity scoring → live color badge & word cloud display.\n\nWould you like to build this beginner project at the workshop?",
        suggested_actions: ["Build This Project →", "Claim Free Seat", "What technologies would I need?"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 3. Follow-up: "Something more impressive" / "More challenging"
    if (text.includes('more impressive') || text.includes('impressive') || text.includes('more advanced') || text.includes('challenging') || text.includes('complex')) {
      return {
        reply: "Based on what you've told me, here is an advanced, high-impact project:\n\n⚡ **Predictive Maintenance System** (IoT / ML - Intermediate)\n\n**Why it fits:**\n• Time-series machine learning\n• Sensor feature engineering\n• Industrial smart factory use case\n\n**60-minute MVP:**\nMachine telemetry logs → rolling window feature extraction → failure prediction classifier → alert dashboard.\n\nWould you like to explore the architecture for this project?",
        suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another project"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 4. Cybersecurity specific
    if (text.includes('cyber') || text.includes('security') || text.includes('intrusion') || text.includes('network')) {
      return {
        reply: "Based on what you've told me, I'd recommend an **AI Network Anomaly Detector**.\n\n**Why it fits:**\n• Python\n• Machine learning (Isolation Forest)\n• Cybersecurity\n• Strong practical use case\n\n**60-minute MVP:**\nNetwork data → feature extraction → anomaly detection → threat summary.\n\nWant to see another cybersecurity project or explore this one?",
        suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another cybersecurity project"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 5. Computer Vision specific
    if (text.includes('vision') || text.includes('opencv') || text.includes('camera') || text.includes('yolo') || text.includes('object detection')) {
      return {
        reply: "Based on what you've told me, I'd recommend a **Computer Vision Object Detection App**.\n\n**Why it fits:**\n• Python & OpenCV\n• Real-time video frame processing\n• Pre-trained YOLO/MediaPipe deep learning\n• High-visibility visual project\n\n**60-minute MVP:**\nWebcam feed → frame processing → model inference → bounding boxes & item count display.\n\nWant to see another computer vision project or explore this one?",
        suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another vision project"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 6. Finance / Fintech specific
    if (text.includes('finance') || text.includes('money') || text.includes('budget') || text.includes('expense') || text.includes('fintech')) {
      return {
        reply: "Based on what you've told me, I'd recommend an **AI Personal Finance Analyzer**.\n\n**Why it fits:**\n• Python & Pandas data manipulation\n• ML text classification for expenses\n• High-utility consumer fintech application\n\n**60-minute MVP:**\nBank CSV upload → automated categorization → monthly spending trend prediction → visual dashboard.\n\nWant to explore this finance project or see another area?",
        suggested_actions: ["Build This Project →", "What technologies would I need?", "Discover My Project →"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 7. Healthcare / Medical specific
    if (text.includes('health') || text.includes('medical') || text.includes('doctor') || text.includes('symptom')) {
      return {
        reply: "Based on what you've told me, I'd recommend an **AI Healthcare Symptom & Triage Assistant**.\n\n**Why it fits:**\n• Python & NLP\n• Clinical entity extraction & triage classification\n• High-impact healthcare use case\n\n**60-minute MVP:**\nSymptom intake description → structured medical entity extraction → preliminary triage recommendation.\n\nWant to see more details on the Healthcare Assistant or explore another domain?",
        suggested_actions: ["Build This Project →", "What technologies would I need?", "Discover My Project →"],
        quick_cta: { label: "Build This Project →", action: "/project" }
      };
    }

    // 8. Python + Placement specific
    if (text.includes('python') && (text.includes('placement') || text.includes('campus') || text.includes('job') || text.includes('career'))) {
      const alreadyShowedResume = historyText.includes('resume screener');
      if (alreadyShowedResume) {
        return {
          reply: "Based on what you've told me, here is another great placement-ready project:\n\n🛡️ **AI Network Anomaly Detector** (Cybersecurity - Intermediate)\n\n**Why it fits:**\n• Python + Machine Learning\n• Demonstrates real-time anomaly detection to recruiters\n• High placement appeal across tech firms\n\n**60-minute MVP:**\nNetwork data stream → feature extraction → Isolation Forest anomaly detection → threat alert summary.\n\nReady to build this project or would you like to explore another placement idea?",
          suggested_actions: ["Build This Project →", "What technologies would I need?", "Give me another project"],
          quick_cta: { label: "Build This Project →", action: "/project" }
        };
      }

      return {
        reply: "Based on what you've told me, I'd recommend a **Multimodal RAG Resume Screener**.\n\n**Why it fits:**\n• Python + AI\n• Strong placement relevance\n• Practical portfolio project\n• Can be reduced to a working MVP within the 60-minute workshop\n\n**60-minute MVP:**\nResume PDF upload → text extraction → LLM prompt analysis → match score & skill gap badges.\n\nReady to build this project or would you like to explore another placement option?",
        suggested_actions: ["Discover My Project →", "What technologies would I need?", "How long will it take?"],
        quick_cta: { label: "Discover My Project →", action: "/project" }
      };
    }

    // 9. Broad project request ("Give me an AI project", "Suggest a project") -> 3 curated options
    if (text.includes('give me an ai project') || text.includes('give me a project') || text.includes('suggest a project') || text.includes('what project should i build') || text.includes('what can i build') || text.includes('suggest something') || text.includes('project idea') || text.includes('any project')) {
      return {
        reply: "Sure. Here are three options:\n\n1. 🤖 **RAG Knowledge Assistant**\n   GenAI-focused and good for learning LLM applications.\n\n2. 👁️ **Computer Vision Object Detection App**\n   Best if you're interested in image-based AI.\n\n3. 🛡️ **AI Network Anomaly Detector**\n   Good if you want AI + cybersecurity.\n\nIf you're preparing for placements, tell me your current skills and I can narrow these down.",
        suggested_actions: ["I know Python (Placements)", "Computer Vision", "Cybersecurity", "I'm a beginner"],
        quick_cta: { label: "Discover My Project →", action: "/project" }
      };
    }

    // 10. Beginner general
    if (text.includes('beginner') || text.includes('1st year') || text.includes('first year') || text.includes('no experience') || text.includes('new to coding')) {
      return {
        reply: "Based on what you've told me, I'd recommend the **AI Sentiment Analysis Dashboard**.\n\n**Why it fits:**\n• Beginner-friendly Python\n• Step-by-step guidance\n• Zero complex math required\n\n**60-minute MVP:**\nText input → sentiment polarity scoring → live color badge & word cloud display.\n\nWould you like to build this beginner project at the workshop?",
        suggested_actions: ["Find beginner project", "Is it free?", "Claim Free Seat"],
        quick_cta: { label: "Find My Project →", action: "/project" }
      };
    }
    // 11. Cost / Free
    if (text.includes('free') || text.includes('cost') || text.includes('price') || text.includes('fee')) {
      return {
        reply: "Yes! The **Build Your First AI Project in 60 Minutes** workshop is **100% Free** for engineering students. All starter code repositories and API sandbox access are provided at no charge.",
        suggested_actions: ["Register for Free", "What will I build?", "How does referral work?"],
        quick_cta: { label: "Claim Free Seat →", action: "/register" }
      };
    }

    // 12. Default
    return {
      reply: "Hey! I'm Nova, your AI Workshop Assistant 👋\n\nI'll help you find an AI project you can build in 60 minutes for your resume or campus placements.\n\nTell me your branch or what programming language you know (e.g., Python, C++, Web)!",
      suggested_actions: ["I know Python (Placements)", "Computer Vision", "Cybersecurity", "I'm a beginner"],
      quick_cta: { label: "Discover My Project →", action: "/project" }
    };
  }
}

export async function getGrowthCopilot(actionType: string = 'insights'): Promise<GrowthCopilotResponse> {
  try {
    const res = await fetch(`${BASE_URL}/api/growth/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: actionType })
    });
    if (!res.ok) throw new Error('Copilot failed');
    return await res.json();
  } catch {
    if (actionType === 'whatsapp_copy') {
      return {
        analysis: "High-converting conversational copy optimized for final-year engineering WhatsApp groups and Discord servers.",
        key_findings: ["Actionable emojis increase CTR by 24%", "Emphasizing 'Free' + '60 Mins' overcomes hesitation"],
        recommended_experiments: [],
        generated_copy: "🚀 *Final-Year Engineers:* Stop watching boring 10-hour AI tutorials!\n\nWe are joining NovaSpark's *'Build Your First AI Project in 60 Minutes'* live workshop this weekend.\n\n⚡ *What we will build:* A real AI Web App (ATS Resume Analyzer / Computer Vision system)\n🎓 *Who:* CSE / IT / ECE & any engineering branch (Zero prior AI experience needed)\n💸 *Cost:* 100% Free (Limited to 500 seats)\n\n👉 *Grab your free seat here before slots fill:* {{REFERRAL_LINK}}\n\nLet's build something real together! 💻🔥"
      };
    }
    return {
      analysis: "Campaign is currently at 65.4% (327 / 500 registrations) with 1 day remaining in the 7-day sprint.",
      key_findings: [
        "WhatsApp and Campus Referrals drive 143 total signups (43.7% of all registrations).",
        "Total budget spent is ₹1,250 of ₹2,000, resulting in a blended Cost/Registration of only ₹3.82 (Target was < ₹4.00).",
        "Referral channel has an effective Cost per Registration of ₹0.00."
      ],
      recommended_experiments: [
        {
          title: "24-Hour 'Squad Blitz' Referral Challenge",
          hypothesis: "Students are more likely to register when encouraged to bring 3 friends. Offering a team pass activates zero-referral users.",
          target_channel: "WhatsApp Student Communities",
          estimated_impact: "+65 registrations within 24h",
          budget_needed: "₹0"
        },
        {
          title: "College Tech-Club Rep Micro-Incentive",
          hypothesis: "Appoint student club leads in VIT, SRM & Amrita as Campus Ambassadors with dedicated club links.",
          target_channel: "College Tech Clubs",
          estimated_impact: "+80 registrations in 48h",
          budget_needed: "₹400 for club perk"
        }
      ]
    };
  }
}
