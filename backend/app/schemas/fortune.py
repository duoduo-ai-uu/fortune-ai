"""
Pydantic Schemas - 算命
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


# 算命类型
class FortuneTypeBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None


class FortuneTypeCreate(FortuneTypeBase):
    sort_order: int = 0


class FortuneTypeUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class FortuneTypeResponse(FortuneTypeBase):
    id: UUID
    sort_order: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# 算命会话
class FortuneSessionBase(BaseModel):
    session_type: str = "general"
    title: Optional[str] = None


class FortuneSessionCreate(FortuneSessionBase):
    pass


class FortuneSessionResponse(FortuneSessionBase):
    id: UUID
    user_id: UUID
    status: str
    total_messages: int
    total_tokens: int
    created_at: datetime
    updated_at: datetime
    ended_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# 算命消息
class FortuneMessageBase(BaseModel):
    role: str
    content: str


class FortuneMessageCreate(FortuneMessageBase):
    pass


class FortuneMessageResponse(FortuneMessageBase):
    id: UUID
    session_id: UUID
    tokens: int = 0
    extra_data: Optional[dict] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# 算命请求/响应
class FortuneRequest(BaseModel):
    """用户算命请求"""
    message: str = Field(..., description="用户输入的问题")
    session_id: Optional[UUID] = None
    session_type: str = "general"  # general, love, career, wealth, health


class FortuneResponse(BaseModel):
    """算命响应"""
    message: str
    session_id: UUID
    tokens_used: int = 0
    session_type: str = "general"
