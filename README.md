# Fortune AI - 算命应用

基于 LLM + RAG + Agent 的智能算命应用，包含小程序和Web后台。

## 项目结构

```
fortune-app/
├── backend/                 # Python FastAPI 后端
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据库模型
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # 业务服务
│   └── alembic/            # 数据库迁移
├── mini-program/           # 微信小程序
│   └── pages/
└── web-admin/              # React 管理后台
    └── src/
```

## 技术栈

- **后端**: FastAPI + SQLAlchemy + PostgreSQL
- **AI**: LangChain + LangGraph + OpenAI/Claude
- **向量库**: Qdrant
- **小程序**: 原生微信开发
- **Web后台**: React + Ant Design + React Query

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 配置数据库和 API Key
python -m app.main
```

### Web后台启动

```bash
cd web-admin
npm install
npm run dev
```

## 功能特性

### 小程序端
- 🧸 Labubu IP 展示
- 💬 AI 算命对话
- 🎨 可配置背景

### Web后台
- 🔐 RBAC 权限管理
- 📊 数据看板
- 👤 用户画像
- ⚙️ Prompt 配置
