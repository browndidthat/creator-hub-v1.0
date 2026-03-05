import { useState } from 'react'
import { Camera, Clock, Calendar } from 'lucide-react'
import { Header } from '../../../components/layout/Header'
import { PoseGenerator } from './PoseGenerator'
import { ConsistencyTracker } from './ConsistencyTracker'
import { MasterCalendar } from './MasterCalendar'
import { cn } from '../../../lib/utils'

const tabs = [
  { id: 'poses', label: 'Pose Generator', icon: Camera, shortLabel: 'Poses' },
  { id: 'consistency', label: 'Consistency', icon: Clock, shortLabel: 'Tracker' },
  { id: 'calendar', label: 'Master Calendar', icon: Calendar, shortLabel: 'Calendar' },
] as const

type TabId = (typeof tabs)[number]['id']

export function ContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('poses')

  return (
    <>
      <Header title="Content Studio" subtitle="Create, schedule, and stay consistent" />

      <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full">
        {/* Tab navigation */}
        <div className="flex gap-1 bg-onyx rounded-xl p-1 border border-slate-dark mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-charcoal text-gold shadow-sm border border-gold/20'
                    : 'text-muted hover:text-cream'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-gold' : 'text-muted')} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'poses' && <PoseGenerator />}
          {activeTab === 'consistency' && <ConsistencyTracker />}
          {activeTab === 'calendar' && <MasterCalendar />}
        </div>
      </div>
    </>
  )
}
