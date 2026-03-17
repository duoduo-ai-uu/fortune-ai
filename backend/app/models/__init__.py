"""
数据库模型 - 初始化
"""
from app.models.user import User
from app.models.admin import Admin, AdminLoginLog
from app.models.fortune import FortuneSession, FortuneMessage, FortuneType
from app.models.config import PromptTemplate, AppConfig, BackgroundImage

__all__ = [
    "User",
    "Admin", 
    "AdminLoginLog",
    "FortuneSession",
    "FortuneMessage", 
    "FortuneType",
    "PromptTemplate",
    "AppConfig",
    "BackgroundImage",
]
