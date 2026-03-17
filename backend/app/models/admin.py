"""
数据库模型 - 管理员
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Admin(Base):
    """管理员"""
    __tablename__ = "admins"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=True)
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(256), nullable=False)
    
    # 权限角色
    role = Column(String(32), default="viewer")  # super_admin, prompt_engineer, content_editor, viewer
    permissions = Column(String(512), nullable=True)  # JSON 数组
    
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Admin {self.username}>"


class AdminLoginLog(Base):
    """管理员登录日志"""
    __tablename__ = "admin_login_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True))
    ip_address = Column(String(45))
    user_agent = Column(String(512))
    success = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
