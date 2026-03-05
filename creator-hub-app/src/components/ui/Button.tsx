import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        {
          'bg-gold text-obsidian hover:bg-gold-light shadow-[0_0_20px_var(--color-gold-glow)]':
            variant === 'primary',
          'bg-graphite text-cream border border-slate-dark hover:border-gold-dim hover:text-gold-light':
            variant === 'secondary',
          'bg-transparent text-soft hover:text-cream hover:bg-charcoal':
            variant === 'ghost',
          'bg-ruby/15 text-ruby border border-ruby/30 hover:bg-ruby/25':
            variant === 'danger',
        },
        {
          'text-xs px-3 py-1.5 rounded-md': size === 'sm',
          'text-sm px-4 py-2 rounded-lg': size === 'md',
          'text-base px-6 py-3 rounded-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
