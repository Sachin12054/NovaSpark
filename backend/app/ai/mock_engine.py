import re
import random
from typing import Dict, Any, List, Optional
from ..schemas import ProjectRecommendation, ChatResponse, GrowthCopilotResponse

NOVASPARK_CONTEXT = {
    "product_name": "NovaSpark",
    "tagline": "Turn your idea into an AI project.",
    "workshop_title": "Build Your First AI Project in 60 Minutes",
    "workshop_duration": "60 minutes",
    "workshop_cost": "100% Free",
    "workshop_format": "Live interactive online session with starter repositories and free sandbox API access",
    "campaign": {
        "target_registrations": 500,
        "current_registrations": 327,
        "percentage": 65.4,
        "registrations_remaining": 173,
        "budget_total": 2000.0,
        "budget_spent": 1250.0,
        "budget_remaining": 750.0,
        "cost_per_reg": 3.82,
        "viral_k_factor": 0.26,
        "current_day": "Day 6 of 7",
        "remaining_days": 1
    }
}

# Structured Project Catalog matching specifications
PROJECT_CATALOG = [
    {
        "id": "rag_resume",
        "name": "Multimodal RAG Resume Screener",
        "project_title": "Multimodal RAG Resume Screener",
        "domain": "GenAI / Career",
        "description": "Upload a PDF resume and job description to get instant match scores, skill gap analysis, and tailored AI suggestions.",
        "tagline": "Upload a PDF resume and job description to get instant match scores, skill gap analysis, and tailored AI suggestions.",
        "skills": ["Python", "NLP", "LLM"],
        "technologies": ["Python", "FastAPI", "Mistral AI / LLM API", "PyPDF2", "React Native UI"],
        "tech_stack": ["Python", "FastAPI", "Mistral AI / LLM API", "PyPDF2", "React Native UI"],
        "difficulty": "Intermediate",
        "placementRelevance": "High placement impact; demonstrates LLM prompt engineering, PDF text parsing, and REST API deployment to recruiters.",
        "why_this_fits_you": "Python + AI + practical campus placement preparation.",
        "workshopMVP": "Resume PDF upload → text extraction → LLM prompt evaluation → match score & skill gap badges.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["resume", "cv", "placement", "screener", "rag", "ats", "career", "job", "multimodal", "genai"],
        "keywords": ["resume", "cv", "placement", "screener", "rag", "ats", "career", "job", "multimodal", "genai"],
        "what_you_will_learn": [
            "Extracting and parsing text from PDF resumes with PyPDF2",
            "Designing structured system prompts for semantic job matching",
            "Connecting an LLM API to a clean student mobile interface",
            "Displaying visual score badges and skill gap breakdowns"
        ],
        "prerequisites": "Basic Python syntax (variables, functions, API requests)",
        "starter_code_preview": "import mistralai\n\ndef analyze_resume(resume_text, job_desc):\n    prompt = f'Analyze this resume for this job:\\n{job_desc}\\nResume:\\n{resume_text}'\n    return client.chat.complete(model='mistral-small', messages=[{'role': 'user', 'content': prompt}])",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "network_anomaly",
        "name": "AI Network Anomaly Detector",
        "project_title": "AI Network Anomaly Detector",
        "domain": "Cybersecurity",
        "description": "Analyze network traffic streams in real time using unsupervised machine learning to detect suspicious intrusions and port scans.",
        "tagline": "Real-time network traffic anomaly detector using machine learning to surface cybersecurity threats.",
        "skills": ["Python", "ML", "Cybersecurity"],
        "technologies": ["Python", "Scikit-Learn", "Pandas", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "Scikit-Learn", "Pandas", "FastAPI", "React Native UI"],
        "difficulty": "Intermediate",
        "placementRelevance": "Strong cybersecurity portfolio piece demonstrating telemetry feature extraction, Isolation Forests, and threat alerting.",
        "why_this_fits_you": "Python + Machine Learning + practical Cybersecurity threat analysis.",
        "workshopMVP": "Network data stream → feature extraction → Isolation Forest anomaly detection → threat alert summary.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["cybersecurity", "security", "network", "anomaly", "intrusion", "packets", "threat", "firewall"],
        "keywords": ["cybersecurity", "security", "network", "anomaly", "intrusion", "packets", "threat", "firewall"],
        "what_you_will_learn": [
            "Parsing network connection records and calculating statistical traffic features",
            "Training an unsupervised Isolation Forest model for zero-day threat detection",
            "Exposing a fast anomaly scoring endpoint via FastAPI",
            "Building visual alert notifications with severity levels"
        ],
        "prerequisites": "Python data structures and basic statistical intuition",
        "starter_code_preview": "from sklearn.ensemble import IsolationForest\nmodel = IsolationForest(contamination=0.05, random_state=42)\nmodel.fit(traffic_features)",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "edge_ai_anomaly",
        "name": "Edge AI Anomaly Detector",
        "project_title": "Edge AI Anomaly Detector",
        "domain": "Edge AI / IoT",
        "description": "Deploy lightweight machine learning models on simulated edge devices/sensors to flag anomalies with ultra-low latency.",
        "tagline": "Lightweight on-device sensor anomaly detector for IoT and embedded hardware environments.",
        "skills": ["Python", "ML", "sensors", "IoT"],
        "technologies": ["Python", "NumPy", "Scikit-Learn", "MQTT / WebSockets", "SQLite"],
        "tech_stack": ["Python", "NumPy", "Scikit-Learn", "MQTT / WebSockets", "SQLite"],
        "difficulty": "Intermediate",
        "placementRelevance": "High appeal for ECE, IoT, and embedded hardware roles; highlights low-latency on-device processing and sensor streams.",
        "why_this_fits_you": "Python + Edge AI + IoT hardware sensor processing.",
        "workshopMVP": "Sensor time-series simulator → lightweight threshold ML model → real-time edge anomaly notification.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["edge", "iot", "sensor", "hardware", "ece", "embedded", "anomaly", "devices", "telemetry"],
        "keywords": ["edge", "iot", "sensor", "hardware", "ece", "embedded", "anomaly", "devices", "telemetry"],
        "what_you_will_learn": [
            "Simulating multi-sensor telemetry streams (temperature, vibration, voltage)",
            "Quantizing and optimizing lightweight ML models for edge execution",
            "Streaming real-time alerts over WebSockets",
            "Logging diagnostic events into local SQLite"
        ],
        "prerequisites": "Python basics and interest in IoT / sensor data",
        "starter_code_preview": "def check_sensor_anomaly(sensor_reading, baseline_mean, baseline_std):\n    z_score = abs(sensor_reading - baseline_mean) / baseline_std\n    return z_score > 3.0",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "doc_image_analyzer",
        "name": "AI Document & Image Analyzer",
        "project_title": "AI Document & Image Analyzer",
        "domain": "Computer Vision / GenAI",
        "description": "Multimodal computer vision pipeline that extracts text from documents, diagrams, and invoices and generates structured summaries.",
        "tagline": "Extract text, tables, and visual entities from photos and receipts using OCR and Vision AI.",
        "skills": ["Python", "OCR", "Vision", "GenAI"],
        "technologies": ["Python", "Tesseract / EasyOCR", "OpenCV", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "Tesseract / EasyOCR", "OpenCV", "FastAPI", "React Native UI"],
        "difficulty": "Beginner-Intermediate",
        "placementRelevance": "Great for demonstrating enterprise document automation, multimodal AI, and image pre-processing.",
        "why_this_fits_you": "Computer Vision + Optical Character Recognition + LLM summarization.",
        "workshopMVP": "Document photo upload → OCR text extraction → vision LLM classification → structured JSON summary.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["ocr", "document", "image", "invoice", "receipt", "vision", "multimodal", "scanner"],
        "keywords": ["ocr", "document", "image", "invoice", "receipt", "vision", "multimodal", "scanner"],
        "what_you_will_learn": [
            "Image preprocessing (grayscale, adaptive thresholding) with OpenCV",
            "Extracting high-accuracy text with OCR engines",
            "Passing raw OCR output to an LLM for structured entity extraction",
            "Rendering extracted keys/values in a student mobile dashboard"
        ],
        "prerequisites": "Basic Python syntax",
        "starter_code_preview": "import cv2\nimport pytesseract\n\ndef extract_document_text(image_path):\n    img = cv2.imread(image_path)\n    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\n    return pytesseract.image_to_string(gray)",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "finance_analyzer",
        "name": "AI Personal Finance Analyzer",
        "project_title": "AI Personal Finance Analyzer",
        "domain": "Finance / AI",
        "description": "Smart personal expense intelligence app that auto-categorizes bank transactions and predicts future spending bottlenecks.",
        "tagline": "Automate transaction categorization and forecast monthly budgets with lightweight predictive ML.",
        "skills": ["Python", "ML", "data analysis", "Finance"],
        "technologies": ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React Native UI"],
        "difficulty": "Beginner-Intermediate",
        "placementRelevance": "Highly relatable fintech application showing clean data manipulation with Pandas, classification, and budgeting insights.",
        "why_this_fits_you": "Python + Pandas data processing + practical consumer fintech AI.",
        "workshopMVP": "Bank statement/CSV upload → automated expense categorization → trend forecasting → visual dashboard.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["finance", "money", "budget", "expense", "bank", "fintech", "spending", "csv", "data analysis"],
        "keywords": ["finance", "money", "budget", "expense", "bank", "fintech", "spending", "csv", "data analysis"],
        "what_you_will_learn": [
            "Cleaning and transforming messy financial transaction strings with Pandas",
            "Training text classification models for expense categorization",
            "Calculating recurring spending patterns and cash burn projections",
            "Rendering interactive mobile expense charts"
        ],
        "prerequisites": "Basic Python and interest in data science / finance",
        "starter_code_preview": "import pandas as pd\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\ndef categorize_expense(description):\n    # ML text classifier mapping descriptions to categories (Food, Rent, Bills)\n    return model.predict([description])[0]",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "rag_knowledge",
        "name": "RAG Knowledge Assistant",
        "project_title": "RAG Knowledge Assistant",
        "domain": "GenAI",
        "description": "Ask anything about syllabus, exams, faculty circulars, and technical handbooks with vector-grounded citations.",
        "tagline": "Vector database grounded chatbot answering questions strictly from your college documents without hallucinations.",
        "skills": ["Python", "embeddings", "LLM", "RAG"],
        "technologies": ["Python", "LangChain", "ChromaDB / FAISS", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "LangChain", "ChromaDB / FAISS", "FastAPI", "React Native UI"],
        "difficulty": "Intermediate",
        "placementRelevance": "The gold standard GenAI portfolio project; proves you know embeddings, chunking strategies, vector search, and strict grounding.",
        "why_this_fits_you": "Generative AI + Vector Search + Enterprise Knowledge Retrieval.",
        "workshopMVP": "Document ingestion → text chunking & embeddings → vector similarity search → grounded context answering.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["rag", "knowledge", "chatbot", "vector", "embeddings", "syllabus", "faiss", "chromadb", "genai"],
        "keywords": ["rag", "knowledge", "chatbot", "vector", "embeddings", "syllabus", "faiss", "chromadb", "genai"],
        "what_you_will_learn": [
            "Chunking text documents and generating dense vector embeddings",
            "Storing and querying vector databases with cosine similarity",
            "Constructing strict context-injected prompt templates to eliminate hallucinations",
            "Deploying a lightning-fast responsive chatbot UI"
        ],
        "prerequisites": "Basic Python and understanding of API keys",
        "starter_code_preview": "SYSTEM_PROMPT = 'Answer ONLY using the provided college syllabus chunks: {context}'",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "sentiment_dashboard",
        "name": "AI Sentiment Analysis Dashboard",
        "project_title": "AI Sentiment Analysis Dashboard",
        "domain": "NLP",
        "description": "Real-time customer review & feedback sentiment analyzer categorizing sentiment polarity, emotions, and urgent complaint alerts.",
        "tagline": "Analyze customer sentiment and surface real-time actionable feedback with natural language processing.",
        "skills": ["Python", "NLP", "ML"],
        "technologies": ["Python", "NLTK / Transformers", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "NLTK / Transformers", "FastAPI", "React Native UI"],
        "difficulty": "Beginner",
        "placementRelevance": "Super approachable NLP project for beginners; showcases tokenization, polarity scoring, and clean analytics UI.",
        "why_this_fits_you": "Beginner-friendly Python + NLP sentiment classification.",
        "workshopMVP": "Text/review input → NLTK / HuggingFace sentiment pipeline → live sentiment score & word cloud display.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["nlp", "sentiment", "reviews", "feedback", "emotions", "text", "beginner", "nltk"],
        "keywords": ["nlp", "sentiment", "reviews", "feedback", "emotions", "text", "beginner", "nltk"],
        "what_you_will_learn": [
            "Tokenizing text and removing stop words with NLTK",
            "Scoring positive, negative, and neutral sentiment polarity",
            "Building real-time sentiment distribution charts",
            "Triggering automated alert webhooks for critical negative reviews"
        ],
        "prerequisites": "Basic Python syntax (lists, strings, loops)",
        "starter_code_preview": "from nltk.sentiment import SentimentIntensityAnalyzer\nsia = SentimentIntensityAnalyzer()\ndef get_sentiment(text):\n    return sia.polarity_scores(text)",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "study_assistant",
        "name": "AI Study Assistant",
        "project_title": "AI Study Assistant",
        "domain": "Education / GenAI",
        "description": "Transform complex engineering lecture notes into clear summaries, interactive flashcards, and automated multiple-choice quizzes.",
        "tagline": "Turn lecture notes into instant summaries, flashcards, and exam preparation quizzes using Generative AI.",
        "skills": ["Python", "LLM", "RAG", "Education"],
        "technologies": ["Python", "Mistral AI API", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "Mistral AI API", "FastAPI", "React Native UI"],
        "difficulty": "Beginner-Intermediate",
        "placementRelevance": "Demonstrates structured JSON outputs from LLMs, education technology application, and rapid prompt chaining.",
        "why_this_fits_you": "GenAI + Structured LLM Prompts + EdTech automation.",
        "workshopMVP": "Lecture notes text → LLM summarization → dynamic flashcard & quiz generation.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["study", "education", "quiz", "flashcards", "notes", "summary", "student", "exam", "learning"],
        "keywords": ["study", "education", "quiz", "flashcards", "notes", "summary", "student", "exam", "learning"],
        "what_you_will_learn": [
            "Instructing LLMs to return strict JSON arrays for quizzes and flashcards",
            "Handling large lecture transcripts with recursive summarization",
            "Building an interactive flashcard flip UI on mobile",
            "Scoring quiz answers and giving personalized explanations"
        ],
        "prerequisites": "Basic Python functions and API calls",
        "starter_code_preview": "prompt = f'Generate 5 multiple choice questions with answers from this lecture note:\\n{notes}'",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "predictive_maintenance",
        "name": "Predictive Maintenance System",
        "project_title": "Predictive Maintenance System",
        "domain": "IoT / ML",
        "description": "Predict machine failures before they occur by analyzing time-series telemetry data (temperature, pressure, vibration).",
        "tagline": "Industrial machine health monitoring and predictive failure forecasting using time-series ML.",
        "skills": ["Python", "time-series ML", "IoT", "Data Science"],
        "technologies": ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React Native UI"],
        "difficulty": "Intermediate",
        "placementRelevance": "Great crossover project for Mechanical, EEE, and Data Science students targeting industrial tech and smart manufacturing.",
        "why_this_fits_you": "Python + Time-Series Machine Learning + Smart Industry 4.0 use case.",
        "workshopMVP": "Machine sensor logs → feature engineering → Random Forest failure classification → maintenance alert UI.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["predictive", "maintenance", "iot", "machine", "sensors", "factory", "mechanical", "timeseries", "hardware"],
        "keywords": ["predictive", "maintenance", "iot", "machine", "sensors", "factory", "mechanical", "timeseries", "hardware"],
        "what_you_will_learn": [
            "Feature engineering on rolling time windows (mean, standard deviation, spikes)",
            "Training Random Forest & XGBoost classifiers for remaining useful life prediction",
            "Setting confidence thresholds for automated preventive work orders",
            "Visualizing machine health dials on mobile"
        ],
        "prerequisites": "Python basics and interest in data science / physical systems",
        "starter_code_preview": "from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier()\nmodel.fit(sensor_rolling_features, failure_labels)",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "cv_object_detection",
        "name": "Computer Vision Object Detection App",
        "project_title": "Computer Vision Object Detection App",
        "domain": "Computer Vision",
        "description": "Real-time webcam and camera feed application detecting and counting objects with bounding boxes and confidence scores.",
        "tagline": "Real-time object detection and tracking using OpenCV and deep learning models.",
        "skills": ["Python", "OpenCV", "deep learning", "Computer Vision"],
        "technologies": ["Python", "OpenCV", "YOLO / MediaPipe", "FastAPI", "React Native UI"],
        "tech_stack": ["Python", "OpenCV", "YOLO / MediaPipe", "FastAPI", "React Native UI"],
        "difficulty": "Intermediate",
        "placementRelevance": "Classic high-visibility computer vision project demonstrating real-time video stream processing and deep learning bounding boxes.",
        "why_this_fits_you": "Python + OpenCV + Real-time Deep Learning Vision Inference.",
        "workshopMVP": "Camera/image stream → YOLO / OpenCV model inference → real-time bounding box rendering & item count.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["vision", "camera", "opencv", "yolo", "detection", "objects", "image", "deep learning", "computer vision"],
        "keywords": ["vision", "camera", "opencv", "yolo", "detection", "objects", "image", "deep learning", "computer vision"],
        "what_you_will_learn": [
            "Capturing and processing video frames at 30+ FPS with OpenCV",
            "Running pre-trained YOLO / MediaPipe models for zero-shot object recognition",
            "Drawing dynamic bounding box overlays and confidence badges",
            "Streaming processed frames to a mobile client"
        ],
        "prerequisites": "Python loops, lists, and basic package installation",
        "starter_code_preview": "import cv2\ncap = cv2.VideoCapture(0)\nwhile cap.isOpened():\n    ret, frame = cap.read()\n    # Run YOLO detection & draw bounding boxes\n    cv2.imshow('Object Detection', frame)",
        "cta_text": "Build this project in the workshop →"
    },
    {
        "id": "healthcare_diagnostic",
        "name": "AI Healthcare Symptom & Triage Assistant",
        "project_title": "AI Healthcare Symptom & Triage Assistant",
        "domain": "Healthcare / AI",
        "description": "Intelligent medical symptom intake and preliminary triage assistant that structures patient queries and provides emergency guidance.",
        "tagline": "Structure patient symptom descriptions and perform clinical triage classification using NLP.",
        "skills": ["Python", "NLP", "GenAI", "Healthcare"],
        "technologies": ["Python", "FastAPI", "Mistral AI API", "React Native UI"],
        "tech_stack": ["Python", "FastAPI", "Mistral AI API", "React Native UI"],
        "difficulty": "Beginner-Intermediate",
        "placementRelevance": "High-impact healthtech project demonstrating medical entity extraction, structured triage prompt templates, and ethical guardrails.",
        "why_this_fits_you": "Python + NLP + Healthcare technology triage use case.",
        "workshopMVP": "Symptom intake description → structured medical entity extraction → preliminary triage recommendation.",
        "estimatedTime": "60 minutes",
        "estimated_build_time": "60 minutes",
        "tags": ["health", "healthcare", "medical", "symptom", "triage", "doctor", "clinic", "hospital", "patient"],
        "keywords": ["health", "healthcare", "medical", "symptom", "triage", "doctor", "clinic", "hospital", "patient"],
        "what_you_will_learn": [
            "Structuring natural language patient complaints into clinical entities",
            "Implementing ethical guardrails and disclaimer protocols",
            "Categorizing urgency levels (Routine, Urgent, Emergency)",
            "Designing an accessible mobile patient intake flow"
        ],
        "prerequisites": "Basic Python and interest in healthtech / AI applications",
        "starter_code_preview": "prompt = f'Analyze these symptoms strictly for triage severity: {symptoms}'",
        "cta_text": "Build this project in the workshop →"
    }
]

