import { useState } from 'react'
import { X, Plus, UserPlus } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useClientStore } from '../store/clientStore'
import { cn } from '../../../lib/utils'
import type { Platform, ClientTier } from '../types'

const platformOptions: { key: Platform; label: string; emoji: string }[] = [
  { key: 'snapchat', label: 'Snapchat', emoji: '👻' },
  { key: 'instagram', label: 'Instagram', emoji: '📸' },
  { key: 'twitter', label: 'Twitter/X', emoji: '🐦' },
  { key: 'onlyfans', label: 'OnlyFans', emoji: '🔒' },
  { key: 'fansly', label: 'Fansly', emoji: '💎' },
  { key: 'telegram', label: 'Telegram', emoji: '✈️' },
  { key: 'other', label: 'Other', emoji: '💬' },
]

interface AddClientFormProps {
  onClose: () => void
}

export function AddClientForm({ onClose }: AddClientFormProps) {
  const { addClient } = useClientStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tier, setTier] = useState<ClientTier>('new')
  const [platforms, setPlatforms] = useState<{ platform: Platform; username: string }[]>([])
  const [activePlatform, setActivePlatform] = useState<Platform>('snapchat')
  const [platformUsername, setPlatformUsername] = useState('')
  const [likes, setLikes] = useState('')
  const [dislikes, setDislikes] = useState('')
  const [notes, setNotes] = useState('')

  const addPlatformEntry = () => {
    if (!platformUsername.trim()) return
    setPlatforms((prev) => [
      ...prev.filter((p) => p.platform !== activePlatform),
      { platform: activePlatform, username: platformUsername.trim() },
    ])
    setPlatformUsername('')
  }

  const removePlatformEntry = (platform: Platform) => {
    setPlatforms((prev) => prev.filter((p) => p.platform !== platform))
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    addClient({
      displayName: name.trim(),
      email: email.trim(),
      platforms,
      tier,
      firstContactDate: new Date().toISOString().split('T')[0],
      preferences: {
        likes: likes.split(',').map((s) => s.trim()).filter(Boolean),
        dislikes: dislikes.split(',').map((s) => s.trim()).filter(Boolean),
        customNotes: notes.trim(),
      },
      redFlag: null,
    })
    onClose()
  }

  return (
    <Card className="animate-fade-in !p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-gold" />
          <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory">New Client</h3>
        </div>
        <button onClick={onClose} className="p-1.5 text-muted hover:text-cream rounded-lg hover:bg-graphite transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Name & email */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Display name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
        />
      </div>

      {/* Tier */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Client Tier</label>
        <div className="flex gap-2">
          {(['new', 'regular', 'vip'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-medium border transition-all',
                tier === t
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : 'text-muted border-slate-dark hover:text-cream'
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-wider block mb-1.5">Platforms</label>
        {platforms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {platforms.map((p) => {
              const opt = platformOptions.find((o) => o.key === p.platform)
              return (
                <span
                  key={p.platform}
                  className="inline-flex items-center gap-1 text-xs bg-graphite border border-slate-dark rounded-md px-2 py-1 text-soft"
                >
                  {opt?.emoji} {p.username}
                  <button onClick={() => removePlatformEntry(p.platform)} className="ml-1 text-muted hover:text-ruby">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
        <div className="flex gap-2">
          <select
            value={activePlatform}
            onChange={(e) => setActivePlatform(e.target.value as Platform)}
            className="bg-onyx border border-slate-dark rounded-lg px-2 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim"
          >
            {platformOptions.map((p) => (
              <option key={p.key} value={p.key}>{p.emoji} {p.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Username"
            value={platformUsername}
            onChange={(e) => setPlatformUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlatformEntry()}
            className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
          />
          <Button size="sm" variant="secondary" onClick={addPlatformEntry}>
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <label className="text-[11px] text-muted uppercase tracking-wider block">Preferences</label>
        <input
          type="text"
          placeholder="Likes (comma separated)"
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
        />
        <input
          type="text"
          placeholder="Dislikes (comma separated)"
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
        />
        <textarea
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
          <UserPlus className="w-4 h-4" /> Add Client
        </Button>
      </div>
    </Card>
  )
}
