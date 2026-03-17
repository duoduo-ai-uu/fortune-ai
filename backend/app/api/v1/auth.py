"""
API 路由 - 认证
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.config import settings
from app.models.admin import Admin, AdminLoginLog
from app.schemas.user import LoginRequest, LoginResponse, AdminCreate, AdminResponse

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """管理员登录"""
    admin = db.query(Admin).filter(Admin.username == form_data.username).first()
    
    # 记录登录日志
    log = AdminLoginLog(
        admin_id=admin.id if admin else None,
        success=False
    )
    
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        db.add(log)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    if not admin.is_active:
        db.add(log)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账号已被禁用"
        )
    
    # 更新登录信息
    admin.last_login = datetime.utcnow()
    log.success = True
    db.add(log)
    db.commit()
    
    # 生成 token
    access_token = create_access_token(
        data={"sub": str(admin.id), "type": "admin"}
    )
    
    return LoginResponse(
        access_token=access_token,
        user=AdminResponse.model_validate(admin)
    )


@router.post("/register", response_model=AdminResponse)
def register(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    """注册管理员（首个用户）"""
    # 检查是否已有管理员
    existing = db.query(Admin).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="管理员已存在"
        )
    
    admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        phone=admin_data.phone,
        hashed_password=get_password_hash(admin_data.password),
        role="super_admin"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    return AdminResponse.model_validate(admin)


from datetime import datetime
