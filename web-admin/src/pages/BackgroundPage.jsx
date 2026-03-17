import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Table, Tag, Spin, message } from 'antd'
import { api } from '../utils/api'

export default function BackgroundPage() {
  const [loading, setLoading] = useState(true)
  const [backgrounds, setBackgrounds] = useState([])
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    api.getBackgrounds()
      .then(setBackgrounds)
      .catch(() => {
        setBackgrounds([
          { id: '1', name: '梦幻星空', category: 'general', is_default: true, is_active: true },
          { id: '2', name: '浪漫粉紫', category: 'love', is_default: false, is_active: true },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      await api.createBackground(values)
      message.success('保存成功')
      form.resetFields()
      const list = await api.getBackgrounds()
      setBackgrounds(list)
    } catch (e) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { title: '名称', dataIndex: 'name' },
    { title: '分类', dataIndex: 'category', render: (v) => <Tag>{v || '通用'}</Tag> },
    { title: '默认', dataIndex: 'is_default', render: (v) => v ? <Tag color="gold">默认</Tag> : null },
    { title: '状态', dataIndex: 'is_active', render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? '启用' : '禁用'}</Tag> },
  ]

  return (
    <Spin spinning={loading}>
      <Card title="背景图配置">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="背景名称" rules={[{ required: true }]}>
            <Input placeholder="例如：神秘星空" />
          </Form.Item>
          <Form.Item name="image_url" label="背景图片 URL" rules={[{ required: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Select
              placeholder="选择分类"
              options={[
                { label: '通用', value: 'general' },
                { label: '爱情', value: 'love' },
                { label: '事业', value: 'career' },
                { label: '财运', value: 'wealth' },
                { label: '健康', value: 'health' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>保存背景</Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 32 }}>
          <h3>已有背景</h3>
          <Table columns={columns} dataSource={backgrounds} rowKey="id" pagination={false} size="small" />
        </div>
      </Card>
    </Spin>
  )
}
