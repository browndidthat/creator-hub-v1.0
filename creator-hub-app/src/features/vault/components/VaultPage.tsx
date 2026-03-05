import { useState } from 'react'

import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AssetCard } from './AssetCard'
import { AssetDetail } from './AssetDetail'
import { useVaultStore } from '../store/vaultStore'
import {
  ASSET_TYPE_CONFIG, ASSET_STATUS_CONFIG, PLATFORM_TAG_CONFIG,
  type AssetType, type AssetStatus, type PostedPlatform,
} from '../types'
import { cn } from '../../../lib/utils'

export function VaultPage() {
  const {
    filters, setSearch, setTypeFilter, setStatusFilter, setPlatformFilter, setClientFilter,
    selectedAssetId, selectAsset, getFilteredAssets, getStats, addAsset,
  } = useVaultStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<AssetType>('photo')
  const [newEmoji, setNewEmoji] = useState('📷')

  const filtered = getFilteredAssets()
  const stats = getStats()
  const selectedAsset = filtered.find((a) => a.id === selectedAssetId)
    ?? useVaultStore.getState().getAssetById(selectedAssetId ?? '')

  const handleAddAsset = () => {
    if (!newName.trim()) return
    addAsset({
      name: newName.trim(), type: newType, status: 'available', postedTo: [],
      dateCreated: new Date().toISOString().split('T')[0], datePosted: null,
      clientId: null, clientName: null, orderId: null, tags: [],
      isWatermarked: false, watermarkConfig: null, fileSize: '—',
      thumbnail: newEmoji, notes: '',
    })
    setNewName(''); setShowAdd(false)
  }

  return (
    <>
      <Header title="Content Vault" subtitle="Asset tracking, watermarking, and platform management" />
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-ivory">{stats.total}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">📁 Total</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-emerald">{stats.available}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">✅ Available</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-sapphire">{stats.posted}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">📤 Posted</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-gold">{stats.exclusive}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">👑 Exclusive</p>
            </Card>
            <Card className="!p-2.5 text-center">
              <p className="text-lg font-bold text-amethyst">{stats.clientContent}</p>
              <p className="text-[9px] text-muted uppercase tracking-wider">📩 Client</p>
            </Card>
          </div>

          {/* Search + filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
              <input type="text" placeholder="Search assets, tags, or clients..." value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-onyx border border-slate-dark rounded-lg pl-10 pr-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
            </div>

            {/* Filter rows */}
            <div className="flex flex-wrap gap-1.5">
              {/* Type */}
              <button onClick={() => setTypeFilter('all')}
                className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                  filters.type === 'all' ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                All Types
              </button>
              {(Object.entries(ASSET_TYPE_CONFIG) as [AssetType, { label: string; emoji: string }][]).map(([key, conf]) => (
                <button key={key} onClick={() => setTypeFilter(key)}
                  className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                    filters.type === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                  {conf.emoji} {conf.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {/* Status */}
              {(Object.entries(ASSET_STATUS_CONFIG) as [AssetStatus, { label: string; emoji: string; variant: string }][]).map(([key, conf]) => (
                <button key={key} onClick={() => setStatusFilter(filters.status === key ? 'all' : key)}
                  className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                    filters.status === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                  {conf.emoji} {conf.label}
                </button>
              ))}
              <span className="border-l border-slate-dark mx-0.5" />
              <button onClick={() => setClientFilter(filters.clientLinked === 'linked' ? 'all' : 'linked')}
                className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                  filters.clientLinked === 'linked' ? 'bg-amethyst/15 text-amethyst border-amethyst/30' : 'text-muted border-slate-dark hover:text-cream')}>
                📩 Client Content
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {/* Platforms */}
              {(Object.entries(PLATFORM_TAG_CONFIG) as [PostedPlatform, { label: string; emoji: string }][]).slice(0, 6).map(([key, conf]) => (
                <button key={key} onClick={() => setPlatformFilter(filters.platform === key ? 'all' : key)}
                  className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                    filters.platform === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                  {conf.emoji}
                </button>
              ))}
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{filtered.length} asset{filtered.length !== 1 ? 's' : ''}</span>
              <div className="flex-1" />
              <Button size="sm" onClick={() => { setShowAdd(!showAdd); selectAsset(null) }}>
                {showAdd ? '✕ Cancel' : '📁 Add Asset'}
              </Button>
            </div>

            {/* Quick add form */}
            {showAdd && (
              <Card className="!p-4 animate-fade-in space-y-3">
                <div className="flex gap-2">
                  <select value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)}
                    className="bg-onyx border border-slate-dark rounded-lg px-2 py-2 text-lg focus:outline-none focus:border-gold-dim">
                    {['📷', '🎬', '🖼️', '✂️', '🎭', '👙', '🛁', '💪', '🌅', '🪞', '🖤', '🎨'].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Asset name *" value={newName} onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAsset()}
                    className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(ASSET_TYPE_CONFIG) as [AssetType, { label: string; emoji: string }][]).map(([key, conf]) => (
                    <button key={key} onClick={() => setNewType(key)}
                      className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all',
                        newType === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream')}>
                      {conf.emoji} {conf.label}
                    </button>
                  ))}
                </div>
                <Button size="sm" onClick={handleAddAsset} disabled={!newName.trim()} className="w-full">
                  📁 Add to Vault
                </Button>
              </Card>
            )}
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Grid */}
            <div className={cn(selectedAsset ? 'lg:w-[55%] xl:w-[60%] shrink-0' : 'w-full')}>
              {filtered.length === 0 ? (
                <Card className="text-center !py-12">
                  <span className="text-3xl block mb-2">📁</span>
                  <p className="text-sm text-muted">No assets match your filters</p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      isSelected={asset.id === selectedAssetId}
                      onSelect={() => {
                        selectAsset(asset.id === selectedAssetId ? null : asset.id)
                        setShowAdd(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selectedAsset && (
              <div className="lg:flex-1 min-w-0">
                <div className="lg:sticky lg:top-20">
                  <AssetDetail asset={selectedAsset} onClose={() => selectAsset(null)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
