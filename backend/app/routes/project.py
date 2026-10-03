from fastapi import APIRouter
from ..schemas import ProjectRecommendRequest, ProjectRecommendation
from ..ai.service import ai_service

router = APIRouter(prefix="/api/project", tags=["AI Project Generator"])

@router.post("/recommend", response_model=ProjectRecommendation)
async def recommend_project(payload: ProjectRecommendRequest):
    return await ai_service.recommend_project(
        branch=payload.branch,
        year=payload.year,
        coding_experience=payload.coding_experience,
        preferred_area=payload.preferred_area,
        ai_experience=payload.ai_experience,
        what_to_build=payload.what_to_build
    )
