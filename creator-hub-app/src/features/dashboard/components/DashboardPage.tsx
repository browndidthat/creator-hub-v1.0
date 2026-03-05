import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import {
  ChevronRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary'
import { useClientStore } from '../../clients/store/clientStore'
import { useOrderStore } from '../../orders/store/orderStore'
import { useFinanceStore } from '../../finances/store/financeStore'
import { useSubscriberStore } from '../../subscribers/store/subscriberStore'
import { useVaultStore } from '../../vault/store/vaultStore'
import { ORDER_STATUS_CONFIG } from '../../orders/types'
import type { OrderStatus } from '../../orders/types'
import { cn, formatCurrency } from '../../../lib/utils'

const PIPE_COLORS: Record<OrderStatus, string> = {
  inquiry: '#9494a8',
  pending: '#fbbf24',
  'in-progress': '#60a5fa',
  completed: '#a78bfa',
  paid: '#34d399',
  cancelled: '#f87171',
}

export function DashboardPage() {
  // Subscribe to store changes for reactivity
  useClientStore((s) => s.clients)
  const orders = useOrderStore((s) => s.orders)
  useSubscriberStore((s) => s.subscribers)
  useVaultStore((s) => s.assets)
  useFinanceStore((s) => s.expenses)
  useFinanceStore((s) => s.taxRate)

  const clientStats = useClientStore.getState().getStats()
  const orderStats = useOrderStore.getState().getStats()
  const pipelineCounts = useOrderStore.getState().getPipelineCounts()
  const subStats = useSubscriberStore.getState().getStats()
  const vaultStats = useVaultStore.getState().getStats()

  const taxEstimate = useFinanceStore.getState().getTaxEstimate()
  const monthlyBreakdown = useFinanceStore.getState().getMonthlyBreakdown()
  const recurringExpenses = useFinanceStore.getState().getRecurringExpensesTotal()

  const pipelineData = useMemo(() => (['inquiry', 'pending', 'in-progress', 'completed', 'paid'] as OrderStatus[]).map((status) => ({
    name: ORDER_STATUS_CONFIG[status].label,
    value: pipelineCounts[status],
    color: PIPE_COLORS[status],
  })), [pipelineCounts])

  const recentOrders = useMemo(() => [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5), [orders])

  // Action items
  const actionItems = useMemo(() => {
    const items: { emoji: string; text: string; link: string; variant: 'amber' | 'ruby' | 'gold' | 'sapphire' }[] = []
    if (subStats.expiringSoon > 0)
      items.push({ emoji: '🔥', text: `${subStats.expiringSoon} subscriber${subStats.expiringSoon !== 1 ? 's' : ''} expiring within 3 days`, link: '/subscribers', variant: 'amber' })
    if (subStats.expired > 0)
      items.push({ emoji: '⏰', text: `${subStats.expired} expired subscriber${subStats.expired !== 1 ? 's' : ''} ready to purge`, link: '/subscribers', variant: 'ruby' })
    if (orderStats.activeOrders > 0)
      items.push({ emoji: '📦', text: `${orderStats.activeOrders} active order${orderStats.activeOrders !== 1 ? 's' : ''} in pipeline`, link: '/orders', variant: 'sapphire' })
    if (clientStats.flagged > 0)
      items.push({ emoji: '🚩', text: `${clientStats.flagged} flagged client${clientStats.flagged !== 1 ? 's' : ''} on red flag list`, link: '/clients', variant: 'ruby' })
    if (pipelineCounts.completed > 0)
      items.push({ emoji: '💰', text: `${pipelineCounts.completed} completed order${pipelineCounts.completed !== 1 ? 's' : ''} awaiting payment`, link: '/orders', variant: 'gold' })
    return items
  }, [subStats, orderStats, clientStats, pipelineCounts])

  return (
    <>
      <Header title="Dashboard" subtitle="Your command center — everything at a glance" />

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-5">

          {/* TOP STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="!p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">💰</span>
                <span className="text-[10px] text-muted uppercase tracking-wider">Net Profit</span>
              </div>
              <p className={cn('text-2xl font-bold font-[family-name:var(--font-display)]', taxEstimate.netProfit >= 0 ? 'text-gold' : 'text-ruby')}>
                {formatCurrency(taxEstimate.netProfit)}
              </p>
              <p className="text-[10px] text-muted mt-0.5">{formatCurrency(taxEstimate.grossIncome)} in — {formatCurrency(taxEstimate.totalExpenses)} out</p>
            </Card>
            <Card className="!p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">📦</span>
                <span className="text-[10px] text-muted uppercase tracking-wider">Pipeline</span>
              </div>
              <p className="text-2xl font-bold text-sapphire font-[family-name:var(--font-display)]">{formatCurrency(orderStats.pendingRevenue)}</p>
              <p className="text-[10px] text-muted mt-0.5">{orderStats.activeOrders} active order{orderStats.activeOrders !== 1 ? 's' : ''}</p>
            </Card>
            <Card className="!p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">👥</span>
                <span className="text-[10px] text-muted uppercase tracking-wider">Subscribers</span>
              </div>
              <p className="text-2xl font-bold text-emerald font-[family-name:var(--font-display)]">{subStats.active}</p>
              <p className="text-[10px] text-muted mt-0.5">{formatCurrency(subStats.monthlyRevenue)}/mo MRR{subStats.expiringSoon > 0 && <> • <span className="text-amber">{subStats.expiringSoon} expiring</span></>}</p>
            </Card>
            <Card className="!p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">👑</span>
                <span className="text-[10px] text-muted uppercase tracking-wider">Clients</span>
              </div>
              <p className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">{clientStats.total}</p>
              <p className="text-[10px] text-muted mt-0.5">{clientStats.vip} VIP{clientStats.vip !== 1 ? 's' : ''} • {formatCurrency(clientStats.totalRevenue)} lifetime</p>
            </Card>
          </div>

          {/* ACTION ITEMS */}
          {actionItems.length > 0 && (
            <Card className="!p-4">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-3">⚡ Action Items</p>
              <div className="space-y-2">
                {actionItems.map((item, i) => (
                  <Link key={i} to={item.link}
                    className={cn('flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:border-gold-dim/30',
                      item.variant === 'ruby' ? 'bg-ruby/5 border-ruby/15' :
                        item.variant === 'amber' ? 'bg-amber/5 border-amber/15' :
                          item.variant === 'gold' ? 'bg-gold/5 border-gold/15' :
                            'bg-sapphire/5 border-sapphire/15')}>
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-sm text-cream flex-1">{item.text}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* CHARTS ROW */}
          <ErrorBoundary>
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Revenue Chart */}
              <Card className="!p-4" transition={false}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-muted uppercase tracking-wider">📊 Revenue vs Expenses (6mo)</p>
                  <Link to="/finances" className="text-[10px] text-gold hover:text-gold-light">View Details →</Link>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyBreakdown} barGap={2}>
                      <XAxis dataKey="month" tick={{ fill: '#6b6b80', fontSize: 10 }} axisLine={{ stroke: '#32323f' }} tickLine={false} />
                      <YAxis tick={{ fill: '#6b6b80', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} width={40} />
                      <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #32323f', borderRadius: 8, fontSize: 11, color: '#e8e4dc' }}
                        formatter={(value, name) => [formatCurrency(Number(value)), name === 'income' ? '💰 Income' : '💸 Expenses']} />
                      <Bar dataKey="income" radius={[3, 3, 0, 0]} maxBarSize={20}>
                        {monthlyBreakdown.map((_, i) => <Cell key={i} fill="#34d399" fillOpacity={0.7} />)}
                      </Bar>
                      <Bar dataKey="expenses" radius={[3, 3, 0, 0]} maxBarSize={20}>
                        {monthlyBreakdown.map((_, i) => <Cell key={i} fill="#f87171" fillOpacity={0.5} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Order Pipeline */}
              <Card className="!p-4" transition={false}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-muted uppercase tracking-wider">📦 Order Pipeline</p>
                  <Link to="/orders" className="text-[10px] text-gold hover:text-gold-light">View Pipeline →</Link>
                </div>
                <div className="space-y-2">
                  {pipelineData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-soft flex-1">{item.name}</span>
                      <span className="text-sm font-semibold text-ivory">{item.value}</span>
                      <div className="w-20 h-1.5 bg-graphite rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${orderStats.totalOrders > 0 ? (item.value / orderStats.totalOrders) * 100 : 0}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-dark flex justify-between text-xs">
                  <span className="text-muted">{orderStats.totalOrders} total orders</span>
                  <span className="text-gold font-medium">{formatCurrency(orderStats.pendingRevenue)} pending</span>
                </div>
              </Card>
            </div>
          </ErrorBoundary>

          {/* SECOND ROW — 3 columns */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Subscriber Health */}
            <Card className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted uppercase tracking-wider">👥 Subscriber Health</p>
                <Link to="/subscribers" className="text-[10px] text-gold hover:text-gold-light">Manage →</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-emerald">{subStats.active}</p>
                  <p className="text-[9px] text-muted">✅ Active</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-amber">{subStats.expiringSoon}</p>
                  <p className="text-[9px] text-muted">🔥 Expiring</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-ruby">{subStats.expired}</p>
                  <p className="text-[9px] text-muted">⏰ Expired</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-gold">{formatCurrency(subStats.monthlyRevenue)}</p>
                  <p className="text-[9px] text-muted">💰 MRR</p>
                </div>
              </div>
            </Card>

            {/* Vault Summary */}
            <Card className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted uppercase tracking-wider">🔒 Content Vault</p>
                <Link to="/vault" className="text-[10px] text-gold hover:text-gold-light">Open Vault →</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-ivory">{vaultStats.total}</p>
                  <p className="text-[9px] text-muted">📁 Total</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-sapphire">{vaultStats.posted}</p>
                  <p className="text-[9px] text-muted">📤 Posted</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-amethyst">{vaultStats.exclusive}</p>
                  <p className="text-[9px] text-muted">⭐ Exclusive</p>
                </div>
                <div className="p-2 bg-graphite rounded-lg text-center">
                  <p className="text-lg font-bold text-emerald">{vaultStats.available}</p>
                  <p className="text-[9px] text-muted">✅ Available</p>
                </div>
              </div>
            </Card>

            {/* Financial Quick View */}
            <Card className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted uppercase tracking-wider">💵 Financial Health</p>
                <Link to="/finances" className="text-[10px] text-gold hover:text-gold-light">Details →</Link>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft">💰 Gross Income</span>
                  <span className="text-sm font-medium text-emerald">{formatCurrency(taxEstimate.grossIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft">💸 Expenses</span>
                  <span className="text-sm font-medium text-ruby">-{formatCurrency(taxEstimate.totalExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft">🔄 Recurring</span>
                  <span className="text-sm font-medium text-amethyst">{formatCurrency(recurringExpenses)}/mo</span>
                </div>
                <div className="pt-2 border-t border-slate-dark flex justify-between items-center">
                  <span className="text-xs text-soft">🏦 Tax ({taxEstimate.taxRate}%)</span>
                  <span className="text-sm font-medium text-amber">{formatCurrency(taxEstimate.estimatedTax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-ivory font-medium">🎉 Take-Home</span>
                  <span className="text-lg font-bold text-gold font-[family-name:var(--font-display)]">{formatCurrency(taxEstimate.takeHome)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* RECENT ORDERS */}
          <Card className="!p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-muted uppercase tracking-wider">🕐 Recent Orders</p>
              <Link to="/orders" className="text-[10px] text-gold hover:text-gold-light">View All →</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => {
                  const statusConf = ORDER_STATUS_CONFIG[order.status]
                  return (
                    <Link key={order.id} to="/orders"
                      className="flex items-center gap-3 p-2.5 bg-graphite rounded-lg border border-slate-dark hover:border-gold-dim/30 transition-all">
                      <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: statusConf.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-cream truncate">{order.clientName}</p>
                        <p className="text-[11px] text-muted truncate">{order.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-gold">{formatCurrency(order.pricing.total)}</p>
                        <Badge variant={statusConf.badgeVariant} className="text-[9px] !py-0 !px-1.5">{statusConf.label}</Badge>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </Card>

        </div>
      </div>
    </>
  )
}
