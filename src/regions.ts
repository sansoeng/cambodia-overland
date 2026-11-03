import { images } from './siteImages'
import type { Feature } from './motion'

/* The three regions from the homepage "Explore 3 regions" section. Each opens its own page at #/regions/<slug>.
   Placeholder copy written for Cambodia Overland: edit freely. `tours` lists tour ids from content.tsx. */
export type Region = {
  slug: string
  name: string
  hero: string
  heroAlt: string
  lines: [string, string]
  intro: string
  statement: string
  paragraphs: [string, string]
  facts: { label: string; value: string }[]
  highlights: Feature[]
  tours: string[]
  card: string
}

export const regions: Region[] = [
  {
    slug: 'culture-history',
    name: 'Culture & History',
    hero: images.homePanels[0],
    heroAlt: 'Angkor Wat temple towers at sunrise',
    lines: ['Culture &', 'History'],
    intro: 'Siem Reap, the temples of Angkor and the floating villages of the Tonlé Sap: the heart of the Khmer story.',
    statement: 'Begin where time stands still: among ancient stones, flooded forests and floating villages, where every carving tells a living story.',
    paragraphs: [
      'For six centuries Angkor was the capital of a Khmer empire that stretched across Southeast Asia. Today its temples rise from the forest just outside Siem Reap, and our guides know the quiet hours and hidden paths that keep the crowds behind you.',
      'Beyond the stones, life carries on as it has for generations. Stilt villages rise and fall with the Tonlé Sap, monks walk the morning alms round, and family workshops still carve, weave and cook the way their grandparents did.',
    ],
    facts: [
      { label: 'Base', value: 'Siem Reap' },
      { label: 'Best time', value: 'November to March' },
      { label: 'Ideal stay', value: '3 to 5 days' },
    ],
    highlights: [
      { img: images.blogGuide.angkorWat, alt: 'Angkor Wat reflected in its moat', eyebrow: 'Region highlights', title: 'Angkor Wat at dawn.', text: 'Watch the five towers appear out of the dark from a quiet corner of the moat, then explore the galleries before the day-trippers arrive.' },
      { img: images.blogGuide.taProhm, alt: 'Tree roots growing over Ta Prohm', eyebrow: 'Region highlights', title: 'Ta Prohm & Bayon.', text: 'Giant fig roots pour over Ta Prohm’s walls, and the 216 smiling faces of the Bayon watch over the old royal city of Angkor Thom.' },
      { img: images.tours.tonleSap, alt: 'Painted stilt houses in a Tonlé Sap village', eyebrow: 'Region highlights', title: 'Tonlé Sap villages.', text: 'Glide past stilt houses and flooded forest by boat, and share lunch with a fishing family on Southeast Asia’s largest lake.' },
    ],
    tours: ['discovery', 'photography', 'secret-siem-reap', 'tonle-sap', 'angkor-sunrise', 'banteay-srei'],
    card: 'Temples of Angkor, Siem Reap and the floating villages of the Tonlé Sap.',
  },
  {
    slug: 'eco-east',
    name: 'Eco-East',
    hero: images.homePanels[1],
    heroAlt: 'Morning on a quiet Cambodian lake',
    lines: ['The wild', 'Eco-East'],
    intro: 'The Mekong, Kratie’s river dolphins and the highland forests of Mondulkiri, protected by the communities who live there.',
    statement: 'The Mekong greets you with endless life: fishermen at dawn, bird-filled trails, and forests cared for by the people who call them home.',
    paragraphs: [
      'North of Phnom Penh the Mekong slows into a maze of islands and sandbars. In Kratie, rare Irrawaddy dolphins surface beside the boats, and village homestays welcome you with river fish and stories on the porch.',
      'Further east the land climbs into the rolling hills of Mondulkiri. Here, Bunong communities protect their forests and the elephants that live in them, and every visit helps keep that conservation work going.',
    ],
    facts: [
      { label: 'Base', value: 'Kratie & Mondulkiri' },
      { label: 'Best time', value: 'November to April' },
      { label: 'Ideal stay', value: '4 to 6 days' },
    ],
    highlights: [
      { img: images.tours.phnomPenh, alt: 'Riverside promenade in Phnom Penh', eyebrow: 'Region highlights', title: 'The Mekong riverside.', text: 'Start in Phnom Penh, then follow the river north by road and boat to sleepy Kratie and its sandbar islands.' },
      { img: images.community[1], alt: 'Stilt homes and boats along the river', eyebrow: 'Region highlights', title: 'River dolphins & homestays.', text: 'Look out for Irrawaddy dolphins at sunset and spend a night with a family on Koh Trong island, cycling between their orchards.' },
      { img: images.community[4], alt: 'Forested hills in eastern Cambodia', eyebrow: 'Region highlights', title: 'Mondulkiri forests.', text: 'Walk with Bunong guides through highland forest and waterfalls, and visit a community-run sanctuary for retired elephants.' },
    ],
    tours: ['phnom-penh', 'northern-trails'],
    card: 'The Mekong, Kratie’s river dolphins and the highland forests of Mondulkiri.',
  },
  {
    slug: 'southern-coast',
    name: 'Southern Coast & Mountains',
    hero: images.homePanels[2],
    heroAlt: 'Lanterns along the riverside at dusk',
    lines: ['Southern Coast', '& Mountains'],
    intro: 'Kampot’s riverside, Kep’s crab market and the rainforest ridges of the Cardamom Mountains.',
    statement: 'Where emerald peaks meet the sea: sleepy riverside towns, fragrant pepper farms, and secluded jungle waterways deep in the Cardamoms.',
    paragraphs: [
      'Kampot sits on a slow green river below Bokor Mountain, with old shophouses, sunset boat rides and the pepper farms that made its name. Down the road, Kep serves fresh crab straight from the market baskets to your table.',
      'Inland, the Cardamom Mountains hold one of Southeast Asia’s largest rainforests. Trek between ranger stations, kayak the Tatai River at dawn and sleep in eco-lodges run with the communities who protect the forest.',
    ],
    facts: [
      { label: 'Base', value: 'Kampot & Koh Kong' },
      { label: 'Best time', value: 'December to April' },
      { label: 'Ideal stay', value: '4 to 7 days' },
    ],
    highlights: [
      { img: images.tours.cardamom, alt: 'Rainforest hills of the Cardamom Mountains', eyebrow: 'Region highlights', title: 'The Cardamom Mountains.', text: 'Trek through ancient rainforest with local rangers, then kayak the Tatai River to waterfalls you can swim beneath.' },
      { img: images.community[2], alt: 'Green fields and sugar palms near Kampot', eyebrow: 'Region highlights', title: 'Kampot pepper farms.', text: 'Walk the vines with the farmers who grow the world-famous pepper, and taste it fresh, green, red and black.' },
      { img: images.homePanels[2], alt: 'Riverside at dusk in southern Cambodia', eyebrow: 'Region highlights', title: 'Kep & the coast.', text: 'Pick your crab at Kep’s market, watch it cooked in Kampot pepper, and end the day with sunset over the Gulf of Thailand.' },
    ],
    tours: ['cardamom', 'cardamom-enduro', 'discovery'],
    card: 'Kampot’s riverside, Kep’s crab market and the Cardamom rainforest.',
  },
]

export const regionBySlug = (slug: string) => regions.find((r) => r.slug === slug)
