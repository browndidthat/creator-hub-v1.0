import { useState, useCallback } from 'react'
import { Shuffle, ChevronRight, Star, Camera } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { poses, poseCategories, type PoseSuggestion } from '../data/poses'
import { cn, randomFromArray } from '../../../lib/utils'

const difficultyVariant = {
  easy: 'emerald' as const,
  medium: 'amber' as const,
  advanced: 'amethyst' as const,
}

const categoryEmoji: Record<string, string> = Object.fromEntries(
  poseCategories.map((c) => [c.key, c.emoji])
)

export function PoseGenerator() {
  const [currentPose, setCurrentPose] = useState<PoseSuggestion | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [history, setHistory] = useState<PoseSuggestion[]>([])

  const generate = useCallback(() => {
    setIsShuffling(true)
    const pool = activeCategory
      ? poses.filter((p) => p.category === activeCategory)
      : poses
    
    // Avoid repeating the current pose
    const available = pool.filter((p) => p.id !== currentPose?.id)
    const pick = randomFromArray(available.length > 0 ? available : pool)
    
    // Simulate a brief shuffle animation
    setTimeout(() => {
      setCurrentPose(pick)
      setHistory((prev) => [pick, ...prev].slice(0, 10))
      setIsShuffling(false)
    }, 300)
  }, [activeCategory, currentPose])

  return (
    <div className="space-y-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
            !activeCategory
              ? 'bg-gold/15 text-gold border-gold/30'
              : 'bg-transparent text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
          )}
        >
          All Poses
        </button>
        {poseCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              activeCategory === cat.key
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-transparent text-muted border-slate-dark hover:text-cream hover:border-gold-dim'
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Main pose card */}
      <Card glow={!!currentPose} className={cn('relative overflow-hidden', isShuffling && 'animate-shimmer')}>
        {!currentPose ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-gold" />
            </div>
            <p className="text-ivory font-[family-name:var(--font-display)] text-lg mb-1">
              Ready for inspiration?
            </p>
            <p className="text-muted text-sm mb-6 max-w-xs">
              Hit shuffle to get a random pose suggestion with tips and ideas.
            </p>
            <Button onClick={generate} size="lg">
              <Shuffle className="w-4 h-4" />
              Generate Pose
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <CardHeader>
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="text-2xl">{categoryEmoji[currentPose.category] || '📸'}</div>
                <div className="min-w-0">
                  <CardTitle>{currentPose.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant={difficultyVariant[currentPose.difficulty]}>
                      {currentPose.difficulty}
                    </Badge>
                    <Badge variant="muted">
                      {poseCategories.find((c) => c.key === currentPose.category)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <p className="text-cream/90 text-sm leading-relaxed">
              {currentPose.description}
            </p>

            {/* Tips */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gold-dim uppercase tracking-wider">Pro Tips</p>
              <div className="space-y-1.5">
                {currentPose.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-soft">
                    <Star className="w-3 h-3 text-gold mt-1 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best for */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted mr-1">Best for:</span>
              {currentPose.bestFor.map((platform) => (
                <Badge key={platform} variant="gold">
                  {platform}
                </Badge>
              ))}
            </div>

            {/* Reshuffle */}
            <div className="pt-2 flex gap-2">
              <Button onClick={generate} className="flex-1">
                <Shuffle className="w-4 h-4" />
                Shuffle Again
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Recent history */}
      {history.length > 1 && (
        <Card className="!p-3">
          <p className="text-xs font-medium text-muted mb-2 px-1">Recent suggestions</p>
          <div className="space-y-1">
            {history.slice(1, 5).map((pose, i) => (
              <button
                key={`${pose.id}-${i}`}
                onClick={() => setCurrentPose(pose)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm text-soft hover:text-cream hover:bg-charcoal transition-colors"
              >
                <span className="text-xs">{categoryEmoji[pose.category]}</span>
                <span className="flex-1 truncate">{pose.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted" />
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
