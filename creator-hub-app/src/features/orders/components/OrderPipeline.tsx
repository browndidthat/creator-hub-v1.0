import {
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useOrderStore } from '../store/orderStore'
import { ORDER_STATUS_CONFIG, type OrderStatus, type Order } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

const PIPELINE_STATUSES: OrderStatus[] = ['inquiry', 'pending', 'in-progress', 'completed', 'paid']

function OrderCard({ order, onSelect }: { order: Order; onSelect: () => void }) {
  const { advanceStatus } = useOrderStore()
  const isOverdue = order.dueDate && order.dueDate < new Date().toISOString().split('T')[0] && !['paid', 'completed', 'cancelled'].includes(order.status)

  return (
    <div
      onClick={onSelect}
      className={cn(
        'bg-graphite border border-slate-dark rounded-lg p-3 cursor-pointer transition-all hover:border-gold-dim/30 group',
        isOverdue && 'border-l-2 border-l-ruby'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-cream leading-tight line-clamp-2">
          {order.clientName}
        </p>
        <span className="text-xs font-semibold text-gold shrink-0">
          {formatCurrency(order.pricing.total)}
        </span>
      </div>

      <p className="text-[11px] text-muted line-clamp-1 mb-2">
        {order.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {order.dueDate && (
          <span className={cn(
            'flex items-center gap-1 text-[10px]',
            isOverdue ? 'text-ruby' : 'text-muted'
          )}>
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {order.dueDate}
          </span>
        )}
      </div>

      {/* Advance button */}
      {order.status !== 'paid' && order.status !== 'cancelled' && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            advanceStatus(order.id)
          }}
          className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] font-medium bg-gold/10 text-gold border border-gold/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold/20"
        >
          Advance <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export function OrderPipeline() {
  const { orders, selectOrder, getPipelineCounts } = useOrderStore()
  const counts = getPipelineCounts()

  return (
    <div className="space-y-4">
      {/* Mobile: stacked view */}
      <div className="space-y-4 lg:hidden">
        {PIPELINE_STATUSES.map((status) => {
          const conf = ORDER_STATUS_CONFIG[status]
          const statusOrders = orders.filter((o) => o.status === status)
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: conf.color }}
                />
                <span className="text-xs font-medium text-cream">{conf.label}</span>
                <span className="text-[10px] text-muted bg-graphite px-1.5 py-0.5 rounded-full">
                  {counts[status]}
                </span>
              </div>
              {statusOrders.length === 0 ? (
                <div className="py-3 text-center text-[11px] text-muted border border-dashed border-slate-dark rounded-lg">
                  No orders
                </div>
              ) : (
                <div className="space-y-2">
                  {statusOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => selectOrder(order.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: horizontal pipeline */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-3">
        {PIPELINE_STATUSES.map((status) => {
          const conf = ORDER_STATUS_CONFIG[status]
          const statusOrders = orders.filter((o) => o.status === status)
          return (
            <div key={status} className="min-w-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: conf.color }}
                />
                <span className="text-xs font-medium text-cream truncate">{conf.label}</span>
                <span className="text-[10px] text-muted bg-graphite px-1.5 py-0.5 rounded-full shrink-0">
                  {counts[status]}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {statusOrders.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-muted border border-dashed border-slate-dark rounded-lg">
                    Empty
                  </div>
                ) : (
                  statusOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => selectOrder(order.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
