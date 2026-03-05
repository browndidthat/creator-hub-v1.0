import { useState, useMemo } from 'react'
import { Calculator, Zap, Clock, Plus, Minus } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useOrderStore } from '../store/orderStore'
import { PRICING_CONFIG, type ContentType, type TurnaroundSpeed } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

export function CostCalculator() {
  const { calculatePrice } = useOrderStore()
  const [contentType, setContentType] = useState<ContentType>('custom-video')
  const [videoMin, setVideoMin] = useState(5)
  const [photoCount, setPhotoCount] = useState(10)
  const [turnaround, setTurnaround] = useState<TurnaroundSpeed>('standard')
  const [addOns, setAddOns] = useState<string[]>([])
  const [discount, setDiscount] = useState(0)

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

  const needsLength = contentType === 'custom-video' || contentType === 'video-call'
  const needsPhotos = contentType === 'photo-set'

  return (
    <Card glow>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gold" />
          <CardTitle>Cost Calculator</CardTitle>
        </div>
      </CardHeader>

      <div className="space-y-5">
        {/* Content type */}
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">Content Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(PRICING_CONFIG.contentTypeLabels) as [ContentType, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => setContentType(key)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center',
                    contentType === key
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
                  )}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Quantity — video length or photo count */}
        {needsLength && (
          <div>
            <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">
              Video Length: <span className="text-gold">{videoMin} min</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVideoMin(Math.max(1, videoMin - 1))}
                className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={1}
                max={30}
                value={videoMin}
                onChange={(e) => setVideoMin(Number(e.target.value))}
                className="flex-1 accent-gold"
              />
              <button
                onClick={() => setVideoMin(Math.min(30, videoMin + 1))}
                className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {needsPhotos && (
          <div>
            <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">
              Photo Count: <span className="text-gold">{photoCount}</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPhotoCount(Math.max(1, photoCount - 1))}
                className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={1}
                max={50}
                value={photoCount}
                onChange={(e) => setPhotoCount(Number(e.target.value))}
                className="flex-1 accent-gold"
              />
              <button
                onClick={() => setPhotoCount(Math.min(50, photoCount + 1))}
                className="w-8 h-8 rounded-lg bg-graphite border border-slate-dark flex items-center justify-center text-muted hover:text-cream hover:border-gold-dim transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Turnaround */}
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">
            Turnaround Speed
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(PRICING_CONFIG.turnaroundLabels) as [TurnaroundSpeed, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTurnaround(key)}
                  className={cn(
                    'py-2 px-2 rounded-lg text-[11px] font-medium border transition-all text-center',
                    turnaround === key
                      ? key === 'priority'
                        ? 'bg-ruby/15 text-ruby border-ruby/30'
                        : key === 'rush'
                          ? 'bg-amber/15 text-amber border-amber/30'
                          : 'bg-gold/15 text-gold border-gold/30'
                      : 'text-muted border-slate-dark hover:text-cream'
                  )}
                >
                  {key === 'rush' && <Zap className="w-3 h-3 inline mr-1" />}
                  {key === 'priority' && <Clock className="w-3 h-3 inline mr-1" />}
                  {label.split('(')[0].trim()}
                  <br />
                  <span className="text-[10px] opacity-70">
                    ({label.match(/\((.+)\)/)?.[1]})
                    {key !== 'standard' && (
                      <> +{Math.round((PRICING_CONFIG.turnaroundMultiplier[key] - 1) * 100)}%</>
                    )}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">Add-Ons</label>
          <div className="grid grid-cols-2 gap-2">
            {PRICING_CONFIG.addOnOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleAddOn(opt.id)}
                className={cn(
                  'py-2 px-3 rounded-lg text-[11px] font-medium border transition-all text-left',
                  addOns.includes(opt.id)
                    ? 'bg-gold/10 text-gold border-gold/30'
                    : 'text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
                )}
              >
                <span className="block">{opt.label}</span>
                <span className="text-[10px] opacity-70">+{formatCurrency(opt.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="text-[10px] text-muted uppercase tracking-wider block mb-2">
            Discount: <span className="text-gold">{formatCurrency(discount)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full accent-gold"
          />
        </div>

        {/* Price breakdown */}
        <div className="p-4 bg-onyx rounded-lg border border-slate-dark space-y-2">
          <div className="flex justify-between text-xs text-soft">
            <span>Base ({formatCurrency(pricing.basePrice)} × {pricing.lengthMultiplier})</span>
            <span>{formatCurrency(pricing.basePrice * pricing.lengthMultiplier)}</span>
          </div>
          {pricing.rushFee > 0 && (
            <div className="flex justify-between text-xs text-amber">
              <span>Rush fee</span>
              <span>+{formatCurrency(pricing.rushFee)}</span>
            </div>
          )}
          {pricing.addOns.map((a: { label: string; price: number }) => (
            <div key={a.label} className="flex justify-between text-xs text-soft">
              <span>{a.label}</span>
              <span>+{formatCurrency(a.price)}</span>
            </div>
          ))}
          {pricing.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald">
              <span>Discount</span>
              <span>-{formatCurrency(pricing.discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-dark flex justify-between">
            <span className="text-sm font-medium text-ivory">Total</span>
            <span className="text-lg font-bold text-gold font-[family-name:var(--font-display)]">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
