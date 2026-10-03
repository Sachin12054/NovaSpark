import datetime
import random
from sqlalchemy.orm import Session
from .models import Student, Referral, CampaignDailyMetric

COLLEGES = [
    "VIT Vellore", "Amrita University", "SRM University", "IIT Madras",
    "BITS Pilani", "Delhi Technological University (DTU)", "RVCE Bangalore",
    "PSG Tech Coimbatore", "PES University", "NIT Trichy", "Manipal Institute of Tech"
]

BRANCHES = [
    "Computer Science & Engg (CSE)", "AI & Data Science (AIDS)",
    "Information Technology (IT)", "Electronics & Comm (ECE)", "Electrical & Electronics (EEE)"
]

SOURCES = ["Organic", "Referral", "WhatsApp", "College Clubs", "Email", "Other"]

FIRST_NAMES = [
    "Arjun", "Priya", "Rahul", "Ananya", "Karthik", "Neha", "Sachin", "Rohan",
    "Sneha", "Aditya", "Divya", "Varun", "Pooja", "Vikram", "Shreya", "Manish",
    "Deepak", "Swati", "Naveen", "Megha", "Gaurav", "Tanvi", "Siddharth", "Aishwarya",
    "Harish", "Rhea", "Abhishek", "Shruti", "Sanjay", "Ankita", "Akash", "Bhavna"
]

LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Reddy", "Iyer", "Gupta", "Kumar", "Nair",
    "Singh", "Chopra", "Deshmukh", "Menon", "Joshi", "Rao", "Mishra", "Choudhury"
]

def seed_initial_database(db: Session):
    existing_count = db.query(Student).count()
    if existing_count >= 50:
        return # Already seeded

    # Top seed referrers
    leaders = [
        {"name": "Arjun Sharma", "college": "VIT Vellore", "branch": "CSE", "code": "ARJUN24", "count": 24},
        {"name": "Priya Patel", "college": "Amrita University", "branch": "AI & Data Science", "code": "PRIYA19", "count": 19},
        {"name": "Rahul Verma", "college": "SRM University", "branch": "CSE", "code": "RAHUL17", "count": 17},
        {"name": "Ananya Reddy", "college": "IIT Madras", "branch": "ECE", "code": "ANANYA14", "count": 14},
        {"name": "Karthik Iyer", "college": "BITS Pilani", "branch": "IT", "code": "KARTHIK11", "count": 11},
        {"name": "Sachin Kumar", "college": "RVCE Bangalore", "branch": "CSE", "code": "SACHIN27", "count": 7},
    ]

    leader_objs = []
    for idx, l in enumerate(leaders):
        phone_num = f"98765{idx:05d}"
        email_addr = f"{l['name'].lower().replace(' ', '.')}@example.com"
        
        student = Student(
            name=l["name"],
            email=email_addr,
            phone=phone_num,
            college=l["college"],
            branch=l["branch"],
            year="Final Year",
            referral_code=l["code"],
            referred_by=None,
            source="WhatsApp" if idx % 2 == 0 else "College Clubs",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(2, 6))
        )
        db.add(student)
        db.flush()
        leader_objs.append((student, l["count"]))

    db.commit()

    # Seed referred students and organic students
    total_to_create = 90
    used_emails = set()
    used_phones = set()

    for i in range(total_to_create):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        name = f"{fname} {lname}"
        
        email = f"{fname.lower()}.{lname.lower()}{i+10}@gmail.com"
        phone = f"91234{i+10000}"
        
        # Decide if referred by one of top leaders
        referred_by_code = None
        source = random.choice(SOURCES)
        
        referrer_student = None
        if leader_objs and (i < 65): # 65% are referrals
            ref_choice, _ = random.choice(leader_objs)
            referrer_student = ref_choice
            referred_by_code = ref_choice.referral_code
            source = "Referral"

        code = f"{fname.upper()[:4]}{random.randint(10, 99)}"

        new_st = Student(
            name=name,
            email=email,
            phone=phone,
            college=random.choice(COLLEGES),
            branch=random.choice(BRANCHES),
            year="Final Year" if random.random() > 0.15 else "3rd Year",
            referral_code=code,
            referred_by=referred_by_code,
            source=source,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 5), hours=random.randint(1, 23))
        )
        db.add(new_st)
        db.flush()

        if referrer_student:
            ref_rel = Referral(
                referrer_id=referrer_student.id,
                referred_student_id=new_st.id,
                status="confirmed",
                created_at=new_st.created_at
            )
            db.add(ref_rel)

    db.commit()
    print("Database seeded with simulated students and referrals successfully.")
