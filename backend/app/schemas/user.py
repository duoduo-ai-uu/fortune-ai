"""
Pydantic Schemas - 用户
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


# 用户
class UserBase(BaseModel):
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    openid: Optional[str] = None


class UserUpdate(UserBase):
    age: Optional[int] = None
    gender: Optional[str] = None
    interests: Optional[str] = None


class UserResponse(UserBase):
    id: UUID
    openid: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    interests: Optional[str] = None
    total_queries: int = 0
    vip_expire_at: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True


# 管理员
class AdminBase(BaseModel):
    username: str
    email: Optional[str] = None
    phone: Optional[str] = None


class AdminCreate(AdminBase):
    password: str
    role: str = "viewer"


class AdminUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[str] = None
    is_active: Optional[bool] = None


class AdminResponse(AdminBase):
    id: UUID
    role: str
    permissions: Optional[str] = None
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# 认证
class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminResponse


class TokenData(BaseModel):
    user_id: str
    user_type: str = "user"
