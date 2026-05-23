'use client'

import { useEffect, useState, useCallback } from 'react'
import { NavBar, Card } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import CheckInButton from '@/components/CheckInButton'
import MoodInput from '@/components/MoodInput'
import SuccessModal from '@/components/SuccessModal'
import { getStoredToken, clearStoredToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null)
  const [mood, setMood] = useState('')
  const [todayCount, setTodayCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initUser = async () => {
      const token = getStoredToken()
      if (!token) {
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, nickname')
        .eq('login_token', token)
        .single()

      if (error || !data) {
        clearStoredToken()
        router.push('/')
        return
      }

      setUser(data)
      await fetchTodayCount(data.id)
    }

    initUser()
  }, [router])

  const fetchTodayCount = async (userId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('timestamp', today.toISOString())

    setTodayCount(count || 0)
  }

  const handleCheckIn = useCallback(async () => {
    if (!user || loading) return

    setLoading(true)

    const { error } = await supabase.from('check_ins').insert({
      user_id: user.id,
      timestamp: new Date().toISOString(),
      mood: mood.trim() || null,
    })

    if (!error) {
      await fetchTodayCount(user.id)
      setShowSuccess(true)
      setMood('')
    }

    setLoading(false)
  }, [user, mood, loading])

  const handleLogout = () => {
    clearStoredToken()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        backArrow={false}
        right={<span onClick={() => router.push('/leaderboard')}>排行榜</span>}
      >
        👤 {user.nickname}
      </NavBar>

      <div className="flex flex-col items-center px-6 pt-20">
        <div className="mb-10">
          <CheckInButton onCheckIn={handleCheckIn} disabled={loading} />
        </div>

        <div className="w-full mb-8">
          <MoodInput value={mood} onChange={setMood} />
        </div>

        <Card className="w-full rounded-card shadow-sm" bodyClassName="text-center py-4">
          <div className="text-text-secondary text-base">
            今日已打卡
            <span className="text-primary font-bold text-2xl mx-2">{todayCount}</span>
            次
          </div>
        </Card>

        <button
          onClick={handleLogout}
          className="mt-12 text-text-secondary text-sm underline"
        >
          退出登录
        </button>
      </div>

      <SuccessModal
        show={showSuccess}
        todayCount={todayCount}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  )
}
