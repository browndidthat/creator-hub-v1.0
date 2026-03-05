import { useState } from 'react'
import {
  Plus,
  Calculator,

  Kanban,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { OrderPipeline } from './OrderPipeline'
import { CostCalculator } from './CostCalculator'
import { OrderDetail } from './OrderDetail'
import { CreateOrderForm } from './CreateOrderForm'
import { useOrderStore } from '../store/orderStore'
import { cn, formatCurrency } from '../../../lib/utils'

type ViewMode = 'pipeline' | 'calculator'

export function OrdersPage() {
  const {
    selectedOrderId,
    selectOrder,
    getStats,
    getOrderById,
  } = useOrderStore()
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline')
  const [showCreate, setShowCreate] = useState(false)

  const stats = getStats()
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : undefined

  return (
    <>
      <Header title="Orders" subtitle="Custom order pipeline, pricing, and invoicing" />

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sapphire/10 border border-sapphire/20 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-sapphire" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{stats.totalOrders}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Total Orders</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{stats.activeOrders}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Active</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{formatCurrency(stats.pendingRevenue)}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Pending $</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-emerald" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{formatCurrency(stats.completedRevenue)}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Earned</p>
              </div>
            </Card>
          </div>

          {/* View toggle + create */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1 bg-onyx rounded-lg p-1 border border-slate-dark">
              <button
                onClick={() => { setViewMode('pipeline'); setShowCreate(false) }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'pipeline' && !showCreate
                    ? 'bg-charcoal text-gold border border-gold/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <Kanban className="w-3.5 h-3.5" />
                Pipeline
              </button>
              <button
                onClick={() => { setViewMode('calculator'); selectOrder(null); setShowCreate(false) }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'calculator'
                    ? 'bg-charcoal text-gold border border-gold/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <Calculator className="w-3.5 h-3.5" />
                Calculator
              </button>
            </div>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={() => {
                setShowCreate(true)
                setViewMode('pipeline')
                selectOrder(null)
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Order</span>
            </Button>
          </div>

          {/* Main content */}
          {viewMode === 'calculator' ? (
            <div className="max-w-lg mx-auto">
              <CostCalculator />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Pipeline */}
              <div className={cn(
                selectedOrder || showCreate ? 'lg:w-[55%] xl:w-[60%] shrink-0' : 'w-full'
              )}>
                <OrderPipeline />
              </div>

              {/* Detail panel or create form */}
              {(selectedOrder || showCreate) && (
                <div className="lg:flex-1 min-w-0">
                  <div className="lg:sticky lg:top-20">
                    {showCreate ? (
                      <CreateOrderForm onClose={() => setShowCreate(false)} />
                    ) : selectedOrder ? (
                      <OrderDetail
                        order={selectedOrder}
                        onClose={() => selectOrder(null)}
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
