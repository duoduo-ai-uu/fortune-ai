"""数据库初始化脚本 - 创建默认数据"""
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.admin import Admin
from app.models.config import PromptTemplate, BackgroundImage
from app.models.fortune import FortuneType


def init_db():
    db: Session = SessionLocal()
    try:
        # 1. 创建默认管理员（如果不存在）
        if not db.query(Admin).first():
            admin = Admin(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                role="super_admin",
                is_active=True,
            )
            db.add(admin)
            print("✅ 创建默认管理员: admin / admin123")

        # 2. 创建算命类型
        fortune_types = [
            {"name": "整体运势", "name_en": "general", "icon": "🔮", "sort_order": 1},
            {"name": "爱情运势", "name_en": "love", "icon": "💕", "sort_order": 2},
            {"name": "事业运势", "name_en": "career", "icon": "💼", "sort_order": 3},
            {"name": "财运", "name_en": "wealth", "icon": "💰", "sort_order": 4},
            {"name": "健康运势", "name_en": "health", "icon": "❤️", "sort_order": 5},
        ]
        for ft in fortune_types:
            exists = db.query(FortuneType).filter(FortuneType.name_en == ft["name_en"]).first()
            if not exists:
                db.add(FortuneType(**ft))
        print("✅ 创建算命类型")

        # 3. 创建默认提示词模板
        default_prompts = [
            {
                "name": "通用算命",
                "fortune_type": "general",
                "system_prompt": "你是一位神秘的算命大师，善于解读命运。你需要根据用户的问题给出温暖、有洞察力的回答。使用中文回复，保持神秘感但不要过度玄学。",
                "user_prompt_template": "用户问题：{message}\n请给出你的解读：",
                "is_default": True,
            },
            {
                "name": "爱情算命",
                "fortune_type": "love",
                "system_prompt": "你是爱情占卜师，擅长解读感情运势。回答要温暖细腻，帮助用户理解感情状态。",
                "user_prompt_template": "用户的感情问题：{message}\n请解读：",
                "is_default": False,
            },
        ]
        for dp in default_prompts:
            exists = db.query(PromptTemplate).filter(PromptTemplate.name == dp["name"]).first()
            if not exists:
                db.add(PromptTemplate(**dp))
        print("✅ 创建默认提示词模板")

        # 4. 创建默认背景图
        default_backgrounds = [
            {"name": "梦幻星空", "image_url": "https://dummyimage.com/1200x2200/1a0a2e/ffffff&text=Starry+Sky", "category": "general", "is_default": True, "sort_order": 1},
            {"name": "浪漫粉紫", "image_url": "https://dummyimage.com/1200x2200/ffb6c1/ffffff&text=Love+Rose", "category": "love", "is_default": False, "sort_order": 2},
            {"name": "事业金色", "image_url": "https://dummyimage.com/1200x2200/ffd700/ffffff&text=Golden+Career", "category": "career", "is_default": False, "sort_order": 3},
        ]
        for bg in default_backgrounds:
            exists = db.query(BackgroundImage).filter(BackgroundImage.name == bg["name"]).first()
            if not exists:
                db.add(BackgroundImage(**bg))
        print("✅ 创建默认背景图")

        db.commit()
        print("\n🎉 数据库初始化完成！")

    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
