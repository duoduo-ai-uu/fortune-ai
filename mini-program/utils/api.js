const MOCK_MODE = true

var fortuneTypes = [
  { id: 1, name: '通用算命', name_en: 'general', icon: '🔮' },
  { id: 2, name: '爱情算命', name_en: 'love', icon: '💕' },
  { id: 3, name: '事业算命', name_en: 'career', icon: '💼' },
  { id: 4, name: '财运算命', name_en: 'wealth', icon: '💰' },
  { id: 5, name: '健康算命', name_en: 'health', icon: '❤️' }
]

var backgrounds = {
  general: 'https://picsum.photos/750/1334?random=1',
  love: 'https://picsum.photos/750/1334?random=2',
  career: 'https://picsum.photos/750/1334?random=3',
  wealth: 'https://picsum.photos/750/1334?random=4',
  health: 'https://picsum.photos/750/1334?random=5'
}

var responses = {
  general: '*轻轻抚过手中的罗盘*\n\n施主，贫道观你今日气运...',
  love: '*轻拂过水晶球*\n\n爱情的路上，每个人都有自己的轨迹...',
  career: '*掐指一算*\n\n职场如战场，讲究天时地利人和...',
  wealth: '*打开账本*\n\n财运之道，在于取舍...',
  health: '*把脉沉思*\n\n身体是修行的根本...'
}

module.exports = {
  miniApi: {
    login: function() {
      return { access_token: 'mock', user: { id: '1', nickname: '用户' } }
    },
    getFortuneTypes: function() {
      return fortuneTypes
    },
    getBackgrounds: function(category) {
      return { default: { image_url: backgrounds[category] || backgrounds.general } }
    },
    chat: function(message, sessionId, sessionType) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve({
            message: responses[sessionType] || responses.general,
            session_id: sessionId || 'sess_' + Date.now(),
            tokens_used: 100,
            session_type: sessionType
          })
        }, 1500)
      })
    }
  }
}
