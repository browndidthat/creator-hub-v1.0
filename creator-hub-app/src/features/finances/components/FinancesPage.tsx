import { useState } from 'react'
import {
  TrendingUp,
  Receipt,
  PiggyBank,
  MessageSquare,
} from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { useFinanceStore } from '../store/financeStore'
import { ProfitTracker } from './ProfitTracker'
import { ExpenseLog } from './ExpenseLog'
import { TaxEstimator } from './TaxEstimator'
import { CannedResponses } from './CannedResponses'
import { cn } from '../../../lib/utils'

const tabs = [
  { id: 'profit' as const, label: 'Profit', shortLabel: 'Profit', icon: TrendingUp },
  { id: 'expenses' as const, label: 'Expenses', shortLabel: 'Expenses', icon: Receipt },
  { id: 'tax' as const, label: 'Tax Estimator', shortLabel: 'Taxes', icon: PiggyBank },
  { id: 'responses' as const, label: 'Quick Replies', shortLabel: 'Replies', icon: MessageSquare },
]

type TabId = (typeof tabs)[number]['id']

const dateRanges = [
  { key: '7d' as const, label: '7 Days' },
  { key: '30d' as const, label: '30 Days' },
  { key: '90d' as const, label: '90 Days' },
  { key: '365d' as const, label: '1 Year' },
  { key: 'all' as const, label: 'All Time' },
]

export function FinancesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profit')
  const { filters, setDateRange } = useFinanceStore()

  return (
    <>
      <Header title="Finances" subtitle="Profit tracking, tax estimation, and communication tools" />

      <div className="flex-1 p-4 lg:p-6 max-w-3xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-1 bg-onyx rounded-xl p-1 border border-slate-dark mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-charcoal text-gold shadow-sm border border-gold/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-gold' : 'text-muted')} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* Date range filter — shown for profit, expenses, tax */}
        {activeTab !== 'responses' && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dateRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all',
                  filters.dateRange === range.key
                    ? 'bg-gold/15 text-gold border-gold/30'
                    : 'text-muted border-slate-dark hover:text-cream'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'profit' && <ProfitTracker />}
          {activeTab === 'expenses' && <ExpenseLog />}
          {activeTab === 'tax' && <TaxEstimator />}
          {activeTab === 'responses' && <CannedResponses />}
        </div>
      </div>
    </>
  )
}
