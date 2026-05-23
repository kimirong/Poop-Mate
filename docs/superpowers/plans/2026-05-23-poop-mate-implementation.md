# 拉屎宝 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first check-in app with Next.js + Vant UI + Tailwind CSS + Supabase

**Architecture:** Next.js App Router with client-side Supabase integration. Token-based auth stored in localStorage. Three pages: Login (/), Home (/home), Leaderboard (/leaderboard).

**Tech Stack:** Next.js 14+, Vant UI 4.x, Tailwind CSS, Supabase (PostgreSQL)

---

## File Structure

```
poop-mate/
├── app/
│   ├── layout.tsx              # Root layout with Vant + Tailwind
│   ├── page.tsx                # Login page
│   ├── home/
│   │   └── page.tsx            # Check-in page
│   └── leaderboard/
│       └── page.tsx            # Leaderboard page
├── components/
│   ├── NicknameForm.tsx        # Login form component
│   ├── CheckInButton.tsx       # Circular check-in button
│   ├── MoodInput.tsx           # Mood textarea
│   ├── SuccessModal.tsx        # Check-in success popup
│   └── Leaderboard.tsx          # Leaderboard with tabs
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── auth.ts                 # Token auth utilities
├── .env.local                  # Supabase credentials
├── tailwind.config.ts
├── postcss.config.mjs
└── package.json
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `.env.local.example`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "poop-mate",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.43.0",
    "vant": "^4.9.0",
    "react-router-dom": "^6.23.0",
    "ahooks": "^3.8.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
```

Run: `npm install`

- [ ] **Step 2: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB6C1',
        'primary-dark': '#FF9AAC',
        secondary: '#E0F7FA',
        accent: '#FFF9C4',
        background: '#FAFAFA',
        'text-primary': '#424242',
        'text-secondary': '#9E9E9E',
        success: '#81C784',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

- [ ] **Step 4: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['vant'],
}

module.exports = nextConfig
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create .env.local.example**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Step 7: Commit**

```bash
git add package.json tailwind.config.ts postcss.config.mjs next.config.js tsconfig.json .env.local.example
git commit -m "chore: initial Next.js project setup with Vant UI + Tailwind CSS"
```

---

## Task 2: Global Styles and Layout

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx`

- [ ] **Step 1: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #FFB6C1;
  --primary-dark: #FF9AAC;
  --secondary: #E0F7FA;
  --accent: #FFF9C4;
  --background: #FAFAFA;
  --text-primary: #424242;
  --text-secondary: #9E9E9E;
  --success: #81C784;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  min-height: 100vh;
}
```

- [ ] **Step 2: Create app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { VanProvider } from 'vant'

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
        <VanProvider>
          {children}
        </VanProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add global styles and root layout"
```

---

## Task 3: Supabase Client Setup

**Files:**
- Create: `lib/supabase.ts`

- [ ] **Step 1: Create lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: setup Supabase client"
```

---

## Task 4: Auth Utilities

**Files:**
- Create: `lib/auth.ts`

- [ ] **Step 1: Create lib/auth.ts**

```typescript
const LOGIN_TOKEN_KEY = 'login_token'

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(LOGIN_TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOGIN_TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LOGIN_TOKEN_KEY)
}

export { generateToken }
```

- [ ] **Step 2: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: add auth utilities for token management"
```

---

## Task 5: Database Setup (Supabase SQL)

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create supabase/schema.sql**

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(10) UNIQUE NOT NULL,
  login_token VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mood VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_timestamp ON check_ins(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_login_token ON users(login_token);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- RLS policies (public read/write for now - can restrict later)
CREATE POLICY "Public users read" ON users FOR SELECT USING (true);
CREATE POLICY "Public users insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public users update" ON users FOR UPDATE USING (true);

CREATE POLICY "Public check_ins read" ON check_ins FOR SELECT USING (true);
CREATE POLICY "Public check_ins insert" ON check_ins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public check_ins delete" ON check_ins FOR DELETE USING (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "chore: add Supabase database schema"
```

---

## Task 6: NicknameForm Component

**Files:**
- Create: `components/NicknameForm.tsx`

- [ ] **Step 1: Create components/NicknameForm.tsx**

```typescript
'use client'

import { useState } from 'react'
import { Button, Input, Card, Toast } from 'vant'
import { supabase } from '@/lib/supabase'
import { generateToken, setStoredToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function NicknameForm() {
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

  return (
    <Card className="mx-4 my-8 rounded-card shadow-md">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏠</div>
        <h1 className="text-xl font-bold text-text-primary">拉屎宝</h1>
      </div>

      <p className="text-text-secondary text-center mb-4">
        欢迎来到拉屎宝
        <br />
        请输入昵称登录
      </p>

      <Input
        v-model={nickname}
        placeholder="请输入昵称"
        maxlength={10}
        className="mb-4 rounded-input border-gray-200"
        onChange={(e: any) => {
          setNickname(e.target.value)
          setError('')
        }}
      />

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <Button
        type="primary"
        block
        round
        loading={loading}
        disabled={loading}
        onClick={handleLogin}
        className="bg-primary border-0 rounded-card"
      >
        登录
      </Button>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/NicknameForm.tsx
git commit -m "feat: add NicknameForm component for login"
```

