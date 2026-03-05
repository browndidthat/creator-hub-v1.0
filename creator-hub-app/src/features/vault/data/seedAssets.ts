import type { VaultAsset } from '../types'

function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]
}

export const seedAssets: VaultAsset[] = [
  {
    id: 'asset_1', name: 'Shadow Play Series — 12 shots', type: 'photoset', status: 'exclusive',
    postedTo: ['fansly'], dateCreated: daysAgo(3), datePosted: daysAgo(2),
    clientId: null, clientName: null, orderId: null,
    tags: ['artistic', 'b&w', 'shadow', 'premium'],
    isWatermarked: true, watermarkConfig: { text: '@CreatorHub', position: 'bottom-right', opacity: 30, fontSize: 14 },
    fileSize: '48MB', thumbnail: '🖤', notes: 'Exclusive to Fansly VIPs. Do NOT cross-post.',
  },
  {
    id: 'asset_2', name: 'Gym Selfie Set — Post-Workout', type: 'photoset', status: 'posted',
    postedTo: ['onlyfans', 'instagram', 'twitter'], dateCreated: daysAgo(8), datePosted: daysAgo(7),
    clientId: null, clientName: null, orderId: null,
    tags: ['fitness', 'selfie', 'gym', 'casual'],
    isWatermarked: true, watermarkConfig: { text: '@CreatorHub', position: 'bottom-right', opacity: 25, fontSize: 12 },
    fileSize: '22MB', thumbnail: '💪', notes: 'High engagement on IG. Good for repurposing as reels.',
  },
  {
    id: 'asset_3', name: 'Custom Video — Marcus T. Solo 5min', type: 'video', status: 'sent-to-client',
    postedTo: [], dateCreated: daysAgo(5), datePosted: null,
    clientId: 'c1', clientName: 'Marcus T.', orderId: 'ord_4',
    tags: ['custom', 'solo', 'client-content'],
    isWatermarked: true, watermarkConfig: { text: 'Custom for Marcus', position: 'center', opacity: 15, fontSize: 16 },
    fileSize: '180MB', thumbnail: '🎬', notes: 'Delivered via OF DM. DO NOT post publicly.',
  },
  {
    id: 'asset_4', name: 'Cosplay Set — Anime Character', type: 'photoset', status: 'sent-to-client',
    postedTo: [], dateCreated: daysAgo(14), datePosted: null,
    clientId: 'c2', clientName: 'Jake W.', orderId: 'ord_5',
    tags: ['cosplay', 'themed', 'client-content', 'wig'],
    isWatermarked: false, watermarkConfig: null,
    fileSize: '35MB', thumbnail: '🎭', notes: 'Custom for Jake. He requested no watermark on his copy.',
  },
  {
    id: 'asset_5', name: 'Morning Routine BTS Vlog', type: 'video', status: 'posted',
    postedTo: ['onlyfans', 'fansly'], dateCreated: daysAgo(10), datePosted: daysAgo(9),
    clientId: null, clientName: null, orderId: null,
    tags: ['bts', 'vlog', 'morning', 'lifestyle', 'casual'],
    isWatermarked: false, watermarkConfig: null,
    fileSize: '320MB', thumbnail: '☀️', notes: 'Good engagement. Consider making a series.',
  },
  {
    id: 'asset_6', name: 'B&W Artistic — Sophia Exclusive', type: 'photoset', status: 'sent-to-client',
    postedTo: [], dateCreated: daysAgo(15), datePosted: null,
    clientId: 'c7', clientName: 'Sophia L.', orderId: 'ord_1',
    tags: ['artistic', 'b&w', 'exclusive', 'premium', 'client-content'],
    isWatermarked: true, watermarkConfig: { text: 'Exclusive', position: 'bottom-left', opacity: 20, fontSize: 14 },
    fileSize: '62MB', thumbnail: '🎨', notes: 'Sophia VIP exclusive. 25 high-res images. Her favorite series so far.',
  },
  {
    id: 'asset_7', name: 'Lingerie Try-On Haul', type: 'video', status: 'available',
    postedTo: [], dateCreated: daysAgo(1), datePosted: null,
    clientId: null, clientName: null, orderId: null,
    tags: ['lingerie', 'try-on', 'haul', 'teasing'],
    isWatermarked: false, watermarkConfig: null,
    fileSize: '450MB', thumbnail: '👙', notes: 'Ready to post. Best for OF/Fansly first, then teasers on Twitter.',
  },
  {
    id: 'asset_8', name: 'Silhouette Series — Window Light', type: 'photoset', status: 'available',
    postedTo: [], dateCreated: daysAgo(0), datePosted: null,
    clientId: null, clientName: null, orderId: null,
    tags: ['silhouette', 'artistic', 'window', 'moody'],
    isWatermarked: false, watermarkConfig: null,
    fileSize: '28MB', thumbnail: '🌅', notes: 'Just shot today. Needs editing before posting.',
  },
  {
    id: 'asset_9', name: 'Fitness Custom — Ryan P. 5min', type: 'video', status: 'sent-to-client',
    postedTo: [], dateCreated: daysAgo(8), datePosted: null,
    clientId: 'c5', clientName: 'Ryan P.', orderId: 'ord_2',
    tags: ['custom', 'fitness', 'gym', 'client-content'],
    isWatermarked: true, watermarkConfig: { text: 'Custom for Ryan', position: 'bottom-right', opacity: 15, fontSize: 14 },
    fileSize: '210MB', thumbnail: '🏋️', notes: 'Gym themed custom. Delivered.',
  },
  {
    id: 'asset_10', name: 'Mirror Selfie Collection', type: 'photoset', status: 'posted',
    postedTo: ['instagram', 'twitter', 'snapchat'], dateCreated: daysAgo(20), datePosted: daysAgo(18),
    clientId: null, clientName: null, orderId: null,
    tags: ['selfie', 'mirror', 'casual', 'ootd'],
    isWatermarked: true, watermarkConfig: { text: '@CreatorHub', position: 'bottom-right', opacity: 25, fontSize: 12 },
    fileSize: '15MB', thumbnail: '🪞', notes: 'Good evergreen content. Can re-post quarterly.',
  },
  {
    id: 'asset_11', name: 'Bath Luxe — Candles & Steam', type: 'photoset', status: 'archived',
    postedTo: ['onlyfans', 'fansly'], dateCreated: daysAgo(60), datePosted: daysAgo(55),
    clientId: null, clientName: null, orderId: null,
    tags: ['bath', 'luxury', 'candles', 'moody', 'intimate'],
    isWatermarked: true, watermarkConfig: { text: '@CreatorHub', position: 'center', opacity: 20, fontSize: 14 },
    fileSize: '38MB', thumbnail: '🛁', notes: 'Archived. Already posted everywhere. Could reuse in a "throwback" post.',
  },
]
