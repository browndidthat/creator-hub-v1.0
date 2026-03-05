export type ClientTier = 'vip' | 'regular' | 'new' | 'inactive'
export type RedFlagSeverity = 'warn' | 'block'
export type Platform = 'snapchat' | 'instagram' | 'twitter' | 'onlyfans' | 'fansly' | 'telegram' | 'other'

export interface ClientNote {
  id: string
  text: string
  createdAt: string
}

export interface RedFlagEntry {
  flaggedAt: string
  severity: RedFlagSeverity
  reason: string
}

export interface ClientPreferences {
  likes: string[]
  dislikes: string[]
  customNotes: string
}

export interface OrderHistoryItem {
  id: string
  date: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'in-progress' | 'cancelled'
}

export interface Client {
  id: string
  displayName: string
  email: string
  platforms: { platform: Platform; username: string }[]
  tier: ClientTier
  totalSpent: number
  orderCount: number
  lastOrderDate: string | null
  firstContactDate: string
  preferences: ClientPreferences
  notes: ClientNote[]
  redFlag: RedFlagEntry | null
  orderHistory: OrderHistoryItem[]
  avatarColor: string
}

export type ClientSortField = 'displayName' | 'totalSpent' | 'lastOrderDate' | 'orderCount'
export type SortDirection = 'asc' | 'desc'

export interface ClientFilters {
  search: string
  tier: ClientTier | 'all'
  redFlagOnly: boolean
  sortBy: ClientSortField
  sortDir: SortDirection
}
