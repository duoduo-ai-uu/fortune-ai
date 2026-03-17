"""LLM 服务层 - 阿里千问接入"""
from typing import Optional
import dashscope
from dashscope import Generation
from app.core.config import settings


# 初始化 DashScope
dashscope.api_key = settings.DASHSCOPE_API_KEY


class LLMService:
    """负责统一封装算命回复生成。"""

    def __init__(self):
        self.model = settings.DEFAULT_LLM_MODEL or "qwen-turbo"

    def generate_fortune(
        self,
        user_message: str,
        session_type: str = "general",
        system_prompt: Optional[str] = None,
    ) -> dict:
        """生成算命回复 - 接入阿里千问"""
        
        # 构建系统提示词
        if system_prompt is None:
            system_prompt = """你是一个专业的命理师，擅长八字、紫微斗数、塔罗牌等命理分析。
你的风格：温柔、专业、有洞察力，但不会过度玄学。
回复要接地气，给出可执行的行动建议。
不要使用过于晦涩的术语，用用户能理解的语言解释。"""

        prefix_map = {
            "general": "整体运势",
            "love": "感情运势",
            "career": "事业运势",
            "wealth": "财运",
            "health": "健康运势",
        }
        title = prefix_map.get(session_type, "整体运势")
        
        user_prompt = f"【{title}解读】\n\n用户问题：{user_message}\n\n请给出专业的命理解读和行动建议。"
        
        try:
            response = Generation.call(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=500,
            )
            
            if response.status_code == 200:
                # 新版 API 返回格式：response.output 是 dict，包含 text 字段
                content = response.output.get("text", "")
                tokens = response.usage.total_tokens if response.usage else len(content) // 4
            else:
                content = f"抱歉，当前服务繁忙，请稍后再试。\n(错误: {response.code})"
                tokens = 0
                
        except Exception as e:
            content = f"抱歉，服务暂时不可用：{str(e)}"
            tokens = 0

        return {
            "content": content,
            "tokens": tokens,
        }


llm_service = LLMService()
