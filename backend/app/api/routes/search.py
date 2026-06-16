from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.models.business import Service
from app.models.partner import PartnerProfile, PartnerStatus
from app.schemas.business import Service as ServiceSchema

router = APIRouter()

from app.models.analytics import SearchHistory
from datetime import datetime, timezone
from fastapi import Request

@router.get("/", response_model=List[ServiceSchema])
def search_services(
    request: Request,
    emirate_id: Optional[int] = None,
    city_id: Optional[int] = None,
    category_id: Optional[int] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Service).join(PartnerProfile).filter(
        Service.is_active == True, 
        Service.is_deleted == False,
        PartnerProfile.status == PartnerStatus.VERIFIED
    )
    
    if city_id:
        query = query.filter(Service.city_id == city_id)
    if category_id:
        query = query.filter(Service.category_id == category_id)
    if q:
        query = query.filter(Service.title.ilike(f"%{q}%"))

    # Log the search
    # We can try to extract user_id if token is present, but for now we log as anonymous if not easy
    search_log = SearchHistory(
        emirate_id=emirate_id,
        city_id=city_id,
        category_id=category_id,
        search_query=q
    )
    db.add(search_log)
    db.commit()
        
    return query.all()
