import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Environment variables
PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "novaspark-c1883")
CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL", "")
PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

class LocalFirestoreSimulator:
    """In-memory Firestore-compatible store for local simulation and demo fallback."""
    def __init__(self):
        self._collections: Dict[str, Dict[str, Dict[str, Any]]] = {
            "students": {},
            "registrations": {},
            "referrals": {},
            "campaign_events": {},
            "growth_metrics": {},
            "chat_sessions": {},
            "project_recommendations": {}
        }
        self._id_counter = 1000

    def collection(self, name: str):
        if name not in self._collections:
            self._collections[name] = {}
        return LocalCollectionRef(self, name)

class LocalCollectionRef:
    def __init__(self, store: LocalFirestoreSimulator, name: str):
        self.store = store
        self.name = name

    def document(self, doc_id: Optional[str] = None):
        if not doc_id:
            self.store._id_counter += 1
            doc_id = f"doc_{self.store._id_counter}"
        return LocalDocumentRef(self.store, self.name, doc_id)

    def add(self, data: Dict[str, Any]):
        self.store._id_counter += 1
        doc_id = f"doc_{self.store._id_counter}"
        data_copy = dict(data)
        if "id" not in data_copy:
            data_copy["id"] = doc_id
        self.store._collections[self.name][doc_id] = data_copy
        return (None, LocalDocumentRef(self.store, self.name, doc_id))

    def where(self, field: str, op: str, value: Any):
        return LocalQuery(self.store, self.name, [(field, op, value)])

    def get(self):
        docs = []
        for doc_id, data in self.store._collections[self.name].items():
            docs.append(LocalDocumentSnapshot(doc_id, data))
        return docs

    def limit(self, n: int):
        return LocalQuery(self.store, self.name, []).limit(n)

    def order_by(self, field: str, direction: str = "ASCENDING"):
        return LocalQuery(self.store, self.name, []).order_by(field, direction)

class LocalQuery:
    def __init__(self, store: LocalFirestoreSimulator, name: str, filters: List):
        self.store = store
        self.name = name
        self.filters = filters
        self._limit = None
        self._order = None

    def where(self, field: str, op: str, value: Any):
        self.filters.append((field, op, value))
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def order_by(self, field: str, direction: str = "ASCENDING"):
        self._order = (field, direction)
        return self

    def get(self):
        results = []
        for doc_id, data in self.store._collections[self.name].items():
            match = True
            for field, op, val in self.filters:
                doc_val = data.get(field)
                if op in ["==", "="] and doc_val != val:
                    match = False
                    break
                elif op == "in" and doc_val not in val:
                    match = False
                    break
            if match:
                results.append(LocalDocumentSnapshot(doc_id, data))

        if self._order:
            field, direction = self._order
            results.sort(
                key=lambda x: x.to_dict().get(field, 0),
                reverse=(direction.upper() in ["DESC", "DESCENDING"])
            )

        if self._limit:
            results = results[:self._limit]

        return results

class LocalDocumentRef:
    def __init__(self, store: LocalFirestoreSimulator, col_name: str, doc_id: str):
        self.store = store
        self.col_name = col_name
        self.id = doc_id

    def set(self, data: Dict[str, Any], merge: bool = False):
        if merge and self.id in self.store._collections[self.col_name]:
            self.store._collections[self.col_name][self.id].update(data)
        else:
            data_copy = dict(data)
            data_copy["id"] = self.id
            self.store._collections[self.col_name][self.id] = data_copy

    def update(self, data: Dict[str, Any]):
        if self.id in self.store._collections[self.col_name]:
            self.store._collections[self.col_name][self.id].update(data)
        else:
            self.set(data)

    def get(self):
        data = self.store._collections[self.col_name].get(self.id)
        return LocalDocumentSnapshot(self.id, data)

class LocalDocumentSnapshot:
    def __init__(self, doc_id: str, data: Optional[Dict[str, Any]]):
        self.id = doc_id
        self._data = data
        self.exists = data is not None

    def to_dict(self) -> Dict[str, Any]:
        return dict(self._data) if self._data else {}

# Initialize Firestore or Local Emulator
db = None

def init_firestore():
    global db
    if db is not None:
        return db

    # Try initializing real Firebase Admin if credentials are supplied
    if CLIENT_EMAIL and PRIVATE_KEY and not DEMO_MODE:
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore
            
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": PROJECT_ID,
                "private_key": PRIVATE_KEY,
                "client_email": CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token",
            })
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {"projectId": PROJECT_ID})
            db = firestore.client()
            logger.info("Connected to live Firebase Firestore!")
            return db
        except Exception as e:
            logger.warning(f"Could not connect to Firebase Admin SDK: {e}. Using simulated Firestore.")

    logger.info("Using in-memory simulated Firestore with seeded dataset.")
    db = LocalFirestoreSimulator()
    seed_firestore(db)
    return db

