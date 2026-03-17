import { useEffect, useState } from 'react'
import { Card, Table, Tag, Spin } from 'antd'
import { api } from '../utils/api'

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch(() => {
        // Mock 数据
        setUsers([
          { key: '1', nickname: '桃桃', phone: '138****1234', total_queries: 23, tag: '恋爱型', is_active: true },
          { key: '2', nickname: '小鱼', phone: '139****5678', total_queries: 8, tag: '事业型', is_active: true },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { title: '昵称', dataIndex: 'nickname' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '提问次数', dataIndex: 'total_queries' },
    { title: '用户画像', dataIndex: 'tag', render: (v) => <Tag color="purple">{v || '未标注'}</Tag> },
    { title: '状态', dataIndex: 'is_active', render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? '正常' : '禁用'}</Tag> },
  ]

  return (
    <Card title="用户管理 / 用户画像">
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={users} pagination={false} />
      </Spin>
    </Card>
  )
}
