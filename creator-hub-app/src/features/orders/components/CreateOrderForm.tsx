import { useState, useMemo } from 'react'
import {
  X,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useOrderStore } from '../store/orderStore'
import { useClientStore } from '../../clients/store/clientStore'
import {
  PRICING_CONFIG,
  type ContentType,
  type TurnaroundSpeed,
} from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

interface CreateOrderFormProps {
  onClose: () => void
}

export function CreateOrderForm({ onClose }: CreateOrderFormProps) {
  const { addOrder, calculatePrice } = useOrderStore()
  const { clients } = useClientStore()

  const [clientId, setClientId] = useState('')
  const [contentType, setContentType] = useState<ContentType>('custom-video')
  const [description, setDescription] = useState('')
  const [videoMin, setVideoMin] = useState(5)
  const [photoCount, setPhotoCount] = useState(10)
  const [turnaround, setTurnaround] = useState<TurnaroundSpeed>('standard')
  const [addOns, setAddOns] = useState<string[]>([])
  const [discount, setDiscount] = useState(0)
  const [specialRequests, setSpecialRequests] = useState('')
  const [dueDate, setDueDate] = useState('')

  const selectedClient = clients.find((c) => c.id === clientId)
  const nonFlagged = clients.filter((c) => !c.redFlag)

  const pricing = useMemo(
    () =>
      calculatePrice({
        contentType,
        videoLengthMinutes: videoMin,
        photoCount,
        turnaround,
        addOns,
        customDiscount: discount,
      }),
    [contentType, videoMin, photoCount, turnaround, addOns, discount, calculatePrice]
  )

  const toggleAddOn = (id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const handleSubmit = () => {
    if (!clientId || !description.trim()) return
    addOrder({
      clientId,
      clientName: selectedClient?.displayName || 'Unknown',
      contentType,
      description: description.trim(),
      status: 'pending',
      pricing,
      turnaround,
      videoLengthMinutes: contentType === 'custom-video' || contentType === 'video-call' ? videoMin : null,
      photoCount: contentType === 'photo-set' ? photoCount : null,
      specialRequests: specialRequests.trim(),
      dueDate: dueDate || null,
      completedAt: null,
      paidAt: null,
      internalNotes: '',
    })
    onClose()
  }

  const needsLength = contentType === 'custom-video' || contentType === 'video-call'
  const needsPhotos = contentType === 'photo-set'

  return (
    <Card className="animate-fade-in !p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-gold" />
          <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory">New Order</h3>
        </div>
        <button onClick={onClose} className="p-1.5 text-muted hover:text-cream rounded-lg hover:bg-graphite transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Client select */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Client *</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-gold-dim"
        >
          <option value="">Select a client...</option>
          {nonFlagged.map((c) => (
            <option key={c.id} value={c.id}>
              {c.displayName} {c.tier === 'vip' ? '👑' : ''} — {formatCurrency(c.totalSpent)} spent
            </option>
          ))}
        </select>
        {selectedClient?.redFlag && (
          <p className="text-xs text-ruby mt-1">This client is flagged and cannot place orders.</p>
        )}
      </div>

      {/* Content type */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Content Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(PRICING_CONFIG.contentTypeLabels) as [ContentType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setContentType(key)}
              className={cn(
                'py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center',
                contentType === key
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : 'text-muted border-slate-dark hover:text-cream'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      {needsLength && (
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">
            Video Length: <span className="text-gold">{videoMin} min</span>
          </label>
          <input type="range" min={1} max={30} value={videoMin} onChange={(e) => setVideoMin(Number(e.target.value))} className="w-full accent-gold" />
        </div>
      )}
      {needsPhotos && (
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">
            Photo Count: <span className="text-gold">{photoCount}</span>
          </label>
          <input type="range" min={1} max={50} value={photoCount} onChange={(e) => setPhotoCount(Number(e.target.value))} className="w-full accent-gold" />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Brief description of the order..."
          className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim resize-none"
        />
      </div>

      {/* Turnaround */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Turnaround</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(PRICING_CONFIG.turnaroundLabels) as [TurnaroundSpeed, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTurnaround(key)}
              className={cn(
                'py-2 px-2 rounded-lg text-[11px] font-medium border transition-all text-center',
                turnaround === key
                  ? 'bg-gold/15 text-gold border-gold/30'
                  : 'text-muted border-slate-dark hover:text-cream'
              )}
            >
              {label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Add-Ons</label>
        <div className="grid grid-cols-2 gap-2">
          {PRICING_CONFIG.addOnOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleAddOn(opt.id)}
              className={cn(
                'py-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-all text-left',
                addOns.includes(opt.id)
                  ? 'bg-gold/10 text-gold border-gold/30'
                  : 'text-muted border-slate-dark hover:text-cream'
              )}
            >
              {opt.label} <span className="opacity-60">+{formatCurrency(opt.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Due date + special requests */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Discount</label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="$0"
            className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim"
          />
        </div>
      </div>

      <textarea
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
        rows={2}
        placeholder="Special requests from client..."
        className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim resize-none"
      />

      {/* Price preview */}
      <div className="p-3 bg-onyx rounded-lg border border-gold/20 flex justify-between items-center">
        <span className="text-sm text-muted">Calculated Total</span>
        <span className="text-xl font-bold text-gold font-[family-name:var(--font-display)]">
          {formatCurrency(pricing.total)}
        </span>
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} disabled={!clientId || !description.trim()} className="flex-1">
          <Plus className="w-4 h-4" /> Create Order
        </Button>
      </div>
    </Card>
  )
}