def normalize_text(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r'[^\w\s]', ' ', t)
    
    # Common typo normalization
    typo_map = {
        "placemnt": "placement",
        "placmnt": "placement",
        "placements": "placement",
        "projct": "project",
        "projeckt": "project",
        "begginer": "beginner",
        "beginer": "beginner",
        "pythn": "python",
        "pyton": "python",
        "reume": "resume",
        "resme": "resume",
        "refrral": "referral",
        "referal": "referral",
        "wrokshop": "workshop",
        "wrkshop": "workshop",
        "cyber": "cybersecurity",
        "security": "cybersecurity",
        "cv": "computer vision",
        "vision": "computer vision",
        "iot": "iot",
    }
    words = [typo_map.get(w, w) for w in t.split()]
    return " ".join(words)

def extract_history_context(history: Optional[List[Any]]) -> Dict[str, Any]:
    context = {
        "shown_project_ids": set(),
        "last_project": None,
        "last_domain": None,
        "skills": set(),
        "goals": set(),
        "options_given": False,
        "rejected_project_ids": set()
    }
    if not history:
        return context

    for msg in history:
        c = getattr(msg, "content", "") or ""
        c_lower = c.lower()
        
        # Detect which projects were shown in previous assistant turns
        for p in PROJECT_CATALOG:
            if p["name"].lower() in c_lower or p["id"] in c_lower:
                context["shown_project_ids"].add(p["id"])
                context["last_project"] = p
                context["last_domain"] = p["domain"]

        if "python" in c_lower:
            context["skills"].add("python")
        if "cybersecurity" in c_lower:
            context["skills"].add("cybersecurity")
        if "vision" in c_lower or "computer vision" in c_lower or "opencv" in c_lower:
            context["skills"].add("vision")
        if "iot" in c_lower or "edge" in c_lower or "sensor" in c_lower:
            context["skills"].add("iot")
        if "finance" in c_lower:
            context["skills"].add("finance")
        if "health" in c_lower or "medical" in c_lower:
            context["skills"].add("healthcare")
        if "placement" in c_lower or "career" in c_lower or "interview" in c_lower:
            context["goals"].add("placement")
        if "beginner" in c_lower:
            context["goals"].add("beginner")
        if "1. " in c and "2. " in c:
            context["options_given"] = True

    return context

