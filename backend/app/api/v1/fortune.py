"""
API 路由 - 算命服务
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.fortune import FortuneSession, FortuneMessage, FortuneType
from app.models.config import PromptTemplate, AppConfig, BackgroundImage
from app.schemas.fortune import (
    FortuneRequest, FortuneResponse,
    FortuneSessionResponse, FortuneMessageResponse,
    FortuneTypeResponse
)
from app.services.llm_service import llm_service

router = APIRouter(prefix="/fortune", tags=["算命服务"])


# ============ 公开接口（无需认证）============
# 用于小程序测试，生产环境建议关闭或添加限流

@router.post("/chat/public")
def chat_public(
    request: FortuneRequest,
    db: Session = Depends(get_db)
):
    """公开算命接口（无需认证）"""
    message = request.message
    session_type = request.session_type or "general"
    template = db.query(PromptTemplate).filter(
        PromptTemplate.fortune_type == session_type,
        PromptTemplate.is_active == True,
        PromptTemplate.is_default == True
    ).first()
    
    if not template:
        template = db.query(PromptTemplate).filter(
            PromptTemplate.is_default == True,
            PromptTemplate.is_active == True
        ).first()
    
    system_prompt = template.system_prompt if template else None
    
    # 调用 LLM
    llm_result = llm_service.generate_fortune(
        user_message=message,
        session_type=session_type,
        system_prompt=system_prompt,
    )
    
    return {
        "message": llm_result["content"],
        "session_id": None,
        "tokens_used": llm_result["tokens"],
        "session_type": session_type
    }


# ============ 需要认证的接口 ============

@router.get("/types", response_model=List[FortuneTypeResponse])
def get_fortune_types(db: Session = Depends(get_db)):
    """获取算命类型列表"""
    types = db.query(FortuneType).filter(FortuneType.is_active == True).order_by(FortuneType.sort_order).all()
    return types


@router.get("/backgrounds", response_model=List[dict])
def get_backgrounds(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取背景图列表"""
    query = db.query(BackgroundImage).filter(BackgroundImage.is_active == True)
    if category:
        query = query.filter(BackgroundImage.category == category)
    backgrounds = query.order_by(BackgroundImage.sort_order).all()
    
    # 获取默认背景
    default_bg = db.query(BackgroundImage).filter(
        BackgroundImage.is_default == True,
        BackgroundImage.is_active == True
    ).first()
    
    return {
        "list": [
            {
                "id": str(bg.id),
                "name": bg.name,
                "image_url": bg.image_url,
                "thumbnail_url": bg.thumbnail_url,
                "category": bg.category
            }
            for bg in backgrounds
        ],
        "default": {
            "id": str(default_bg.id),
            "name": default_bg.name,
            "image_url": default_bg.image_url
        } if default_bg else None
    }


@router.post("/chat", response_model=FortuneResponse)
def chat(
    request: FortuneRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """算命对话"""
    # 获取或创建会话
    if request.session_id:
        session = db.query(FortuneSession).filter(
            FortuneSession.id == request.session_id,
            FortuneSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
    else:
        session = FortuneSession(
            user_id=current_user.id,
            session_type=request.session_type,
            title=request.message[:50]
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # 保存用户消息
    user_message = FortuneMessage(
        session_id=session.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    
    # 获取提示词模板
    template = db.query(PromptTemplate).filter(
        PromptTemplate.fortune_type == request.session_type,
        PromptTemplate.is_active == True,
        PromptTemplate.is_default == True
    ).first()
    
    if not template:
        # 使用默认提示词
        template = db.query(PromptTemplate).filter(
            PromptTemplate.is_default == True,
            PromptTemplate.is_active == True
        ).first()
    
    # 调用 LLM 服务生成回复
    system_prompt = template.system_prompt if template else None
    llm_result = llm_service.generate_fortune(
        user_message=request.message,
        session_type=request.session_type,
        system_prompt=system_prompt,
    )
    response_content = llm_result["content"]
    tokens_used = llm_result["tokens"]
    
    # 保存助手消息
    assistant_message = FortuneMessage(
        session_id=session.id,
        role="assistant",
        content=response_content,
        tokens=tokens_used
    )
    db.add(assistant_message)
    
    # 更新会话统计
    session.total_messages += 2
    session.total_tokens += tokens_used
    db.commit()
    
    # 更新用户统计（仅普通用户）
    if hasattr(current_user, 'total_queries'):
        current_user.total_queries += 1
        db.commit()
    
    return FortuneResponse(
        message=response_content,
        session_id=session.id,
        tokens_used=tokens_used,
        session_type=request.session_type
    )


# ============ 用户私有接口 ============

@router.get("/sessions", response_model=List[FortuneSessionResponse])
def get_sessions(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取用户的算命会话列表"""
    sessions = db.query(FortuneSession).filter(
        FortuneSession.user_id == current_user.id
    ).order_by(FortuneSession.updated_at.desc()).limit(limit).all()
    return sessions


@router.get("/sessions/{session_id}/messages", response_model=List[FortuneMessageResponse])
def get_session_messages(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取会话消息历史"""
    session = db.query(FortuneSession).filter(
        FortuneSession.id == session_id,
        FortuneSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    messages = db.query(FortuneMessage).filter(
        FortuneMessage.session_id == session_id
    ).order_by(FortuneMessage.created_at).all()
    
    return messages


# ============ 公开接口：历史记录（简化版）============

@router.get("/sessions/public")
def get_sessions_public(limit: int = 10, db: Session = Depends(get_db)):
    """获取最近的算命记录（公开，无需认证）"""
    sessions = db.query(FortuneSession).order_by(
        FortuneSession.updated_at.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": str(s.id),
            "session_type": s.session_type,
            "title": s.title,
            "total_messages": s.total_messages,
            "updated_at": s.updated_at.isoformat() if s.updated_at else None
        }
        for s in sessions
    ]
