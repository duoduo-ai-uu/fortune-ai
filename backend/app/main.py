"""FastAPI 主入口"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.database import Base, engine
from app import models  # noqa: F401

# 开发期先自动建表，后续可切换到 Alembic
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fortune AI",
    description="基于 LLM + RAG + Agent 的智能算命应用",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "name": "Fortune AI",
        "status": "ok",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
