import { TrendingUp, TrendingDown, Wallet, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card } from '../../../components/ui/Card'
import { useFinanceStore } from '../store/financeStore'
import { formatCurrency } from '../../../lib/utils'
import { useOrderStore } from '../../orders/store/orderStore'

export function ProfitTracker() {
  const financeStore = useFinanceStore()
  useOrderStore((s) => s.orders)

  const tax = financeStore.getTaxEstimate()
  const monthly = financeStore.getMonthlyBreakdown()
  const recurring = financeStore.getRecurringExpensesTotal()

  return (
    <div className="space-y-4">
      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald" />
            <span className="text-[10px] text-muted uppercase tracking-wider">Income</span>
          </div>
          <p className="text-xl font-bold text-emerald font-[family-name:var(--font-display)]">
            {formatCurrency(tax.grossIncome)}
          </p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-ruby" />
            <span className="text-[10px] text-muted uppercase tracking-wider">Expenses</span>
          </div>
          <p className="text-xl font-bold text-ruby font-[family-name:var(--font-display)]">
            {formatCurrency(tax.totalExpenses)}
          </p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-gold" />
            <span className="text-[10px] text-muted uppercase tracking-wider">Net Profit</span>
          </div>
          <p className={`text-xl font-bold font-[family-name:var(--font-display)] ${tax.netProfit >= 0 ? 'text-gold' : 'text-ruby'}`}>
            {formatCurrency(tax.netProfit)}
          </p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-amethyst" />
            <span className="text-[10px] text-muted uppercase tracking-wider">Monthly Recurring</span>
          </div>
          <p className="text-xl font-bold text-amethyst font-[family-name:var(--font-display)]">
            {formatCurrency(recurring)}
          </p>
          <p className="text-[10px] text-muted mt-0.5">/month in fixed costs</p>
        </Card>
      </div>

      {/* Monthly chart */}
      <Card transition={false}>
        <p className="text-[10px] text-muted uppercase tracking-wider mb-3">6 Month Overview</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} barGap={2}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b6b80', fontSize: 11 }}
                axisLine={{ stroke: '#32323f' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b6b80', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1f',
                  border: '1px solid #32323f',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e8e4dc',
                }}
                formatter={(value, name) => [formatCurrency(Number(value)), name === 'income' ? 'Income' : 'Expenses']}
              />
              <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {monthly.map((_, i) => (
                  <Cell key={i} fill="#34d399" fillOpacity={0.7} />
                ))}
              </Bar>
              <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {monthly.map((_, i) => (
                  <Cell key={i} fill="#f87171" fillOpacity={0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