def build_single_recommendation_reply(
    project: Dict[str, Any],
    skills_context: str = "",
    custom_question: Optional[str] = None
) -> ChatResponse:
    why_items = []
    if skills_context:
        why_items.append(f"• {skills_context}")
    for s in project["skills"]:
        if s.lower() not in [item.lower() for item in why_items]:
            why_items.append(f"• {s}")
    why_items.append(f"• {project['domain']}")
    why_items.append(f"• {project['placementRelevance']}")

    why_str = "\n".join(why_items[:4])
    
    closing_q = custom_question or f"Want to see another {project['domain'].split('/')[0].strip()} project or explore this one?"

    reply = (
        f"Based on what you've told me, I'd recommend the **{project['name']}**.\n\n"
        f"**Domain:** {project['domain']} ({project['difficulty']})\n\n"
        f"**Why it fits:**\n"
        f"{why_str}\n\n"
        f"**60-minute MVP:**\n"
        f"{project['workshopMVP']}\n\n"
        f"{closing_q}"
    )

    domain_tag = project['domain'].split('/')[0].strip()
    return ChatResponse(
        reply=reply,
        suggested_actions=[
            "Build This Project →",
            "What technologies would I need?",
            f"Give me another {domain_tag} project",
            "Something easier"
        ],
        recommended_project=ProjectRecommendation(
            project_title=project["name"],
            tagline=project["description"],
            difficulty=project["difficulty"],
            estimated_build_time=project["estimatedTime"],
            tech_stack=project["technologies"],
            what_you_will_learn=project["what_you_will_learn"],
            why_this_fits_you=project["placementRelevance"],
            prerequisites=project["prerequisites"],
            starter_code_preview=project.get("starter_code_preview"),
            cta_text=project.get("cta_text", "Build this project in the workshop →")
        ),
        quick_cta={"label": "Build This Project →", "action": "/project"}
    )

