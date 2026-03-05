import type { Platform } from '../clients/types'

export type SubStatus = 'active' | 'expiring-soon' | 'expired' | 'purged'
export type SubSource = 'onlyfans' | 'fansly' | 'snapchat' | 'patreon' | 'other'

export const PLATFORM_EMOJI: Record<Platform | SubSource | string, string> = {
  snapchat: '👻',
  instagram: '📸',
  twitter: '🐦',
  onlyfans: '🔒',
  fansly: '💎',
  telegram: '✈️',
  patreon: '🅿️',
  other: '💬',
}

export const SOURCE_LABELS: Record<SubSource, string> = {
  onlyfans: '🔒 OnlyFans',
  fansly: '💎 Fansly',
  snapchat: '👻 Snapchat Premium',
  patreon: '🅿️ Patreon',
  other: '💬 Other',
}

export interface ActivityCheckItem {
  id: string
  label: string
  checked: boolean
}

export interface ContentPreferences {
  turnOns: string[]
  turnOffs: string[]
  favoriteContentTypes: string[]
  communicationStyle: string
  notes: string
}

export interface Subscriber {
  id: string
  displayName: string
  source: SubSource
  socialHandles: { platform: Platform | string; username: string }[]
  subscribedAt: string  // ISO date string
  expiresAt: string     // ISO date string
  status: SubStatus
  tier: string          // e.g. "VIP", "Standard", "$15/mo"
  monthlyAmount: number
  totalMonths: number
  autoRenew: boolean

  // Profile details
  preferences: ContentPreferences
  activityChecklist: ActivityCheckItem[]

  // Linking
  clientId: string | null  // optional link to CRM client

  avatarColor: string
  purgedAt: string | null
}

export interface SubscriberFilters {
  search: string
  status: SubStatus | 'all'
  source: SubSource | 'all'
  sortBy: 'expiresAt' | 'displayName' | 'monthlyAmount' | 'totalMonths'
  sortDir: 'asc' | 'desc'
}

// Default activity checklist items for new subscribers
export const DEFAULT_ACTIVITY_CHECKLIST: Omit<ActivityCheckItem, 'id'>[] = [
  { label: '💬 Replied to welcome message', checked: false },
  { label: '❤️ Likes/reacts to posts regularly', checked: false },
  { label: '💸 Tips beyond subscription', checked: false },
  { label: '🛒 Purchased PPV content', checked: false },
  { label: '📩 Opens mass DMs', checked: false },
  { label: '🎥 Requested custom content', checked: false },
  { label: '🔁 Has renewed at least once', checked: false },
  { label: '📱 Follows on social media', checked: false },
  { label: '⭐ Left a positive review/comment', checked: false },
  { label: '🚫 Has been warned about behavior', checked: false },
]
