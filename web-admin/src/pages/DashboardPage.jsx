import { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic, Spin } from 'antd'
import { api } from '../utils/api'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(() => {
        // 如果后端没跑起来，用 mock 数据
        setData({
          total_users: 1280,
          active_users: 913,
          total_sessions: 5240,
          total_messages: 18432,
          total_queries: 10234,
          avg_queries_per_user: 7.99,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin size="large" style={{ margin: 100 }} />

  return (
    <div>
      <h2>数据看板</h2>
      <Row gutter={[16, 16]}>
        <Col span={8}><Card><Statistic title="总用户数" value={data?.total_users || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="活跃用户数" value={data?.active_users || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="总会话数" value={data?.total_sessions || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="总消息数" value={data?.total_messages || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="总算命次数" value={data?.total_queries || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="人均提问次数" value={data?.avg_queries_per_user || 0} precision={2} /></Card></Col>
      </Row>
    </div>
  )
}
