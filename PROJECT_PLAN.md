# Fortune AI 项目计划

## 目标
打造一个基于 LLM + RAG + Agent 的算命应用：
- 小程序给普通用户使用
- Web 后台给管理员使用
- 后端提供统一 API、权限、配置、统计能力

## 当前已完成
- 后端 FastAPI 项目骨架
- 用户 / 管理员 / 提示词 / 背景图 / 会话数据模型
- 算命对话 API 骨架
- 管理后台 React 骨架
- 微信小程序首页骨架（Labubu + 输入框 + 背景图）

## 下一步
1. 接入真实数据库迁移（Alembic）
2. 接入真实 LLM / LangChain / LangGraph
3. 接入 RAG 知识库（命理知识、话术知识库）
4. 补全管理员 RBAC 细粒度权限
5. 补全数据看板图表和用户画像聚类
6. 小程序接通后端接口与登录体系

## 推荐角色设计
- super_admin：全部权限
- prompt_engineer：提示词、模型配置
- operator：用户管理、背景图配置、内容审核
- analyst：数据看板、用户画像查看
