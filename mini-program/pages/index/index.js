/**
 * Labubu 算命小程序 - 连接真实后端
 * 功能：5种算命类型 + AI对话 + 运势卡片 + 分享
 */

const FORTUNE_TYPES = [
  { id: 'general', name: '综合运势', icon: '🔮', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'love', name: '爱情运程', icon: '💕', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'career', name: '事业发展', icon: '📈', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'wealth', name: '财富运势', icon: '💰', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 'health', name: '健康平安', icon: '🌿', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
]

// 运势卡片颜色映射
const CARD_COLORS = {
  general: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  love: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  career: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  wealth: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  health: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
}

function generateStars(count) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 60,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 3
    })
  }
  return stars
}

Page({
  data: {
    loading: false,
    windowWidth: 375,
    windowHeight: 667,
    fortuneTypes: FORTUNE_TYPES,
    typeIndex: 0,
    messages: [
      { role: 'assistant', content: '嗨～我是 Labubu！🐰\n来找我问运势吧～', isFortune: false }
    ],
    inputValue: '',
    stars: generateStars(80),
    isTyping: false,
    currentSessionId: null
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({
      windowWidth: sysInfo.windowWidth,
      windowHeight: sysInfo.windowHeight
    })
    // 初始化登录
    this.initLogin()
  },

  async initLogin() {
    const api = require('./api.js').miniApi
    try {
      await api.login()
      console.log('✅ 登录成功')
    } catch (e) {
      console.error('登录失败:', e)
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  onTypeChange(e) {
    this.setData({ typeIndex: e.detail.value })
  },

  // 打字机效果
  typeWriter(text, callback) {
    this.setData({ isTyping: true })
    let index = 0
    const speed = 25
    
    const type = () => {
      if (index < text.length) {
        this.setData({ 
          [`messages[${this.data.messages.length - 1}.content]`]: text.slice(0, index + 1) 
        })
        index++
        setTimeout(type, speed + Math.random() * 15)
      } else {
        this.setData({ isTyping: false })
        callback && callback()
      }
    }
    type()
  },

  async onSend() {
    const { inputValue, loading, typeIndex, messages, fortuneTypes, currentSessionId } = this.data
    if (!inputValue.trim() || loading) return

    const api = require('./api.js').miniApi
    const sessionType = fortuneTypes[typeIndex].id

    // 添加用户消息
    const userMessage = { role: 'user', content: inputValue }
    const aiLoadingMessage = { role: 'assistant', content: '🔮 解读中...', isFortune: false, isLoading: true }
    
    this.setData({ 
      messages: [...messages, userMessage, aiLoadingMessage], 
      inputValue: '',
      loading: true 
    })

    try {
      // 调用真实后端API
      const result = await api.chat(inputValue, currentSessionId, sessionType)
      
      // 更新会话ID
      if (result.session_id) {
        this.setData({ currentSessionId: result.session_id })
      }

      // 解析AI回复，生成运势卡片
      const fortuneType = fortuneTypes[typeIndex]
      const luckScore = this.generateLuckScore(result.message)
      const tip = this.generateTip(sessionType, luckScore)
      
      const fortuneMessage = {
        role: 'assistant',
        content: result.message,
        isFortune: true,
        luck: luckScore,
        tip: tip,
        icon: fortuneType.icon,
        typeName: fortuneType.name,
        cardColor: CARD_COLORS[sessionType]
      }
      
      this.setData({
        messages: [...this.data.messages.slice(0, -1), fortuneMessage],
        loading: false
      })
      
    } catch (err) {
      console.error('API错误:', err)
      // 回退到本地回复
      const fallbackMessage = {
        role: 'assistant',
        content: '抱歉，神秘力量暂时中断了... 请稍后再试～',
        isFortune: false
      }
      this.setData({
        messages: [...this.data.messages.slice(0, -1), fallbackMessage],
        loading: false
      })
    }
  },

  // 生成幸运指数（基于回复内容）
  generateLuckScore(message) {
    const positiveWords = ['好', '吉', '运', '福', '喜', '财', '爱', '顺利', '成功', '幸运']
    const negativeWords = ['注意', '小心', '谨慎', '避免', '难', '阻', '压力', '疲惫']
    
    let score = 60 + Math.floor(Math.random() * 20) // 基础60-80
    
    positiveWords.forEach(w => { if (message.includes(w)) score += 5 })
    negativeWords.forEach(w => { if (message.includes(w)) score -= 5 })
    
    return Math.min(99, Math.max(30, score))
  },

  // 生成运势建议
  generateTip(sessionType, luck) {
    const tips = {
      general: [
        '保持乐观，好运自然来',
        '今天适合尝试新事物',
        '静心养性，顺势而为'
      ],
      love: [
        '主动出击，不要错过',
        '多陪伴，多沟通',
        '真诚表达，不要试探'
      ],
      career: [
        '抓住机会，展示能力',
        '换位思考，突破思维',
        '耐心等待，不要放弃'
      ],
      wealth: [
        '理性消费，避免冲动',
        '小额尝试，见好就收',
        '保持开放，好运将至'
      ],
      health: [
        '适度运动，保持健康',
        '规律作息，早睡早起',
        '注意饮食，保持运动'
      ]
    }
    
    const typeTips = tips[sessionType] || tips.general
    if (luck >= 80) return typeTips[0]
    if (luck >= 60) return typeTips[1]
    return typeTips[2]
  },

  // 分享功能
  onShareAppMessage() {
    const { fortuneTypes, typeIndex } = this.data
    const type = fortuneTypes[typeIndex]
    return {
      title: `🔮 我的${type.name}运势 - Labubu为你解读`,
      path: '/pages/index/index'
    }
  },

  onShareTimeline() {
    const { fortuneTypes, typeIndex } = this.data
    const type = fortuneTypes[typeIndex]
    return {
      title: `🔮 我的${type.name}运势 - Labubu为你解读`,
      query: `type=${type.id}`
    }
  }
})
