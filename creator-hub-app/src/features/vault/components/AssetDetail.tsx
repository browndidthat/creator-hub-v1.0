import { useState } from 'react'
import {
  X,
  Link2,
  Unlink,
  Trash2,
  Plus,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useVaultStore } from '../store/vaultStore'
import { useClientStore } from '../../clients/store/clientStore'
import {
  PLATFORM_TAG_CONFIG,
  ASSET_STATUS_CONFIG,
  ASSET_TYPE_CONFIG,
  type VaultAsset,
  type PostedPlatform,
  type AssetStatus,
  type WatermarkConfig,
} from '../types'
import { cn } from '../../../lib/utils'

interface AssetDetailProps {
  asset: VaultAsset
  onClose: () => void
}

export function AssetDetail({ asset, onClose }: AssetDetailProps) {
  const {
    updateAsset, deleteAsset,
    addPlatformTag, removePlatformTag,
    setWatermark, removeWatermark,
    linkToClient, unlinkClient,
    addTag, removeTag,
  } = useVaultStore()
  const { clients } = useClientStore()

  const [newTag, setNewTag] = useState('')
  const [showLinkClient, setShowLinkClient] = useState(false)
  const [showWatermark, setShowWatermark] = useState(false)
  const [wmText, setWmText] = useState(asset.watermarkConfig?.text || '@CreatorHub')
  const [wmPos, setWmPos] = useState<WatermarkConfig['position']>(asset.watermarkConfig?.position || 'bottom-right')
  const [wmOpacity, setWmOpacity] = useState(asset.watermarkConfig?.opacity || 25)

  const statusConf = ASSET_STATUS_CONFIG[asset.status]
  const typeConf = ASSET_TYPE_CONFIG[asset.type]
  const nonFlaggedClients = clients.filter((c) => !c.redFlag)

  const handleAddTag = () => {
    if (!newTag.trim()) return
    addTag(asset.id, newTag.trim().toLowerCase())
    setNewTag('')
  }

  const applyWatermark = () => {
    setWatermark(asset.id, { text: wmText, position: wmPos, opacity: wmOpacity, fontSize: 14 })
    setShowWatermark(false)
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <Card className="!p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-16 h-16 rounded-xl bg-graphite flex items-center justify-center text-3xl shrink-0 border border-slate-dark">
            {asset.thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory leading-tight">{asset.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={statusConf.variant} dot>{statusConf.emoji} {statusConf.label}</Badge>
              <Badge variant="muted">{typeConf.emoji} {typeConf.label}</Badge>
              {asset.isWatermarked && <Badge variant="gold">💧 Watermarked</Badge>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-graphite rounded-lg">
            <p className="text-[10px] text-muted">📅 Created</p>
            <p className="text-xs text-cream font-medium mt-0.5">{asset.dateCreated}</p>
          </div>
          <div className="p-2 bg-graphite rounded-lg">
            <p className="text-[10px] text-muted">💾 Size</p>
            <p className="text-xs text-cream font-medium mt-0.5">{asset.fileSize}</p>
          </div>
          <div className="p-2 bg-graphite rounded-lg">
            <p className="text-[10px] text-muted">📤 Posted</p>
            <p className="text-xs text-cream font-medium mt-0.5">{asset.datePosted || 'Not yet'}</p>
          </div>
        </div>

        {/* Client link */}
        {asset.clientId && (
          <div className="mt-3 flex items-center justify-between p-2.5 bg-amethyst/5 border border-amethyst/15 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">📩</span>
              <div>
                <p className="text-xs text-amethyst font-medium">Sent to {asset.clientName}</p>
                {asset.orderId && <p className="text-[10px] text-muted">Order: {asset.orderId}</p>}
              </div>
            </div>
            <button onClick={() => unlinkClient(asset.id)} className="p-1 text-muted hover:text-ruby transition-colors">
              <Unlink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status changer */}
        <div className="mt-3">
          <span className="text-[10px] text-muted uppercase tracking-wider block mb-1.5">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(ASSET_STATUS_CONFIG) as [AssetStatus, typeof ASSET_STATUS_CONFIG.available][]).map(([key, conf]) => (
              <button
                key={key}
                onClick={() => updateAsset(asset.id, { status: key })}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all',
                  asset.status === key ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark hover:text-cream'
                )}
              >
                {conf.emoji} {conf.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Platform Tracking */}
      <Card className="!p-4">
        <span className="text-[10px] text-muted uppercase tracking-wider block mb-2">📤 Platform Tracking — Where is this posted?</span>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(PLATFORM_TAG_CONFIG) as [PostedPlatform, typeof PLATFORM_TAG_CONFIG.onlyfans][]).map(([key, conf]) => {
            const isPosted = asset.postedTo.includes(key)
            return (
              <button
                key={key}
                onClick={() => isPosted ? removePlatformTag(asset.id, key) : addPlatformTag(asset.id, key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                  isPosted
                    ? 'bg-emerald/10 text-emerald border-emerald/25'
                    : 'text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
                )}
              >
                <span className="text-base">{conf.emoji}</span>
                <span className="flex-1 text-left">{conf.label}</span>
                <span>{isPosted ? '✅' : '⬜'}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Watermark Tool */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted uppercase tracking-wider">💧 Watermark</span>
          {asset.isWatermarked ? (
            <div className="flex items-center gap-2">
              <Badge variant="gold">💧 {asset.watermarkConfig?.text}</Badge>
              <button onClick={() => removeWatermark(asset.id)} className="text-[10px] text-muted hover:text-ruby underline">Remove</button>
            </div>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setShowWatermark(!showWatermark)}>
              {showWatermark ? 'Cancel' : '💧 Add Watermark'}
            </Button>
          )}
        </div>
        {showWatermark && (
          <div className="space-y-2 p-3 bg-graphite rounded-lg border border-slate-dark animate-fade-in">
            <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} placeholder="Watermark text"
              className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
            <div className="flex flex-wrap gap-1.5">
              {(['bottom-right', 'bottom-left', 'center', 'top-right'] as const).map((pos) => (
                <button key={pos} onClick={() => setWmPos(pos)}
                  className={cn('px-2 py-1 rounded text-[11px] border transition-all',
                    wmPos === pos ? 'bg-gold/15 text-gold border-gold/30' : 'text-muted border-slate-dark')}>
                  {pos}
                </button>
              ))}
            </div>
            <div>
              <span className="text-[10px] text-muted">Opacity: {wmOpacity}%</span>
              <input type="range" min={5} max={80} value={wmOpacity} onChange={(e) => setWmOpacity(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <Button size="sm" onClick={applyWatermark} className="w-full">💧 Apply Watermark</Button>
          </div>
        )}
      </Card>

      {/* Client Linking */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted uppercase tracking-wider">🔗 Client Link</span>
          {!asset.clientId && (
            <Button size="sm" variant="secondary" onClick={() => setShowLinkClient(!showLinkClient)}>
              <Link2 className="w-3 h-3" /> {showLinkClient ? 'Cancel' : 'Link Client'}
            </Button>
          )}
        </div>
        {showLinkClient && !asset.clientId && (
          <div className="space-y-2 animate-fade-in">
            {nonFlaggedClients.map((client) => (
              <button
                key={client.id}
                onClick={() => { linkToClient(asset.id, client.id, client.displayName); setShowLinkClient(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left text-soft hover:text-cream hover:bg-graphite border border-slate-dark hover:border-gold-dim transition-all"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ backgroundColor: `${client.avatarColor}20`, color: client.avatarColor }}>
                  {client.displayName[0]}
                </div>
                <span className="flex-1">{client.displayName}</span>
                <span className="text-[10px] text-muted">{client.tier}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Tags */}
      <Card className="!p-4">
        <span className="text-[10px] text-muted uppercase tracking-wider block mb-2">🏷️ Tags</span>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {asset.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-graphite border border-slate-dark rounded-md px-2 py-1 text-soft">
              #{tag}
              <button onClick={() => removeTag(asset.id, tag)} className="text-muted hover:text-ruby ml-0.5">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add tag..." className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-1.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim" />
          <Button size="sm" variant="secondary" onClick={handleAddTag}><Plus className="w-3 h-3" /></Button>
        </div>
      </Card>

      {/* Notes */}
      {asset.notes && (
        <Card className="!p-4">
          <span className="text-[10px] text-muted uppercase tracking-wider block mb-2">📝 Notes</span>
          <p className="text-sm text-soft leading-relaxed">{asset.notes}</p>
        </Card>
      )}

      {/* Delete */}
      <Button variant="danger" size="sm" className="w-full" onClick={() => { deleteAsset(asset.id); onClose() }}>
        <Trash2 className="w-3.5 h-3.5" /> Delete Asset
      </Button>
    </div>
  )
}
