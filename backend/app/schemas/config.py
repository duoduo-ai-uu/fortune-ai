"""
Pydantic Schemas - 配置
"""
from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID


# 提示词模板
class PromptTemplateBase(BaseModel):
    name: str
    fortune_type: Optional[str] = None
    system_prompt: str
    user_prompt_template: Optional[str] = None


class PromptTemplateCreate(PromptTemplateBase):
    model: str = "gpt-4o-mini"
    temperature: float = 0.7
    max_tokens: int = 2000


class PromptTemplateUpdate(BaseModel):
    name: Optional[str] = None
    fortune_type: Optional[str] = None
    system_prompt: Optional[str] = None
    user_prompt_template: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    is_active: Optional[bool] = None
    is_default: Optional[bool] = None


class PromptTemplateResponse(PromptTemplateBase):
    id: UUID
    model: str
    temperature: float
    max_tokens: int
    is_active: bool
    is_default: bool
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# 应用配置
class AppConfigBase(BaseModel):
    config_key: str
    config_value: Optional[Any] = None
    description: Optional[str] = None


class AppConfigCreate(AppConfigBase):
    is_public: bool = True


class AppConfigUpdate(BaseModel):
    config_value: Optional[Any] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


class AppConfigResponse(AppConfigBase):
    id: UUID
    is_public: bool
    updated_at: datetime
    
    class Config:
        from_attributes = True


# 背景图
class BackgroundImageBase(BaseModel):
    name: str
    image_url: str
    thumbnail_url: Optional[str] = None
    category: str = "general"


class BackgroundImageCreate(BackgroundImageBase):
    sort_order: int = 0


class BackgroundImageUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    is_default: Optional[bool] = None
    sort_order: Optional[int] = None


class BackgroundImageResponse(BackgroundImageBase):
    id: UUID
    is_active: bool
    is_default: bool
    sort_order: int
    created_at: datetime
    
    class Config:
        from_attributes = True
