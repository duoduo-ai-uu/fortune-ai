/**
 * Labubu 算命小程序 - 第二波优化
 * 添加：运势卡片、打字机优化、更多交互
 */

const FORTUNE_TYPES = [
  { id: 'general', name: '综合运势', icon: '🔮', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'love', name: '爱情运程', icon: '💕', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'career', name: '事业发展', icon: '📈', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'wealth', name: '财富运势', icon: '💰', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 'health', name: '健康平安', icon: '🌿', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
]

// 更丰富的 Mock 回复（带运势卡片格式）
const MOCK_RESPONSES = {
  general: [
    { type: 'text', content: '今天的你就像一颗闪耀的星星✨ 整体运势不错，适合尝试新事物。', luck: 85, tip: '保持乐观，好运自然来' },
    { type: 'text', content: '宇宙在告诉你：近期有意外惊喜！⭐ 但要耐心等待时机。', luck: 78, tip: '不宜冲动，静观其变' },
    { type: 'text', content: '今日宜静心养性，适合冥想或阅读📚 内在能量正在积累。', luck: 72, tip: '修身养性，顺势而为' }
  ],
  love: [
    { type: 'text', content: '红鸾星动！单身的你有望在本周遇到正缘💕 把握机会~', luck: 92, tip: '主动出击，不要错过' },
    { type: 'text', content: '如果已有伴侣，今天适合安排一次浪漫约会🥰 感情升温~', luck: 88, tip: '多陪伴，多沟通' },
    { type: 'text', content: 'TA的心意正在动摇，主动一点可能会有惊喜哦～', luck: 75, tip: '真诚表达，不要试探' }
  ],
  career: [
    { type: 'text', content: '工作上遇到瓶颈了吗？换个角度思考，灵感就在眼前！💡', luck: 82, tip: '换位思考，突破思维' },
    { type: 'text', content: '今天的你特别适合谈判或演讲，表现欲旺盛🔥', luck: 90, tip: '抓住机会，展示能力' },
    { type: 'text', content: '别急，机遇正在路上。保持耐心，好事将近📈', luck: 68, tip: '耐心等待，不要放弃' }
  ],
  wealth: [
    { type: 'text', content: '财富运势今日小吉，但要注意冲动消费哦💰', luck: 78, tip: '理性消费，避免冲动' },
    { type: 'text', content: '或许可以尝试小额投资，回报可能超出预期✨', luck: 85, tip: '小额尝试，见好就收' },
    { type: 'text', content: '有意外之财的可能！保持开放心态接收惊喜🧧', luck: 95, tip: '保持开放，好运将至' }
  ],
  health: [
    { type: 'text', content: '身体是革命的本钱，今天适合做一些轻运动🏃', luck: 80, tip: '适度运动，保持健康' },
    { type: 'text', content: '注意休息，熬夜伤身哦～🌙', luck: 65, tip: '规律作息，早睡早起' },
    { type: 'text', content: '健康运势平稳，保持规律作息最重要💪', luck: 82, tip: '注意饮食，保持运动' }
  ]
}

function generateStars(count) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 60, // 只在上半部分
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
    isTyping: false
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({
      windowWidth: sysInfo.windowWidth,
      windowHeight: sysInfo.windowHeight
    })
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  onTypeChange(e) {
    this.setData({ typeIndex: e.detail.value })
  },

  // 打字机效果优化版
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

  onSend() {
    const { inputValue, loading, typeIndex, messages, fortuneTypes } = this.data
    if (!inputValue.trim() || loading) return

    // 添加用户消息
    const userMessage = { role: 'user', content: inputValue }
    const aiLoadingMessage = { role: 'assistant', content: '', isFortune: false, isLoading: true }
    
    this.setData({ 
      messages: [...messages, userMessage, aiLoadingMessage], 
      inputValue: '',
      loading: true 
    })

    // 模拟 AI 回复
    setTimeout(() => {
      const type = fortuneTypes[typeIndex].id
      const responses = MOCK_RESPONSES[type]
      const response = responses[Math.floor(Math.random() * responses.length)]
      
      // 更新最后一条消息为运势卡片
      const fortuneType = fortuneTypes[typeIndex]
      const fortuneMessage = {
        role: 'assistant',
        content: response.content,
        isFortune: true,
        luck: response.luck,
        tip: response.tip,
        icon: fortuneType.icon,
        typeName: fortuneType.name
      }
      
      this.setData({
        messages: [...this.data.messages.slice(0, -1), fortuneMessage],
        loading: false
      })
    }, 1500)
  }
})
