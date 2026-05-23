'use client'

import { NavBar } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import Leaderboard from '@/components/Leaderboard'

export default function LeaderboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <NavBar back="返回" onBack={() => router.back()}>
        排行榜
      </NavBar>

      <Leaderboard />
    </div>
  )
}
