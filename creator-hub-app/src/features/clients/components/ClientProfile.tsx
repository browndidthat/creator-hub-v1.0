import { useState } from 'react'
import {
  X,
  Crown,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  Send,
  DollarSign,
  Package,
  Calendar,
  Heart,
  ThumbsDown,
  MessageSquare,
  Flag,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useClientStore } from '../store/clientStore'
import { cn, formatCurrency } from '../../../lib/utils'
import type { Client, RedFlagSeverity } from '../types'

const platformEmoji: Record<string, string> = {
  snapchat: '👻', instagram: '📸', twitter: '🐦',
  onlyfans: '🔒', fansly: '💎', telegram: '✈️', other: '💬',
}

const tierConfig = {
  vip: { label: 'VIP', variant: 'gold' as const },
  regular: { label: 'Regular', variant: 'sapphire' as const },
  new: { label: 'New', variant: 'emerald' as const },
  inactive: { label: 'Inactive', variant: 'muted' as const },
}

const statusConfig = {
  completed: { label: 'Completed', variant: 'emerald' as const },
  pending: { label: 'Pending', variant: 'amber' as const },
  'in-progress': { label: 'In Progress', variant: 'sapphire' as const },
  cancelled: { label: 'Cancelled', variant: 'ruby' as const },
}

interface ClientProfileProps {
  client: Client
  onClose: () => void
}