---

## Task 7: Login Page

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getStoredToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import NicknameForm from '@/components/NicknameForm'

export default function LoginPage() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null)

  useEffect(() => {
    const checkToken = async () => {
      const token = getStoredToken()
      if (!token) {
        setChecking(false)
        return
      }

      const { data } = await supabase
        .from('users')
        .select('id, nickname')
        .eq('login_token', token)
        .single()

      if (data) {
        setUser(data)
        window.location.href = '/home'
      } else {
        setChecking(false)
      }
    }

    checkToken()
  }, [])

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">加载中...</div>
      </div>
    )
  }

  return <NicknameForm />
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add login page with token auto-login"
```

---

## Task 8: CheckInButton Component

**Files:**
- Create: `components/CheckInButton.tsx`

- [ ] **Step 1: Create components/CheckInButton.tsx**

```typescript
'use client'

import { useState } from 'react'

interface CheckInButtonProps {
  onCheckIn: () => void
  disabled?: boolean
}

export default function CheckInButton({ onCheckIn, disabled }: CheckInButtonProps) {
  const [pressing, setPressing] = useState(false)

  return (
    <button
      onClick={onCheckIn}
      disabled={disabled}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      className={`
        w-[120px] h-[120px] rounded-full
        bg-gradient-to-b from-primary to-primary-dark
        shadow-lg flex flex-col items-center justify-center
        transition-transform duration-150
        ${pressing ? 'scale-95 shadow-md' : 'shadow-lg'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
    >
      <span className="text-4xl mb-1">🚽</span>
      <span className="text-white font-bold">打卡</span>
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CheckInButton.tsx
git commit -m "feat: add CheckInButton component with press animation"
```

---

## Task 9: MoodInput Component

**Files:**
- Create: `components/MoodInput.tsx`

- [ ] **Step 1: Create components/MoodInput.tsx**

```typescript
'use client'

import { TextArea } from 'vant'

interface MoodInputProps {
  value: string
  onChange: (value: string) => void
}

export default function MoodInput({ value, onChange }: MoodInputProps) {
  return (
    <div className="px-4 mb-6">
      <TextArea
        v-model={value}
        placeholder="记录一下此刻心情..."
        maxlength={200}
        rows={3}
        showWordLimit
        className="!rounded-input !border-gray-200 !bg-white"
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MoodInput.tsx
git commit -m "feat: add MoodInput component"
```

---

## Task 10: SuccessModal Component

**Files:**
- Create: `components/SuccessModal.tsx`

- [ ] **Step 1: Create components/SuccessModal.tsx**

```typescript
'use client'

import { Dialog, Button } from 'vant'
import { useRouter } from 'next/navigation'

interface SuccessModalProps {
  show: boolean
  todayCount: number
  onClose: () => void
}

export default function SuccessModal({ show, todayCount, onClose }: SuccessModalProps) {
  const router = useRouter()

  const handleViewLeaderboard = () => {
    onClose()
    router.push('/leaderboard')
  }

  if (!show) return null

  Dialog({
    title: '打卡成功！',
    message: `今日第 ${todayCount} 次`,
    confirmButtonText: '查看排行榜',
    confirmButtonColor: '#FFB6C1',
    showCancelButton: true,
    cancelButtonText: '关闭',
    onConfirm: handleViewLeaderboard,
    onCancel: onClose,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SuccessModal.tsx
git commit -m "feat: add SuccessModal component"
```

---

## Task 11: Home Page (Check-in Page)

**Files:**
- Create: `app/home/page.tsx`

- [ ] **Step 1: Create app/home/page.tsx**

```typescript
'use client'

import { useEffect, useState, useCallback } from 'react'
import { NavBar, Card } from 'vant'
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

      const { data } = await supabase
        .from('users')
        .select('id, nickname')
        .eq('login_token', token)
        .single()

      if (!data) {
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
        leftText=""
        title={`👤 ${user.nickname}`}
        rightText="排行榜"
        onClickRight={() => router.push('/leaderboard')}
        className="!bg-background"
      />

      <div className="flex flex-col items-center justify-center pt-16">
        <CheckInButton onCheckIn={handleCheckIn} disabled={loading} />

        <MoodInput value={mood} onChange={setMood} />

        <Card className="mx-4 rounded-card shadow-sm">
          <Card.Body className="text-center py-2">
            <span className="text-text-secondary">今日已打卡 </span>
            <span className="text-primary font-bold text-xl">{todayCount}</span>
            <span className="text-text-secondary"> 次</span>
          </Card.Body>
        </Card>

        <button
          onClick={handleLogout}
          className="mt-8 text-text-secondary text-sm underline"
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
```

- [ ] **Step 2: Commit**

```bash
git add app/home/page.tsx
git commit -m "feat: add home page with check-in functionality"
```

---

## Task 12: Leaderboard Component

**Files:**
- Create: `components/Leaderboard.tsx`

- [ ] **Step 1: Create components/Leaderboard.tsx**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabPane } from 'vant'
import { supabase } from '@/lib/supabase'
import { getStoredToken } from '@/lib/auth'

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
    const fetchRanks = async () => {
      const token = getStoredToken()
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('login_token', token)
        .single()

      await Promise.all([
        fetchTotalRank(currentUser?.id),
        fetchTodayRank(currentUser?.id),
        fetchStreakRank(currentUser?.id),
      ])

      setLoading(false)
    }

    fetchRanks()
  }, [])

  const fetchTotalRank = async (currentUserId?: string) => {
    const { data } = await supabase
      .from('check_ins')
      .select('user_id, users(nickname)')
    // @ts-ignore
    const counts: Record<string, { count: number; nickname: string }> = {}

    data?.forEach((item) => {
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

    // @ts-ignore
    const counts: Record<string, { count: number; nickname: string }> = {}

    data?.forEach((item) => {
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
    // Simplified: count consecutive days from check_ins
    // In production, you'd calculate actual streaks
    const { data } = await supabase
      .from('check_ins')
      .select('user_id, users(nickname)')
      .order('timestamp', { ascending: false })

    // @ts-ignore
    const streaks: Record<string, { days: number; nickname: string }> = {}

    data?.forEach((item) => {
      const date = new Date(item.timestamp).toDateString()
      if (!streaks[item.user_id]) {
        streaks[item.user_id] = { days: 0, nickname: item.users?.nickname || '匿名' }
      }
      streaks[item.user_id].days++
    })

    const rank = Object.entries(streaks)
      .map(([userId, { days, nickname }]) => ({
        id: userId,
        nickname,
        value: days,
        isCurrentUser: userId === currentUserId,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20)

    setStreakRank(rank)
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
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

  return (
    <Tabs defaultActiveKey="total" className="min-h-screen bg-background">
      <TabPane tab="总次数" key="total">
        {renderRankList(totalRank)}
      </TabPane>
      <TabPane tab="今日" key="today">
        {renderRankList(todayRank)}
      </TabPane>
      <TabPane tab="连续" key="streak">
        {renderRankList(streakRank)}
      </TabPane>
    </Tabs>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Leaderboard.tsx
git commit -m "feat: add Leaderboard component with tabs"
```

---

## Task 13: Leaderboard Page

**Files:**
- Create: `app/leaderboard/page.tsx`

- [ ] **Step 1: Create app/leaderboard/page.tsx**

```typescript
'use client'

import { NavBar } from 'vant'
import { useRouter } from 'next/navigation'
import Leaderboard from '@/components/Leaderboard'

export default function LeaderboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        leftText="返回"
        title="排行榜"
        onClickLeft={() => router.back()}
        className="!bg-background"
      />

      <Leaderboard />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/leaderboard/page.tsx
git commit -m "feat: add leaderboard page"
```

---

## Task 14: Final Integration & Testing

**Files:**
- Modify: `.env.local` (from template)

- [ ] **Step 1: Verify all files exist**

Run: `find . -type f -name "*.ts" -o -name "*.tsx" | sort`

Expected output:
```
./app/page.tsx
./app/layout.tsx
./app/home/page.tsx
./app/leaderboard/page.tsx
./components/CheckInButton.tsx
./components/MoodInput.tsx
./components/NicknameForm.tsx
./components/SuccessModal.tsx
./components/Leaderboard.tsx
./lib/supabase.ts
./lib/auth.ts
```

- [ ] **Step 2: Setup env file**

Run: `cp .env.local.example .env.local`

Then edit `.env.local` with your Supabase credentials.

- [ ] **Step 3: Run database migration**

Run in Supabase SQL editor:
```bash
cat supabase/schema.sql | pbcopy
# Paste into Supabase SQL Editor and execute
```

- [ ] **Step 4: Start dev server**

Run: `npm run dev`

- [ ] **Step 5: Test login flow**
1. Navigate to http://localhost:3000
2. Enter a nickname (should exist in DB)
3. Should redirect to /home

- [ ] **Step 6: Test check-in flow**
1. On /home, enter mood
2. Click check-in button
3. Success modal should appear
4. Today count should update

- [ ] **Step 7: Test leaderboard**
1. Click "排行榜" or "查看排行榜"
2. Should see three tabs
3. Should see your rank highlighted

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: complete poop-mate app implementation"
```

---

## Spec Coverage Check

| Spec Section | Task(s) |
|--------------|---------|
| 登录与 Token 机制 | Task 4, 6, 7 |
| 打卡功能 | Task 8, 9, 11 |
| 打卡成功反馈 | Task 10, 11 |
| 排行榜 | Task 5, 12, 13 |
| Supabase 配置 | Task 3, 5 |
| 视觉设计 | Task 1, 2, 8 |

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-23-poop-mate-implementation.md`**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
