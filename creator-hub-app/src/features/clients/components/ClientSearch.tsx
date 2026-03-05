import {
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Crown,
  ArrowUpDown,
} from 'lucide-react'
import { useClientStore } from '../store/clientStore'
import { cn } from '../../../lib/utils'
import type { ClientTier, ClientSortField } from '../types'

const tiers: { key: ClientTier | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'vip', label: 'VIP' },
  { key: 'regular', label: 'Regular' },
  { key: 'new', label: 'New' },
  { key: 'inactive', label: 'Inactive' },
]

const sortOptions: { key: ClientSortField; label: string }[] = [
  { key: 'lastOrderDate', label: 'Last Order' },
  { key: 'totalSpent', label: 'Spending' },
  { key: 'orderCount', label: 'Orders' },
  { key: 'displayName', label: 'Name' },
]

export function ClientSearch() {
  const { filters, setSearch, setTierFilter, toggleRedFlagFilter, setSort } = useClientStore()

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg pl-10 pr-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim transition-colors"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tier pills */}
        {tiers.map((t) => (
          <button
            key={t.key}
            onClick={() => setTierFilter(t.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              filters.tier === t.key
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-transparent text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
            )}
          >
            {t.key === 'vip' && <Crown className="w-3 h-3 inline mr-1" />}
            {t.label}
          </button>
        ))}

        {/* Red flag toggle */}
        <button
          onClick={toggleRedFlagFilter}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5',
            filters.redFlagOnly
              ? 'bg-ruby/15 text-ruby border-ruby/30'
              : 'bg-transparent text-muted border-slate-dark hover:text-cream hover:border-ruby/30'
          )}
        >
          <AlertTriangle className="w-3 h-3" />
          Flagged
        </button>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={cn(
                'px-2 py-1 rounded text-[11px] font-medium transition-all',
                filters.sortBy === opt.key
                  ? 'bg-graphite text-cream'
                  : 'text-muted hover:text-soft'
              )}
            >
              {opt.label}
              {filters.sortBy === opt.key && (
                <ArrowUpDown className="w-2.5 h-2.5 inline ml-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
