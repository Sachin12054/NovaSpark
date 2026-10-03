import random
import string
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from ..firebase import get_firestore
from ..schemas import StudentCreate, StudentResponse, StudentReferralStats, ReferralDetail

router = APIRouter(prefix="/api", tags=["Registration & Referrals"])

def generate_referral_code(name: str, firestore_db) -> str:
    """Generate clean memorable code like SACHIN27 or NOVA99."""
    cleaned = "".join(c for c in name if c.isalnum()).upper()[:6]
    if len(cleaned) < 3:
        cleaned = "NXT"
    
    students_col = firestore_db.collection("students")
    
    for _ in range(50):
        suffix = random.randint(10, 99)
        code = f"{cleaned}{suffix}"
        matches = students_col.where("referralCode", "==", code).get()
        if not matches:
            return code
            
    rand_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{cleaned}{rand_part}"

@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentCreate):
    db = get_firestore()
    students_col = db.collection("students")
    regs_col = db.collection("registrations")
    referrals_col = db.collection("referrals")
    events_col = db.collection("campaign_events")

    clean_email = payload.email.lower().strip()
    clean_phone = payload.phone.strip()

    # 1. Check duplicate email in Firestore
    dup_email = students_col.where("email", "==", clean_email).get()
    if dup_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email address is already registered."
        )

    # 2. Check duplicate phone
    dup_phone = students_col.where("phone", "==", clean_phone).get()
    if dup_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this phone number is already registered."
        )

    # 3. Process referral code if provided
    referrer_doc = None
    referral_code_used = payload.referral_code_used.strip().upper() if payload.referral_code_used else None
    
    source = payload.source or "Organic"
    if referral_code_used:
        ref_matches = students_col.where("referralCode", "==", referral_code_used).get()
        if ref_matches:
            referrer_doc = ref_matches[0]
            source = "Referral"
        else:
            referral_code_used = None

    # 4. Generate unique referral code for new student
    new_referral_code = generate_referral_code(payload.name, db)
    new_student_id = payload.auth_uid or f"st_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{random.randint(100, 999)}"
    now_iso = datetime.utcnow().isoformat()

    # 5. Create student document
    student_data = {
        "id": new_student_id,
        "name": payload.name.strip(),
        "email": clean_email,
        "phone": clean_phone,
        "college": payload.college.strip(),
        "branch": payload.branch.strip(),
        "year": payload.year,
        "referralCode": new_referral_code,
        "referredBy": referral_code_used,
        "source": source,
        "createdAt": now_iso
    }
    students_col.document(new_student_id).set(student_data)

    # 6. Record workshop registration
    regs_col.document(f"reg_{new_student_id}").set({
        "studentId": new_student_id,
        "workshopId": "ws_ai_60min",
        "registeredAt": now_iso,
        "source": source,
        "referralCode": new_referral_code,
        "referredBy": referral_code_used
    })

    # 7. Record referral relation in Firestore
    if referrer_doc:
        ref_data = referrer_doc.to_dict()
        if ref_data.get("id") != new_student_id: # Prevent self-referral
            referrals_col.document(f"ref_{new_student_id}").set({
                "referrerId": ref_data.get("id"),
                "referredStudentId": new_student_id,
                "referralCode": referral_code_used,
                "status": "confirmed",
                "createdAt": now_iso
            })

    # 8. Record telemetry event
    events_col.add({
        "eventType": "REGISTRATION_COMPLETED",
        "studentId": new_student_id,
        "source": source,
        "metadata": {"college": payload.college, "branch": payload.branch, "referredBy": referral_code_used},
        "createdAt": now_iso
    })

    return StudentResponse(
        id=new_student_id,
        name=student_data["name"],
        email=student_data["email"],
        phone=student_data["phone"],
        college=student_data["college"],
        branch=student_data["branch"],
        year=student_data["year"],
        referral_code=new_referral_code,
        referred_by=referral_code_used,
        source=source,
        created_at=now_iso,
        referral_count=0,
        rank=12
    )

@router.get("/students/{student_id_or_code}", response_model=StudentResponse)
def get_student(student_id_or_code: str):
    db = get_firestore()
    students_col = db.collection("students")
    
    # Try by ID
    doc = students_col.document(student_id_or_code).get()
    if not doc.exists:
        # Try by referral code or email
        code_matches = students_col.where("referralCode", "==", student_id_or_code.upper()).get()
        if code_matches:
            doc = code_matches[0]
        else:
            email_matches = students_col.where("email", "==", student_id_or_code.lower()).get()
            if email_matches:
                doc = email_matches[0]
            else:
                raise HTTPException(status_code=404, detail="Student not found")

    st_data = doc.to_dict()
    st_id = st_data.get("id") or doc.id

    # Count referrals made
    referrals_col = db.collection("referrals")
    ref_count = len(referrals_col.where("referrerId", "==", st_id).get())

    return StudentResponse(
        id=st_id,
        name=st_data.get("name", ""),
        email=st_data.get("email", ""),
        phone=st_data.get("phone", ""),
        college=st_data.get("college", ""),
        branch=st_data.get("branch", ""),
        year=st_data.get("year", "Final Year"),
        referral_code=st_data.get("referralCode", ""),
        referred_by=st_data.get("referredBy"),
        source=st_data.get("source", "Organic"),
        created_at=st_data.get("createdAt", datetime.utcnow().isoformat()),
        referral_count=ref_count,
        rank=max(1, 15 - ref_count)
    )

@router.get("/referrals/{code}", response_model=StudentReferralStats)
def get_referral_stats(code: str):
    db = get_firestore()
    students_col = db.collection("students")
    referrals_col = db.collection("referrals")

    st_matches = students_col.where("referralCode", "==", code.upper()).get()
    if not st_matches:
        raise HTTPException(status_code=404, detail="Referral code not found")

    st_data = st_matches[0].to_dict()
    st_id = st_data.get("id") or st_matches[0].id

    ref_docs = referrals_col.where("referrerId", "==", st_id).get()
    count = len(ref_docs)

    milestones = [3, 5, 10, 20, 50]
    next_m = 3
    for m in milestones:
        if count < m:
            next_m = m
            break
    else:
        next_m = count + 10

    details = []
    for r in ref_docs:
        rdata = r.to_dict()
        ref_st_doc = students_col.document(rdata.get("referredStudentId", "")).get()
        if ref_st_doc.exists:
            ref_st = ref_st_doc.to_dict()
            details.append(ReferralDetail(
                id=r.id,
                referred_student_name=ref_st.get("name", "Fellow Student"),
                referred_student_college=ref_st.get("college", "Engineering College"),
                date=rdata.get("createdAt", datetime.utcnow().isoformat()),
                status=rdata.get("status", "confirmed")
            ))

    return StudentReferralStats(
        student_id=st_id,
        name=st_data.get("name", "Student"),
        referral_code=st_data.get("referralCode", code),
        total_referrals=count,
        rank=max(1, 15 - count),
        next_milestone=next_m,
        referrals_needed_for_milestone=max(0, next_m - count),
        recent_referrals=details
    )
