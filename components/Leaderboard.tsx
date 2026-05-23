'use client'

import { useState, useEffect } from 'react'
import { Tabs } from 'antd-mobile'
import { supabase } from '@/lib/supabase'
import { getStoredToken } from '@/lib/auth'

interface CheckInItem {
  user_id: string
  timestamp: string
  users?: { nickname: string }
}

interface UserRank {
  id: string
  nickname: string
  value: number
  isCurrentUser: boolean
}

export default function Leaderboard() {
  const [totalRank, setTotalRank] = useState<UserRank[]>([])
  const [todayRank, setTodayRank] = useState<UserRank[]>([])
  const [streakRank, setStreakRank] = useState<UserRank[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchRanks = async () => {
      const token = getStoredToken()
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('login_token', token)
        .single()

      if (cancelled) return

      try {
        await Promise.all([
          fetchTotalRank(currentUser?.id),
          fetchTodayRank(currentUser?.id),
          fetchStreakRank(currentUser?.id),
        ])
      } catch (error) {
        console.error('Failed to fetch ranks:', error)
      }

      if (!cancelled) {
        setLoading(false)
      }
    }

    fetchRanks()
    return () => { cancelled = true }
  }, [])

  const fetchTotalRank = async (currentUserId?: string) => {
    const { data } = await supabase
      .from('check_ins')
      .select('user_id, users(nickname)')

    const counts: Record<string, { count: number; nickname: string }> = {}

    data?.forEach((item: CheckInItem) => {
      if (!counts[item.user_id]) {
        counts[item.user_id] = { count: 0, nickname: item.users?.nickname || '匿名' }
      }
      counts[item.user_id].count++
    })

    const rank = Object.entries(counts)
      .map(([userId, { count, nickname }]) => ({
        id: userId,
        nickname,
        value: count,
        isCurrentUser: userId === currentUserId,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20)

    setTotalRank(rank)
  }

  const fetchTodayRank = async (currentUserId?: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('check_ins')
      .select('user_id, users(nickname)')
      .gte('timestamp', today.toISOString())

    const counts: Record<string, { count: number; nickname: string }> = {}

    data?.forEach((item: CheckInItem) => {
      if (!counts[item.user_id]) {
        counts[item.user_id] = { count: 0, nickname: item.users?.nickname || '匿名' }
      }
      counts[item.user_id].count++
    })

    const rank = Object.entries(counts)
      .map(([userId, { count, nickname }]) => ({
        id: userId,
        nickname,
        value: count,
        isCurrentUser: userId === currentUserId,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20)

    setTodayRank(rank)
  }

  const fetchStreakRank = async (currentUserId?: string) => {
    // Simplified streak: count unique days with at least one check-in
    const { data } = await supabase
      .from('check_ins')
      .select('user_id, timestamp, users(nickname)')
      .order('timestamp', { ascending: false })

    const uniqueDays: Record<string, { days: Set<string>; nickname: string }> = {}

    data?.forEach((item: CheckInItem) => {
      const date = new Date(item.timestamp).toDateString()
      if (!uniqueDays[item.user_id]) {
        uniqueDays[item.user_id] = { days: new Set(), nickname: item.users?.nickname || '匿名' }
      }
      uniqueDays[item.user_id].days.add(date)
    })

    const rank = Object.entries(uniqueDays)
      .map(([userId, { days, nickname }]) => ({
        id: userId,
        nickname,
        value: days.size,
        isCurrentUser: userId === currentUserId,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20)

    setStreakRank(rank)
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 3) return '🥉'
    return `${index + 1}.`
  }

  const renderRankList = (list: UserRank[]) => (
    <div className="px-4 py-2">
      {list.length === 0 ? (
        <p className="text-center text-text-secondary py-8">暂无数据</p>
      ) : (
        list.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between py-3 border-b border-gray-100 ${
              item.isCurrentUser ? 'bg-primary/10 -mx-4 px-4 rounded' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center">{getMedalIcon(index)}</span>
              <span className="font-medium">{item.nickname}</span>
              {item.isCurrentUser && (
                <span className="text-xs text-text-secondary">(你)</span>
              )}
            </div>
            <span className="text-text-secondary">{item.value} 次</span>
          </div>
        ))
      )}
    </div>
  )

  if (loading) {
    return <div className="text-center py-8 text-text-secondary">加载中...</div>
  }

  return (
    <Tabs defaultActiveKey="total">
      <Tabs.Tab title="总次数" key="total">
        {renderRankList(totalRank)}
      </Tabs.Tab>
      <Tabs.Tab title="今日" key="today">
        {renderRankList(todayRank)}
      </Tabs.Tab>
      <Tabs.Tab title="连续" key="streak">
        {renderRankList(streakRank)}
      </Tabs.Tab>
    </Tabs>
  )
}