def build_three_options_reply(
    intro: str = "Sure! Here are three curated options across different tracks:",
    p1: Optional[Dict[str, Any]] = None,
    p2: Optional[Dict[str, Any]] = None,
    p3: Optional[Dict[str, Any]] = None
) -> ChatResponse:
    p1 = p1 or PROJECT_CATALOG[5] # RAG Knowledge Assistant
    p2 = p2 or PROJECT_CATALOG[9] # Computer Vision Object Detection App
    p3 = p3 or PROJECT_CATALOG[1] # AI Network Anomaly Detector

    reply = (
        f"{intro}\n\n"
        f"1. 🤖 **{p1['name']}** ({p1['domain']})\n"
        f"   {p1['description']}\n\n"
        f"2. 👁️ **{p2['name']}** ({p2['domain']})\n"
        f"   {p2['description']}\n\n"
        f"3. 🛡️ **{p3['name']}** ({p3['domain']})\n"
        f"   {p3['description']}\n\n"
        f"If you're preparing for placements, tell me your current skills and I can narrow these down."
    )

    return ChatResponse(
        reply=reply,
        suggested_actions=[
            "I know Python (Placements)",
            "Computer Vision",
            "Cybersecurity",
            "I'm a beginner"
        ],
        quick_cta={"label": "Discover My Project →", "action": "/project"}
    )

