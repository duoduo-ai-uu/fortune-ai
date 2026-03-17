from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.fortune import router as fortune_router
from app.api.v1.admin import router as admin_router
from app.api.v1.mini_program import router as mini_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(fortune_router)
api_router.include_router(admin_router)
api_router.include_router(mini_router)
