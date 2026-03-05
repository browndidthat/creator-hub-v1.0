import { useState } from 'react'
import { Copy, Check, Plus, Trash2, X, MessageSquare } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useFinanceStore } from '../store/financeStore'
import { CANNED_RESPONSE_CATEGORIES, type CannedResponse } from '../types'
import { cn } from '../../../lib/utils'

export function CannedResponses() {
  const { cannedResponses, addCannedResponse, deleteCannedResponse } = useFinanceStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CannedResponse['category'] | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newCat, setNewCat] = useState<CannedResponse['category']>('pricing')

  const filtered = activeCategory === 'all'
    ? cannedResponses
    : cannedResponses.filter((r) => r.category === activeCategory)

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleAdd = () => {
    if (!newLabel.trim() || !newBody.trim()) return
    addCannedResponse({ label: newLabel.trim(), body: newBody.trim(), category: newCat })
    setNewLabel('')
    setNewBody('')
    setShowAdd(false)
  }

  return (
    <div className="space-y-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
            activeCategory === 'all'
              ? 'bg-gold/15 text-gold border-gold/30'
              : 'text-muted border-slate-dark hover:text-cream'
          )}
        >
          All ({cannedResponses.length})
        </button>
        {(Object.entries(CANNED_RESPONSE_CATEGORIES) as [CannedResponse['category'], { label: string; emoji: string }][]).map(
          ([key, conf]) => {
            const count = cannedResponses.filter((r) => r.category === key).length
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  activeCategory === key
                    ? 'bg-gold/15 text-gold border-gold/30'
                    : 'text-muted border-slate-dark hover:text-cream'
                )}
              >
                {conf.emoji} {conf.label} ({count})
              </button>
            )
          }
        )}
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAdd ? 'Cancel' : 'New Response'}
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card className="!p-4 animate-fade-in space-y-3">
          <input
            type="text"
            placeholder="Label (e.g. 'Rush Pricing Info')"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
          />
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CANNED_RESPONSE_CATEGORIES) as [CannedResponse['category'], { label: string; emoji: string }][]).map(
              ([key, conf]) => (
                <button
                  key={key}
                  onClick={() => setNewCat(key)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all',
                    newCat === key
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'text-muted border-slate-dark hover:text-cream'
                  )}
                >
                  {conf.emoji} {conf.label}
                </button>
              )
            )}
          </div>
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
            placeholder="Message body..."
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim resize-none"
          />
          <Button size="sm" onClick={handleAdd} disabled={!newLabel.trim() || !newBody.trim()} className="w-full">
            <Plus className="w-3.5 h-3.5" /> Save Response
          </Button>
        </Card>
      )}

      {/* Response list */}
      {filtered.length === 0 ? (
        <Card className="text-center !py-6">
          <MessageSquare className="w-6 h-6 text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">No responses in this category</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((resp) => {
            const catConf = CANNED_RESPONSE_CATEGORIES[resp.category]
            const isCopied = copiedId === resp.id
            return (
              <Card key={resp.id} className="!p-4 group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ivory">{resp.label}</span>
                    <Badge variant="muted">{catConf.emoji} {catConf.label}</Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => copyToClipboard(resp.id, resp.body)}
                      className={cn(
                        'p-1.5 rounded-md transition-all text-xs font-medium flex items-center gap-1',
                        isCopied
                          ? 'bg-emerald/15 text-emerald'
                          : 'text-muted hover:text-gold hover:bg-gold/10'
                      )}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => deleteCannedResponse(resp.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-muted hover:text-ruby rounded-md transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-soft leading-relaxed whitespace-pre-line line-clamp-3">
                  {resp.body}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