def get_mock_project_recommendation(
    branch: str,
    year: str,
    coding_experience: str,
    preferred_area: str,
    ai_experience: str,
    what_to_build: Optional[str] = None
) -> ProjectRecommendation:
    query = f"{preferred_area} {what_to_build or ''} {coding_experience} {branch}".lower()
    best_match = PROJECT_CATALOG[0]
    best_score = -1
    
    for item in PROJECT_CATALOG:
        score = sum(1 for kw in item["tags"] if kw in query)
        if score > best_score:
            best_score = score
            best_match = item
            
    branch_text = f"As a {year} {branch} student"
    if "Beginner" in coding_experience or "Basic" in ai_experience:
        tailor = f"{branch_text} with beginner coding experience, this project is crafted to get you a working GitHub project in 60 minutes with zero confusing theory."
    else:
        tailor = f"{branch_text} with {coding_experience} skills, this project lets you implement real-world AI architecture you can showcase in technical interviews."

    return ProjectRecommendation(
        project_title=best_match["name"],
        tagline=best_match["description"],
        difficulty=best_match["difficulty"],
        estimated_build_time=best_match["estimatedTime"],
        tech_stack=best_match["technologies"],
        what_you_will_learn=best_match["what_you_will_learn"],
        why_this_fits_you=tailor,
        prerequisites=best_match["prerequisites"],
        starter_code_preview=best_match.get("starter_code_preview"),
        cta_text="Build this project in the workshop →"
    )

