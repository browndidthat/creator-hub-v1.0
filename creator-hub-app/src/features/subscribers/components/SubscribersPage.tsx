import { useState } from 'react'

import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { SubscriberRow } from './SubscriberRow'
import { SubscriberDetail } from './SubscriberDetail'
import { AddSubscriberForm } from './AddSubscriberForm'
import { useSubscriberStore } from '../store/subscriberStore'
import { SOURCE_LABELS, type SubSource } from '../types'
import type { SubStatus } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

const statusFilters: { key: SubStatus | 'all'; label: string }[] = [
  { key: 'all', label: '📋 All' },
  { key: 'active', label: '✅ Active' },
  { key: 'expiring-soon', label: '🔥 Expiring' },
  { key: 'expired', label: '⏰ Expired' },
  { key: 'purged', label: '🗑️ Purged' },
]

export function SubscribersPage() {
  const {
    filters,
    setSearch,
    setStatusFilter,
    setSourceFilter,
    selectedSubId,
    selectSubscriber,
    getFilteredSubscribers,
    getStats,
    bulkPurgeExpired,
  } = useSubscriberStore()
  const [showAdd, setShowAdd] = useState(false)
  const [purgeCount, setPurgeCount] = useState<number | null>(null)

  const filtered = getFilteredSubscribers()
  const stats = getStats()
  const selectedSub = filtered.find((s) => s.id === selectedSubId)
    ?? useSubscriberStore.getState().getSubscriberById(selectedSubId ?? '')

  const handleBulkPurge = () => {
    const count = bulkPurgeExpired()
    setPurgeCount(count)
    setTimeout(() => setPurgeCount(null), 3000)
  }

  return (
    <>
      <Header title="The Purge" subtitle="Subscriber management, timers, and cross-referencing" />

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-ivory">{stats.total}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">📋 Total</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-emerald">{stats.active}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">✅ Active</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-amber">{stats.expiringSoon}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">🔥 Expiring</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-ruby">{stats.expired}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">⏰ Expired</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-muted">{stats.purged}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">🗑️ Purged</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-gold">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">💰 MRR</p>
            </Card>
          </div>

          {/* Search + actions */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by name or username..."
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-onyx border border-slate-dark rounded-lg pl-10 pr-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    filters.status === f.key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                  {f.label}
                  {f.key === 'expired' && stats.expired > 0 && (
                    <span className="ml-1 bg-ruby/20 text-ruby text-[10px] px-1.5 py-0.5 rounded-full">{stats.expired}</span>
                  )}
                </button>
              ))}
              <span className="border-l border-slate-dark mx-1" />
              <button onClick={() => setSourceFilter('all')}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  filters.source === 'all' ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                All Sources
              </button>
              {(Object.entries(SOURCE_LABELS) as [SubSource, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setSourceFilter(key)}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    filters.source === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                  {label}
                </button>
              ))}
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}</span>
              <div className="flex-1" />
              {stats.expired > 0 && (
                <Button variant="danger" size="sm" onClick={handleBulkPurge}>
                  🗑️ Purge All Expired ({stats.expired})
                </Button>
              )}
              <Button size="sm" onClick={() => { setShowAdd(true); selectSubscriber(null) }}>
                👤 Add
              </Button>
            </div>

            {/* Bulk purge feedback */}
            {purgeCount !== null && (
              <div className="p-2.5 bg-ruby/10 border border-ruby/20 rounded-lg text-xs text-ruby text-center animate-fade-in">
                🗑️ Purged {purgeCount} expired subscriber{purgeCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* List */}
            <div className={cn('space-y-2', selectedSub || showAdd ? 'lg:w-[45%] xl:w-[40%] shrink-0' : 'w-full')}>
              {filtered.length === 0 ? (
                <Card className="text-center !py-8">
                  <span className="text-2xl block mb-2">👥</span>
                  <p className="text-sm text-muted">No subscribers match your filters</p>
                </Card>
              ) : (
                filtered.map((sub) => (
                  <SubscriberRow
                    key={sub.id}
                    subscriber={sub}
                    isSelected={sub.id === selectedSubId}
                    onSelect={() => {
                      selectSubscriber(sub.id === selectedSubId ? null : sub.id)
                      setShowAdd(false)
                    }}
                  />
                ))
              )}
            </div>

            {/* Detail panel */}
            {(selectedSub || showAdd) && (
              <div className="lg:flex-1 min-w-0">
                <div className="lg:sticky lg:top-20">
                  {showAdd ? (
                    <AddSubscriberForm onClose={() => setShowAdd(false)} />
                  ) : selectedSub ? (
                    <SubscriberDetail subscriber={selectedSub} onClose={() => selectSubscriber(null)} />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
