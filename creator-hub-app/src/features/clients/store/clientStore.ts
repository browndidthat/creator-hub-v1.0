import { create } from 'zustand'
import type {
  Client,
  ClientFilters,
  ClientNote,
  ClientPreferences,
  RedFlagEntry,
  Platform,
} from '../types'
import { seedClients } from '../data/seedClients'

interface ClientState {
  clients: Client[]
  filters: ClientFilters
  selectedClientId: string | null

  // Filters
  setSearch: (search: string) => void
  setTierFilter: (tier: ClientFilters['tier']) => void
  toggleRedFlagFilter: () => void
  setSort: (field: ClientFilters['sortBy'], dir?: ClientFilters['sortDir']) => void

  // Selection
  selectClient: (id: string | null) => void

  // CRUD
  addClient: (client: Omit<Client, 'id' | 'avatarColor' | 'orderHistory' | 'notes' | 'totalSpent' | 'orderCount' | 'lastOrderDate'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Notes
  addNote: (clientId: string, text: string) => void
  removeNote: (clientId: string, noteId: string) => void

  // Red flags
  flagClient: (clientId: string, entry: RedFlagEntry) => void
  unflagClient: (clientId: string) => void

  // Preferences
  updatePreferences: (clientId: string, prefs: Partial<ClientPreferences>) => void
  addPlatform: (clientId: string, platform: Platform, username: string) => void
  removePlatform: (clientId: string, platform: Platform) => void

  // Computed
  getFilteredClients: () => Client[]
  getClientById: (id: string) => Client | undefined
  getRedFlaggedClients: () => Client[]
  getStats: () => { total: number; vip: number; flagged: number; totalRevenue: number }
}

const avatarColors = ['#c9a84c', '#60a5fa', '#a78bfa', '#f87171', '#34d399', '#fbbf24', '#f472b6', '#818cf8']

export const useClientStore = create<ClientState>((set, get) => ({
  clients: seedClients,
  filters: {
    search: '',
    tier: 'all',
    redFlagOnly: false,
    sortBy: 'lastOrderDate',
    sortDir: 'desc',
  },
  selectedClientId: null,

  // Filters
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setTierFilter: (tier) => set((s) => ({ filters: { ...s.filters, tier } })),
  toggleRedFlagFilter: () =>
    set((s) => ({ filters: { ...s.filters, redFlagOnly: !s.filters.redFlagOnly } })),
  setSort: (field, dir) =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortBy: field,
        sortDir: dir ?? (s.filters.sortBy === field && s.filters.sortDir === 'desc' ? 'asc' : 'desc'),
      },
    })),

  // Selection
  selectClient: (id) => set({ selectedClientId: id }),

  // CRUD
  addClient: (partial) => {
    const newClient: Client = {
      ...partial,
      id: `c_${Date.now()}`,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      orderHistory: [],
      notes: [],
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: null,
    }
    set((s) => ({ clients: [newClient, ...s.clients] }))
  },

  updateClient: (id, updates) =>
    set((s) => ({
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  deleteClient: (id) =>
    set((s) => ({
      clients: s.clients.filter((c) => c.id !== id),
      selectedClientId: s.selectedClientId === id ? null : s.selectedClientId,
    })),

  // Notes
  addNote: (clientId, text) => {
    const note: ClientNote = { id: `n_${Date.now()}`, text, createdAt: new Date().toISOString().split('T')[0] }
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId ? { ...c, notes: [note, ...c.notes] } : c
      ),
    }))
  },

  removeNote: (clientId, noteId) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId ? { ...c, notes: c.notes.filter((n) => n.id !== noteId) } : c
      ),
    })),

  // Red flags
  flagClient: (clientId, entry) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId ? { ...c, redFlag: entry, tier: 'inactive' as const } : c
      ),
    })),

  unflagClient: (clientId) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId ? { ...c, redFlag: null } : c
      ),
    })),

  // Preferences
  updatePreferences: (clientId, prefs) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId ? { ...c, preferences: { ...c.preferences, ...prefs } } : c
      ),
    })),

  addPlatform: (clientId, platform, username) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId
          ? { ...c, platforms: [...c.platforms.filter((p) => p.platform !== platform), { platform, username }] }
          : c
      ),
    })),

  removePlatform: (clientId, platform) =>
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id === clientId
          ? { ...c, platforms: c.platforms.filter((p) => p.platform !== platform) }
          : c
      ),
    })),

  // Computed
  getFilteredClients: () => {
    const { clients, filters } = get()
    let result = [...clients]

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.platforms.some((p) => p.username.toLowerCase().includes(q))
      )
    }

    // Tier
    if (filters.tier !== 'all') {
      result = result.filter((c) => c.tier === filters.tier)
    }

    // Red flag
    if (filters.redFlagOnly) {
      result = result.filter((c) => c.redFlag !== null)
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      switch (filters.sortBy) {
        case 'displayName':
          return dir * a.displayName.localeCompare(b.displayName)
        case 'totalSpent':
          return dir * (a.totalSpent - b.totalSpent)
        case 'orderCount':
          return dir * (a.orderCount - b.orderCount)
        case 'lastOrderDate': {
          const aDate = a.lastOrderDate ?? '1970-01-01'
          const bDate = b.lastOrderDate ?? '1970-01-01'
          return dir * aDate.localeCompare(bDate)
        }
        default:
          return 0
      }
    })

    return result
  },

  getClientById: (id) => get().clients.find((c) => c.id === id),

  getRedFlaggedClients: () => get().clients.filter((c) => c.redFlag !== null),

  getStats: () => {
    const { clients } = get()
    return {
      total: clients.length,
      vip: clients.filter((c) => c.tier === 'vip').length,
      flagged: clients.filter((c) => c.redFlag !== null).length,
      totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
    }
  },
}))
