import { useState } from 'react'
import {
  UserPlus,
  Users,
  Crown,
  ShieldAlert,
  DollarSign,
  BookOpen,
  AlertTriangle,
} from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { ClientSearch } from './ClientSearch'
import { ClientRow } from './ClientRow'
import { ClientProfile } from './ClientProfile'
import { AddClientForm } from './AddClientForm'
import { RedFlagList } from './RedFlagList'
import { useClientStore } from '../store/clientStore'
import { cn, formatCurrency } from '../../../lib/utils'

type ViewMode = 'list' | 'flags'

export function ClientsPage() {
  const {
    selectedClientId,
    selectClient,
    getFilteredClients,
    getStats,
  } = useClientStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredClients = getFilteredClients()
  const stats = getStats()
  const selectedClient = filteredClients.find((c) => c.id === selectedClientId)
    ?? useClientStore.getState().getClientById(selectedClientId ?? '')

  return (
    <>
      <Header title="The Rolodex" subtitle="Client profiles, history, and the red flag list" />

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sapphire/10 border border-sapphire/20 flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-sapphire" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{stats.total}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Clients</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Crown className="w-4.5 h-4.5 text-gold" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{stats.vip}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">VIPs</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ruby/10 border border-ruby/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-ruby" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{stats.flagged}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Flagged</p>
              </div>
            </Card>
            <Card className="!p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0">
                <DollarSign className="w-4.5 h-4.5 text-emerald" />
              </div>
              <div>
                <p className="text-lg font-semibold text-ivory leading-tight">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Revenue</p>
              </div>
            </Card>
          </div>

          {/* View mode toggle + add button */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1 bg-onyx rounded-lg p-1 border border-slate-dark">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'list'
                    ? 'bg-charcoal text-gold border border-gold/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Rolodex
              </button>
              <button
                onClick={() => setViewMode('flags')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  viewMode === 'flags'
                    ? 'bg-charcoal text-ruby border border-ruby/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Red Flags
                {stats.flagged > 0 && (
                  <span className="bg-ruby/20 text-ruby text-[10px] px-1.5 py-0.5 rounded-full">
                    {stats.flagged}
                  </span>
                )}
              </button>
            </div>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={() => {
                setShowAddForm(true)
                selectClient(null)
              }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Client</span>
            </Button>
          </div>

          {/* Main content area — responsive two-column on desktop */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left panel — list or flags */}
            <div className={cn(
              'space-y-4',
              selectedClient || showAddForm
                ? 'lg:w-[45%] xl:w-[40%] shrink-0'
                : 'w-full'
            )}>
              {viewMode === 'list' ? (
                <>
                  <ClientSearch />
                  <div className="space-y-2">
                    {filteredClients.length === 0 ? (
                      <Card className="text-center !py-8">
                        <Users className="w-8 h-8 text-muted mx-auto mb-2" />
                        <p className="text-sm text-muted">No clients match your filters</p>
                      </Card>
                    ) : (
                      filteredClients.map((client) => (
                        <ClientRow
                          key={client.id}
                          client={client}
                          isSelected={client.id === selectedClientId}
                          onSelect={() => {
                            selectClient(client.id === selectedClientId ? null : client.id)
                            setShowAddForm(false)
                          }}
                        />
                      ))
                    )}
                  </div>
                </>
              ) : (
                <RedFlagList
                  onSelectClient={(id) => {
                    selectClient(id)
                    setShowAddForm(false)
                  }}
                />
              )}
            </div>

            {/* Right panel — profile detail or add form */}
            {(selectedClient || showAddForm) && (
              <div className="lg:flex-1 min-w-0">
                <div className="lg:sticky lg:top-20">
                  {showAddForm ? (
                    <AddClientForm onClose={() => setShowAddForm(false)} />
                  ) : selectedClient ? (
                    <ClientProfile
                      client={selectedClient}
                      onClose={() => selectClient(null)}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
