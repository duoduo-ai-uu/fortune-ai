import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// 请求拦截：自动带 token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：处理错误
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// 导出常用方法
export const api = {
  // 认证 - 需要 form-urlencoded 格式
  login: (username, password) => 
    client.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  
  // 数据看板
  getDashboard: () => client.get('/admin/dashboard'),
  
  // 用户
  getUsers: () => client.get('/admin/users'),
  
  // 提示词
  getPrompts: () => client.get('/admin/prompts'),
  createPrompt: (data) => client.post('/admin/prompts', data),
  
  // 背景图
  getBackgrounds: () => client.get('/admin/backgrounds'),
  createBackground: (data) => client.post('/admin/backgrounds', data),
}

export default client
