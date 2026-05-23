# 拉屎宝 Poop-Mate

一款极简有趣的如厕打卡工具，通过游戏化（积分/排行榜）增加用户粘性。

## 功能特性

- 🚽 **一键打卡** - 圆形打卡按钮，轻松记录如厕时刻
- 💭 **心情记录** - 记录此刻心情（可选）
- 🏆 **排行榜** - 总次数、今日、连续天数三种排行
- 🔐 **简单登录** - 输入昵称即可，无需复杂注册

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件库**: antd-mobile
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL)
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/kimirong/Poop-Mate.git
cd Poop-Mate
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 设置 Supabase 数据库

在 Supabase SQL Editor 中执行 `supabase/schema.sql` 创建数据表。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 数据库结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| nickname | VARCHAR(10) | 昵称，唯一 |
| login_token | VARCHAR(64) | 登录凭证 |
| created_at | TIMESTAMP | 创建时间 |

### check_ins 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 外键关联 users |
| timestamp | TIMESTAMP | 打卡时间 |
| mood | VARCHAR(200) | 心情内容 |
| created_at | TIMESTAMP | 创建时间 |

## 项目结构

```
poop-mate/
├── app/
│   ├── page.tsx           # 登录/登记页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── home/
│   │   └── page.tsx      # 打卡主页
│   └── leaderboard/
│       └── page.tsx       # 排行榜页
├── components/
│   ├── AntdMobileProvider.tsx  # antd-mobile Provider
│   ├── CheckInButton.tsx       # 打卡按钮
│   ├── Leaderboard.tsx         # 排行榜组件
│   ├── MoodInput.tsx           # 心情输入框
│   ├── NicknameForm.tsx        # 登录表单
│   └── SuccessModal.tsx        # 打卡成功弹层
├── lib/
│   ├── auth.ts            # Token 管理
│   └── supabase.ts        # Supabase 客户端
└── supabase/
    └── schema.sql         # 数据库 Schema
```

## License

MIT
