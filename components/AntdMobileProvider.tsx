'use client'

import { ConfigProvider } from 'antd-mobile'

export default function AntdMobileProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConfigProvider>{children}</ConfigProvider>
}
