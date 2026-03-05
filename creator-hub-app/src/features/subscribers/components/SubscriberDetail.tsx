import { useState } from 'react'
import {
  X,
  RotateCcw,
  Link2,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { CountdownTimer } from './CountdownTimer'
import { useSubscriberStore } from '../store/subscriberStore'
import { PLATFORM_EMOJI, SOURCE_LABELS, type Subscriber } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

const statusConfig = {
  active: { label: '✅ Active', variant: 'emerald' as const },
  'expiring-soon': { label: '🔥 Expiring Soon', variant: 'amber' as const },
  expired: { label: '⏰ Expired', variant: 'ruby' as const },
  purged: { label: '🗑️ Purged', variant: 'muted' as const },
}

interface SubscriberDetailProps {
  subscriber: Subscriber
  onClose: () => void
}

export function SubscriberDetail({ subscriber: sub, onClose }: SubscriberDetailProps) {
  const { toggleCheckItem, purgeSubscriber, unpurgeSubscriber } = useSubscriberStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'prefs'>('profile')

  const status = statusConfig[sub.status]
  const checkedCount = sub.activityChecklist.filter((i) => i.checked).length
  const totalChecks = sub.activityChecklist.length
  const engagementPct = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header card */}
      <Card className="!p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: `${sub.avatarColor}20`, color: sub.avatarColor }}
            >
              {sub.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 text-lg">{PLATFORM_EMOJI[sub.source]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-ivory">{sub.displayName}</h3>
              <Badge variant={status.variant} dot>{status.label}</Badge>
            </div>
            <p className="text-xs text-muted mt-1">{SOURCE_LABELS[sub.source]} • {sub.tier}</p>
            {/* Platform handles */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sub.socialHandles.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-soft bg-graphite px-2 py-1 rounded-md border border-slate-dark">
                  {PLATFORM_EMOJI[h.platform] || '💬'} {h.username}
                </span>
              ))}
              {sub.socialHandles.length === 0 && (
                <span className="text-xs text-muted">No linked socials</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-muted uppercase tracking-wider">⏱️ Subscription Timer</span>
          <CountdownTimer expiresAt={sub.expiresAt} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-graphite rounded-lg">
            <span className="text-sm">💰</span>
            <p className="text-sm font-semibold text-ivory">{formatCurrency(sub.monthlyAmount)}</p>
            <p className="text-[9px] text-muted">/month</p>
          </div>
          <div className="text-center p-2 bg-graphite rounded-lg">
            <span className="text-sm">📅</span>
            <p className="text-sm font-semibold text-ivory">{sub.totalMonths}</p>
            <p className="text-[9px] text-muted">months</p>
          </div>
          <div className="text-center p-2 bg-graphite rounded-lg">
            <span className="text-sm">📊</span>
            <p className="text-sm font-semibold text-ivory">{engagementPct}%</p>
            <p className="text-[9px] text-muted">engaged</p>
          </div>
          <div className="text-center p-2 bg-graphite rounded-lg">
            <span className="text-sm">{sub.autoRenew ? '🔁' : '⚠️'}</span>
            <p className="text-sm font-semibold text-ivory">{sub.autoRenew ? 'Yes' : 'No'}</p>
            <p className="text-[9px] text-muted">auto-renew</p>
          </div>
        </div>

        {sub.clientId && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-gold/5 border border-gold/15 rounded-lg">
            <Link2 className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs text-gold">Linked to CRM client</span>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-onyx rounded-xl p-1 border border-slate-dark">
        {[
          { id: 'profile' as const, label: '🎭 Preferences' },
          { id: 'activity' as const, label: `✅ Activity (${checkedCount}/${totalChecks})` },
          { id: 'prefs' as const, label: '⚡ Actions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all text-center',
              activeTab === tab.id
                ? 'bg-charcoal text-gold border border-gold/20'
                : 'text-muted hover:text-cream'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preferences / Turn-ons / Turn-offs */}
      {activeTab === 'profile' && (
        <Card className="!p-4 animate-fade-in space-y-4">
          {/* Turn Ons */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🔥</span>
              <span className="text-[10px] font-semibold text-emerald uppercase tracking-wider">Turn Ons</span>
            </div>
            {sub.preferences.turnOns.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sub.preferences.turnOns.map((item) => (
                  <Badge key={item} variant="emerald">❤️ {item}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">No turn-ons recorded yet</p>
            )}
          </div>

          {/* Turn Offs */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🚫</span>
              <span className="text-[10px] font-semibold text-ruby uppercase tracking-wider">Turn Offs</span>
            </div>
            {sub.preferences.turnOffs.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sub.preferences.turnOffs.map((item) => (
                  <Badge key={item} variant="ruby">👎 {item}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">No turn-offs recorded yet</p>
            )}
          </div>

          {/* Favorite content types */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">⭐</span>
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">Favorite Content</span>
            </div>
            {sub.preferences.favoriteContentTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sub.preferences.favoriteContentTypes.map((item) => (
                  <Badge key={item} variant="gold">🎬 {item}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">No favorites recorded yet</p>
            )}
          </div>

          {/* Communication style */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">💬</span>
              <span className="text-[10px] font-semibold text-sapphire uppercase tracking-wider">Communication Style</span>
            </div>
            <p className="text-sm text-soft leading-relaxed">
              {sub.preferences.communicationStyle || <span className="italic text-muted">Not recorded</span>}
            </p>
          </div>

          {/* General notes */}
          {sub.preferences.notes && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">📝</span>
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Notes</span>
              </div>
              <p className="text-sm text-soft leading-relaxed bg-graphite p-3 rounded-lg border border-slate-dark">
                {sub.preferences.notes}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Activity checklist */}
      {activeTab === 'activity' && (
        <Card className="!p-4 animate-fade-in">
          {/* Engagement bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] text-muted uppercase tracking-wider">📊 Engagement Score</span>
              <span className={cn(
                'text-sm font-bold',
                engagementPct >= 70 ? 'text-emerald' : engagementPct >= 40 ? 'text-amber' : 'text-ruby'
              )}>
                {engagementPct}%
              </span>
            </div>
            <div className="h-2 bg-graphite rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  engagementPct >= 70 ? 'bg-emerald' : engagementPct >= 40 ? 'bg-amber' : 'bg-ruby'
                )}
                style={{ width: `${engagementPct}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1.5">
            {sub.activityChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheckItem(sub.id, item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all border',
                  item.checked
                    ? 'bg-emerald/5 border-emerald/20 text-cream'
                    : 'bg-graphite border-slate-dark text-muted hover:border-gold-dim/30'
                )}
              >
                <span className="text-base shrink-0">
                  {item.checked ? '☑️' : '⬜'}
                </span>
                <span className={cn(item.checked && 'line-through opacity-70')}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      {activeTab === 'prefs' && (
        <Card className="!p-4 animate-fade-in space-y-3">
          {sub.status === 'purged' ? (
            <div className="text-center py-4">
              <span className="text-3xl block mb-2">🗑️</span>
              <p className="text-sm text-muted font-medium mb-1">Subscriber has been purged</p>
              <p className="text-xs text-muted mb-3">Purged on {sub.purgedAt}</p>
              <Button variant="secondary" size="sm" onClick={() => unpurgeSubscriber(sub.id)}>
                <RotateCcw className="w-3.5 h-3.5" /> Restore Subscriber
              </Button>
            </div>
          ) : (
            <>
              {sub.status === 'expired' && (
                <div className="p-3 bg-amber/5 border border-amber/15 rounded-lg mb-2">
                  <p className="text-xs text-amber font-medium">⏰ Subscription expired</p>
                  <p className="text-[11px] text-amber/70 mt-1">
                    This subscriber's access has lapsed. Consider sending a renewal reminder or purging.
                  </p>
                </div>
              )}
              {sub.status === 'expiring-soon' && (
                <div className="p-3 bg-amber/5 border border-amber/15 rounded-lg mb-2">
                  <p className="text-xs text-amber font-medium">🔥 Expiring in less than 3 days</p>
                  <p className="text-[11px] text-amber/70 mt-1">
                    {sub.autoRenew ? 'Auto-renew is ON — should renew automatically.' : 'Auto-renew is OFF — send a reminder to keep them!'}
                  </p>
                </div>
              )}
              <Button
                variant="danger"
                className="w-full"
                onClick={() => purgeSubscriber(sub.id)}
              >
                🗑️ Purge Subscriber
              </Button>
              <p className="text-[10px] text-muted text-center">
                Purging marks them as removed. You can restore them later.
              </p>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
