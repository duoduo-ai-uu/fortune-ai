#!/bin/bash
# Fortune AI 后端启动脚本

cd "$(dirname "$0")"

# 激活虚拟环境（如果使用 venv）
# source venv/bin/activate

# 安装依赖（首次）
if [ ! -d "venv" ] && [ ! -f "requirements.txt" ]; then
    echo "📦 首次安装依赖..."
    pip install -r requirements.txt
fi

# 初始化数据库
echo "🗄️ 初始化数据库..."
python -m app.db_init

# 启动服务
echo "🚀 启动 FastAPI 服务..."
echo "📍 访问地址: http://localhost:8000"
echo "📖 API 文档: http://localhost:8000/docs"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
