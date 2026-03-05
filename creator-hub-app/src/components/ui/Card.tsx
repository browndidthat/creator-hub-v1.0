import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  glow?: boolean
  transition?: boolean
}

export function Card({ className, children, glow = false, transition = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-charcoal border border-slate-dark rounded-xl p-5',
        transition && 'transition-all duration-300',
        glow && 'border-gold-dim/50 shadow-[0_0_30px_var(--color-gold-glow)]',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-[family-name:var(--font-display)] text-lg text-ivory', className)}>
      {children}
    </h3>
  )
}
