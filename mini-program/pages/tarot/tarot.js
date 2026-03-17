/**
 * 塔罗牌页面
 */
const API_BASE = 'http://localhost:8000/api/v1'

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
    stars: generateStars(60),
    currentSpread: 'past-present-future',
    isDrawing: false,
    showResult: false,
    cards: []
  },

  onLoad() {
    // 
  },

  selectSpread(e) {
    const spread = e.currentTarget.dataset.spread
    this.setData({ 
      currentSpread: spread,
      showResult: false,
      cards: []
    })
  },

  async drawCards() {
    if (this.data.isDrawing) return

    this.setData({ isDrawing: true, showResult: false })

    // 模拟洗牌动画
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${API_BASE}/fortune/tarot/draw`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: {
            count: 3,
            spread: this.data.currentSpread
          },
          success: (res) => res.statusCode === 200 ? resolve(res.data) : reject(res),
          fail: reject
        })
      })

      this.setData({
        cards: res.cards || [],
        showResult: true,
        isDrawing: false
      })
    } catch (err) {
      console.error('抽牌失败:', err)
      wx.showToast({ title: '抽牌失败，请重试', icon: 'none' })
      this.setData({ isDrawing: false })
    }
  },

  showCardDetail(e) {
    const index = e.currentTarget.dataset.index
    const card = this.data.cards[index]
    wx.showModal({
      title: `${card.position} - ${card.name}`,
      content: card.meaning,
      showCancel: false
    })
  },

  redraw() {
    this.setData({ showResult: false, cards: [] })
  },

  goHome() {
    wx.navigateTo({ url: '/pages/index/index' })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  }
})
