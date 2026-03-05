import { useState } from 'react'
import {
  X,
  ChevronRight,
  Clock,
  Calendar,
  User,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useOrderStore } from '../store/orderStore'
import {
  ORDER_STATUS_CONFIG,
  PRICING_CONFIG,
  type Order,
  type OrderStatus,
} from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

interface OrderDetailProps {
  order: Order
  onClose: () => void
}

const STATUS_FLOW: OrderStatus[] = ['inquiry', 'pending', 'in-progress', 'completed', 'paid']

export function OrderDetail({ order, onClose }: OrderDetailProps) {
  const { advanceStatus, setStatus, updateOrder } = useOrderStore()
  const [copiedReceipt, setCopiedReceipt] = useState(false)
  const [notes, setNotes] = useState(order.internalNotes)

  const statusConf = ORDER_STATUS_CONFIG[order.status]
  const currentIdx = STATUS_FLOW.indexOf(order.status)
  const isOverdue = order.dueDate && order.dueDate < new Date().toISOString().split('T')[0] && !['paid', 'completed', 'cancelled'].includes(order.status)

  const handleSaveNotes = () => {
    updateOrder(order.id, { internalNotes: notes })
  }

  const generateReceipt = () => {
    const lines = [
      `═══════════════════════════════`,
      `       CREATOR HUB RECEIPT`,
      `═══════════════════════════════`,
      ``,
      `Order: ${order.id}`,
      `Date: ${order.paidAt || order.completedAt || order.createdAt}`,
      `Client: ${order.clientName}`,
      ``,
      `── Item ──────────────────────`,
      `${PRICING_CONFIG.contentTypeLabels[order.contentType]}`,
      `${order.description}`,
      ``,
      `── Pricing ───────────────────`,
      `Base: ${formatCurrency(order.pricing.basePrice)} × ${order.pricing.lengthMultiplier} = ${formatCurrency(order.pricing.basePrice * order.pricing.lengthMultiplier)}`,
    ]
    if (order.pricing.rushFee > 0) {
      lines.push(`Rush fee: +${formatCurrency(order.pricing.rushFee)}`)
    }
    order.pricing.addOns.forEach((a) => {
      lines.push(`${a.label}: +${formatCurrency(a.price)}`)
    })
    if (order.pricing.discount > 0) {
      lines.push(`Discount: -${formatCurrency(order.pricing.discount)}`)
    }
    lines.push(``, `── Total ─────────────────────`)
    lines.push(`TOTAL: ${formatCurrency(order.pricing.total)}`)
    lines.push(`Status: ${ORDER_STATUS_CONFIG[order.status].label}`)
    lines.push(``, `═══════════════════════════════`)
    lines.push(`Thank you for your order! ✨`)

    navigator.clipboard.writeText(lines.join('\n'))
    setCopiedReceipt(true)
    setTimeout(() => setCopiedReceipt(false), 2000)
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <Card className="!p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] text-muted font-mono">{order.id}</p>
            <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory mt-0.5">
              {PRICING_CONFIG.contentTypeLabels[order.contentType]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-1 mb-4">
          {STATUS_FLOW.map((s, i) => {
            const conf = ORDER_STATUS_CONFIG[s]
            const isActive = s === order.status
            const isPast = i < currentIdx
            return (
              <div key={s} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => setStatus(order.id, s)}
                  className={cn(
                    'flex-1 h-1.5 rounded-full transition-all',
                    isActive || isPast ? '' : 'bg-graphite'
                  )}
                  style={{
                    backgroundColor: isActive || isPast ? conf.color : undefined,
                    opacity: isPast ? 0.4 : 1,
                  }}
                />
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusConf.badgeVariant} dot>
            {statusConf.label}
          </Badge>
          {isOverdue && (
            <Badge variant="ruby" dot>
              <AlertCircle className="w-3 h-3" /> Overdue
            </Badge>
          )}
          <span className="text-lg font-bold text-gold font-[family-name:var(--font-display)] ml-auto">
            {formatCurrency(order.pricing.total)}
          </span>
        </div>

        {/* Advance button */}
        {order.status !== 'paid' && order.status !== 'cancelled' && (
          <Button
            className="w-full mt-3"
            onClick={() => advanceStatus(order.id)}
          >
            {order.status === 'completed' ? (
              <><DollarSign className="w-4 h-4" /> Mark as Paid</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Advance to {ORDER_STATUS_CONFIG[STATUS_FLOW[currentIdx + 1]]?.label}</>
            )}
          </Button>
        )}

        {order.status === 'paid' && (
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-emerald/10 border border-emerald/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-emerald" />
            <span className="text-sm text-emerald font-medium">Paid on {order.paidAt}</span>
          </div>
        )}
      </Card>

      {/* Details */}
      <Card className="!p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3 h-3 text-muted" />
              <span className="text-[10px] text-muted uppercase tracking-wider">Client</span>
            </div>
            <p className="text-sm text-cream font-medium">{order.clientName}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-muted" />
              <span className="text-[10px] text-muted uppercase tracking-wider">Created</span>
            </div>
            <p className="text-sm text-cream">{order.createdAt}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-muted" />
              <span className="text-[10px] text-muted uppercase tracking-wider">Due Date</span>
            </div>
            <p className={cn('text-sm', isOverdue ? 'text-ruby font-medium' : 'text-cream')}>
              {order.dueDate || '—'}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="w-3 h-3 text-muted" />
              <span className="text-[10px] text-muted uppercase tracking-wider">Turnaround</span>
            </div>
            <p className="text-sm text-cream">
              {PRICING_CONFIG.turnaroundLabels[order.turnaround].split('(')[0].trim()}
            </p>
          </div>
        </div>

        {/* Specs */}
        {(order.videoLengthMinutes || order.photoCount) && (
          <div>
            <span className="text-[10px] text-muted uppercase tracking-wider">Specs</span>
            <div className="flex gap-2 mt-1">
              {order.videoLengthMinutes && (
                <Badge variant="sapphire">{order.videoLengthMinutes} min video</Badge>
              )}
              {order.photoCount && (
                <Badge variant="amethyst">{order.photoCount} photos</Badge>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">Description</span>
          <p className="text-sm text-soft leading-relaxed">{order.description}</p>
        </div>

        {/* Special requests */}
        {order.specialRequests && (
          <div>
            <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">Special Requests</span>
            <p className="text-sm text-cream bg-graphite p-3 rounded-lg border border-slate-dark leading-relaxed">
              {order.specialRequests}
            </p>
          </div>
        )}
      </Card>

      {/* Pricing breakdown */}
      <Card className="!p-4">
        <span className="text-[10px] text-muted uppercase tracking-wider block mb-3">Price Breakdown</span>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-soft">
            <span>Base ({formatCurrency(order.pricing.basePrice)} × {order.pricing.lengthMultiplier})</span>
            <span>{formatCurrency(order.pricing.basePrice * order.pricing.lengthMultiplier)}</span>
          </div>
          {order.pricing.rushFee > 0 && (
            <div className="flex justify-between text-xs text-amber">
              <span>Rush fee</span>
              <span>+{formatCurrency(order.pricing.rushFee)}</span>
            </div>
          )}
          {order.pricing.addOns.map((a) => (
            <div key={a.label} className="flex justify-between text-xs text-soft">
              <span>{a.label}</span>
              <span>+{formatCurrency(a.price)}</span>
            </div>
          ))}
          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald">
              <span>Discount</span>
              <span>-{formatCurrency(order.pricing.discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-dark flex justify-between">
            <span className="text-sm font-medium text-ivory">Total</span>
            <span className="text-lg font-bold text-gold">{formatCurrency(order.pricing.total)}</span>
          </div>
        </div>

        {/* Receipt button */}
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-3"
          onClick={generateReceipt}
        >
          {copiedReceipt ? (
            <><Check className="w-3.5 h-3.5 text-emerald" /> Receipt Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy Receipt to Clipboard</>
          )}
        </Button>
      </Card>

      {/* Internal notes */}
      <Card className="!p-4">
        <span className="text-[10px] text-muted uppercase tracking-wider block mb-2">Internal Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add private notes about this order..."
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim resize-none"
        />
        {notes !== order.internalNotes && (
          <Button size="sm" onClick={handleSaveNotes} className="mt-2">
            Save Notes
          </Button>
        )}
      </Card>

      {/* Cancel */}
      {!['paid', 'cancelled'].includes(order.status) && (
        <Button
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() => setStatus(order.id, 'cancelled')}
        >
          Cancel Order
        </Button>
      )}
    </div>
  )
}
