"""数据看板服务"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.fortune import FortuneSession, FortuneMessage


class DashboardService:
    def get_overview(self, db: Session) -> dict:
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        total_sessions = db.query(FortuneSession).count()
        total_messages = db.query(FortuneMessage).count()
        total_queries = sum((u.total_queries or 0) for u in db.query(User).all())

        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_sessions": total_sessions,
            "total_messages": total_messages,
            "total_queries": total_queries,
            "avg_queries_per_user": round(total_queries / total_users, 2) if total_users else 0,
        }


dashboard_service = DashboardService()
