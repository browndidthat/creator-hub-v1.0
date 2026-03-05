import type { Client } from '../types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const seedClients: Client[] = [
  {
    id: 'c1',
    displayName: 'Marcus T.',
    email: 'marcus.t@email.com',
    platforms: [
      { platform: 'snapchat', username: 'marc_t99' },
      { platform: 'onlyfans', username: 'marct' },
    ],
    tier: 'vip',
    totalSpent: 2450,
    orderCount: 12,
    lastOrderDate: daysAgo(3),
    firstContactDate: daysAgo(180),
    preferences: {
      likes: ['Lingerie', 'Custom greetings', 'Solo content'],
      dislikes: ['Feet content'],
      customNotes: 'Always tips extra. Prefers same-week delivery. Birthday in October.',
    },
    notes: [
      { id: 'n1', text: 'Repeat VIP — always pays on time, tips generously', createdAt: daysAgo(30) },
      { id: 'n2', text: 'Requested exclusive photo set — delivered 3 days early', createdAt: daysAgo(10) },
    ],
    redFlag: null,
    orderHistory: [
      { id: 'o1', date: daysAgo(3), description: '5min custom video — solo', amount: 150, status: 'completed' },
      { id: 'o2', date: daysAgo(20), description: '10min custom video', amount: 275, status: 'completed' },
      { id: 'o3', date: daysAgo(45), description: 'Photo set — 15 images', amount: 100, status: 'completed' },
      { id: 'o4', date: daysAgo(60), description: '3min custom with name', amount: 85, status: 'completed' },
    ],
    avatarColor: '#c9a84c',
  },
  {
    id: 'c2',
    displayName: 'Jake W.',
    email: 'jakew@proton.me',
    platforms: [
      { platform: 'telegram', username: 'jw_private' },
      { platform: 'fansly', username: 'jakew22' },
    ],
    tier: 'regular',
    totalSpent: 680,
    orderCount: 5,
    lastOrderDate: daysAgo(14),
    firstContactDate: daysAgo(90),
    preferences: {
      likes: ['Cosplay', 'Themed content', 'GFE style'],
      dislikes: [],
      customNotes: 'Polite. Prefers detailed back-and-forth on custom specs.',
    },
    notes: [
      { id: 'n3', text: 'Likes to plan customs in advance — usually 2 week lead time', createdAt: daysAgo(14) },
    ],
    redFlag: null,
    orderHistory: [
      { id: 'o5', date: daysAgo(14), description: 'Cosplay custom — 7min', amount: 200, status: 'completed' },
      { id: 'o6', date: daysAgo(40), description: 'GFE video — 5min', amount: 150, status: 'completed' },
      { id: 'o7', date: daysAgo(70), description: 'Photo set', amount: 80, status: 'completed' },
    ],
    avatarColor: '#60a5fa',
  },
  {
    id: 'c3',
    displayName: 'Anonymous_99',
    email: '',
    platforms: [
      { platform: 'snapchat', username: 'anon99snap' },
    ],
    tier: 'new',
    totalSpent: 75,
    orderCount: 1,
    lastOrderDate: daysAgo(5),
    firstContactDate: daysAgo(7),
    preferences: {
      likes: ['Casual content'],
      dislikes: [],
      customNotes: 'First-time buyer. Seemed genuine.',
    },
    notes: [],
    redFlag: null,
    orderHistory: [
      { id: 'o8', date: daysAgo(5), description: '3min intro custom', amount: 75, status: 'completed' },
    ],
    avatarColor: '#34d399',
  },
  {
    id: 'c4',
    displayName: 'DarkKnight_X',
    email: 'dk_x@throwaway.io',
    platforms: [
      { platform: 'twitter', username: '@DK_burner42' },
      { platform: 'snapchat', username: 'dk_x_snap' },
    ],
    tier: 'inactive',
    totalSpent: 0,
    orderCount: 0,
    lastOrderDate: null,
    firstContactDate: daysAgo(30),
    preferences: {
      likes: [],
      dislikes: [],
      customNotes: '',
    },
    notes: [
      { id: 'n4', text: 'Sent 15 messages asking for free content. Got aggressive when told no.', createdAt: daysAgo(28) },
    ],
    redFlag: {
      flaggedAt: daysAgo(28),
      severity: 'block',
      reason: 'Repeatedly demanded free content. Became hostile and threatening after being declined. Block on all platforms.',
    },
    orderHistory: [],
    avatarColor: '#f87171',
  },
  {
    id: 'c5',
    displayName: 'Ryan P.',
    email: 'ryanp@gmail.com',
    platforms: [
      { platform: 'instagram', username: 'ryan_lifestyle' },
      { platform: 'onlyfans', username: 'ryanp_of' },
    ],
    tier: 'regular',
    totalSpent: 1120,
    orderCount: 8,
    lastOrderDate: daysAgo(8),
    firstContactDate: daysAgo(150),
    preferences: {
      likes: ['Fitness content', 'Workout gear', 'Behind-the-scenes'],
      dislikes: ['Explicit requests'],
      customNotes: 'Consistent buyer. Prefers softcore/tease style.',
    },
    notes: [
      { id: 'n5', text: 'Good repeat client — always respectful, pays promptly', createdAt: daysAgo(60) },
    ],
    redFlag: null,
    orderHistory: [
      { id: 'o9', date: daysAgo(8), description: 'Fitness custom — 5min', amount: 140, status: 'in-progress' },
      { id: 'o10', date: daysAgo(25), description: 'Photo set — gym theme', amount: 90, status: 'completed' },
      { id: 'o11', date: daysAgo(50), description: '10min workout custom', amount: 250, status: 'completed' },
    ],
    avatarColor: '#a78bfa',
  },
  {
    id: 'c6',
    displayName: 'ChargeBacker22',
    email: 'fake@nowhere.com',
    platforms: [
      { platform: 'onlyfans', username: 'cb22_of' },
    ],
    tier: 'inactive',
    totalSpent: 0,
    orderCount: 2,
    lastOrderDate: daysAgo(60),
    firstContactDate: daysAgo(75),
    preferences: {
      likes: [],
      dislikes: [],
      customNotes: '',
    },
    notes: [
      { id: 'n6', text: 'Ordered two customs then did chargebacks on both. Lost $300.', createdAt: daysAgo(55) },
      { id: 'n7', text: 'Reported to OF support. Account flagged.', createdAt: daysAgo(50) },
    ],
    redFlag: {
      flaggedAt: daysAgo(55),
      severity: 'block',
      reason: 'Chargeback scammer. Ordered 2 customs ($300 total) and reversed both payments. Reported to platform.',
    },
    orderHistory: [
      { id: 'o12', date: daysAgo(65), description: 'Custom video — 5min', amount: 150, status: 'cancelled' },
      { id: 'o13', date: daysAgo(60), description: 'Custom video — 5min', amount: 150, status: 'cancelled' },
    ],
    avatarColor: '#f87171',
  },
  {
    id: 'c7',
    displayName: 'Sophia L.',
    email: 'sophia.l@email.com',
    platforms: [
      { platform: 'fansly', username: 'soph_vip' },
      { platform: 'telegram', username: 'sophia_priv' },
    ],
    tier: 'vip',
    totalSpent: 3200,
    orderCount: 18,
    lastOrderDate: daysAgo(1),
    firstContactDate: daysAgo(365),
    preferences: {
      likes: ['Artistic nudes', 'B&W photography', 'Poetic captions'],
      dislikes: ['Rushed content', 'Low-res'],
      customNotes: 'Long-time supporter. Values quality over quantity. Sends holiday gifts.',
    },
    notes: [
      { id: 'n8', text: 'Anniversary coming up — consider a thank-you bonus', createdAt: daysAgo(5) },
      { id: 'n9', text: 'Prefers high-res downloads. Always send full quality.', createdAt: daysAgo(100) },
    ],
    redFlag: null,
    orderHistory: [
      { id: 'o14', date: daysAgo(1), description: 'Exclusive photo series — 25 images', amount: 200, status: 'pending' },
      { id: 'o15', date: daysAgo(15), description: '15min artistic custom', amount: 400, status: 'completed' },
      { id: 'o16', date: daysAgo(40), description: 'B&W photo set', amount: 120, status: 'completed' },
    ],
    avatarColor: '#f472b6',
  },
  {
    id: 'c8',
    displayName: 'TimWaster_Mike',
    email: '',
    platforms: [
      { platform: 'snapchat', username: 'mike_tw_snap' },
    ],
    tier: 'inactive',
    totalSpent: 0,
    orderCount: 0,
    lastOrderDate: null,
    firstContactDate: daysAgo(20),
    preferences: { likes: [], dislikes: [], customNotes: '' },
    notes: [
      { id: 'n10', text: 'Spent a week "negotiating" a custom, asked 50+ questions, then ghosted.', createdAt: daysAgo(15) },
    ],
    redFlag: {
      flaggedAt: daysAgo(15),
      severity: 'warn',
      reason: 'Time-waster. Spent extensive time negotiating then disappeared. Not hostile, just draining.',
    },
    orderHistory: [],
    avatarColor: '#fbbf24',
  },
]
