'use client'

import { useState } from 'react'
import { Button, Input, Card } from 'antd-mobile'
import { supabase } from '@/lib/supabase'
import { generateToken, setStoredToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function NicknameForm() {
  const [isRegister, setIsRegister] = useState(false)
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const trimmed = nickname.trim()
    if (trimmed.length < 2 || trimmed.length > 10) {
      setError('昵称长度需在 2-10 个字符之间')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: queryError } = await supabase
        .from('users')
        .select('id, nickname')
        .eq('nickname', trimmed)
        .single()

      if (queryError || !data) {
        setError('昵称不存在，请重新输入')
        setLoading(false)
        return
      }

      const token = generateToken()
      await supabase
        .from('users')
        .update({ login_token: token })
        .eq('id', data.id)

      setStoredToken(token)
      router.push('/home')
    } catch {
      setError('登录失败，请重试')
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    const trimmed = nickname.trim()
    if (trimmed.length < 2 || trimmed.length > 10) {
      setError('昵称长度需在 2-10 个字符之间')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', trimmed)
        .single()

      if (existing) {
        setError('该昵称已被登记过，请换一个')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase.from('users').insert({
        nickname: trimmed,
      })

      if (insertError) {
        setError('注册失败，请重试')
        setLoading(false)
        return
      }

      const token = generateToken()
      const { data: newUser } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', trimmed)
        .single()

      if (newUser) {
        await supabase
          .from('users')
          .update({ login_token: token })
          .eq('id', newUser.id)
      }

      setStoredToken(token)
      router.push('/home')
    } catch {
      setError('注册失败，请重试')
      setLoading(false)
    }
  }

  return (
    <Card className="mx-4 my-8 rounded-card shadow-md" bordered={false}>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏠</div>
        <h1 className="text-xl font-bold text-text-primary">拉屎宝</h1>
      </div>

      <p className="text-text-secondary text-center mb-4">
        {isRegister ? '欢迎加入拉屎宝' : '欢迎来到拉屎宝'}
        <br />
        {isRegister ? '登记成为新用户' : '请输入昵称登录'}
      </p>

      <Input
        value={nickname}
        placeholder={isRegister ? '请输入昵称（2-10字）' : '请输入昵称'}
        maxLength={10}
        className="mb-4"
        onChange={(val) => {
          setNickname(val)
          setError('')
        }}
      />

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <Button
        block
        color="primary"
        loading={loading}
        disabled={loading}
        onClick={isRegister ? handleRegister : handleLogin}
        className="rounded-card"
      >
        {isRegister ? '登记' : '登录'}
      </Button>

      <div className="text-center mt-4">
        <span className="text-text-secondary text-sm">
          {isRegister ? '已有登记？' : '没有登记？'}
        </span>
        <span
          className="text-primary text-sm ml-1"
          onClick={() => {
            setIsRegister(!isRegister)
            setError('')
            setNickname('')
          }}
        >
          {isRegister ? '去登录' : '去登记'}
        </span>
      </div>
    </Card>
  )
}
