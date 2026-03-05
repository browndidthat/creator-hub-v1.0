export type OrderStatus = 'inquiry' | 'pending' | 'in-progress' | 'completed' | 'paid' | 'cancelled'

export type ContentType = 'custom-video' | 'photo-set' | 'video-call' | 'gfe-day' | 'sexting' | 'other'

export type TurnaroundSpeed = 'standard' | 'rush' | 'priority'

export interface OrderPricing {
  basePrice: number
  lengthMultiplier: number
  rushFee: number
  addOns: { label: string; price: number }[]
  discount: number
  total: number
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  contentType: ContentType
  description: string
  status: OrderStatus
  pricing: OrderPricing
  turnaround: TurnaroundSpeed

  // Content specs
  videoLengthMinutes: number | null
  photoCount: number | null
  specialRequests: string

  // Dates
  createdAt: string
  dueDate: string | null
  completedAt: string | null
  paidAt: string | null

  // Notes
  internalNotes: string
}

export interface CostCalculatorInputs {
  contentType: ContentType
  videoLengthMinutes: number
  photoCount: number
  turnaround: TurnaroundSpeed
  addOns: string[]
  customDiscount: number
}

export type OrderSortField = 'createdAt' | 'dueDate' | 'pricing' | 'status'

export interface OrderFilters {
  search: string
  status: OrderStatus | 'all'
  sortBy: OrderSortField
  sortDir: 'asc' | 'desc'
}

// Pricing config — user can customize later
export const PRICING_CONFIG = {
  baseRates: {
    'custom-video': 30,    // per minute
    'photo-set': 8,        // per photo
    'video-call': 50,      // per minute
    'gfe-day': 150,        // flat
    'sexting': 25,         // per session
    'other': 50,           // flat
  } as Record<ContentType, number>,
  turnaroundMultiplier: {
    standard: 1,
    rush: 1.5,
    priority: 2,
  } as Record<TurnaroundSpeed, number>,
  addOnOptions: [
    { id: 'name-use', label: 'Use their name', price: 15 },
    { id: 'outfit-request', label: 'Specific outfit', price: 20 },
    { id: 'scenario', label: 'Custom scenario/script', price: 25 },
    { id: 'hd-download', label: 'HD download link', price: 10 },
    { id: 'expedite', label: 'Same-day delivery', price: 50 },
    { id: 'reshoot', label: 'One free reshoot', price: 30 },
  ],
  contentTypeLabels: {
    'custom-video': 'Custom Video',
    'photo-set': 'Photo Set',
    'video-call': 'Video Call',
    'gfe-day': 'GFE Day',
    'sexting': 'Sexting Session',
    'other': 'Other',
  } as Record<ContentType, string>,
  turnaroundLabels: {
    standard: 'Standard (5-7 days)',
    rush: 'Rush (2-3 days)',
    priority: 'Priority (24 hours)',
  } as Record<TurnaroundSpeed, string>,
}

import type { BadgeVariant } from '../../components/ui/Badge'

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; badgeVariant: BadgeVariant }> = {
  inquiry: { label: 'Inquiry', color: '#9494a8', badgeVariant: 'muted' },
  pending: { label: 'Pending', color: '#fbbf24', badgeVariant: 'amber' },
  'in-progress': { label: 'In Progress', color: '#60a5fa', badgeVariant: 'sapphire' },
  completed: { label: 'Completed', color: '#a78bfa', badgeVariant: 'amethyst' },
  paid: { label: 'Paid', color: '#34d399', badgeVariant: 'emerald' },
  cancelled: { label: 'Cancelled', color: '#f87171', badgeVariant: 'ruby' },
}
