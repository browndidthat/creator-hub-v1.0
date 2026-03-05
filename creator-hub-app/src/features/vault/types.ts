export type AssetType = 'photo' | 'video' | 'photoset' | 'clip' | 'other'
export type AssetStatus = 'available' | 'posted' | 'exclusive' | 'archived' | 'sent-to-client'

export type PostedPlatform = 'onlyfans' | 'fansly' | 'instagram' | 'twitter' | 'snapchat' | 'tiktok' | 'reddit' | 'telegram'

export const PLATFORM_TAG_CONFIG: Record<PostedPlatform, { label: string; emoji: string; color: string }> = {
  onlyfans: { label: 'OnlyFans', emoji: '🔒', color: '#00aeef' },
  fansly: { label: 'Fansly', emoji: '💎', color: '#2b9fef' },
  instagram: { label: 'Instagram', emoji: '📸', color: '#e1306c' },
  twitter: { label: 'Twitter/X', emoji: '🐦', color: '#1da1f2' },
  snapchat: { label: 'Snapchat', emoji: '👻', color: '#fffc00' },
  tiktok: { label: 'TikTok', emoji: '🎵', color: '#fe2c55' },
  reddit: { label: 'Reddit', emoji: '🤖', color: '#ff4500' },
  telegram: { label: 'Telegram', emoji: '✈️', color: '#0088cc' },
}

export const ASSET_TYPE_CONFIG: Record<AssetType, { label: string; emoji: string }> = {
  photo: { label: 'Photo', emoji: '📷' },
  video: { label: 'Video', emoji: '🎬' },
  photoset: { label: 'Photo Set', emoji: '🖼️' },
  clip: { label: 'Clip', emoji: '✂️' },
  other: { label: 'Other', emoji: '📁' },
}

import type { BadgeVariant } from '../../components/ui/Badge'

export const ASSET_STATUS_CONFIG: Record<AssetStatus, { label: string; emoji: string; variant: BadgeVariant }> = {
  available: { label: 'Available', emoji: '✅', variant: 'emerald' },
  posted: { label: 'Posted', emoji: '📤', variant: 'sapphire' },
  exclusive: { label: 'Exclusive', emoji: '👑', variant: 'gold' },
  archived: { label: 'Archived', emoji: '📦', variant: 'muted' },
  'sent-to-client': { label: 'Sent to Client', emoji: '📩', variant: 'amethyst' },
}

export interface WatermarkConfig {
  text: string
  position: 'bottom-right' | 'bottom-left' | 'center' | 'top-right'
  opacity: number
  fontSize: number
}

export interface VaultAsset {
  id: string
  name: string
  type: AssetType
  status: AssetStatus
  postedTo: PostedPlatform[]
  dateCreated: string
  datePosted: string | null
  clientId: string | null
  clientName: string | null
  orderId: string | null
  tags: string[]
  isWatermarked: boolean
  watermarkConfig: WatermarkConfig | null
  fileSize: string
  thumbnail: string   // emoji placeholder — real app would have actual thumbnails
  notes: string
}

export interface VaultFilters {
  search: string
  type: AssetType | 'all'
  status: AssetStatus | 'all'
  platform: PostedPlatform | 'all'
  clientLinked: 'all' | 'linked' | 'unlinked'
  sortBy: 'dateCreated' | 'name' | 'status'
  sortDir: 'asc' | 'desc'
}
