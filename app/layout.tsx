import type { Metadata } from 'next'
import './globals.css'
import AntdMobileProvider from '@/components/AntdMobileProvider'

export const metadata: Metadata = {
  title: '拉屎宝',
  description: '如厕打卡神器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdMobileProvider>{children}</AntdMobileProvider>
      </body>
    </html>
  )
}
