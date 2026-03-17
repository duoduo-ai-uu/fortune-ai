"""塔罗牌服务"""
import random
from typing import List, Dict

# 78张塔罗牌数据（简化版，22张大阿卡纳）
TAROT_CARDS = [
    {"name": "愚人", "name_en": "The Fool", "meaning": "新的开始、自由、冒险", "reverse": "冲动、鲁莽、缺乏计划"},
    {"name": "魔术师", "name_en": "The Magician", "meaning": "创造力、技能、意志力", "reverse": "欺骗、操纵、不诚实"},
    {"name": "女祭司", "name_en": "The High Priestess", "meaning": "直觉、智慧、神秘", "reverse": "冷漠、肤浅、表面"},
    {"name": "皇后", "name_en": "The Empress", "meaning": "丰盛、母性、创造力", "reverse": "依赖、过度保护、空虚"},
    {"name": "皇帝", "name_en": "The Emperor", "meaning": "权威、稳定、领导力", "reverse": "专制、脆弱、缺乏耐心"},
    {"name": "教皇", "name_en": "The Hierophant", "meaning": "传统、教导、信仰", "reverse": "反叛、离经叛道、误导"},
    {"name": "恋人", "name_en": "The Lovers", "meaning": "爱情、和谐、选择", "reverse": "不和谐、诱惑、错误选择"},
    {"name": "战车", "name_en": "The Chariot", "meaning": "胜利、意志力、决心", "reverse": "攻击、失败、缺乏方向"},
    {"name": "力量", "name_en": "Strength", "meaning": "勇气、耐心、内在力量", "reverse": "虚弱、缺乏信心、放弃"},
    {"name": "隐士", "name_en": "The Hermit", "meaning": "内省、智慧、指引", "reverse": "孤立、过度分析、孤独"},
    {"name": "命运之轮", "name_en": "Wheel of Fortune", "meaning": "命运、转折、机遇", "reverse": "厄运、停滞、无法改变"},
    {"name": "正义", "name_en": "Justice", "meaning": "公正、真相、平衡", "reverse": "不公、不诚实、逃避责任"},
    {"name": "倒吊人", "name_en": "The Hanged Man", "meaning": "牺牲、等待、新视角", "reverse": "牺牲过度、停滞、白费"},
    {"name": "死亡", "name_en": "Death", "meaning": "转变、结束、新生", "reverse": "抗拒改变、停滞、抑郁"},
    {"name": "节制", "name_en": "Temperance", "meaning": "平衡、耐心、中庸", "reverse": "过度、失衡、缺乏耐心"},
    {"name": "恶魔", "name_en": "The Devil", "meaning": "欲望、束缚、物质主义", "reverse": "解脱、觉醒、摆脱束缚"},
    {"name": "塔", "name_en": "The Tower", "meaning": "突变、毁灭、觉醒", "reverse": "害怕改变、缓慢的灾难"},
    {"name": "星星", "name_en": "The Star", "meaning": "希望、灵感、疗愈", "reverse": "失望、绝望、缺乏信念"},
    {"name": "月亮", "name_en": "The Moon", "meaning": "直觉、幻觉、未知", "reverse": "恐惧、焦虑、逃避"},
    {"name": "太阳", "name_en": "The Sun", "meaning": "成功、活力、快乐", "reverse": "悲伤、失败、缺乏活力"},
    {"name": "审判", "name_en": "Judgement", "meaning": "觉醒、重生、召唤", "reverse": "自我怀疑、犹豫、错失机会"},
    {"name": "世界", "name_en": "The World", "meaning": "完成、成就、圆满", "reverse": "未完成、拖延、不完整"}
]

class TarotService:
    """塔罗牌服务"""
    
    def draw_cards(self, count: int = 3, spread: str = "past-present-future") -> Dict:
        """抽牌"""
        # 洗牌
        deck = TAROT_CARDS.copy()
        random.shuffle(deck)
        
        # 抽取指定数量的牌
        drawn = deck[:count]
        
        # 为每张牌随机决定正逆位
        for card in drawn:
            card["is_reversed"] = random.choice([True, False])
        
        # 解读
        spread_names = {
            "past-present-future": ["过去", "现在", "未来"],
            "situation-advice-outcome": ["现状", "建议", "结果"],
            "mind-body-spirit": ["心灵", "身体", "精神"]
        }
        
        spread_positions = spread_names.get(spread, ["位置1", "位置2", "位置3"])
        
        result = {
            "spread": spread,
            "spread_names": spread_positions,
            "cards": []
        }
        
        for i, card in enumerate(drawn):
            result["cards"].append({
                "position": spread_positions[i],
                "name": card["name"],
                "name_en": card["name_en"],
                "meaning": card["reverse"] if card["is_reversed"] else card["meaning"],
                "is_reversed": card["is_reversed"],
                "full_meaning": {
                    "upright": card["meaning"],
                    "reversed": card["reverse"]
                }
            })
        
        return result
    
    def get_daily_tarot(self) -> Dict:
        """每日塔罗牌"""
        # 固定一张牌作为今日运势
        random.seed()
        card = random.choice(TAROT_CARDS)
        is_reversed = random.choice([True, False])
        
        return {
            "card": {
                "name": card["name"],
                "name_en": card["name_en"],
                "meaning": card["reverse"] if is_reversed else card["meaning"],
                "is_reversed": is_reversed
            },
            "advice": "今日适合静心冥想，与内心对话。"
        }

tarot_service = TarotService()
