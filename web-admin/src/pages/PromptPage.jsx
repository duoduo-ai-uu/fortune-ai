import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Table, Tag, Spin, message } from 'antd'
import { api } from '../utils/api'

export default function PromptPage() {
  const [loading, setLoading] = useState(true)
  const [prompts, setPrompts] = useState([])
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    api.getPrompts()
      .then(setPrompts)
      .catch(() => {
        setPrompts([
          { id: '1', name: '通用算命', fortune_type: 'general', is_default: true, is_active: true },
          { id: '2', name: '爱情算命', fortune_type: 'love', is_default: false, is_active: true },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      await api.createPrompt(values)
      message.success('保存成功')
      form.resetFields()
      // 刷新列表
      const list = await api.getPrompts()
      setPrompts(list)
    } catch (e) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { title: '名称', dataIndex: 'name' },
    { title: '算命类型', dataIndex: 'fortune_type', render: (v) => <Tag>{v || '通用'}</Tag> },
    { title: '默认', dataIndex: 'is_default', render: (v) => v ? <Tag color="gold">默认</Tag> : null },
    { title: '状态', dataIndex: 'is_active', render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? '启用' : '禁用'}</Tag> },
  ]

  return (
    <Spin spinning={loading}>
      <Card title="提示词配置">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="例如：通用算命" />
          </Form.Item>
          <Form.Item name="fortune_type" label="算命类型">
            <Select
              placeholder="选择类型"
              options={[
                { label: '通用', value: 'general' },
                { label: '爱情', value: 'love' },
                { label: '事业', value: 'career' },
                { label: '财运', value: 'wealth' },
                { label: '健康', value: 'health' },
              ]}
            />
          </Form.Item>
          <Form.Item name="system_prompt" label="系统提示词" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="在这里配置大模型提示词..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>保存提示词</Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 32 }}>
          <h3>已有模板</h3>
          <Table columns={columns} dataSource={prompts} rowKey="id" pagination={false} size="small" />
        </div>
      </Card>
    </Spin>
  )
}
