import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useSubscriberStore } from '../store/subscriberStore'
import { SOURCE_LABELS, PLATFORM_EMOJI, type SubSource } from '../types'
import type { Platform } from '../../clients/types'
import { cn } from '../../../lib/utils'

interface AddSubscriberFormProps {
  onClose: () => void
}

const platformOptions: { key: Platform; label: string }[] = [
  { key: 'snapchat', label: '👻 Snapchat' },
  { key: 'instagram', label: '📸 Instagram' },
  { key: 'twitter', label: '🐦 Twitter/X' },
  { key: 'onlyfans', label: '🔒 OnlyFans' },
  { key: 'fansly', label: '💎 Fansly' },
  { key: 'telegram', label: '✈️ Telegram' },
]

export function AddSubscriberForm({ onClose }: AddSubscriberFormProps) {
  const { addSubscriber } = useSubscriberStore()
  const [name, setName] = useState('')
  const [source, setSource] = useState<SubSource>('onlyfans')
  const [amount, setAmount] = useState('10')
  const [tier, setTier] = useState('Standard')
  const [autoRenew, setAutoRenew] = useState(false)
  const [handles, setHandles] = useState<{ platform: Platform; username: string }[]>([])
  const [handlePlatform, setHandlePlatform] = useState<Platform>('snapchat')
  const [handleUsername, setHandleUsername] = useState('')
  const [turnOns, setTurnOns] = useState('')
  const [turnOffs, setTurnOffs] = useState('')
  const [favContent, setFavContent] = useState('')
  const [commStyle, setCommStyle] = useState('')

  const addHandle = () => {
    if (!handleUsername.trim()) return
    setHandles((prev) => [...prev.filter((h) => h.platform !== handlePlatform), { platform: handlePlatform, username: handleUsername.trim() }])
    setHandleUsername('')
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const now = new Date().toISOString().split('T')[0]
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)

    addSubscriber({
      displayName: name.trim(),
      source,
      socialHandles: handles,
      subscribedAt: now,
      expiresAt: expires.toISOString().split('T')[0],
      status: 'active',
      tier: `${tier} ($${amount}/mo)`,
      monthlyAmount: parseFloat(amount) || 0,
      totalMonths: 1,
      autoRenew,
      preferences: {
        turnOns: turnOns.split(',').map((s) => s.trim()).filter(Boolean),
        turnOffs: turnOffs.split(',').map((s) => s.trim()).filter(Boolean),
        favoriteContentTypes: favContent.split(',').map((s) => s.trim()).filter(Boolean),
        communicationStyle: commStyle.trim(),
        notes: '',
      },
      clientId: null,
    })
    onClose()
  }

  return (
    <Card className="animate-fade-in !p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory">New Subscriber</h3>
        </div>
        <button onClick={onClose} className="p-1.5 text-muted hover:text-cream rounded-lg hover:bg-graphite transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <input type="text" placeholder="Display name *" value={name} onChange={(e) => setName(e.target.value)}
        className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />

      {/* Source */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Platform Source</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(SOURCE_LABELS) as [SubSource, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSource(key)}
              className={cn('py-2 px-2 rounded-lg text-[11px] font-medium border transition-all text-center',
                source === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount + Tier + Auto */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">$/month</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim" />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Tier</label>
          <input type="text" value={tier} onChange={(e) => setTier(e.target.value)}
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-xs text-soft cursor-pointer">
            <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="accent-gold" />
            🔁 Auto-renew
          </label>
        </div>
      </div>

      {/* Social handles */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Social Handles</label>
        {handles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {handles.map((h) => (
              <span key={h.platform} className="inline-flex items-center gap-1 text-xs bg-graphite border border-slate-dark rounded-md px-2 py-1 text-soft">
                {PLATFORM_EMOJI[h.platform]} {h.username}
                <button onClick={() => setHandles((p) => p.filter((x) => x.platform !== h.platform))} className="ml-1 text-muted hover:text-ruby">✕</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <select value={handlePlatform} onChange={(e) => setHandlePlatform(e.target.value as Platform)}
            className="bg-onyx border border-slate-dark rounded-lg px-2 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim">
            {platformOptions.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <input type="text" placeholder="Username" value={handleUsername} onChange={(e) => setHandleUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHandle()}
            className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
          <Button size="sm" variant="secondary" onClick={addHandle}>+</Button>
        </div>
      </div>

      {/* Content preferences */}
      <div className="space-y-2">
        <label className="text-[10px] text-muted uppercase tracking-wider block">Content Preferences</label>
        <input type="text" placeholder="🔥 Turn-ons (comma separated)" value={turnOns} onChange={(e) => setTurnOns(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
        <input type="text" placeholder="🚫 Turn-offs (comma separated)" value={turnOffs} onChange={(e) => setTurnOffs(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
        <input type="text" placeholder="⭐ Favorite content types (comma separated)" value={favContent} onChange={(e) => setFavContent(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
        <input type="text" placeholder="💬 Communication style" value={commStyle} onChange={(e) => setCommStyle(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
          👤 Add Subscriber
        </Button>
      </div>
    </Card>
  )
}
