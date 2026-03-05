import { create } from 'zustand'
import type {
  VaultAsset,
  PostedPlatform,
  VaultFilters,
  WatermarkConfig,
} from '../types'
import { seedAssets } from '../data/seedAssets'

interface VaultState {
  assets: VaultAsset[]
  filters: VaultFilters
  selectedAssetId: string | null

  // Filters
  setSearch: (search: string) => void
  setTypeFilter: (type: VaultFilters['type']) => void
  setStatusFilter: (status: VaultFilters['status']) => void
  setPlatformFilter: (platform: VaultFilters['platform']) => void
  setClientFilter: (linked: VaultFilters['clientLinked']) => void
  setSort: (field: VaultFilters['sortBy'], dir?: VaultFilters['sortDir']) => void

  selectAsset: (id: string | null) => void

  // CRUD
  addAsset: (asset: Omit<VaultAsset, 'id'>) => void
  updateAsset: (id: string, updates: Partial<VaultAsset>) => void
  deleteAsset: (id: string) => void

  // Platform tagging
  addPlatformTag: (assetId: string, platform: PostedPlatform) => void
  removePlatformTag: (assetId: string, platform: PostedPlatform) => void

  // Watermark
  setWatermark: (assetId: string, config: WatermarkConfig) => void
  removeWatermark: (assetId: string) => void

  // Client linking
  linkToClient: (assetId: string, clientId: string, clientName: string, orderId?: string) => void
  unlinkClient: (assetId: string) => void

  // Tags
  addTag: (assetId: string, tag: string) => void
  removeTag: (assetId: string, tag: string) => void

  // Computed
  getFilteredAssets: () => VaultAsset[]
  getAssetById: (id: string) => VaultAsset | undefined
  getAssetsByClient: (clientId: string) => VaultAsset[]
  getStats: () => {
    total: number
    available: number
    posted: number
    exclusive: number
    clientContent: number
    platforms: { platform: PostedPlatform; count: number }[]
  }
}

export const useVaultStore = create<VaultState>((set, get) => ({
  assets: seedAssets,
  filters: {
    search: '', type: 'all', status: 'all', platform: 'all',
    clientLinked: 'all', sortBy: 'dateCreated', sortDir: 'desc',
  },
  selectedAssetId: null,

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setTypeFilter: (type) => set((s) => ({ filters: { ...s.filters, type } })),
  setStatusFilter: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setPlatformFilter: (platform) => set((s) => ({ filters: { ...s.filters, platform } })),
  setClientFilter: (clientLinked) => set((s) => ({ filters: { ...s.filters, clientLinked } })),
  setSort: (field, dir) =>
    set((s) => ({
      filters: {
        ...s.filters, sortBy: field,
        sortDir: dir ?? (s.filters.sortBy === field && s.filters.sortDir === 'desc' ? 'asc' : 'desc'),
      },
    })),

  selectAsset: (id) => set({ selectedAssetId: id }),

  addAsset: (partial) => {
    set((s) => ({ assets: [{ ...partial, id: `asset_${Date.now()}` }, ...s.assets] }))
  },
  updateAsset: (id, updates) =>
    set((s) => ({ assets: s.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)) })),
  deleteAsset: (id) =>
    set((s) => ({
      assets: s.assets.filter((a) => a.id !== id),
      selectedAssetId: s.selectedAssetId === id ? null : s.selectedAssetId,
    })),

  addPlatformTag: (assetId, platform) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId && !a.postedTo.includes(platform)
          ? { ...a, postedTo: [...a.postedTo, platform], status: 'posted' as const, datePosted: a.datePosted || new Date().toISOString().split('T')[0] }
          : a
      ),
    })),
  removePlatformTag: (assetId, platform) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId ? { ...a, postedTo: a.postedTo.filter((p) => p !== platform) } : a
      ),
    })),

  setWatermark: (assetId, config) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId ? { ...a, isWatermarked: true, watermarkConfig: config } : a
      ),
    })),
  removeWatermark: (assetId) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId ? { ...a, isWatermarked: false, watermarkConfig: null } : a
      ),
    })),

  linkToClient: (assetId, clientId, clientName, orderId) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId
          ? { ...a, clientId, clientName, orderId: orderId || a.orderId, status: 'sent-to-client' as const }
          : a
      ),
    })),
  unlinkClient: (assetId) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId ? { ...a, clientId: null, clientName: null, orderId: null, status: 'available' as const } : a
      ),
    })),

  addTag: (assetId, tag) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId && !a.tags.includes(tag) ? { ...a, tags: [...a.tags, tag] } : a
      ),
    })),
  removeTag: (assetId, tag) =>
    set((s) => ({
      assets: s.assets.map((a) =>
        a.id === assetId ? { ...a, tags: a.tags.filter((t) => t !== tag) } : a
      ),
    })),

  getFilteredAssets: () => {
    const { assets, filters } = get()
    let result = [...assets]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        (a.clientName?.toLowerCase().includes(q) ?? false)
      )
    }
    if (filters.type !== 'all') result = result.filter((a) => a.type === filters.type)
    if (filters.status !== 'all') result = result.filter((a) => a.status === filters.status)
    if (filters.platform !== 'all') result = result.filter((a) => a.postedTo.includes(filters.platform as PostedPlatform))
    if (filters.clientLinked === 'linked') result = result.filter((a) => a.clientId !== null)
    if (filters.clientLinked === 'unlinked') result = result.filter((a) => a.clientId === null)

    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      if (filters.sortBy === 'dateCreated') return dir * a.dateCreated.localeCompare(b.dateCreated)
      if (filters.sortBy === 'name') return dir * a.name.localeCompare(b.name)
      if (filters.sortBy === 'status') return dir * a.status.localeCompare(b.status)
      return 0
    })
    return result
  },

  getAssetById: (id) => get().assets.find((a) => a.id === id),
  getAssetsByClient: (clientId) => get().assets.filter((a) => a.clientId === clientId),

  getStats: () => {
    const { assets } = get()
    const platformCounts: Record<string, number> = {}
    assets.forEach((a) => a.postedTo.forEach((p) => { platformCounts[p] = (platformCounts[p] || 0) + 1 }))
    return {
      total: assets.length,
      available: assets.filter((a) => a.status === 'available').length,
      posted: assets.filter((a) => a.status === 'posted').length,
      exclusive: assets.filter((a) => a.status === 'exclusive').length,
      clientContent: assets.filter((a) => a.clientId !== null).length,
      platforms: Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform: platform as PostedPlatform, count }))
        .sort((a, b) => b.count - a.count),
    }
  },
}))
