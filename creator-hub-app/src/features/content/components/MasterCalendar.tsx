import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Video,
  Image,
  FileText,
  Clock,
} from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { cn } from '../../../lib/utils'

type EventType = 'post' | 'custom-video' | 'photoshoot' | 'deadline' | 'promo'

interface CalendarEvent {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: EventType
  platform?: string
  time?: string
  notes?: string
}

import type { BadgeVariant } from '../../../components/ui/Badge'

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: React.ElementType; badge: BadgeVariant }> = {
  post: { label: 'Scheduled Post', color: 'text-sapphire', icon: Image, badge: 'sapphire' },
  'custom-video': { label: 'Custom Video', color: 'text-amethyst', icon: Video, badge: 'amethyst' },
  photoshoot: { label: 'Photoshoot', color: 'text-gold', icon: Image, badge: 'gold' },
  deadline: { label: 'Deadline', color: 'text-ruby', icon: Clock, badge: 'ruby' },
  promo: { label: 'Promo/Sale', color: 'text-emerald', icon: FileText, badge: 'emerald' },
}

const SEED_EVENTS: CalendarEvent[] = [
  { id: '1', date: formatDate(0), title: 'Instagram Reel — OOTD', type: 'post', platform: 'Instagram', time: '2:00 PM' },
  { id: '2', date: formatDate(1), title: 'Custom video for Client A', type: 'custom-video', time: '6:00 PM' },
  { id: '3', date: formatDate(3), title: 'Batch photoshoot', type: 'photoshoot', notes: 'Studio B, bring 3 outfits' },
  { id: '4', date: formatDate(5), title: 'TikTok series Part 3', type: 'post', platform: 'TikTok', time: '7:00 PM' },
  { id: '5', date: formatDate(7), title: 'Promo — 20% off customs', type: 'promo' },
  { id: '6', date: formatDate(2), title: 'Custom delivery deadline', type: 'deadline' },
]

function formatDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function MasterCalendar() {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({ type: 'post' })

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const todayStr = new Date().toISOString().split('T')[0]

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const getEventsForDate = (dateStr: string) => events.filter((e) => e.date === dateStr)

  const addEvent = () => {
    if (!newEvent.title || !selectedDate) return
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title,
      type: (newEvent.type as EventType) || 'post',
      platform: newEvent.platform,
      time: newEvent.time,
      notes: newEvent.notes,
    }
    setEvents((prev) => [...prev, event])
    setNewEvent({ type: 'post' })
    setShowAddForm(false)
  }

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <Card className="!p-4">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-[family-name:var(--font-display)] text-lg text-ivory">{monthLabel}</h3>
          <button onClick={nextMonth} className="p-2 text-muted hover:text-cream hover:bg-graphite rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mt-4 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-[10px] text-muted font-medium uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = getEventsForDate(dateStr)
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-all relative',
                  isToday && 'bg-gold/10 text-gold font-semibold',
                  isSelected && 'bg-gold/20 ring-1 ring-gold/50',
                  !isToday && !isSelected && 'text-cream hover:bg-charcoal',
                )}
              >
                <span className="text-xs leading-none">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={cn('w-1 h-1 rounded-full', {
                          'bg-sapphire': e.type === 'post',
                          'bg-amethyst': e.type === 'custom-video',
                          'bg-gold': e.type === 'photoshoot',
                          'bg-ruby': e.type === 'deadline',
                          'bg-emerald': e.type === 'promo',
                        })}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-dark">
          {Object.entries(eventTypeConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px] text-muted">
              <span className={cn('w-2 h-2 rounded-full', {
                'bg-sapphire': key === 'post',
                'bg-amethyst': key === 'custom-video',
                'bg-gold': key === 'photoshoot',
                'bg-ruby': key === 'deadline',
                'bg-emerald': key === 'promo',
              })} />
              {config.label}
            </div>
          ))}
        </div>
      </Card>

      {/* Selected date detail */}
      {selectedDate && (
        <Card className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-ivory font-[family-name:var(--font-display)] mt-0.5">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showAddForm ? 'Cancel' : 'Add'}
            </Button>
          </div>

          {/* Add event form */}
          {showAddForm && (
            <div className="mb-4 p-3 bg-graphite rounded-lg border border-slate-dark space-y-3 animate-fade-in">
              <input
                type="text"
                placeholder="Event title..."
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
              />
              <div className="flex gap-2 flex-wrap">
                {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig.post][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setNewEvent({ ...newEvent, type: key })}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs border transition-all',
                        newEvent.type === key
                          ? 'bg-gold/15 text-gold border-gold/30'
                          : 'text-muted border-slate-dark hover:text-cream'
                      )}
                    >
                      {config.label}
                    </button>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Time (e.g. 2:00 PM)"
                  value={newEvent.time || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
                />
                <input
                  type="text"
                  placeholder="Platform"
                  value={newEvent.platform || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
                  className="flex-1 bg-onyx border border-slate-dark rounded-lg px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold-dim"
                />
              </div>
              <Button onClick={addEvent} size="sm" className="w-full" disabled={!newEvent.title}>
                <Plus className="w-3.5 h-3.5" /> Add Event
              </Button>
            </div>
          )}

          {/* Event list */}
          {selectedEvents.length === 0 && !showAddForm ? (
            <p className="text-sm text-muted text-center py-4">No events scheduled. Hit + to add one.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => {
                const config = eventTypeConfig[event.type]
                const Icon = config.icon
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-graphite rounded-lg border border-slate-dark group"
                  >
                    <div className={cn('mt-0.5', config.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cream font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={config.badge}>{config.label}</Badge>
                        {event.time && (
                          <span className="text-xs text-muted">{event.time}</span>
                        )}
                        {event.platform && (
                          <span className="text-xs text-muted">• {event.platform}</span>
                        )}
                      </div>
                      {event.notes && (
                        <p className="text-xs text-soft mt-1.5">{event.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-ruby transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