def get_mock_chat_response(message: str, history: Optional[List[Any]] = None) -> ChatResponse:
    norm = normalize_text(message)
    ctx = extract_history_context(history)
    shown_ids = ctx["shown_project_ids"]
    last_p = ctx["last_project"]

    # -------------------------------------------------------------
    # 1. FOLLOW-UP: "Tell me about another one" / "Give me another project" / "Something else" / "I don't like that one"
    # -------------------------------------------------------------
    if any(q in norm for q in [
        "tell me about another", "another project", "give me another", "another one",
        "something else", "different project", "show me another", "other options", "next project"
    ]) or any(q in norm for q in ["dont like that", "don t like that", "not interested", "dont like it", "dislike"]):
        # Select a project NOT yet shown
        available = [p for p in PROJECT_CATALOG if p["id"] not in shown_ids]
        if not available:
            available = PROJECT_CATALOG

        # If user was looking for a specific domain, pick another in that domain or close domain
        if last_p:
            domain_matches = [p for p in available if p["domain"] == last_p["domain"] and p["id"] != last_p["id"]]
            next_project = domain_matches[0] if domain_matches else available[0]
        else:
            next_project = available[0]

        return build_single_recommendation_reply(
            next_project,
            skills_context="Fresh project recommendation",
            custom_question=f"Does this **{next_project['name']}** sound like a better fit, or would you like to see another direction?"
        )

    # -------------------------------------------------------------
    # 2. FOLLOW-UP: "Something easier" / "Too difficult"
    # -------------------------------------------------------------
    if any(q in norm for q in ["something easier", "easier", "too hard", "too difficult", "simpler", "simple project", "for beginners"]):
        beginner_projects = [p for p in PROJECT_CATALOG if "Beginner" in p["difficulty"] and p["id"] not in shown_ids]
        if not beginner_projects:
            beginner_projects = [p for p in PROJECT_CATALOG if "Beginner" in p["difficulty"]]
        chosen = beginner_projects[0]
        return build_single_recommendation_reply(
            chosen,
            skills_context="Beginner-friendly learning path with step-by-step guidance",
            custom_question="Would you like to build this beginner project at the workshop?"
        )

    # -------------------------------------------------------------
    # 3. FOLLOW-UP: "Something more impressive" / "More challenging" / "Advanced"
    # -------------------------------------------------------------
    if any(q in norm for q in ["more impressive", "impressive", "more advanced", "challenging", "complex", "harder", "advanced project"]):
        advanced_projects = [p for p in PROJECT_CATALOG if p["difficulty"] == "Intermediate" and p["id"] not in shown_ids]
        if not advanced_projects:
            advanced_projects = [p for p in PROJECT_CATALOG if p["difficulty"] == "Intermediate"]
        chosen = advanced_projects[0]
        return build_single_recommendation_reply(
            chosen,
            skills_context="High-impact technical depth designed to impress senior interviewers",
            custom_question="Would you like to explore the technical architecture for this project?"
        )

    # -------------------------------------------------------------
    # 4. FOLLOW-UP: Specific Follow-up Questions on Tech Stack / Time / Architecture
    # -------------------------------------------------------------
    if any(q in norm for q in ["what technologies", "what tech", "tech stack", "what tools", "what libraries", "technologies would i need"]):
        if last_p:
            tech_bullets = "\n".join([f"• **{t}**" for t in last_p["technologies"]])
            reply = (
                f"For the 60-minute MVP of the **{last_p['name']}**, here is the exact tech stack:\n\n"
                f"{tech_bullets}\n\n"
                f"**60-Minute Scope:** {last_p['workshopMVP']}\n\n"
                "All starter code templates and API sandbox keys are provided free during the session!"
            )
            return ChatResponse(
                reply=reply,
                suggested_actions=["How long will it take?", "Build This Project →", "Give me another project"],
                quick_cta={"label": "Build This Project →", "action": "/project"}
            )
        else:
            return ChatResponse(
                reply=(
                    "For our 60-minute workshop AI projects, we primarily use **Python 3.10+**, **FastAPI**, "
                    "pre-configured **LLM APIs / OpenCV**, and **React Native**.\n\n"
                    "Tell me your area of interest (e.g., Computer Vision, Cybersecurity, GenAI) and I'll detail the stack!"
                ),
                suggested_actions=["Computer Vision", "Cybersecurity", "GenAI / RAG", "Finance"],
                quick_cta={"label": "Discover My Project →", "action": "/project"}
            )

    if any(q in norm for q in ["how long would that take", "how long will it take", "how long will that take", "time to build", "duration"]):
        if last_p:
            reply = (
                f"⏱️ You will build a working MVP of the **{last_p['name']}** in **60 minutes**!\n\n"
                "Here is the workshop timeline:\n"
                "• **Min 00–15**: Environment setup & dataset/API key verification\n"
                "• **Min 15–40**: Core logic & AI pipeline implementation\n"
                "• **Min 40–55**: UI connection & interactive testing\n"
                "• **Min 55–60**: Deployment to your GitHub portfolio\n\n"
                "Ready to build it?"
            )
        else:
            reply = (
                "⏱️ Every workshop project is scoped to a **60-minute working MVP** with step-by-step mentor guidance.\n\n"
                "Want to find a project tailored to your skills?"
            )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Build This Project →", "Claim Free Seat", "Give me another project"],
            quick_cta={"label": "Claim Free Seat →", "action": "/register"}
        )

    # -------------------------------------------------------------
    # 5. DOMAIN INTENTS: Specific Technical / Domain Requests
    # -------------------------------------------------------------

    # Cybersecurity / Network Anomaly
    if "cybersecurity" in norm or "network" in norm or "security" in norm or "intrusion" in norm:
        proj = PROJECT_CATALOG[1] # AI Network Anomaly Detector
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + Machine Learning + Network Security",
            custom_question="Want to see another cybersecurity project or explore this one?"
        )

    # Edge AI / IoT / Sensors / ECE
    if any(k in norm for k in ["edge ai", "edge", "iot", "sensor", "sensors", "hardware", "ece", "predictive maintenance"]):
        if "maintenance" in norm or "machine" in norm or "factory" in norm:
            proj = PROJECT_CATALOG[8] # Predictive Maintenance
        else:
            proj = PROJECT_CATALOG[2] # Edge AI Anomaly Detector
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + Edge AI + Sensor Telemetry",
            custom_question=f"Want to explore this {proj['domain']} project or look at an alternative?"
        )

    # Computer Vision / OpenCV
    if any(k in norm for k in ["computer vision", "vision", "opencv", "camera", "image", "yolo", "ocr", "object detection"]):
        if "document" in norm or "ocr" in norm or "invoice" in norm or "receipt" in norm:
            proj = PROJECT_CATALOG[3] # AI Document & Image Analyzer
        else:
            proj = PROJECT_CATALOG[9] # Computer Vision Object Detection App
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + OpenCV + Real-Time Video / Image AI",
            custom_question="Want to see another computer vision project or explore this one?"
        )

    # Finance / Fintech
    if any(k in norm for k in ["finance", "fintech", "money", "budget", "expense", "stock", "trading"]):
        proj = PROJECT_CATALOG[4] # AI Personal Finance Analyzer
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + Pandas Data Analysis + Consumer Fintech AI",
            custom_question="Want to explore this finance project or see another area?"
        )

    # Healthcare / Medical
    if any(k in norm for k in ["health", "healthcare", "medical", "doctor", "hospital", "clinic", "symptom"]):
        proj = PROJECT_CATALOG[10] # AI Healthcare Symptom & Triage Assistant
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + NLP + Healthcare Triage Automation",
            custom_question="Want to see more details on the Healthcare Assistant or explore another domain?"
        )

    # Education / Study Assistant
    if any(k in norm for k in ["study", "education", "notes", "quiz", "flashcard", "student app"]):
        proj = PROJECT_CATALOG[7] # AI Study Assistant
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + LLMs + Educational Prompt Engineering",
            custom_question="Want to build this study assistant in the workshop?"
        )

    # NLP / Sentiment Analysis
    if any(k in norm for k in ["sentiment", "nlp", "reviews", "feedback", "text analysis"]):
        proj = PROJECT_CATALOG[6] # AI Sentiment Analysis Dashboard
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + Natural Language Processing + Text Classification",
            custom_question="Want to build this sentiment dashboard or try a GenAI project?"
        )

    # GenAI / RAG Assistant
    if "rag" in norm or "embeddings" in norm or "vector" in norm or "syllabus" in norm:
        proj = PROJECT_CATALOG[5] # RAG Knowledge Assistant
        return build_single_recommendation_reply(
            proj,
            skills_context="Python + Vector Embeddings + Retrieval-Augmented Generation",
            custom_question="Want to build this RAG project at the workshop?"
        )

    # -------------------------------------------------------------
    # 6. INTENT: Python + Campus Placements (Dynamic Match)
    # -------------------------------------------------------------
    if ("python" in norm and any(p in norm for p in ["placement", "campus", "interview", "job", "career", "fit", "fits"])) or \
       any(k in norm for k in ["fits campus placements", "preparing for placements", "campus placements", "placement project"]):
        # If resume screener has already been shown, pick another high placement relevance project!
        if "rag_resume" in shown_ids:
            proj = PROJECT_CATALOG[1] # Network Anomaly or RAG Knowledge
        else:
            proj = PROJECT_CATALOG[0] # Multimodal RAG Resume Screener

        return build_single_recommendation_reply(
            proj,
            skills_context="Python + AI + practical campus placement preparation",
            custom_question="Ready to build this project or would you like to explore another placement option?"
        )

    # -------------------------------------------------------------
    # 7. INTENT: Beginner ("I'm a beginner")
    # -------------------------------------------------------------
    if any(k in norm for k in ["beginner", "im beginner", "i am beginner", "no experience", "new to ai", "never coded ai", "1st year"]):
        proj = PROJECT_CATALOG[6] # AI Sentiment Analysis Dashboard (Beginner)
        return build_single_recommendation_reply(
            proj,
            skills_context="Beginner-friendly with zero complicated math and pre-built templates",
            custom_question="Would you like to build this beginner project or see 3 options across different domains?"
        )

    # -------------------------------------------------------------
    # 8. INTENT: Broad Project Request ("Give me a project", "What project should I build?")
    # -------------------------------------------------------------
    if any(k in norm for k in [
        "give me an ai project", "give me a project", "what project should i build",
        "what project should i make", "suggest something i can build", "suggest a project",
        "suggest project", "what can i build", "what will i build", "ai project ideas",
        "need something for resume", "project idea", "any good ai project"
    ]):
        return build_three_options_reply(
            intro="Sure. Here are three options:",
            p1=PROJECT_CATALOG[5], # RAG Knowledge Assistant (Best match / GenAI)
            p2=PROJECT_CATALOG[9], # Computer Vision Object Detection App (Alternative / Vision)
            p3=PROJECT_CATALOG[1]  # AI Network Anomaly Detector (More challenging / Cybersecurity)
        )

    # -------------------------------------------------------------
    # 9. INTENT: Technical & Educational Questions
    # -------------------------------------------------------------
    if "what is rag" in norm or "explain rag" in norm:
        reply = (
            "**RAG (Retrieval-Augmented Generation)** is an AI architecture that connects an LLM to external documents (like college circulars or resumes).\n\n"
            "Instead of relying only on what the LLM was trained on, RAG:\n"
            "1. Searches a vector database for relevant text snippets\n"
            "2. Injects those snippets into the prompt as context\n"
            "3. Generates accurate, grounded answers without hallucinations.\n\n"
            "It is currently one of the most in-demand skills for tech placements."
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Build a RAG Project", "What is an LLM?", "Claim Free Seat"],
            quick_cta={"label": "Discover My Project →", "action": "/project"}
        )

    if "what is an llm" in norm or "what is llm" in norm:
        reply = (
            "A **Large Language Model (LLM)** is a neural network trained on vast text data to understand, summarize, and generate human language.\n\n"
            "In modern AI engineering, rather than training LLMs from scratch, engineers connect to pre-trained models (like Mistral or OpenAI) via APIs to build practical applications."
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["What is RAG?", "Give me an AI project", "Claim Free Seat"]
        )

    # -------------------------------------------------------------
    # 10. INTENT: Workshop Information & Cost
    # -------------------------------------------------------------
    if any(k in norm for k in ["is the workshop free", "is it free", "cost", "price", "fees", "money", "paid", "free"]):
        reply = (
            "Yes! The **Build Your First AI Project in 60 Minutes** workshop is **100% Free** for engineering students.\n\n"
            "All starter code repositories and API sandbox access are provided at zero cost."
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Claim Free Seat", "When is the workshop?", "Give me an AI project"],
            quick_cta={"label": "Claim Free Seat →", "action": "/register"}
        )

    if any(k in norm for k in ["what is the workshop", "workshop details", "how long is it", "schedule", "when"]):
        reply = (
            "**Build Your First AI Project in 60 Minutes** is a hands-on live online workshop designed for engineering students.\n\n"
            "• **Duration:** 60 Minutes\n"
            "• **Schedule:** This Saturday at 6:00 PM IST (Live Online)\n"
            "• **Format:** Code-along with live mentor Q&A\n"
            "• **Outcome:** A working AI application deployed to your GitHub."
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Reserve My Seat", "Give me an AI project", "Invite Friends"],
            quick_cta={"label": "Reserve My Seat →", "action": "/register"}
        )

    # -------------------------------------------------------------
    # 11. INTENT: Registration & Referral Information
    # -------------------------------------------------------------
    if any(k in norm for k in ["how do i register", "how to register", "join workshop", "i want to register", "get a seat", "reserve"]):
        reply = (
            "To reserve your free seat:\n\n"
            "1. Tap **Claim Free Seat** below\n"
            "2. Fill in your name, college email, WhatsApp number, and branch\n"
            "3. Submit to receive your workshop pass and instant **Campus Referral Code**!"
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Claim Free Seat →", "Give me an AI project", "Is it free?"],
            quick_cta={"label": "Claim Free Seat →", "action": "/register"}
        )

    if any(k in norm for k in ["how does referral work", "how to refer", "referral code", "where is my referral", "invite friends", "rewards"]):
        reply = (
            "When you register, you receive a unique **Campus Referral Code** (e.g. `NOVA48`).\n\n"
            "• **Share with Friends:** Invite batchmates using your personalized WhatsApp link\n"
            "• **Climb Leaderboard:** Earn verified attribution when friends join\n"
            "• **Unlock Perks:**\n"
            "   🎁 **3 Referrals:** Verified Certificate & AI Starter Toolkit\n"
            "   ⚡ **5 Referrals:** Production Python AI Boilerplate Repository\n"
            "   ✨ **10 Referrals:** 1-on-1 AI Resume & Portfolio Review"
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["View Leaderboard →", "Claim Free Seat", "Discover My Project"],
            quick_cta={"label": "View Leaderboard →", "action": "/leaderboard"}
        )

    # -------------------------------------------------------------
    # 12. INTENT: Simulated Campaign Data Questions
    # -------------------------------------------------------------
    if any(k in norm for k in ["how many registrations", "what is the cpa", "what is our cpa", "k factor", "budget spent", "campaign metrics"]):
        c = NOVASPARK_CONTEXT["campaign"]
        reply = (
            f"Here are the current simulated sprint metrics (Day 6 of 7):\n\n"
            f"• **Registrations:** {c['current_registrations']} / {c['target_registrations']} ({c['percentage']}% goal achieved)\n"
            f"• **Blended CPA:** ₹{c['cost_per_reg']:.2f} (Target: < ₹4.00)\n"
            f"• **Budget Spent:** ₹{c['budget_spent']:,.0f} of ₹{c['budget_total']:,.0f} (₹{c['budget_remaining']:,.0f} remaining)\n"
            f"• **Viral K-Factor:** {c['viral_k_factor']}\n"
            f"• **Timeline:** {c['current_day']} ({c['remaining_days']} day remaining)"
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["Open Growth Cockpit →", "View Leaderboard", "Discover My Project"],
            quick_cta={"label": "Open Growth Cockpit →", "action": "/growth"}
        )

    # -------------------------------------------------------------
    # 13. INTENT: Greetings & Casual Pleasantries
    # -------------------------------------------------------------
    if any(k in norm.split() for k in ["hi", "hello", "hey", "hola", "greetings"]):
        reply = (
            "Hey! I'm Nova, your AI project assistant 👋\n\n"
            "Tell me your programming background (e.g. Python, beginner, ML) or career goals, and I'll match you to a 60-minute build blueprint!"
        )
        return ChatResponse(
            reply=reply,
            suggested_actions=["I know Python (Placements)", "Cybersecurity", "Computer Vision", "I'm a beginner"],
            quick_cta={"label": "Discover My Project →", "action": "/project"}
        )

    if any(k in norm for k in ["thanks", "thank you", "thx", "appreciate it"]):
        return ChatResponse(
            reply="You're very welcome! Let me know whenever you want to explore more project blueprints or jump into the 60-minute workshop.",
            suggested_actions=["Discover My Project →", "Claim Free Seat", "View Leaderboard"]
        )

    # -------------------------------------------------------------
    # 14. DEFAULT: Contextual 3-option Project Discovery
    # -------------------------------------------------------------
    return build_three_options_reply(
        intro="I can help you find an AI project tailored to your skills and placement goals.\nHere are three curated tracks:",
        p1=PROJECT_CATALOG[0], # Multimodal RAG Resume Screener
        p2=PROJECT_CATALOG[9], # Computer Vision Object Detection
        p3=PROJECT_CATALOG[1]  # AI Network Anomaly Detector
    )

