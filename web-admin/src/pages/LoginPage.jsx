import { useState } from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const res = await api.login(values.username, values.password)
      localStorage.setItem('token', res.access_token)
      message.success('登录成功')
      navigate('/')
    } catch (e) {
      message.error('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <Card title="Fortune AI 管理后台" style={{ width: 360 }}>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="admin" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="admin123" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
