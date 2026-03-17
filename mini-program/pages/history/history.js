/**
 * 历史记录页面
 */
const API_BASE = 'http://localhost:8000/api/v1'

const TYPE_ICONS = {
  general: '🔮',
  love: '💕',
  career: '📈',
  wealth: '💰',
  health: '🌿'
}

const TYPE_NAMES = {
  general: '综合运势',
  love: '爱情运程',
  career: '事业发展',
  wealth: '财富运势',
  health: '健康平安'
}

function generateStars(count) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 3
    })
  }
  return stars
}

Page({
  data: {
    stars: generateStars(50),
    records: []
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${API_BASE}/fortune/sessions/public?limit=20`,
          success: (res) => res.statusCode === 200 ? resolve(res.data) : reject(res),
          fail: reject
        })
      })

      const records = (res || []).map(item => ({
        id: item.id,
        title: item.title || '算命记录',
        typeName: TYPE_NAMES[item.session_type] || '综合运势',
        icon: TYPE_ICONS[item.session_type] || '🔮',
        time: this.formatTime(item.updated_at)
      }))

      this.setData({ records })
    } catch (err) {
      console.error('加载记录失败:', err)
      // 使用本地模拟数据
      this.setData({
        records: [
          { id: '1', title: '今天运势如何', typeName: '综合运势', icon: '🔮', time: '今天 14:30' },
          { id: '2', title: '桃花运怎么样', typeName: '爱情运程', icon: '💕', time: '今天 14:00' }
        ]
      })
    }
  },

  formatTime(timeStr) {
    if (!timeStr) return '未知时间'
    const date = new Date(timeStr)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    
    if (isToday) {
      return `今天 ${hour}:${minute}`
    }
    return `${date.getMonth() + 1}/${date.getDate()} ${hour}:${minute}`
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({ title: '详情功能开发中', icon: 'none' })
  },

  goHome() {
    wx.navigateTo({ url: '/pages/index/index' })
  },

  goTarot() {
    wx.navigateTo({ url: '/pages/tarot/tarot' })
  }
})
