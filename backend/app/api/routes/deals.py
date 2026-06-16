from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_active_partner, get_current_user
from app.models.user import User, UserRole
from app.models.partner import PartnerProfile, PartnerStatus
from app.models.business import Deal, Service
from app.schemas.business import Deal as DealSchema, DealCreate, DealUpdate

router = APIRouter()

@router.get("/", response_model=List[DealSchema])
def list_deals(
    skip: int = 0, 
    limit: int = 100,
    emirate_id: int | None = None,
    city_id: int | None = None,
    category_id: int | None = None,
    q: str | None = None,
    db: Session = Depends(get_db)
):
    # Join with PartnerProfile to ensure only verified partners' deals are shown
    query = db.query(Deal).join(PartnerProfile).join(Service, Deal.service_id == Service.id).filter(
        Deal.is_active == True,
        Deal.is_deleted == False,
        PartnerProfile.status == PartnerStatus.VERIFIED,
        Service.is_active == True,
        Service.is_deleted == False
    )

    if city_id:
        query = query.filter(Service.city_id == city_id)
    # Emirate ID can be checked if Service.city has emirate_id but we don't have direct join unless we join City
    if emirate_id:
        from app.models.catalog import City
        query = query.join(City, Service.city_id == City.id).filter(City.emirate_id == emirate_id)
    if category_id:
        query = query.filter(Service.category_id == category_id)
    if q:
        query = query.filter(Service.title.ilike(f"%{q}%"))

    deals = query.offset(skip).limit(limit).all()
    return deals

@router.post("/", response_model=DealSchema)
def create_deal(
    deal_in: DealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_partner),
):
    profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    if not profile or profile.status != PartnerStatus.VERIFIED:
        raise HTTPException(status_code=403, detail="Only verified partners can create deals.")
        
    service = db.query(Service).filter(Service.id == deal_in.service_id, Service.is_deleted == False).first()
    if not service or service.partner_id != profile.id:
        raise HTTPException(status_code=404, detail="Service not found or you don't own it.")
    
    current_deals_count = db.query(Deal).filter(Deal.partner_id == profile.id, Deal.is_deleted == False).count()
    if current_deals_count >= profile.deals_limit:
        raise HTTPException(status_code=400, detail=f"Deal limit of {profile.deals_limit} reached.")
        
    deal = Deal(
        service_id=deal_in.service_id,
        partner_id=profile.id,
        discount_desc=deal_in.discount_desc,
        expiry_date=deal_in.expiry_date,
    )
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal

@router.put("/{deal_id}", response_model=DealSchema)
def update_deal(
    deal_id: int,
    deal_in: DealUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_partner),
):
    profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.is_deleted == False).first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found.")
    if deal.partner_id != profile.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough privileges to update this deal.")
    if profile.status in [PartnerStatus.SUSPENDED, PartnerStatus.BANNED]:
        raise HTTPException(status_code=403, detail="Suspended or banned partners cannot modify deals.")
        
    update_data = deal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(deal, field, value)
        
    db.commit()
    db.refresh(deal)
    return deal

@router.delete("/{deal_id}", response_model=dict)
def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_partner),
):
    profile = db.query(PartnerProfile).filter(PartnerProfile.user_id == current_user.id).first()
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.is_deleted == False).first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found.")
    if deal.partner_id != profile.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough privileges to delete this deal.")
    if profile.status in [PartnerStatus.SUSPENDED, PartnerStatus.BANNED]:
        raise HTTPException(status_code=403, detail="Suspended or banned partners cannot modify deals.")
        
    deal.is_deleted = True
    db.commit()
    return {"detail": "Deal deleted successfully."}
