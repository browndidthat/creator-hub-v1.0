export interface PoseSuggestion {
  id: string
  name: string
  category: 'selfie' | 'full-body' | 'detail' | 'lifestyle' | 'artistic'
  description: string
  tips: string[]
  difficulty: 'easy' | 'medium' | 'advanced'
  bestFor: string[]
}

export const poseCategories = [
  { key: 'selfie', label: 'Selfie', emoji: '🤳' },
  { key: 'full-body', label: 'Full Body', emoji: '🧍' },
  { key: 'detail', label: 'Close-Up Detail', emoji: '✨' },
  { key: 'lifestyle', label: 'Lifestyle', emoji: '☕' },
  { key: 'artistic', label: 'Artistic', emoji: '🎨' },
] as const

export const poses: PoseSuggestion[] = [
  // Selfie poses
  {
    id: 's1',
    name: 'The Over-The-Shoulder',
    category: 'selfie',
    description: 'Look back over your shoulder toward the camera with a soft expression.',
    tips: ['Angle chin slightly down', 'Soften your eyes', 'Let hair fall naturally'],
    difficulty: 'easy',
    bestFor: ['Instagram Stories', 'Profile pics'],
  },
  {
    id: 's2',
    name: 'Mirror Selfie — Elevated',
    category: 'selfie',
    description: 'Full-length mirror shot with phone held at chest height, one hip popped.',
    tips: ['Clean the mirror first', 'Use portrait mode if possible', 'Good lighting behind you'],
    difficulty: 'easy',
    bestFor: ['OOTD posts', 'Stories'],
  },
  {
    id: 's3',
    name: 'The Soft Glance',
    category: 'selfie',
    description: 'Hold camera slightly above, look up through your lashes.',
    tips: ['Natural light from a window', 'Relax your jaw', 'Slight smile or parted lips'],
    difficulty: 'easy',
    bestFor: ['Close-up content', 'DM teasers'],
  },
  {
    id: 's4',
    name: 'Hand Framing',
    category: 'selfie',
    description: 'Rest one hand near your face — touching jaw, playing with hair, or near temple.',
    tips: ['Keep fingers relaxed', 'Dont flatten your hand', 'Try different placements'],
    difficulty: 'easy',
    bestFor: ['Headshots', 'Promo images'],
  },
  {
    id: 's5',
    name: 'The Candid Laugh',
    category: 'selfie',
    description: 'Set a timer and genuinely laugh — capture the in-between moment.',
    tips: ['Think of something actually funny', 'Burst mode helps', 'Eyes can be half-closed — thats okay'],
    difficulty: 'easy',
    bestFor: ['Engagement posts', 'Relatable content'],
  },

  // Full body
  {
    id: 'f1',
    name: 'The Lean',
    category: 'full-body',
    description: 'Lean against a wall or doorframe with one leg crossed in front.',
    tips: ['Shift weight to back leg', 'Arms can be crossed or one hand in pocket', 'Angle your body 45°'],
    difficulty: 'easy',
    bestFor: ['Fashion content', 'Promo shoots'],
  },
  {
    id: 'f2',
    name: 'Walking Away',
    category: 'full-body',
    description: 'Walk away from camera, look back over shoulder mid-stride.',
    tips: ['Take natural steps', 'Keep back straight', 'Timer + burst mode'],
    difficulty: 'medium',
    bestFor: ['Outdoor shoots', 'Storytelling'],
  },
  {
    id: 'f3',
    name: 'The Power Stand',
    category: 'full-body',
    description: 'Feet shoulder-width, hands on hips, chin slightly up. Confident energy.',
    tips: ['Square shoulders to camera', 'Strong eye contact', 'Works great in heels'],
    difficulty: 'easy',
    bestFor: ['Empowerment content', 'Brand partnerships'],
  },
  {
    id: 'f4',
    name: 'Seated Cross-Leg',
    category: 'full-body',
    description: 'Sit on floor or low surface, one leg extended, one bent. Lean back on hands.',
    tips: ['Point toes slightly', 'Keep spine elongated', 'Camera at ground level'],
    difficulty: 'medium',
    bestFor: ['Casual content', 'Product shots'],
  },
  {
    id: 'f5',
    name: 'The Twirl',
    category: 'full-body',
    description: 'Spin slowly in a dress or flowing outfit and capture mid-motion.',
    tips: ['Burst mode essential', 'Spin slowly', 'Look down or to the side for dreamy feel'],
    difficulty: 'medium',
    bestFor: ['Reels', 'Fashion features'],
  },

  // Detail/Close-up
  {
    id: 'd1',
    name: 'The Hand Story',
    category: 'detail',
    description: 'Close-up of hands doing something — holding coffee, jewelry, phone.',
    tips: ['Natural light', 'Moisturize hands before', 'Keep background simple'],
    difficulty: 'easy',
    bestFor: ['Product promo', 'Aesthetic grids'],
  },
  {
    id: 'd2',
    name: 'Collarbone Highlight',
    category: 'detail',
    description: 'Shoot from above, light catching collarbones and neckline.',
    tips: ['Side lighting works best', 'Slightly arch back', 'Minimal jewelry or one statement piece'],
    difficulty: 'easy',
    bestFor: ['Jewelry promo', 'Intimate content'],
  },
  {
    id: 'd3',
    name: 'Texture Play',
    category: 'detail',
    description: 'Focus on an interesting texture — fabric, skin with water drops, lace detail.',
    tips: ['Macro mode if available', 'Single light source for drama', 'Shallow depth of field'],
    difficulty: 'medium',
    bestFor: ['Artistic content', 'Exclusive posts'],
  },

  // Lifestyle
  {
    id: 'l1',
    name: 'Morning Ritual',
    category: 'lifestyle',
    description: 'Capture yourself mid-routine — stretching, sipping coffee, journaling.',
    tips: ['Soft morning light', 'Cozy setting', 'Dont look directly at camera'],
    difficulty: 'easy',
    bestFor: ['Day-in-the-life', 'Relatable content'],
  },
  {
    id: 'l2',
    name: 'The Work Moment',
    category: 'lifestyle',
    description: 'Styled shot of you at your desk, on your phone, or being "productive."',
    tips: ['Clean desk, curated items', 'Side angle', 'Concentration expression'],
    difficulty: 'easy',
    bestFor: ['Behind-the-scenes', 'Brand building'],
  },
  {
    id: 'l3',
    name: 'Bath/Pool Luxe',
    category: 'lifestyle',
    description: 'Relaxed in water — bathtub, pool edge, or hot tub with steam.',
    tips: ['Candles or fairy lights', 'Hair up or slicked back', 'Keep it tasteful with strategic bubbles/angles'],
    difficulty: 'medium',
    bestFor: ['Luxury content', 'Exclusive tiers'],
  },

  // Artistic
  {
    id: 'a1',
    name: 'Shadow Play',
    category: 'artistic',
    description: 'Use blinds, lace, or plants to cast dramatic shadows across body.',
    tips: ['Strong single light source', 'Midday sun through blinds is perfect', 'Black and white edit'],
    difficulty: 'advanced',
    bestFor: ['Portfolio pieces', 'Exclusive drops'],
  },
  {
    id: 'a2',
    name: 'The Silhouette',
    category: 'artistic',
    description: 'Stand in front of a bright window or light — just your outline visible.',
    tips: ['Expose for the background', 'Profile angle is strongest', 'Works at sunset too'],
    difficulty: 'medium',
    bestFor: ['Teasers', 'Artistic series'],
  },
  {
    id: 'a3',
    name: 'Fabric Drape',
    category: 'artistic',
    description: 'Wrap yourself in a sheet, silk, or curtain — revealing through concealing.',
    tips: ['Use a large piece of fabric', 'Movement adds interest', 'Muted or single-color fabrics work best'],
    difficulty: 'advanced',
    bestFor: ['Fine art content', 'Premium exclusives'],
  },
  {
    id: 'a4',
    name: 'Reflection Shot',
    category: 'artistic',
    description: 'Capture your reflection in water, glass, or a metallic surface.',
    tips: ['Puddles after rain are perfect', 'Shoot the reflection, not the subject', 'Flip the image in editing'],
    difficulty: 'advanced',
    bestFor: ['Creative series', 'Instagram feed'],
  },
]

export const postingTimes = [
  { platform: 'Instagram', bestTimes: ['11:00 AM', '2:00 PM', '7:00 PM'], bestDays: ['Tuesday', 'Wednesday', 'Friday'] },
  { platform: 'TikTok', bestTimes: ['9:00 AM', '12:00 PM', '7:00 PM'], bestDays: ['Tuesday', 'Thursday', 'Saturday'] },
  { platform: 'Twitter/X', bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM'], bestDays: ['Monday', 'Wednesday', 'Friday'] },
  { platform: 'Snapchat', bestTimes: ['10:00 AM', '1:00 PM', '8:00 PM'], bestDays: ['Daily'] },
  { platform: 'Fansly', bestTimes: ['8:00 PM', '10:00 PM'], bestDays: ['Friday', 'Saturday', 'Sunday'] },
  { platform: 'OnlyFans', bestTimes: ['9:00 PM', '11:00 PM'], bestDays: ['Thursday', 'Friday', 'Saturday'] },
]
