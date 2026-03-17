"""
数据库模型 - 用户
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class User(Base):
    """小程序用户"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    openid = Column(String(128), unique=True, index=True, nullable=True)  # 微信openid
    nickname = Column(String(64), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # 画像数据
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)  # male, female
    interests = Column(Text, nullable=True)  # JSON 数组
    
    # 统计
    total_queries = Column(Integer, default=0)
    vip_expire_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<User {self.nickname or self.id}>"
