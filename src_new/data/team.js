/**
 * Aamrutham Team
 *
 * Add or reorder entries freely — the TeamSection renders them as-is.
 *
 * Fields
 * ──────
 *   id       string   unique key, also used as the CSS fallback colour key
 *   name     string   displayed name
 *   role     string   title / designation (written with the same warmth for animals)
 *   bio      string   one-liner that tells their story
 *   image    string   path relative to /public  (e.g. '/assets/team/ravi.jpg')
 *                     drop the real photo in and the card updates automatically
 *   emoji    string   shown when the image is missing / as an accent
 *   type     'human' | 'animal'
 *   color    string   CSS gradient stop used for the avatar fallback
 */

export const team = [
  /* ── People ─────────────────────────────────────────────── */
  {
    id: 'ravi',
    name: 'Ravi Kumar Vajha',
    role: 'Founder & Head Farmer',
    bio: 'Third-generation mango grower who traded city life to bring Bobbili\'s finest back to Hyderabad.',
    image: '/assets/team/ravi.jpg',
    emoji: '👨‍🌾',
    type: 'human',
    color: '#e07b39',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi Vajha',
    role: 'Farm Operations & Soul',
    bio: 'Keeps every harvest on schedule and every relationship warmer than a summer afternoon.',
    image: '/assets/team/lakshmi.jpg',
    emoji: '👩‍🌾',
    type: 'human',
    color: '#c96b8a',
  },
  {
    id: 'arjun',
    name: 'Arjun Reddy',
    role: 'Harvest Coordinator',
    bio: 'Leads our seasonal picking crew, nose-first — he can smell the perfect ripeness from ten paces.',
    image: '/assets/team/arjun.jpg',
    emoji: '🧑‍🌾',
    type: 'human',
    color: '#b06040',
  },

  /* ── Farm Animals ────────────────────────────────────────── */
  {
    id: 'nandi',
    name: 'Nandi',
    role: 'Head of Jeevamrutham',
    bio: 'Our prized Ongole bull. His daily contribution goes directly into the organic bio-input that feeds every tree.',
    image: '/assets/team/nandi.jpg',
    emoji: '🐂',
    type: 'animal',
    color: '#7a5230',
  },
  {
    id: 'ganga',
    name: 'Ganga',
    role: 'Soil Enrichment Specialist',
    bio: 'Senior dairy associate whose milk and dung are the backbone of our pesticide-free compost cycle.',
    image: '/assets/team/ganga.jpg',
    emoji: '🐄',
    type: 'animal',
    color: '#8a6840',
  },
  {
    id: 'karna',
    name: 'Karna',
    role: 'Chief of Orchard Security',
    bio: 'Patrols the grove through the night. No monkey, wild boar, or uninvited guest escapes his watch.',
    image: '/assets/team/karna.jpg',
    emoji: '🐕',
    type: 'animal',
    color: '#6b7a8a',
  },
  {
    id: 'meenu',
    name: 'Meenu',
    role: 'Natural Weed Management',
    bio: 'Keeps the orchard floor tidy without a single drop of herbicide. Has strong opinions on grass quality.',
    image: '/assets/team/meenu.jpg',
    emoji: '🐐',
    type: 'animal',
    color: '#7a8a5a',
  },
  {
    id: 'chitti',
    name: 'Chitti & Flock',
    role: 'Pollination Partners',
    bio: 'Hundreds of sparrows who nest in our trees every season — nature\'s own pollination crew.',
    image: '/assets/team/chitti.jpg',
    emoji: '🐦',
    type: 'animal',
    color: '#5a8aaa',
  },
  {
    id: 'raja',
    name: 'Raja',
    role: 'Senior Quality Tester',
    bio: 'Our resident parrot always gets the first taste. If Raja approves, the harvest is ready.',
    image: '/assets/team/raja.jpg',
    emoji: '🦜',
    type: 'animal',
    color: '#3a8a5a',
  },
];
