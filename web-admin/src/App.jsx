import { Layout, Menu } from 'antd'
import { DashboardOutlined, UserOutlined, BgColorsOutlined, SettingOutlined } from '@ant-design/icons'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import PromptPage from './pages/PromptPage'
import BackgroundPage from './pages/BackgroundPage'
import LoginPage from './pages/LoginPage'

const { Header, Sider, Content } = Layout

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { key: '/', icon: <DashboardOutlined />, label: '数据看板' },
    { key: '/users', icon: <UserOutlined />, label: '用户画像/用户管理' },
    { key: '/prompts', icon: <SettingOutlined />, label: '提示词配置' },
    { key: '/backgrounds', icon: <BgColorsOutlined />, label: '背景配置' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <div className="logo">Fortune AI</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="header">算命应用管理后台</Header>
        <Content className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/prompts" element={<PromptPage />} />
            <Route path="/backgrounds" element={<BackgroundPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}