export function ClientProfile({ client, onClose }: ClientProfileProps) {
  const { addNote, removeNote, flagClient, unflagClient, updateClient } = useClientStore()
  const [newNote, setNewNote] = useState('')
  const [showFlagForm, setShowFlagForm] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [flagSeverity, setFlagSeverity] = useState<RedFlagSeverity>('warn')
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'notes' | 'flags'>('overview')

  const tier = tierConfig[client.tier]
  const [clientDays] = useState(() =>
    client.firstContactDate
      ? Math.floor((Date.now() - new Date(client.firstContactDate).getTime()) / 86400000)
      : null
  )

  const handleAddNote = () => {
    if (!newNote.trim()) return
    addNote(client.id, newNote.trim())
    setNewNote('')
  }

  const handleFlag = () => {
    if (!flagReason.trim()) return
    flagClient(client.id, {
      flaggedAt: new Date().toISOString().split('T')[0],
      severity: flagSeverity,
      reason: flagReason.trim(),
    })
    setFlagReason('')
    setShowFlagForm(false)
  }

  const handleTierChange = (newTier: Client['tier']) => {
    updateClient(client.id, { tier: newTier })
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <Card className="!p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
            style={{ backgroundColor: `${client.avatarColor}20`, color: client.avatarColor }}
          >
            {client.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-ivory">
                {client.displayName}
              </h3>
              <Badge variant={tier.variant} dot>{tier.label}</Badge>
            </div>
            {client.email && (
              <p className="text-xs text-muted mt-1">{client.email}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {client.platforms.map((p) => (
                <span
                  key={p.platform}
                  className="inline-flex items-center gap-1 text-xs text-soft bg-graphite px-2 py-1 rounded-md border border-slate-dark"
                >
                  <span>{platformEmoji[p.platform]}</span>
                  {p.username}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Red flag banner */}
        {client.redFlag && (
          <div className="mt-3 p-3 bg-ruby/10 border border-ruby/25 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {client.redFlag.severity === 'block' ? (
                <ShieldAlert className="w-4 h-4 text-ruby" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-ruby" />
              )}
              <span className="text-sm font-medium text-ruby">
                {client.redFlag.severity === 'block' ? 'Blocked' : 'Warning'} — Flagged {client.redFlag.flaggedAt}
              </span>
            </div>
            <p className="text-xs text-ruby/80 leading-relaxed">{client.redFlag.reason}</p>
            <button
              onClick={() => unflagClient(client.id)}
              className="mt-2 text-[11px] text-ruby/60 hover:text-ruby underline"
            >
              Remove flag
            </button>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-graphite rounded-lg">
            <DollarSign className="w-4 h-4 text-gold mx-auto mb-1" />
            <p className="text-sm font-semibold text-ivory">{formatCurrency(client.totalSpent)}</p>
            <p className="text-[10px] text-muted">Total Spent</p>
          </div>
          <div className="text-center p-2 bg-graphite rounded-lg">
            <Package className="w-4 h-4 text-sapphire mx-auto mb-1" />
            <p className="text-sm font-semibold text-ivory">{client.orderCount}</p>
            <p className="text-[10px] text-muted">Orders</p>
          </div>
          <div className="text-center p-2 bg-graphite rounded-lg">
            <Calendar className="w-4 h-4 text-amethyst mx-auto mb-1" />
            <p className="text-sm font-semibold text-ivory">
              {clientDays !== null ? `${clientDays}d` : '—'}
            </p>
            <p className="text-[10px] text-muted">Client For</p>
          </div>
        </div>

        {/* Tier switcher */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] text-muted">Tier:</span>
          {(['vip', 'regular', 'new', 'inactive'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTierChange(t)}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-medium transition-all border',
                client.tier === t
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : 'text-muted border-transparent hover:text-cream'
              )}
            >
              {t === 'vip' && <Crown className="w-3 h-3 inline mr-0.5" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Section tabs */}
      <div className="flex gap-1 bg-onyx rounded-xl p-1 border border-slate-dark">
        {[
          { id: 'overview' as const, label: 'Preferences' },
          { id: 'orders' as const, label: `Orders (${client.orderHistory.length})` },
          { id: 'notes' as const, label: `Notes (${client.notes.length})` },
          { id: 'flags' as const, label: 'Actions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all text-center',
              activeSection === tab.id
                ? 'bg-charcoal text-gold border border-gold/20'
                : 'text-muted hover:text-cream'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preferences */}
      {activeSection === 'overview' && (
        <Card className="!p-4 animate-fade-in space-y-4">
          {client.preferences.likes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-emerald" />
                <span className="text-xs font-medium text-emerald uppercase tracking-wider">Likes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {client.preferences.likes.map((like) => (
                  <Badge key={like} variant="emerald">{like}</Badge>
                ))}
              </div>
            </div>
          )}

          {client.preferences.dislikes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsDown className="w-3.5 h-3.5 text-ruby" />
                <span className="text-xs font-medium text-ruby uppercase tracking-wider">Dislikes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {client.preferences.dislikes.map((dislike) => (
                  <Badge key={dislike} variant="ruby">{dislike}</Badge>
                ))}
              </div>
            </div>
          )}

          {client.preferences.customNotes && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-soft" />
                <span className="text-xs font-medium text-muted uppercase tracking-wider">Notes</span>
              </div>
              <p className="text-sm text-soft leading-relaxed">{client.preferences.customNotes}</p>
            </div>
          )}

          {!client.preferences.likes.length && !client.preferences.dislikes.length && !client.preferences.customNotes && (
            <p className="text-sm text-muted text-center py-4">No preferences recorded yet.</p>
          )}
        </Card>
      )}

      {/* Order history */}
      {activeSection === 'orders' && (
        <Card className="!p-4 animate-fade-in">
          {client.orderHistory.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {client.orderHistory.map((order) => {
                const status = statusConfig[order.status]
                return (
                  <div
                    key={order.id}
                    className="flex items-start gap-3 p-3 bg-graphite rounded-lg border border-slate-dark"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cream font-medium">{order.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <span className="text-xs text-muted">{order.date}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gold shrink-0">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                )
              })}
              <div className="pt-2 border-t border-slate-dark flex justify-between text-sm">
                <span className="text-muted">Total from {client.orderHistory.length} orders</span>
                <span className="text-gold font-semibold">{formatCurrency(client.totalSpent)}</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Notes */}
      {activeSection === 'notes' && (
        <Card className="!p-4 animate-fade-in space-y-3">
          {/* Add note */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
            />
            <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>

          {client.notes.length === 0 ? (
            <p className="text-sm text-muted text-center py-2">No notes yet.</p>
          ) : (
            <div className="space-y-2">
              {client.notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-2 p-2.5 bg-graphite rounded-lg border border-slate-dark group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-cream">{note.text}</p>
                    <p className="text-[11px] text-muted mt-1">{note.createdAt}</p>
                  </div>
                  <button
                    onClick={() => removeNote(client.id, note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-ruby transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Actions (Flag/unflag) */}
      {activeSection === 'flags' && (
        <Card className="!p-4 animate-fade-in space-y-3">
          {!client.redFlag ? (
            <>
              {!showFlagForm ? (
                <Button variant="danger" onClick={() => setShowFlagForm(true)} className="w-full">
                  <Flag className="w-4 h-4" />
                  Flag This Client
                </Button>
              ) : (
                <div className="space-y-3 p-3 bg-ruby/5 border border-ruby/20 rounded-lg">
                  <p className="text-sm font-medium text-ruby">Add to Red Flag List</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlagSeverity('warn')}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-xs font-medium border transition-all',
                        flagSeverity === 'warn'
                          ? 'bg-amber/15 text-amber border-amber/30'
                          : 'text-muted border-slate-dark'
                      )}
                    >
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      Warning
                    </button>
                    <button
                      onClick={() => setFlagSeverity('block')}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-xs font-medium border transition-all',
                        flagSeverity === 'block'
                          ? 'bg-ruby/15 text-ruby border-ruby/30'
                          : 'text-muted border-slate-dark'
                      )}
                    >
                      <ShieldAlert className="w-3 h-3 inline mr-1" />
                      Block
                    </button>
                  </div>
                  <textarea
                    placeholder="Reason for flagging..."
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    rows={3}
                    className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-ruby/40 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setShowFlagForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={handleFlag} disabled={!flagReason.trim()} className="flex-1">
                      Confirm Flag
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <ShieldAlert className="w-8 h-8 text-ruby mx-auto mb-2" />
              <p className="text-sm text-ruby font-medium mb-1">Client is flagged</p>
              <p className="text-xs text-muted mb-3">
                {client.redFlag.severity === 'block' ? 'Blocked' : 'Warning'} since {client.redFlag.flaggedAt}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => unflagClient(client.id)}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Remove Flag
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
