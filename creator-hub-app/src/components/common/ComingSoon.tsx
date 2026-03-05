import { Construction } from 'lucide-react'
import { Header } from '../layout/Header'
import { Card } from '../ui/Card'

interface ComingSoonProps {
  title: string
  subtitle: string
}

export function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-sm text-center">
          <div className="flex flex-col items-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Construction className="w-7 h-7 text-gold" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-ivory mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-muted max-w-xs">
              This module is on the roadmap. We're building iteratively — check back soon.
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
