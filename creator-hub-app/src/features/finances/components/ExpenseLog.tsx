import { useState } from 'react'
import { Plus, Trash2, RotateCcw, X } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useFinanceStore } from '../store/financeStore'
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

export function ExpenseLog() {
  const {
    filters,
    setExpenseCategory,
    getFilteredExpenses,
    getExpensesByCategory,
    addExpense,
    deleteExpense,
  } = useFinanceStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [newAmt, setNewAmt] = useState('')
  const [newCat, setNewCat] = useState<ExpenseCategory>('other')
  const [newRecurring, setNewRecurring] = useState(false)

  const expenses = getFilteredExpenses()
  const byCategory = getExpensesByCategory()
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const handleAdd = () => {
    if (!newDesc.trim() || !newAmt) return
    addExpense({
      description: newDesc.trim(),
      amount: parseFloat(newAmt),
      category: newCat,
      date: new Date().toISOString().split('T')[0],
      recurring: newRecurring,
      recurringInterval: newRecurring ? 'monthly' : undefined,
    })
    setNewDesc('')
    setNewAmt('')
    setNewCat('other')
    setNewRecurring(false)
    setShowAdd(false)
  }

  return (
    <div className="space-y-4">
      {/* Category summary */}
      {byCategory.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setExpenseCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              filters.expenseCategory === 'all'
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'text-muted border-slate-dark hover:text-cream'
            )}
          >
            All ({formatCurrency(total)})
          </button>
          {byCategory.map((cat) => {
            const conf = EXPENSE_CATEGORIES[cat.category]
            return (
              <button
                key={cat.category}
                onClick={() => setExpenseCategory(cat.category)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  filters.expenseCategory === cat.category
                    ? 'bg-gold/15 text-gold border-gold/30'
                    : 'text-muted border-slate-dark hover:text-cream'
                )}
              >
                {conf.emoji} {formatCurrency(cat.total)}
              </button>
            )
          })}
        </div>
      )}

      {/* Add button */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted">{expenses.length} expenses</span>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAdd ? 'Cancel' : 'Add Expense'}
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card className="!p-4 animate-fade-in space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
            />
            <input
              type="number"
              placeholder="$"
              value={newAmt}
              onChange={(e) => setNewAmt(e.target.value)}
              className="w-24 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(EXPENSE_CATEGORIES) as [ExpenseCategory, typeof EXPENSE_CATEGORIES.equipment][]).map(
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
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-soft cursor-pointer">
              <input
                type="checkbox"
                checked={newRecurring}
                onChange={(e) => setNewRecurring(e.target.checked)}
                className="accent-gold"
              />
              <RotateCcw className="w-3 h-3" />
              Monthly recurring
            </label>
            <Button size="sm" onClick={handleAdd} disabled={!newDesc.trim() || !newAmt}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
        </Card>
      )}

      {/* Expense list */}
      {expenses.length === 0 ? (
        <Card className="text-center !py-6">
          <p className="text-sm text-muted">No expenses in this period</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp) => {
            const conf = EXPENSE_CATEGORIES[exp.category]
            return (
              <Card key={exp.id} className="!p-3 group">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{conf.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-cream truncate">{exp.description}</span>
                      {exp.recurring && (
                        <Badge variant="amethyst">
                          <RotateCcw className="w-2.5 h-2.5" /> Monthly
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted">{exp.date}</span>
                  </div>
                  <span className="text-sm font-semibold text-ruby shrink-0">
                    -{formatCurrency(exp.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-ruby transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
