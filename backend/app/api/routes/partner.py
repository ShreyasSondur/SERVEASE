from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.partner import PartnerProfile, PartnerStatus
from app.schemas.partner import PartnerProfileCreate, PartnerProfileUpdate, PartnerProfile as PartnerProfileSchema

router = APIRouter()

@router.post("/apply", response_model=PartnerProfileSchema)
def apply_for_partner(
    profile_in: PartnerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.USER:
        raise HTTPException(status_code=400, detail="Only standard users can apply to be a partner.")
    
    existing_profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="You have already applied for a partner profile.")
    
    new_profile = PartnerProfile(
        user_id=current_user.id,
        first_name=profile_in.first_name,
        last_name=profile_in.last_name,
        phone=profile_in.phone,
        emirate=profile_in.emirate,
        city=profile_in.city,
        emirate_id_number=profile_in.emirate_id_number,
        business_name=profile_in.business_name,
        emirates_id_url=profile_in.emirates_id_url,
        status=PartnerStatus.PENDING
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/profile", response_model=PartnerProfileSchema)
def get_partner_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Partner profile not found.")
    return profile

@router.put("/profile", response_model=PartnerProfileSchema)
def update_partner_profile(
    profile_in: PartnerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Partner profile not found.")
    
    if profile_in.business_name:
        profile.business_name = profile_in.business_name
    if profile_in.emirates_id_url:
        profile.emirates_id_url = profile_in.emirates_id_url
        
    db.commit()
    db.refresh(profile)
    return profile
