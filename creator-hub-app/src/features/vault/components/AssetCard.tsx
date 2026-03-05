import { Badge } from '../../../components/ui/Badge'
import { PLATFORM_TAG_CONFIG, ASSET_STATUS_CONFIG, ASSET_TYPE_CONFIG, type VaultAsset } from '../types'
import { cn } from '../../../lib/utils'

interface AssetCardProps {
  asset: VaultAsset
  isSelected: boolean
  onSelect: () => void
}

export function AssetCard({ asset, isSelected, onSelect }: AssetCardProps) {
  const statusConf = ASSET_STATUS_CONFIG[asset.status]
  const typeConf = ASSET_TYPE_CONFIG[asset.type]

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left bg-charcoal border rounded-xl overflow-hidden transition-all duration-200 group',
        isSelected
          ? 'border-gold/40 shadow-[0_0_20px_var(--color-gold-glow)]'
          : 'border-slate-dark hover:border-gold-dim/30'
      )}
    >
      {/* Thumbnail area */}
      <div className="relative h-28 bg-graphite flex items-center justify-center">
        <span className="text-4xl">{asset.thumbnail}</span>
        {/* Type badge */}
        <span className="absolute top-2 left-2 text-xs bg-onyx/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-muted border border-slate-dark">
          {typeConf.emoji} {typeConf.label}
        </span>
        {/* Watermark indicator */}
        {asset.isWatermarked && (
          <span className="absolute top-2 right-2 text-xs bg-onyx/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-gold border border-gold/20">
            💧
          </span>
        )}
        {/* Client link indicator */}
        {asset.clientId && (
          <span className="absolute bottom-2 right-2 text-xs bg-amethyst/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-amethyst border border-amethyst/25">
            📩 {asset.clientName}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-ivory truncate mb-1.5">{asset.name}</p>

        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Badge variant={statusConf.variant} dot>
            {statusConf.emoji} {statusConf.label}
          </Badge>
        </div>

        {/* Platform tags */}
        {asset.postedTo.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-1.5">
            {asset.postedTo.map((p) => {
              const pConf = PLATFORM_TAG_CONFIG[p]
              return (
                <span key={p} className="text-[10px] bg-graphite px-1.5 py-0.5 rounded text-muted border border-slate-dark">
                  {pConf.emoji}
                </span>
              )
            })}
          </div>
        )}

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {asset.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] text-muted">#{tag}</span>
            ))}
            {asset.tags.length > 3 && (
              <span className="text-[10px] text-muted">+{asset.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 text-[10px] text-muted">
          <span>{asset.dateCreated}</span>
          <span>{asset.fileSize}</span>
        </div>
      </div>
    </button>
  )
}
