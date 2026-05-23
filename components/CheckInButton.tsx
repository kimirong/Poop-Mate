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
        ${pressing ? 'scale-95 shadow-md' : 'shadow-lg hover:shadow-xl'}
        ${disabled ? 'opacity-50 cursor-not-allowed animate-none' : 'cursor-pointer active:scale-95'}
        ${!disabled && !pressing ? 'animate-breathe' : ''}
      `}
      style={{
        animation: !disabled && !pressing ? 'breathe 2s ease-in-out infinite' : undefined,
      }}
    >
      <span className="text-4xl mb-1">🚽</span>
      <span className="text-white font-bold">打卡</span>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
      `}</style>
    </button>
  )
}
