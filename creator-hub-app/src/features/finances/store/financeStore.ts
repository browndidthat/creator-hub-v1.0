import { create } from 'zustand'
import type {
  Expense,
  ExpenseCategory,
  CannedResponse,
  FinanceFilters,
  TaxEstimate,
  IncomeEntry,
} from '../types'
import { seedExpenses, seedCannedResponses } from '../data/seedFinances'
import { useOrderStore } from '../../orders/store/orderStore'

interface FinanceState {
  expenses: Expense[]
  cannedResponses: CannedResponse[]
  filters: FinanceFilters
  taxRate: number

  // Filters
  setDateRange: (range: FinanceFilters['dateRange']) => void
  setExpenseCategory: (cat: FinanceFilters['expenseCategory']) => void

  // Tax rate
  setTaxRate: (rate: number) => void

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void

  // Canned responses
  addCannedResponse: (resp: Omit<CannedResponse, 'id'>) => void
  deleteCannedResponse: (id: string) => void

  // Computed
  getFilteredExpenses: () => Expense[]
  getIncomeEntries: () => IncomeEntry[]
  getFilteredIncome: () => IncomeEntry[]
  getTaxEstimate: () => TaxEstimate
  getMonthlyBreakdown: () => { month: string; income: number; expenses: number; profit: number }[]
  getExpensesByCategory: () => { category: ExpenseCategory; total: number; count: number }[]
  getRecurringExpensesTotal: () => number
}

function isWithinRange(dateStr: string, range: FinanceFilters['dateRange']): boolean {
  if (range === 'all') return true
  const days = parseInt(range)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return new Date(dateStr) >= cutoff
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  expenses: seedExpenses,
  cannedResponses: seedCannedResponses,
  filters: { dateRange: '30d', expenseCategory: 'all' },
  taxRate: 25,

  setDateRange: (dateRange) => set((s) => ({ filters: { ...s.filters, dateRange } })),
  setExpenseCategory: (expenseCategory) => set((s) => ({ filters: { ...s.filters, expenseCategory } })),
  setTaxRate: (taxRate) => set({ taxRate: Math.max(0, Math.min(50, taxRate)) }),

  addExpense: (partial) => {
    const expense: Expense = { ...partial, id: `exp_${Date.now()}` }
    set((s) => ({ expenses: [expense, ...s.expenses] }))
  },

  updateExpense: (id, updates) =>
    set((s) => ({
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  deleteExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

  addCannedResponse: (partial) => {
    const resp: CannedResponse = { ...partial, id: `cr_${Date.now()}` }
    set((s) => ({ cannedResponses: [...s.cannedResponses, resp] }))
  },

  deleteCannedResponse: (id) =>
    set((s) => ({ cannedResponses: s.cannedResponses.filter((r) => r.id !== id) })),

  getFilteredExpenses: () => {
    const { expenses, filters } = get()
    return expenses
      .filter((e) => isWithinRange(e.date, filters.dateRange))
      .filter((e) => filters.expenseCategory === 'all' || e.category === filters.expenseCategory)
      .sort((a, b) => b.date.localeCompare(a.date))
  },

  getIncomeEntries: () => {
    const orders = useOrderStore.getState().orders
    return orders
      .filter((o) => o.status === 'paid' && o.paidAt)
      .map((o) => ({
        orderId: o.id,
        clientName: o.clientName,
        amount: o.pricing.total,
        date: o.paidAt!,
        description: o.description,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },

  getFilteredIncome: () => {
    const { filters } = get()
    return get().getIncomeEntries().filter((e) => isWithinRange(e.date, filters.dateRange))
  },

  getTaxEstimate: () => {
    const { filters, taxRate } = get()
    const income = get().getIncomeEntries().filter((e) => isWithinRange(e.date, filters.dateRange))
    const expenses = get().getFilteredExpenses()

    const grossIncome = income.reduce((s, e) => s + e.amount, 0)
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
    const netProfit = grossIncome - totalExpenses
    const estimatedTax = Math.max(0, netProfit * (taxRate / 100))
    const takeHome = netProfit - estimatedTax

    return { grossIncome, totalExpenses, netProfit, taxRate, estimatedTax, takeHome }
  },

  getMonthlyBreakdown: () => {
    const allIncome = get().getIncomeEntries()
    const { expenses } = get()
    const months: Record<string, { income: number; expenses: number }> = {}

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[key] = { income: 0, expenses: 0 }
    }

    allIncome.forEach((e) => {
      const key = e.date.substring(0, 7)
      if (months[key]) months[key].income += e.amount
    })

    expenses.forEach((e) => {
      const key = e.date.substring(0, 7)
      if (months[key]) months[key].expenses += e.amount
    })

    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + '-15').toLocaleDateString('en-US', { month: 'short' }),
      income: data.income,
      expenses: data.expenses,
      profit: data.income - data.expenses,
    }))
  },

  getExpensesByCategory: () => {
    const expenses = get().getFilteredExpenses()
    const cats: Record<string, { total: number; count: number }> = {}
    expenses.forEach((e) => {
      if (!cats[e.category]) cats[e.category] = { total: 0, count: 0 }
      cats[e.category].total += e.amount
      cats[e.category].count++
    })
    return Object.entries(cats)
      .map(([category, data]) => ({ category: category as ExpenseCategory, ...data }))
      .sort((a, b) => b.total - a.total)
  },

  getRecurringExpensesTotal: () => {
    return get().expenses
      .filter((e) => e.recurring && e.recurringInterval === 'monthly')
      .reduce((s, e) => s + e.amount, 0)
  },
}))
