import { create } from 'zustand'
import type {
  Subscriber,
  SubStatus,

  SubscriberFilters,
  ContentPreferences,
  ActivityCheckItem,
} from '../types'
import { DEFAULT_ACTIVITY_CHECKLIST } from '../types'
import { seedSubscribers } from '../data/seedSubscribers'

interface SubscriberState {
  subscribers: Subscriber[]
  filters: SubscriberFilters
  selectedSubId: string | null

  // Filters
  setSearch: (search: string) => void
  setStatusFilter: (status: SubscriberFilters['status']) => void
  setSourceFilter: (source: SubscriberFilters['source']) => void
  setSort: (field: SubscriberFilters['sortBy'], dir?: SubscriberFilters['sortDir']) => void

  // Selection
  selectSubscriber: (id: string | null) => void

  // CRUD
  addSubscriber: (sub: Omit<Subscriber, 'id' | 'avatarColor' | 'activityChecklist' | 'purgedAt'>) => void
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void
  deleteSubscriber: (id: string) => void

  // Activity checklist
  toggleCheckItem: (subId: string, itemId: string) => void

  // Preferences
  updatePreferences: (subId: string, prefs: Partial<ContentPreferences>) => void

  // Purge
  purgeSubscriber: (id: string) => void
  unpurgeSubscriber: (id: string) => void
  bulkPurgeExpired: () => number

  // Computed
  getFilteredSubscribers: () => Subscriber[]
  getSubscriberById: (id: string) => Subscriber | undefined
  getCountdown: (expiresAt: string) => { days: number; hours: number; minutes: number; total: number; label: string; urgent: boolean }
  getStats: () => {
    total: number
    active: number
    expiringSoon: number
    expired: number
    purged: number
    monthlyRevenue: number
  }
}

function computeStatus(expiresAt: string, currentStatus: SubStatus): SubStatus {
  if (currentStatus === 'purged') return 'purged'
  const now = new Date()
  const exp = new Date(expiresAt)
  const diff = exp.getTime() - now.getTime()
  const daysLeft = diff / 86400000
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 3) return 'expiring-soon'
  return 'active'
}

const avatarColors = ['#c9a84c', '#60a5fa', '#a78bfa', '#f87171', '#34d399', '#fbbf24', '#f472b6', '#818cf8']

export const useSubscriberStore = create<SubscriberState>((set, get) => ({
  subscribers: seedSubscribers.map((s) => ({
    ...s,
    status: computeStatus(s.expiresAt, s.status),
  })),
  filters: { search: '', status: 'all', source: 'all', sortBy: 'expiresAt', sortDir: 'asc' },
  selectedSubId: null,

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setStatusFilter: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setSourceFilter: (source) => set((s) => ({ filters: { ...s.filters, source } })),
  setSort: (field, dir) =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortBy: field,
        sortDir: dir ?? (s.filters.sortBy === field && s.filters.sortDir === 'asc' ? 'desc' : 'asc'),
      },
    })),

  selectSubscriber: (id) => set({ selectedSubId: id }),

  addSubscriber: (partial) => {
    const checklist: ActivityCheckItem[] = DEFAULT_ACTIVITY_CHECKLIST.map((item, i) => ({
      ...item,
      id: `ac_${Date.now()}_${i}`,
    }))
    const sub: Subscriber = {
      ...partial,
      id: `sub_${Date.now()}`,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      activityChecklist: checklist,
      purgedAt: null,
    }
    set((s) => ({ subscribers: [sub, ...s.subscribers] }))
  },

  updateSubscriber: (id, updates) =>
    set((s) => ({
      subscribers: s.subscribers.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)),
    })),

  deleteSubscriber: (id) =>
    set((s) => ({
      subscribers: s.subscribers.filter((sub) => sub.id !== id),
      selectedSubId: s.selectedSubId === id ? null : s.selectedSubId,
    })),

  toggleCheckItem: (subId, itemId) =>
    set((s) => ({
      subscribers: s.subscribers.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              activityChecklist: sub.activityChecklist.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : sub
      ),
    })),

  updatePreferences: (subId, prefs) =>
    set((s) => ({
      subscribers: s.subscribers.map((sub) =>
        sub.id === subId ? { ...sub, preferences: { ...sub.preferences, ...prefs } } : sub
      ),
    })),

  purgeSubscriber: (id) =>
    set((s) => ({
      subscribers: s.subscribers.map((sub) =>
        sub.id === id
          ? { ...sub, status: 'purged' as const, purgedAt: new Date().toISOString().split('T')[0] }
          : sub
      ),
    })),

  unpurgeSubscriber: (id) => {
    const sub = get().getSubscriberById(id)
    if (!sub) return
    const newStatus = computeStatus(sub.expiresAt, 'active')
    set((s) => ({
      subscribers: s.subscribers.map((su) =>
        su.id === id ? { ...su, status: newStatus, purgedAt: null } : su
      ),
    }))
  },

  bulkPurgeExpired: () => {
    const expired = get().subscribers.filter((s) => s.status === 'expired')
    const count = expired.length
    if (count === 0) return 0
    set((s) => ({
      subscribers: s.subscribers.map((sub) =>
        sub.status === 'expired'
          ? { ...sub, status: 'purged' as const, purgedAt: new Date().toISOString().split('T')[0] }
          : sub
      ),
    }))
    return count
  },

  getFilteredSubscribers: () => {
    const { subscribers, filters } = get()
    let result = subscribers.map((s) => ({
      ...s,
      status: s.status === 'purged' ? s.status : computeStatus(s.expiresAt, s.status),
    }))

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          s.socialHandles.some((h) => h.username.toLowerCase().includes(q))
      )
    }
    if (filters.status !== 'all') result = result.filter((s) => s.status === filters.status)
    if (filters.source !== 'all') result = result.filter((s) => s.source === filters.source)

    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      switch (filters.sortBy) {
        case 'expiresAt': return dir * a.expiresAt.localeCompare(b.expiresAt)
        case 'displayName': return dir * a.displayName.localeCompare(b.displayName)
        case 'monthlyAmount': return dir * (a.monthlyAmount - b.monthlyAmount)
        case 'totalMonths': return dir * (a.totalMonths - b.totalMonths)
        default: return 0
      }
    })
    return result
  },

  getSubscriberById: (id) => get().subscribers.find((s) => s.id === id),

  getCountdown: (expiresAt) => {
    const now = Date.now()
    const exp = new Date(expiresAt).getTime()
    const diff = exp - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, total: 0, label: 'Expired', urgent: true }
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const urgent = days <= 3
    let label = ''
    if (days > 0) label = `${days}d ${hours}h`
    else if (hours > 0) label = `${hours}h ${minutes}m`
    else label = `${minutes}m`
    return { days, hours, minutes, total: diff, label, urgent }
  },

  getStats: () => {
    const subs = get().subscribers.map((s) => ({
      ...s,
      status: s.status === 'purged' ? s.status : computeStatus(s.expiresAt, s.status),
    }))
    return {
      total: subs.length,
      active: subs.filter((s) => s.status === 'active').length,
      expiringSoon: subs.filter((s) => s.status === 'expiring-soon').length,
      expired: subs.filter((s) => s.status === 'expired').length,
      purged: subs.filter((s) => s.status === 'purged').length,
      monthlyRevenue: subs.filter((s) => s.status === 'active' || s.status === 'expiring-soon').reduce((sum, s) => sum + s.monthlyAmount, 0),
    }
  },
}))
