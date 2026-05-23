'use client'

import { TextArea } from 'antd-mobile'

interface MoodInputProps {
  value: string
  onChange: (value: string) => void
}

export default function MoodInput({ value, onChange }: MoodInputProps) {
  return (
    <TextArea
      value={value}
      placeholder="记录一下此刻心情..."
      maxLength={200}
      rows={3}
      showCount
      onChange={onChange}
    />
  )
}
