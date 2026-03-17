"""
数据库模型 - 配置管理
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class PromptTemplate(Base):
    """提示词模板"""
    __tablename__ = "prompt_templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(128), nullable=False)
    fortune_type = Column(String(64), nullable=True)  # 对应的算命类型
    
    # 提示词内容
    system_prompt = Column(Text, nullable=False)
    user_prompt_template = Column(Text, nullable=True)
    
    # 配置
    model = Column(String(64), default="gpt-4o-mini")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2000)
    
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    
    created_by = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<PromptTemplate {self.name}>"


class AppConfig(Base):
    """应用配置"""
    __tablename__ = "app_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    config_key = Column(String(128), unique=True, nullable=False)
    config_value = Column(JSON, nullable=True)
    description = Column(String(256), nullable=True)
    
    is_public = Column(Boolean, default=True)  # 是否对用户可见
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<AppConfig {self.config_key}>"


class BackgroundImage(Base):
    """背景图配置"""
    __tablename__ = "background_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(128), nullable=False)
    image_url = Column(String(512), nullable=False)
    thumbnail_url = Column(String(512), nullable=True)
    
    # 分类
    category = Column(String(64), default="general")  # general, love, career, etc.
    
    # 状态
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<BackgroundImage {self.name}>"
