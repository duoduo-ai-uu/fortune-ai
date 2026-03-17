"""
数据库模型 - 算命会话和记录
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class FortuneSession(Base):
    """算命会话"""
    __tablename__ = "fortune_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # 会话信息
    session_type = Column(String(32), default="general")  # general, love, career, wealth, health
    title = Column(String(128), nullable=True)
    status = Column(String(16), default="active")  # active, completed
    
    # 统计
    total_messages = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<FortuneSession {self.id}>"


class FortuneMessage(Base):
    """算命消息"""
    __tablename__ = "fortune_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("fortune_sessions.id"), nullable=False)
    
    # 消息内容
    role = Column(String(16), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    
    # Token 统计
    tokens = Column(Integer, default=0)
    
    # 元数据
    extra_data = Column(JSON, nullable=True)  # 额外信息
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<FortuneMessage {self.id}>"


class FortuneType(Base):
    """算命类型"""
    __tablename__ = "fortune_types"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(64), nullable=False)  # 事业、爱情、财运、健康、整体运势
    name_en = Column(String(64), nullable=True)  # career, love, wealth, health, general
    description = Column(Text, nullable=True)
    icon = Column(String(128), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<FortuneType {self.name}>"
