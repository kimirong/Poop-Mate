'use client'

import { useEffect, useRef } from 'react'
import { Dialog } from 'antd-mobile'
import { useRouter } from 'next/navigation'

interface SuccessModalProps {
  show: boolean
  todayCount: number
  onClose: () => void
}

export default function SuccessModal({ show, todayCount, onClose }: SuccessModalProps) {
  const router = useRouter()
  const handlerRef = useRef<{ close: () => void } | null>(null)

  const handleViewLeaderboard = () => {
    onClose()
    router.push('/leaderboard')
  }

  useEffect(() => {
    if (show) {
      handlerRef.current = Dialog.show({
        content: (
          <div className="text-center">
            <div className="text-4xl mb-2">✓</div>
            <div className="text-lg font-bold">打卡成功！</div>
            <div className="text-gray-500 mt-2">今日第 {todayCount} 次</div>
          </div>
        ),
        confirmText: '查看排行榜',
        onConfirm: handleViewLeaderboard,
        closeOnAction: true,
        actions: [
          { key: 'close', text: '关闭', onPress: onClose },
        ],
      })
    } else {
      if (handlerRef.current) {
        handlerRef.current.close()
        handlerRef.current = null
      }
    }
  }, [show, todayCount])

  return null
}
