import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useClientStore } from '../store/clientStore'

interface RedFlagListProps {
  onSelectClient: (id: string) => void
}

export function RedFlagList({ onSelectClient }: RedFlagListProps) {
  const { getRedFlaggedClients, unflagClient } = useClientStore()
  const flagged = getRedFlaggedClients()

  if (flagged.length === 0) {
    return (
      <Card className="text-center !py-8">
        <ShieldCheck className="w-8 h-8 text-emerald mx-auto mb-2" />
        <p className="text-sm text-ivory font-medium">All clear</p>
        <p className="text-xs text-muted mt-1">No flagged clients. Nice.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-ruby" />
        <span className="text-xs font-medium text-ruby uppercase tracking-wider">
          {flagged.length} Flagged Client{flagged.length !== 1 ? 's' : ''}
        </span>
      </div>

      {flagged.map((client) => (
        <Card
          key={client.id}
          className="!p-4 border-l-2 border-l-ruby cursor-pointer hover:border-ruby/40 transition-all"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ backgroundColor: `${client.avatarColor}20`, color: client.avatarColor }}
            >
              {client.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0" onClick={() => onSelectClient(client.id)}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ivory">{client.displayName}</span>
                <Badge
                  variant="ruby"
                  dot
                >
                  {client.redFlag?.severity === 'block' ? 'Blocked' : 'Warning'}
                </Badge>
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                {client.redFlag?.reason}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                <span>Flagged: {client.redFlag?.flaggedAt}</span>
                {client.platforms.length > 0 && (
                  <span>
                    Platforms: {client.platforms.map((p) => p.username).join(', ')}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                unflagClient(client.id)
              }}
              className="shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
