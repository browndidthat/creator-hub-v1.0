import { useState, useEffect } from 'react'
import { useSubscriberStore } from '../store/subscriberStore'
import { cn } from '../../../lib/utils'

interface CountdownTimerProps {
  expiresAt: string
  compact?: boolean
}

export function CountdownTimer({ expiresAt, compact = false }: CountdownTimerProps) {
  const { getCountdown } = useSubscriberStore()
  const [countdown, setCountdown] = useState(getCountdown(expiresAt))

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(expiresAt))
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [expiresAt, getCountdown])

  if (countdown.total <= 0) {
    return (
      <span className={cn(
        'font-mono font-semibold text-ruby',
        compact ? 'text-xs' : 'text-sm'
      )}>
        ⏰ Expired
      </span>
    )
  }

  if (compact) {
    return (
      <span className={cn(
        'font-mono font-medium',
        countdown.urgent ? 'text-ruby' : countdown.days <= 7 ? 'text-amber' : 'text-emerald'
      )}>
        {countdown.urgent && '🔥 '}{countdown.label}
      </span>
    )
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold',
      countdown.urgent
        ? 'bg-ruby/10 border-ruby/25 text-ruby'
        : countdown.days <= 7
          ? 'bg-amber/10 border-amber/25 text-amber'
          : 'bg-emerald/10 border-emerald/25 text-emerald'
    )}>
      <span className="text-base">{countdown.urgent ? '🔥' : countdown.days <= 7 ? '⏳' : '✅'}</span>
      <div>
        <span className="text-lg">{countdown.days}</span>
        <span className="text-[10px] opacity-70">d </span>
        <span className="text-lg">{countdown.hours}</span>
        <span className="text-[10px] opacity-70">h </span>
        <span className="text-lg">{countdown.minutes}</span>
        <span className="text-[10px] opacity-70">m</span>
      </div>
    </div>
  )
}
