import type { Expense, CannedResponse } from '../types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const seedExpenses: Expense[] = [
  { id: 'exp_1', amount: 89, category: 'subscriptions', description: 'OnlyFans promo boost', date: daysAgo(2), recurring: true, recurringInterval: 'monthly' },
  { id: 'exp_2', amount: 14.99, category: 'software', description: 'Canva Pro', date: daysAgo(5), recurring: true, recurringInterval: 'monthly' },
  { id: 'exp_3', amount: 249, category: 'equipment', description: 'Ring light replacement', date: daysAgo(12), recurring: false },
  { id: 'exp_4', amount: 67, category: 'props-wardrobe', description: 'Lingerie set — Savage x Fenty', date: daysAgo(8), recurring: false },
  { id: 'exp_5', amount: 45, category: 'props-wardrobe', description: 'Costume pieces for cosplay custom', date: daysAgo(15), recurring: false },
  { id: 'exp_6', amount: 29.99, category: 'subscriptions', description: 'Adobe Lightroom', date: daysAgo(20), recurring: true, recurringInterval: 'monthly' },
  { id: 'exp_7', amount: 150, category: 'marketing', description: 'Twitter promo / shoutout', date: daysAgo(25), recurring: false },
  { id: 'exp_8', amount: 35, category: 'other', description: 'Phone case + tripod mount', date: daysAgo(30), recurring: false },
  { id: 'exp_9', amount: 12.99, category: 'software', description: 'VPN subscription', date: daysAgo(18), recurring: true, recurringInterval: 'monthly' },
  { id: 'exp_10', amount: 320, category: 'equipment', description: 'Backdrop kit — 3 colors', date: daysAgo(45), recurring: false },
]

export const seedCannedResponses: CannedResponse[] = [
  {
    id: 'cr_1',
    label: 'Custom Pricing Intro',
    category: 'pricing',
    body: `Hey! Thanks for your interest in a custom 💕 Here's how my pricing works:\n\n• Custom videos start at $30/min\n• Photo sets start at $8/photo\n• Rush delivery available for +50%\n• Add-ons like name use or specific outfits are extra\n\nLet me know what you're thinking and I'll give you an exact quote!`,
  },
  {
    id: 'cr_2',
    label: 'Payment Required First',
    category: 'pricing',
    body: `I appreciate the interest! Just so you know, I require full payment upfront before I start any custom work. Once payment is confirmed, I'll get started right away. 💛 No exceptions — it protects both of us!`,
  },
  {
    id: 'cr_3',
    label: 'Boundary — No Meetups',
    category: 'boundaries',
    body: `Hey, I appreciate the compliment but I don't meet anyone in person — that's a firm boundary for me. I'm happy to create amazing custom content for you though! Let me know if you're interested. 😊`,
  },
  {
    id: 'cr_4',
    label: 'Boundary — Respect My Limits',
    category: 'boundaries',
    body: `I appreciate your support, but that particular request falls outside what I'm comfortable with. My limits are firm and non-negotiable. There's plenty of amazing content I CAN create for you though — want to explore some options?`,
  },
  {
    id: 'cr_5',
    label: 'Scheduling — Turnaround',
    category: 'scheduling',
    body: `Thanks for your order! 🎉 Just to set expectations:\n\n• Standard orders: 5-7 business days\n• Rush orders: 2-3 business days\n• Priority (24hr): available for an extra fee\n\nI'll keep you updated on progress. Thanks for your patience!`,
  },
  {
    id: 'cr_6',
    label: 'Thank You — After Purchase',
    category: 'gratitude',
    body: `Thank you so much for your order! 💕 It means the world to me. I'm going to make this absolutely amazing for you. I'll send you an update when it's in progress. You're the best! ✨`,
  },
  {
    id: 'cr_7',
    label: 'Thank You — VIP Appreciation',
    category: 'gratitude',
    body: `I just want to take a second to say THANK YOU for being such an amazing supporter. 👑 Your continued support means everything to me and honestly makes this all possible. You're a true VIP and I appreciate you so much! 💛`,
  },
  {
    id: 'cr_8',
    label: 'Decline — Uncomfortable Request',
    category: 'decline',
    body: `Hey, I appreciate you reaching out but I'm going to have to pass on this one. That type of content isn't something I offer. No hard feelings — I hope you understand! Feel free to check my menu for what I do offer. 😊`,
  },
  {
    id: 'cr_9',
    label: 'Decline — Lowball Offer',
    category: 'decline',
    body: `Thanks for the interest, but my prices reflect the time, effort, and quality I put into every piece of content. I'm not able to discount below my listed rates. If my pricing doesn't work for you right now, that's totally okay — no pressure!`,
  },
  {
    id: 'cr_10',
    label: 'Decline — Free Content Request',
    category: 'decline',
    body: `I appreciate you being a fan! But this is my business and how I pay my bills, so I'm not able to give content away for free. If you want to support me, even a small purchase makes a huge difference. Thanks for understanding! 💛`,
  },
]