def seed_firestore(firestore_db):
    """Seed ~100 realistic simulated students and referral graph into Firestore."""
    students_col = firestore_db.collection("students")
    referrals_col = firestore_db.collection("referrals")
    regs_col = firestore_db.collection("registrations")

    # Check if already seeded
    if len(students_col.get()) > 10:
        return

    leaders = [
        {"id": "st_1", "name": "Arjun Sharma", "college": "VIT Vellore", "branch": "CSE", "code": "ARJUN24", "count": 24, "email": "arjun.sharma@example.com", "phone": "9876500001"},
        {"id": "st_2", "name": "Priya Patel", "college": "Amrita University", "branch": "AI & Data Science", "code": "PRIYA19", "count": 19, "email": "priya.patel@example.com", "phone": "9876500002"},
        {"id": "st_3", "name": "Rahul Verma", "college": "SRM University", "branch": "CSE", "code": "RAHUL17", "count": 17, "email": "rahul.verma@example.com", "phone": "9876500003"},
        {"id": "st_4", "name": "Ananya Reddy", "college": "IIT Madras", "branch": "ECE", "code": "ANANYA14", "count": 14, "email": "ananya.reddy@example.com", "phone": "9876500004"},
        {"id": "st_5", "name": "Karthik Iyer", "college": "BITS Pilani", "branch": "IT", "code": "KARTHIK11", "count": 11, "email": "karthik.iyer@example.com", "phone": "9876500005"},
        {"id": "st_6", "name": "Neha Gupta", "college": "DTU Delhi", "branch": "CSE", "code": "NEHA09", "count": 9, "email": "neha.gupta@example.com", "phone": "9876500006"},
        {"id": "st_7", "name": "Sachin Kumar", "college": "RVCE Bangalore", "branch": "CSE", "code": "SACHIN27", "count": 7, "email": "sachin.kumar@example.com", "phone": "9876500007"},
    ]

    for l in leaders:
        student_doc = {
            "id": l["id"],
            "name": l["name"],
            "email": l["email"],
            "phone": l["phone"],
            "college": l["college"],
            "branch": l["branch"],
            "year": "Final Year",
            "referralCode": l["code"],
            "referredBy": None,
            "source": "WhatsApp",
            "createdAt": datetime.utcnow().isoformat()
        }
        students_col.document(l["id"]).set(student_doc)
        regs_col.document(f"reg_{l['id']}").set({
            "studentId": l["id"],
            "workshopId": "ws_ai_60min",
            "registeredAt": datetime.utcnow().isoformat(),
            "source": "WhatsApp",
            "referralCode": l["code"],
            "referredBy": None
        })

    # Seed peer referrals
    import random
    first_names = ["Varun", "Sneha", "Deepak", "Megha", "Rohan", "Divya", "Aakash", "Tanvi", "Gaurav", "Swati", "Naveen", "Pooja", "Vikram", "Shreya", "Aditya", "Rhea"]
    last_names = ["Reddy", "Rao", "Menon", "Joshi", "Kumar", "Sharma", "Deshmukh", "Singh", "Nair", "Iyer", "Chopra"]
    colleges = ["VIT Vellore", "Amrita University", "SRM University", "IIT Madras", "BITS Pilani", "RVCE Bangalore", "PES University", "PSG Tech"]
    branches = ["CSE", "AI & Data Science", "Information Tech", "ECE"]

    for i in range(1, 80):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        referrer = random.choice(leaders)
        st_id = f"st_sim_{i}"
        code = f"{fname.upper()[:4]}{random.randint(10, 99)}"

        student_doc = {
            "id": st_id,
            "name": f"{fname} {lname}",
            "email": f"{fname.lower()}.{lname.lower()}{i}@gmail.com",
            "phone": f"91234{10000 + i}",
            "college": random.choice(colleges),
            "branch": random.choice(branches),
            "year": "Final Year",
            "referralCode": code,
            "referredBy": referrer["code"],
            "source": "Referral",
            "createdAt": datetime.utcnow().isoformat()
        }
        students_col.document(st_id).set(student_doc)
        regs_col.document(f"reg_{st_id}").set({
            "studentId": st_id,
            "workshopId": "ws_ai_60min",
            "registeredAt": datetime.utcnow().isoformat(),
            "source": "Referral",
            "referralCode": code,
            "referredBy": referrer["code"]
        })
        referrals_col.document(f"ref_{st_id}").set({
            "referrerId": referrer["id"],
            "referredStudentId": st_id,
            "referralCode": referrer["code"],
            "status": "confirmed",
            "createdAt": datetime.utcnow().isoformat()
        })

# Export initialized instance
get_firestore = init_firestore
