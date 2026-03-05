import { create } from 'zustand'
import type {
  Order,
  OrderStatus,
  OrderFilters,
  OrderPricing,
  CostCalculatorInputs,
} from '../types'
import { PRICING_CONFIG } from '../types'
import { seedOrders } from '../data/seedOrders'
import { useClientStore } from '../../clients/store/clientStore'

interface OrderState {
  orders: Order[]
  filters: OrderFilters
  selectedOrderId: string | null

  // Filters
  setSearch: (search: string) => void
  setStatusFilter: (status: OrderFilters['status']) => void
  setSort: (field: OrderFilters['sortBy'], dir?: OrderFilters['sortDir']) => void

  // Selection
  selectOrder: (id: string | null) => void

  // CRUD
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void

  // Status transitions
  advanceStatus: (id: string) => void
  setStatus: (id: string, status: OrderStatus) => void
  markPaid: (id: string) => void

  // Cost calculator
  calculatePrice: (inputs: CostCalculatorInputs) => OrderPricing

  // Computed
  getFilteredOrders: () => Order[]
  getOrderById: (id: string) => Order | undefined
  getOrdersByStatus: (status: OrderStatus) => Order[]
  getOrdersByClient: (clientId: string) => Order[]
  getPipelineCounts: () => Record<OrderStatus, number>
  getStats: () => {
    totalOrders: number
    pendingRevenue: number
    completedRevenue: number
    activeOrders: number
  }
}

const STATUS_FLOW: OrderStatus[] = ['inquiry', 'pending', 'in-progress', 'completed', 'paid']

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: seedOrders,
  filters: {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortDir: 'desc',
  },
  selectedOrderId: null,

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setStatusFilter: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setSort: (field, dir) =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortBy: field,
        sortDir: dir ?? (s.filters.sortBy === field && s.filters.sortDir === 'desc' ? 'asc' : 'desc'),
      },
    })),

  selectOrder: (id) => set({ selectedOrderId: id }),

  addOrder: (partial) => {
    const newOrder: Order = {
      ...partial,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    set((s) => ({ orders: [newOrder, ...s.orders] }))

    // Sync to client store
    const clientStore = useClientStore.getState()
    const client = clientStore.getClientById(partial.clientId)
    if (client) {
      clientStore.updateClient(partial.clientId, {
        orderCount: client.orderCount + 1,
        lastOrderDate: newOrder.createdAt,
      })
    }
  },

  updateOrder: (id, updates) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  deleteOrder: (id) =>
    set((s) => ({
      orders: s.orders.filter((o) => o.id !== id),
      selectedOrderId: s.selectedOrderId === id ? null : s.selectedOrderId,
    })),

  advanceStatus: (id) => {
    const order = get().getOrderById(id)
    if (!order) return
    const currentIdx = STATUS_FLOW.indexOf(order.status)
    if (currentIdx < 0 || currentIdx >= STATUS_FLOW.length - 1) return
    const nextStatus = STATUS_FLOW[currentIdx + 1]
    const updates: Partial<Order> = { status: nextStatus }

    if (nextStatus === 'completed') {
      updates.completedAt = new Date().toISOString().split('T')[0]
    }
    if (nextStatus === 'paid') {
      updates.paidAt = new Date().toISOString().split('T')[0]
      // Update client spending
      const clientStore = useClientStore.getState()
      const client = clientStore.getClientById(order.clientId)
      if (client) {
        clientStore.updateClient(order.clientId, {
          totalSpent: client.totalSpent + order.pricing.total,
        })
      }
    }

    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }))
  },

  setStatus: (id, status) => {
    const updates: Partial<Order> = { status }
    if (status === 'completed') updates.completedAt = new Date().toISOString().split('T')[0]
    if (status === 'paid') updates.paidAt = new Date().toISOString().split('T')[0]
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }))
  },

  markPaid: (id) => get().advanceStatus(id),

  calculatePrice: (inputs) => {
    const baseRate = PRICING_CONFIG.baseRates[inputs.contentType]
    let quantity = 1
    if (inputs.contentType === 'custom-video' || inputs.contentType === 'video-call') {
      quantity = inputs.videoLengthMinutes
    } else if (inputs.contentType === 'photo-set') {
      quantity = inputs.photoCount
    }

    const basePrice = baseRate
    const lengthMultiplier = quantity
    const subtotal = basePrice * lengthMultiplier
    const turnaroundMult = PRICING_CONFIG.turnaroundMultiplier[inputs.turnaround]
    const rushFee = turnaroundMult > 1 ? Math.round(subtotal * (turnaroundMult - 1)) : 0

    const selectedAddOns = PRICING_CONFIG.addOnOptions
      .filter((a) => inputs.addOns.includes(a.id))
      .map((a) => ({ label: a.label, price: a.price }))

    const addOnTotal = selectedAddOns.reduce((s, a) => s + a.price, 0)
    const gross = subtotal + rushFee + addOnTotal
    const discount = inputs.customDiscount
    const total = Math.max(0, gross - discount)

    return {
      basePrice,
      lengthMultiplier,
      rushFee,
      addOns: selectedAddOns,
      discount,
      total,
    }
  },

  getFilteredOrders: () => {
    const { orders, filters } = get()
    let result = [...orders]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (o) =>
          o.clientName.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      )
    }

    if (filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status)
    }

    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      switch (filters.sortBy) {
        case 'createdAt':
          return dir * a.createdAt.localeCompare(b.createdAt)
        case 'dueDate':
          return dir * ((a.dueDate || '9999') as string).localeCompare((b.dueDate || '9999') as string)
        case 'pricing':
          return dir * (a.pricing.total - b.pricing.total)
        case 'status': {
          const order: OrderStatus[] = ['inquiry', 'pending', 'in-progress', 'completed', 'paid', 'cancelled']
          return dir * (order.indexOf(a.status) - order.indexOf(b.status))
        }
        default:
          return 0
      }
    })

    return result
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),
  getOrdersByClient: (clientId) => get().orders.filter((o) => o.clientId === clientId),

  getPipelineCounts: () => {
    const counts: Record<OrderStatus, number> = {
      inquiry: 0, pending: 0, 'in-progress': 0, completed: 0, paid: 0, cancelled: 0,
    }
    get().orders.forEach((o) => { counts[o.status]++ })
    return counts
  },

  getStats: () => {
    const { orders } = get()
    const active = orders.filter((o) => !['paid', 'cancelled'].includes(o.status))
    const pending = orders.filter((o) => ['pending', 'in-progress', 'completed'].includes(o.status))
    const paid = orders.filter((o) => o.status === 'paid')
    return {
      totalOrders: orders.length,
      pendingRevenue: pending.reduce((s, o) => s + o.pricing.total, 0),
      completedRevenue: paid.reduce((s, o) => s + o.pricing.total, 0),
      activeOrders: active.length,
    }
  },
}))
