"""管理员后台 API"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin, get_password_hash
from app.models.admin import Admin
from app.models.user import User
from app.models.config import PromptTemplate, AppConfig, BackgroundImage
from app.schemas.user import AdminCreate, AdminResponse
from app.schemas.config import (
    PromptTemplateCreate,
    PromptTemplateResponse,
    AppConfigCreate,
    AppConfigResponse,
    BackgroundImageCreate,
    BackgroundImageResponse,
)
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/admin", tags=["管理后台"])


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    return dashboard_service.get_overview(db)


@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    return [
        {
            "id": str(u.id),
            "nickname": u.nickname,
            "phone": u.phone,
            "total_queries": u.total_queries,
            "is_active": u.is_active,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.get("/admins", response_model=List[AdminResponse])
def list_admins(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    return db.query(Admin).order_by(Admin.created_at.desc()).all()


@router.post("/admins", response_model=AdminResponse)
def create_admin(
    payload: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if current_admin.role != "super_admin":
        raise HTTPException(status_code=403, detail="只有超级管理员可以创建管理员")

    exists = db.query(Admin).filter(Admin.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="用户名已存在")

    admin = Admin(
        username=payload.username,
        email=payload.email,
        phone=payload.phone,
        role=payload.role,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@router.get("/prompts", response_model=List[PromptTemplateResponse])
def list_prompts(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    return db.query(PromptTemplate).order_by(PromptTemplate.updated_at.desc()).all()


@router.post("/prompts", response_model=PromptTemplateResponse)
def create_prompt(
    payload: PromptTemplateCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    prompt = PromptTemplate(
        **payload.model_dump(),
        created_by=current_admin.id,
    )
    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt


@router.get("/configs", response_model=List[AppConfigResponse])
def list_configs(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    return db.query(AppConfig).order_by(AppConfig.updated_at.desc()).all()


@router.post("/configs", response_model=AppConfigResponse)
def create_config(
    payload: AppConfigCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    item = AppConfig(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/backgrounds", response_model=List[BackgroundImageResponse])
def list_backgrounds(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    return db.query(BackgroundImage).order_by(BackgroundImage.sort_order.asc()).all()


@router.post("/backgrounds", response_model=BackgroundImageResponse)
def create_background(
    payload: BackgroundImageCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    item = BackgroundImage(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
