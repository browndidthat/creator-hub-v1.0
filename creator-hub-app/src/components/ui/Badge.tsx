import React from 'react'
import { cn } from '../../lib/utils'

export type BadgeVariant = 'gold' | 'emerald' | 'ruby' | 'sapphire' | 'amethyst' | 'amber' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'bg-gold/15 text-gold-light border-gold/30',
  emerald: 'bg-emerald/15 text-emerald border-emerald/30',
  ruby: 'bg-ruby/15 text-ruby border-ruby/30',
  sapphire: 'bg-sapphire/15 text-sapphire border-sapphire/30',
  amethyst: 'bg-amethyst/15 text-amethyst border-amethyst/30',
  amber: 'bg-amber/15 text-amber border-amber/30',
  muted: 'bg-slate-dark/50 text-muted border-slate-dark',
}

const dotColors: Record<BadgeVariant, string> = {
  gold: 'bg-gold',
  emerald: 'bg-emerald',
  ruby: 'bg-ruby',
  sapphire: 'bg-sapphire',
  amethyst: 'bg-amethyst',
  amber: 'bg-amber',
  muted: 'bg-muted',
}

export function Badge({ variant = 'muted', children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}
