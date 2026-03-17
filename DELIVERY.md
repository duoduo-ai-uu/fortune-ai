# Fortune AI 算命应用 - 交付文档

## 项目概览

- **项目名称**：Fortune AI
- **项目路径**：`/Users/uuyaya/.openclaw/workspace/fortune-app`
- **技术栈**：Python FastAPI + SQLAlchemy + 阿里千问 + React + 微信小程序

---

## 快速启动

### 1. 后端服务

```bash
cd /Users/uuyaya/.openclaw/workspace/fortune-app/backend

# 激活虚拟环境
source venv/bin/activate

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

- **API 文档**：http://localhost:8000/docs
- **管理员账号**：`admin` / `admin123`

### 2. Web 管理后台

```bash
cd /Users/uuyaya/.openclaw/workspace/fortune-app/web-admin
npm run dev
```

- **访问地址**：http://localhost:5174
- **管理员账号**：`admin` / `admin123`

### 3. 微信小程序

用微信开发者工具打开 `mini-program` 目录即可。

---

## 环境变量配置

在 `backend/.env` 文件中配置：

```bash
# Database
DATABASE_URL=sqlite:///./fortune_ai.db

# JWT
SECRET_KEY=your-secret-key-change-in-production
ADMIN_DEFAULT_PASSWORD=admin123

# LLM - 阿里千问 (DashScope)
DASHSCOPE_API_KEY=sk-你的API密钥
DEFAULT_LLM_MODEL=qwen-turbo

# 微信小程序
MINI_PROGRAM_APP_ID=wx125a9470ddf6b26b
MINI_PROGRAM_APP_SECRET=你的AppSecret
```

---

## 功能清单

### 已完成

| 模块 | 功能 |
|------|------|
| 认证系统 | 管理员登录、JWT 令牌 |
| 算命对话 | 5 种类型（通用/爱情/事业/财运/健康） |
| AI 接入 | 阿里千问 API |
| Web 后台 | 数据看板、用户管理、提示词配置、背景配置 |
| 小程序 | 登录、算命类型选择、对话功能 |

### 提示词模板

| 类型 | 风格 |
|------|------|
| general | 资深命理师，沉稳内敛 |
| love | 爱情占卜师，细腻温暖 |
| career | 职业顾问，理性专业 |
| wealth | 财富顾问，稳重务实 |
| health | 健康顾问，温暖关怀 |

---

## API 接口

### 认证
- `POST /api/v1/auth/login` - 管理员登录

### 算命
- `POST /api/v1/fortune/chat` - 算命对话
- `GET /api/v1/fortune/types` - 获取算命类型
- `GET /api/v1/fortune/sessions` - 获取会话列表

### 小程序
- `POST /api/v1/mini/login` - 小程序登录

### 管理后台
- `GET /api/v1/admin/dashboard` - 数据看板
- `GET /api/v1/admin/users` - 用户列表
- `GET /api/v1/admin/prompts` - 提示词列表
- `POST /api/v1/admin/prompts` - 创建提示词

---

## 后续迭代建议

### 短期
1. **八字排盘** - 接入八字分析功能
2. **历史记录** - 小程序聊天记录持久化
3. **分享功能** - 算命结果分享到微信

### 中期
1. **会员体系** - 付费算命次数
2. **紫微斗数** - 更专业的命理分析
3. **小程序发布** - 提交审核上线

### 长期
1. **多语言** - 英文、日文版本
2. **AI 语音** - 语音算命
3. **社区功能** - 用户讨论区

---

## 注意事项

1. **AppSecret 保密** - 不要泄露到公开代码库
2. **生产环境** - 需要修改 SECRET_KEY、更换数据库
3. **小程序上线** - 需要配置服务器域名

---

*交付时间：2026-03-14*
