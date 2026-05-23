'use client'

import { useEffect, useState } from 'react'
import { getStoredToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import NicknameForm from '@/components/NicknameForm'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      const token = getStoredToken()
      if (!token) {
        setChecking(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, nickname')
        .eq('login_token', token)
        .single()

      if (!error && data) {
        router.push('/home')
      } else {
        setChecking(false)
      }
    }

    checkToken()
  }, [router])

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">加载中...</div>
      </div>
    )
  }

  return <NicknameForm />
}
