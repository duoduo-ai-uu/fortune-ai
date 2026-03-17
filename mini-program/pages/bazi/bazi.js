/**
 * 八字排盘页面
 * 简化版八字计算（天干地支+五行）
 */

// 天干
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 五行
const WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
}
const WUXING_COLORS = {
  '木': '#34d399',
  '火': '#f87171',
  '土': '#fbbf24',
  '金': '#a78bfa',
  '水': '#60a5fa'
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

// 计算天干（年柱）
function getYearGan(year) {
  const offset = year - 1900
  return TIANGAN[(offset + 6) % 10]
}

// 计算地支（年柱）
function getYearZhi(year) {
  const offset = year - 1900
  return DIZHI[(offset + 8) % 12]
}

// 计算月柱
function getMonthGan(year, month) {
  const yearGan = getYearGan(year)
  const monthGanIndex = (TIANGAN.indexOf(yearGan) * 2 + month) % 10
  return TIANGAN[monthGanIndex]
}

function getMonthZhi(month) {
  return DIZHI[(month + 1) % 12]
}

// 计算日柱（简化）
function getDayGanZhi(year, month, day) {
  // 简化计算：使用日期作为偏移
  const totalDays = (year - 1900) * 365 + month * 30 + day
  const ganIndex = totalDays % 10
  const zhiIndex = totalDays % 12
  return { gan: TIANGAN[ganIndex], zhi: DIZHI[zhiIndex] }
}

// 计算时柱
function getTimeGanZhi(hour) {
  // 地支对应时辰
  const zhiIndex = Math.floor((hour + 1) / 2) % 12
  const ganIndex = (zhiIndex + 6) % 10 // 简化
  return { gan: TIANGAN[ganIndex], zhi: DIZHI[zhiIndex] }
}

// 计算五行分布
function countWuxing(tiangan, dizhi) {
  const counts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }
  ;[...tiangan, ...dizhi].forEach(char => {
    const w = WUXING[char]
    if (w) counts[w]++
  })
  return Object.entries(counts).map(([element, count]) => ({
    element,
    count,
    color: WUXING_COLORS[element]
  }))
}

// 生成解读
function generateInterpretation(tiangan, dizhi, gender) {
  const wuxing = countWuxing(tiangan, dizhi)
  const maxWuxing = wuxing.reduce((a, b) => a.count > b.count ? a : b)
  const minWuxing = wuxing.reduce((a, b) => a.count < b.count ? a : b)
  
  const interpretations = {
    '木': '你命中木旺，性格坚韧，有生发之气。',
    '火': '你命中火旺，为人热情，精力充沛。',
    '土': '你命中土旺，为人稳重，信守承诺。',
    '金': '你命中金旺，性格刚毅，有决断力。',
    '水': '你命中水旺，聪明灵活，适应力强。'
  }
  
  let text = `根据你的八字：${tiangan.join('')} ${dizhi.join('')}\n\n`
  text += `五行${maxWuxing.element}旺，${minWuxing.element}较弱。\n\n`
  text += interpretations[maxWuxing.element] || ''
  text += `\n\n${gender === 'male' ? '男' : '女'}命宜 ${['木', '火', '土', '金', '水'][Math.floor(Math.random() * 5)]}，需注意调养。`
  
  return text
}

Page({
  data: {
    stars: generateStars(50),
    birthDate: '',
    birthTime: '',
    gender: 'male',
    isCalculating: false,
    showResult: false,
    result: null
  },

  onDateChange(e) {
    this.setData({ birthDate: e.detail.value })
  },

  onTimeChange(e) {
    this.setData({ birthTime: e.detail.value })
  },

  selectGender(e) {
    this.setData({ gender: e.currentTarget.dataset.gender })
  },

  calculateBazi() {
    const { birthDate, birthTime, gender } = this.data
    if (!birthDate || !birthTime) return

    this.setData({ isCalculating: true })

    setTimeout(() => {
      const [year, month, day] = birthDate.split('-').map(Number)
      const [hour] = birthTime.split(':').map(Number)

      // 计算四柱
      const yearGan = getYearGan(year)
      const yearZhi = getYearZhi(year)
      const monthGan = getMonthGan(year, month)
      const monthZhi = getMonthZhi(month)
      const dayGanZhi = getDayGanZhi(year, month, day)
      const timeGanZhi = getTimeGanZhi(hour)

      const tiangan = [yearGan, monthGan, dayGanZhi.gan, timeGanZhi.gan]
      const dizhi = [yearZhi, monthZhi, dayGanZhi.zhi, timeGanZhi.zhi]

      const wuxing = countWuxing(tiangan, dizhi)
      const interpretation = generateInterpretation(tiangan, dizhi, gender)

      this.setData({
        isCalculating: false,
        showResult: true,
        result: {
          name: `${year}年${month}月${day}日`,
          gender: gender === 'male' ? '男' : '女',
          date: `${birthDate} ${birthTime}`,
          tiangan,
          dizhi,
          wuxing,
          interpretation
        }
      })
    }, 1500)
  },

  recalculate() {
    this.setData({
      showResult: false,
      result: null,
      birthDate: '',
      birthTime: ''
    })
  },

  goHome() {
    wx.navigateTo({ url: '/pages/index/index' })
  },

  goTarot() {
    wx.navigateTo({ url: '/pages/tarot/tarot' })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  }
})
