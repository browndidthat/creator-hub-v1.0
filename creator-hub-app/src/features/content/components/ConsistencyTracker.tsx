import { useState, useEffect } from 'react'
import { Clock, Bell, BellOff, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { postingTimes } from '../data/poses'
import { cn } from '../../../lib/utils'

const platformIcons: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  'Twitter/X': '🐦',
  Snapchat: '👻',
  Fansly: '💎',
  OnlyFans: '🔒',
}

interface PostingStatus {
  platform: string
  posted: boolean
}

export function ConsistencyTracker() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayStatuses, setTodayStatuses] = useState<PostingStatus[]>(
    postingTimes.map((p) => ({ platform: p.platform, posted: false }))
  )
  const [enabledPlatforms, setEnabledPlatforms] = useState<Set<string>>(
    new Set(postingTimes.map((p) => p.platform))
  )

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' })
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const togglePosted = (platform: string) => {
    setTodayStatuses((prev) =>
      prev.map((s) => (s.platform === platform ? { ...s, posted: !s.posted } : s))
    )
  }

  const togglePlatform = (platform: string) => {
    setEnabledPlatforms((prev) => {
      const next = new Set(prev)
      if (next.has(platform)) next.delete(platform)
      else next.add(platform)
      return next
    })
  }

  const getNextPostingWindow = (platform: (typeof postingTimes)[0]) => {
    const now = currentTime
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    
    for (const timeStr of platform.bestTimes) {
      const [time, period] = timeStr.split(' ')
      const [h, m] = time.split(':').map(Number)
      let hours = h
      if (period === 'PM' && h !== 12) hours += 12
      if (period === 'AM' && h === 12) hours = 0
      const targetMinutes = hours * 60 + m
      
      if (targetMinutes > nowMinutes) {
        const diff = targetMinutes - nowMinutes
        const hrs = Math.floor(diff / 60)
        const mins = diff % 60
        return {
          time: timeStr,
          label: hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`,
          isUpcoming: diff <= 60,
          isPast: false,
        }
      }
    }
    
    return {
      time: platform.bestTimes[0],
      label: 'tomorrow',
      isUpcoming: false,
      isPast: true,
    }
  }

  const enabledCount = enabledPlatforms.size
  const postedCount = todayStatuses.filter(
    (s) => s.posted && enabledPlatforms.has(s.platform)
  ).length

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <Card className="!p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Today's Progress</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-[family-name:var(--font-display)] text-2xl text-ivory">
                {postedCount}/{enabledCount}
              </span>
              <span className="text-sm text-muted">platforms posted</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">{dayName}</p>
            <p className="text-sm text-gold font-medium">{timeStr}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-graphite rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${enabledCount > 0 ? (postedCount / enabledCount) * 100 : 0}%` }}
          />
        </div>
      </Card>

      {/* Platform cards */}
      <div className="space-y-2">
        {postingTimes.map((platform) => {
          const isEnabled = enabledPlatforms.has(platform.platform)
          const status = todayStatuses.find((s) => s.platform === platform.platform)
          const isPosted = status?.posted ?? false
          const next = getNextPostingWindow(platform)
          const isRelevantDay = platform.bestDays.includes('Daily') || platform.bestDays.includes(dayName)

          return (
            <Card
              key={platform.platform}
              className={cn(
                '!p-4 transition-all',
                !isEnabled && 'opacity-40',
                isPosted && 'border-emerald/30',
                next.isUpcoming && isEnabled && !isPosted && 'border-amber/30 animate-pulse-gold'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Platform icon + toggle posted */}
                <button
                  onClick={() => isEnabled && togglePosted(platform.platform)}
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 transition-all',
                    isPosted
                      ? 'bg-emerald/15 border border-emerald/30'
                      : 'bg-graphite border border-slate-dark hover:border-gold-dim'
                  )}
                  disabled={!isEnabled}
                  title={isPosted ? 'Mark as not posted' : 'Mark as posted'}
                >
                  {isPosted ? (
                    <CheckCircle className="w-5 h-5 text-emerald" />
                  ) : (
                    <span>{platformIcons[platform.platform] || '📱'}</span>
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ivory">{platform.platform}</span>
                    {isPosted && (
                      <Badge variant="emerald" dot>Done</Badge>
                    )}
                    {next.isUpcoming && !isPosted && isEnabled && (
                      <Badge variant="amber" dot>Post soon</Badge>
                    )}
                    {!isRelevantDay && !isPosted && isEnabled && (
                      <Badge variant="muted">Off-day</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Best: {platform.bestTimes.join(', ')}
                    </span>
                  </div>

                  {isEnabled && !isPosted && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                      {next.isUpcoming ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber" />
                          <span className="text-amber">Next window {next.label} ({next.time})</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 text-soft" />
                          <span className="text-soft">Next: {next.time} ({next.label})</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Enable/disable */}
                <button
                  onClick={() => togglePlatform(platform.platform)}
                  className="p-1.5 text-muted hover:text-cream transition-colors shrink-0"
                  title={isEnabled ? 'Disable platform' : 'Enable platform'}
                >
                  {isEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
