// API 配置 - 连接真实后端
const API_BASE = 'http://localhost:8000/api/v1'

const fortuneTypes = [
  { id: 'general', name: '综合运势', name_en: 'general', icon: '🔮' },
  { id: 'love', name: '爱情运程', name_en: 'love', icon: '💕' },
  { id: 'career', name: '事业发展', name_en: 'career', icon: '📈' },
  { id: 'wealth', name: '财富运势', name_en: 'wealth', icon: '💰' },
  { id: 'health', name: '健康平安', name_en: 'health', icon: '🌿' }
]

const backgrounds = {
  general: 'https://picsum.photos/750/1334?random=1',
  love: 'https://picsum.photos/750/1334?random=2',
  career: 'https://picsum.photos/750/1334?random=3',
  wealth: 'https://picsum.photos/750/1334?random=4',
  health: 'https://picsum.photos/750/1334?random=5'
}

// 本地存储token
const getToken = () => wx.getStorageSync('access_token') || 'mock_token'
const setToken = (token) => wx.setStorageSync('access_token', token)

module.exports = {
  miniApi: {
    // 小程序登录
    login: function() {
      return new Promise((resolve) => {
        // 模拟登录，实际应该调用 wx.login
        const mockUser = {
          id: 'user_' + Date.now(),
          nickname: '用户' + Math.floor(Math.random() * 1000)
        }
        setToken('mock_token_' + Date.now())
        resolve({ 
          access_token: getToken(), 
          user: mockUser 
        })
      })
    },

    // 获取算命类型
    getFortuneTypes: function() {
      return Promise.resolve(fortuneTypes)
    },

    // 获取背景图
    getBackgrounds: function(category) {
      return Promise.resolve({ 
        default: { image_url: backgrounds[category] || backgrounds.general } 
      })
    },

    // 算命对话 - 连接真实后端（公开接口）
    chat: function(message, sessionId, sessionType) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${API_BASE}/fortune/chat/public`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            message: message,
            session_type: sessionType || 'general',
            session_id: sessionId || null
          },
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          },
          fail: (err) => {
            console.error('API错误:', err)
            reject(err)
          }
        })
      })
    },

    // 获取历史会话
    getSessions: function() {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${API_BASE}/fortune/sessions`,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${getToken()}`
          },
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              resolve([])
            }
          },
          fail: () => resolve([])
        })
      })
    }
  }
}