def get_mock_growth_copilot(action_type: str = "insights") -> GrowthCopilotResponse:
    if action_type == "experiment":
        return GrowthCopilotResponse(
            analysis=(
                "Based on 327 active registrations, WhatsApp groups boast the lowest Cost per Registration (₹3.29) "
                "and highest viral conversion. However, 61% of registered students have made 0 referrals so far."
            ),
            key_findings=[
                "WhatsApp conversion rate is 18.4% vs Email at 4.2%",
                "Top referrers (top 5%) generate 42% of all peer invites",
                "Students who run project discovery are 2.8x more likely to refer friends"
            ],
            recommended_experiments=[
                {
                    "title": "24-Hour 'Squad Blitz' Referral Challenge",
                    "hypothesis": "Students are more likely to register when encouraged to bring 3 friends. Offering a team pass activates zero-referral users.",
                    "target_channel": "WhatsApp Student Communities",
                    "estimated_impact": "+65 registrations within 24h",
                    "budget_needed": "₹0 (organic milestone)"
                },
                {
                    "title": "College Tech-Club Rep Micro-Incentive",
                    "hypothesis": "Appoint student club leads in VIT, SRM & Amrita as Campus Ambassadors with a dedicated club referral code.",
                    "target_channel": "College Tech Clubs",
                    "estimated_impact": "+80 registrations in 48h",
                    "budget_needed": "₹400 for club perk"
                }
            ],
            generated_copy=None
        )
    elif action_type == "whatsapp_copy":
        return GrowthCopilotResponse(
            analysis="High-converting conversational copy optimized for final-year engineering WhatsApp groups and Discord servers.",
            key_findings=[
                "Actionable emojis increase CTR by 24%",
                "Emphasizing 'Free' + '60 Mins' + 'No Boring Theory' overcomes student procrastination"
            ],
            recommended_experiments=[],
            generated_copy=(
                "🚀 *Final-Year Engineers:* Stop watching boring 10-hour AI tutorials!\n\n"
                "We are joining NovaSpark's *'Build Your First AI Project in 60 Minutes'* live workshop this weekend.\n\n"
                "⚡ *What we will build:* A real AI Web App (ATS Resume Analyzer / Computer Vision system)\n"
                "🎓 *Who:* CSE / IT / ECE & any engineering branch (Zero prior AI experience needed)\n"
                "💸 *Cost:* 100% Free (Limited to 500 seats)\n\n"
                "👉 *Grab your free seat here before slots fill:* {{REFERRAL_LINK}}\n\n"
                "Let's build something real together! 💻🔥"
            )
        )
    else:
        return GrowthCopilotResponse(
            analysis=(
                "Campaign is currently at 65.4% (327 / 500 registrations) with 1 day remaining in the 7-day sprint. "
                "The current Viral Coefficient (K-factor) is **0.26**, meaning approximately 1 in 4 registered students brings in a friend organically."
            ),
            key_findings=[
                "WhatsApp and Campus Referrals drive 143 total signups (43.7% of all registrations).",
                "Total budget spent is ₹1,250 of ₹2,000, resulting in a blended Cost/Registration of only ₹3.82 (Target was < ₹4.00).",
                "Referral channel has an effective Cost per Registration of ₹0.00."
            ],
            recommended_experiments=[
                {
                    "title": "Trigger Automated WhatsApp Referral Prompt Post-Signup",
                    "hypothesis": "Prompting user to share immediately after discovering their custom AI project will lift K-factor from 0.26 to 0.45.",
                    "target_channel": "Post-Registration Confirmation",
                    "estimated_impact": "+75 viral registrations",
                    "budget_needed": "₹0"
                }
            ],
            generated_copy=None
        )
