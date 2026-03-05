export type ExpenseCategory =
  | 'equipment'
  | 'props-wardrobe'
  | 'subscriptions'
  | 'marketing'
  | 'software'
  | 'travel'
  | 'other'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  recurring: boolean
  recurringInterval?: 'weekly' | 'monthly' | 'yearly'
}

export interface IncomeEntry {
  orderId: string
  clientName: string
  amount: number
  date: string
  description: string
}

export interface TaxEstimate {
  grossIncome: number
  totalExpenses: number
  netProfit: number
  taxRate: number
  estimatedTax: number
  takeHome: number
}

export interface CannedResponse {
  id: string
  label: string
  category: 'pricing' | 'boundaries' | 'scheduling' | 'gratitude' | 'decline'
  body: string
}

export interface FinanceFilters {
  dateRange: 'all' | '7d' | '30d' | '90d' | '365d'
  expenseCategory: ExpenseCategory | 'all'
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; emoji: string; color: string }> = {
  equipment: { label: 'Equipment', emoji: '📷', color: '#60a5fa' },
  'props-wardrobe': { label: 'Props & Wardrobe', emoji: '👗', color: '#f472b6' },
  subscriptions: { label: 'Subscriptions', emoji: '🔄', color: '#a78bfa' },
  marketing: { label: 'Marketing', emoji: '📣', color: '#fbbf24' },
  software: { label: 'Software', emoji: '💻', color: '#34d399' },
  travel: { label: 'Travel', emoji: '✈️', color: '#f87171' },
  other: { label: 'Other', emoji: '📦', color: '#9494a8' },
}

export const CANNED_RESPONSE_CATEGORIES: Record<CannedResponse['category'], { label: string; emoji: string }> = {
  pricing: { label: 'Pricing', emoji: '💰' },
  boundaries: { label: 'Boundaries', emoji: '🚧' },
  scheduling: { label: 'Scheduling', emoji: '📅' },
  gratitude: { label: 'Thank You', emoji: '💛' },
  decline: { label: 'Decline', emoji: '🚫' },
}
