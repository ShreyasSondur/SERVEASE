from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_active_admin, get_current_active_mod
from app.models.user import User, UserRole
from app.models.partner import PartnerProfile, PartnerStatus
from app.models.catalog import Category, City
from app.models.business import ActivityLog
from app.models.analytics import SearchHistory
from app.schemas.partner import PartnerProfile as PartnerProfileSchema
from app.schemas.catalog import CategoryCreate, Category as CategorySchema, CityCreate, City as CitySchema, EmirateCreate

router = APIRouter()

# -----------------
# Dashboard (Mod & Admin)
# -----------------
@router.get("/dashboard", response_model=dict)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_mod)):
    from app.models.business import Service, Deal
    users_count = db.query(User).filter(User.role == UserRole.USER).count()
    partners_count = db.query(PartnerProfile).count()
    services_count = db.query(Service).count()
    deals_count = db.query(Deal).count()
    
    return {
        "users": users_count,
        "partners": partners_count,
        "services": services_count,
        "deals": deals_count
    }

# -----------------
# Partner Management (Mod & Admin)
# -----------------
@router.get("/partners", response_model=List[PartnerProfileSchema])
def list_partners(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_mod)):
    partners = db.query(PartnerProfile).offset(skip).limit(limit).all()
    return partners

@router.patch("/verify/{partner_id}", response_model=PartnerProfileSchema)
def verify_partner(partner_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_mod)):
    partner = db.query(PartnerProfile).filter(PartnerProfile.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
        
    partner.status = PartnerStatus.VERIFIED
    partner.is_verified = True
    db.commit()
    db.refresh(partner)
    
    # Log action
    log = ActivityLog(user_id=current_user.id, action="VERIFY_PARTNER", description=f"Verified partner {partner_id}")
    db.add(log)
    db.commit()
    
    return partner

@router.patch("/suspend/{partner_id}", response_model=PartnerProfileSchema)
def suspend_partner(
    partner_id: int, 
    hours: int = Query(0, ge=0),
    days: int = Query(0, ge=0),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_mod)
):
    partner = db.query(PartnerProfile).filter(PartnerProfile.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
        
    partner.status = PartnerStatus.SUSPENDED
    partner.is_verified = False
    
    if hours > 0 or days > 0:
        partner.suspended_until = datetime.now(timezone.utc) + timedelta(hours=hours, days=days)
    else:
        # Permanent suspension if no time specified
        partner.suspended_until = None
        
    db.commit()
    db.refresh(partner)
    
    # Log action
    log = ActivityLog(user_id=current_user.id, action="SUSPEND_PARTNER", description=f"Suspended partner {partner_id} for {days} days, {hours} hours")
    db.add(log)
    db.commit()
    
    return partner

@router.patch("/ban/{partner_id}", response_model=PartnerProfileSchema)
def ban_partner(partner_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_mod)):
    partner = db.query(PartnerProfile).filter(PartnerProfile.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
        
    partner.status = PartnerStatus.BANNED
    partner.is_verified = False
    partner.suspended_until = None
    db.commit()
    db.refresh(partner)
    
    log = ActivityLog(user_id=current_user.id, action="BAN_PARTNER", description=f"Banned partner {partner_id}")
    db.add(log)
    db.commit()
    
    return partner

# -----------------
# Mod Management (Admin Only)
# -----------------
@router.get("/mods")
def list_mods(db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    mods = db.query(User).filter(User.role == UserRole.MODERATOR).all()
    return [{"id": m.id, "email": m.email, "is_active": m.is_active} for m in mods]

@router.patch("/mods/verify/{mod_id}")
def verify_mod(mod_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    mod = db.query(User).filter(User.id == mod_id, User.role == UserRole.MODERATOR).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Moderator not found")
    mod.is_active = True
    db.commit()
    
    log = ActivityLog(user_id=current_admin.id, action="VERIFY_MOD", description=f"Verified moderator {mod_id}")
    db.add(log)
    db.commit()
    
    return {"message": "Moderator verified successfully"}

# -----------------
# Catalog Management (Admin Only)
# -----------------
@router.post("/categories", response_model=CategorySchema)
def add_category(cat: CategoryCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    db_cat = Category(name=cat.name, description=cat.description)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.post("/emirates", response_model=dict)
def add_emirate(emirate: EmirateCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    from app.models.catalog import Emirate
    db_em = Emirate(name=emirate.name)
    db.add(db_em)
    db.commit()
    db.refresh(db_em)
    return {"id": db_em.id, "name": db_em.name}

@router.post("/cities", response_model=CitySchema)
def add_city(city: CityCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    db_city = City(name=city.name, emirate_id=city.emirate_id)
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

# -----------------
# Analytics & Logs (Admin Only)
# -----------------
@router.get("/analytics/searches")
def get_search_history(db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    searches = db.query(SearchHistory).all()
    return [{
        "id": s.id,
        "query": s.search_query,
        "emirate_id": s.emirate_id,
        "city_id": s.city_id,
        "timestamp": s.timestamp
    } for s in searches]

@router.get("/logs")
def get_activity_logs(db: Session = Depends(get_db), current_admin: User = Depends(get_current_active_admin)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()
    return [{
        "id": l.id,
        "user_id": l.user_id,
        "action": l.action,
        "description": l.description,
        "timestamp": l.timestamp
    } for l in logs]
