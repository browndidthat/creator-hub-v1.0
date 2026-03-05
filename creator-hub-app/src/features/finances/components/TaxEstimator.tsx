import { PiggyBank, AlertTriangle, Minus, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useFinanceStore } from '../store/financeStore'
import { formatCurrency, cn } from '../../../lib/utils'

export function TaxEstimator() {
  const { taxRate, setTaxRate, getTaxEstimate } = useFinanceStore()
  const tax = getTaxEstimate()

  return (
    <Card glow>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-gold" />
          <CardTitle>Tax Estimator</CardTitle>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {/* Tax rate slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-muted uppercase tracking-wider">Tax Rate</label>
            <span className="text-sm font-semibold text-gold">{taxRate}%</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTaxRate(taxRate - 1)}
              className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={0}
              max={50}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="flex-1 accent-gold"
            />
            <button
              onClick={() => setTaxRate(taxRate + 1)}
              className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-4 bg-onyx rounded-lg border border-slate-dark space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-soft">Gross Income</span>
            <span className="text-emerald font-medium">{formatCurrency(tax.grossIncome)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-soft">Total Expenses</span>
            <span className="text-ruby font-medium">-{formatCurrency(tax.totalExpenses)}</span>
          </div>
          <div className="pt-2 border-t border-slate-dark flex justify-between text-xs">
            <span className="text-ivory font-medium">Net Profit</span>
            <span className={cn('font-medium', tax.netProfit >= 0 ? 'text-gold' : 'text-ruby')}>
              {formatCurrency(tax.netProfit)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-soft">Estimated Tax ({taxRate}%)</span>
            <span className="text-amber font-medium">-{formatCurrency(tax.estimatedTax)}</span>
          </div>
          <div className="pt-2 border-t border-gold/20 flex justify-between">
            <span className="text-sm font-medium text-ivory">Take-Home</span>
            <span className="text-lg font-bold text-gold font-[family-name:var(--font-display)]">
              {formatCurrency(tax.takeHome)}
            </span>
          </div>
        </div>

        {/* Save reminder */}
        <div className="flex items-start gap-2 p-3 bg-amber/5 border border-amber/15 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-amber font-medium">Tax Savings Reminder</p>
            <p className="text-[11px] text-amber/70 mt-0.5 leading-relaxed">
              Set aside <span className="font-semibold text-amber">{formatCurrency(tax.estimatedTax)}</span> for taxes. 
              This is a rough estimate — consult a tax professional for exact obligations.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
