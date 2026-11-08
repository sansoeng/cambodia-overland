/* ================================================================
   SITE IMAGES — every photo on the site in one place.
   To change an image, either:
     • upload the file to public/assets/ and write a('your-file.webp'), or   (WebP loads fastest; JPG/PNG also work)
     • paste a full web address: 'https://…/photo.jpg'
   Small icons (arrows, calendar, ticks) are not listed here.
   ================================================================ */
const a = (file: string) => `/assets/${file}`

export const images = {
  /* Header */
  logo: a('brand/logo.svg'),            // Wordmark, dark green (light backgrounds)
  logoLight: a('brand/logo-light.svg'),  // Wordmark, cream (photos and dark backgrounds)
  comingSoonBg: a('coming-soon-bg.jpg'), // Great Hornbill flying across jungle canopy

  /* Home — top of page */
  hero: a('149a7.webp'),          // Poster shown while the banner video loads
  /* Banner video (placeholder footage from the Tengile MalaMala reference — swap in your own Cambodia film).
     preview = short silent loop behind the title; full = film opened by "Play Video". */
  heroVideo: {
    preview: a('video/hero-preview.mp4'),
    previewMobile: a('video/hero-preview-mobile.mp4'),
    full: 'https://d1z1bhj01il1nu.cloudfront.net/tmmc-home-hero-full_1080p.mp4',
    fullMobile: 'https://d1z1bhj01il1nu.cloudfront.net/tmmc-home-hero-full_540p.mp4',
  },

  /* Home — scrolling "Cambodia Travel" panels (dark section) */
  homePanels: [
    a('a40d9.webp'), // Sunrise over Angkor Wat
    a('7563c.webp'), // The North Side Tonlé Sap
    a('cc9ad.webp'), // Lanterns along the Siem Reap River
  ],

  /* Home — Explore our Tour cards */
  tours: {
    discovery: a('83bf1.webp'),          // Cambodia Discovery: Temples to Rainforests
    photography: a('7563c.webp'),        // Siem Reap – Photography & Cultural Tour
    secretSiemReap: a('b351f.webp'),     // Secret Siem Reap
    tonleSap: a('cam-stilt-village.webp'), // Tonlé Sap: Floating Villages
    phnomPenh: a('cam-phnom-penh.webp'), // Phnom Penh & the Mekong Riverside
    cardamom: a('cam-cardamom.webp'),    // Cardamom Mountains: Rainforest Trek
    /* Tour Packages page only (placeholders) */
    northernTrails: a('cam-rice-field.webp'),   // Northern Trails: Dirt Bike Adventure
    cardamomEnduro: a('cam-river-homes.webp'),  // Cardamom Enduro: Jungle Dirt Bike Tour
    angkorSunrise: a('a40d9.webp'),             // Angkor Sunrise & Temple Day Tour
    banteaySrei: a('cam-banteay-srei.webp'),    // Banteay Srei & Countryside Day Tour
  },

  /* Home — Community image cloud (6 photos) */
  community: [
    a('cam-bicycles.webp'),
    a('cam-river-homes.webp'),
    a('cam-rice-field.webp'),
    a('cam-stilt-village.webp'),
    a('cam-cardamom.webp'),
    a('cam-banteay-srei.webp'),
  ],

  /* Home — "Our purpose" scrolling photo row under Community (6 photos) */
  purpose: [
    a('people-1.webp'),
    a('people-2.webp'),
    a('people-3.webp'),
    a('people-4.webp'),
    a('people-5.webp'),
    a('people-6.webp'),
  ],

  /* Home — Latest Stories cards (in order) */
  stories: [
    a('blog-guide-hero.webp'), // Cambodia Travel Guide
    a('cam-pagoda.webp'),      // Inside the Pagodas
    a('cam-phnom-penh.webp'),  // 48 Hours in Phnom Penh
    a('cc9ad.webp'),           // Where the Jungle Won
    a('cam-river-homes.webp'), // A Night on the Water
    a('cam-cardamom.webp'),    // Replanting the Cardamoms
  ],

  /* Blog article: Cambodia Travel Guide (in-article photos) */
  blogGuide: {
    angkorPark: a('blog-guide-angkor-park.webp'),
    angkorWat: a('blog-guide-angkor-wat.webp'),
    bayon: a('blog-guide-bayon.webp'),
    taProhm: a('blog-guide-ta-prohm.webp'),
    tuolSleng: a('blog-guide-tuol-sleng.webp'),
  },

  /* Home — Plan a trip full-width photo */
  planCover: a('plan-cover.webp'),

  /* Tour packages page (#/tours) — banner photo */
  toursPage: { hero: a('83bf1.webp') },

  /* About us page */
  about: {
    hero: a('cam-monks-angkor.webp'),   // Full-screen photo behind the page title
    values: [
      a('cam-bicycles.webp'),           // What we believe: Local first
      a('cam-river-homes.webp'),        // What we believe: Travel slowly
      a('cam-cardamom.webp'),           // What we believe: Leave it better
    ],
    responsible: a('cam-rice-field.webp'), // "Travel with integrity" highlight
    /* Meet the team portraits (placeholders — swap in real photos of your team, same order as the names in AboutPage.tsx) */
    team: [
      a('team-1.webp'), // Sokha Chan, founder & lead guide
      a('team-2.webp'), // Sreymom Kim, trip specialist
      a('team-3.webp'), // Dara Pich, driver & dirt-bike guide
      a('team-4.webp'), // Channary Ouk, community & homestays
    ],
    /* Licences & partners logo wall (same order as the names in AboutPage.tsx). Upload each logo to
       public/assets/ and write a('your-logo.svg'); while empty, the partner's name shows in its place. */
    partners: [
      '', // Ministry of Tourism, Cambodia
      '', // Cambodia Association of Travel Agents
      '', // Tripadvisor
      '', // Village schools, Siem Reap
      '', // Cardamom forest rangers
      '', // Homestay families
    ],
  },

  /* Contact page (#/contact) */
  contact: a('cam-river-homes.webp'),     // Photo beside the contact details

  /* Ethical tourism page (#/ethical-tourism) */
  ethical: {
    hero: a('cam-banteay-srei.webp'),     // Full-screen photo behind "Travel with integrity"
    promises: a('cam-monks-angkor.webp'), // Tall photo beside "Our promises"
    guide: [
      a('cam-bicycles.webp'),             // Be mindful of people
      a('cam-pagoda.webp'),               // Be mindful of culture
      a('cam-rice-field.webp'),           // Be mindful of the land
      a('cam-cardamom.webp'),             // Be mindful of wildlife
      a('cam-stilt-village.webp'),        // Be mindful of children
    ],
  },

  /* Trip details page */
  tripGallery: [a('cc9ad.webp'), a('25a6c.webp'), a('a40d9.webp'), a('7563c.webp'), a('83bf1.webp')],
  guidePhoto: a('59c1e.webp'),       // Your guide
  reviewerPhoto: a('59c1e.webp'),    // Review cards avatar
  tripHighlights: [
    a('trip/hl-bats.webp'),          // Phnom Sampov bats at dusk
    a('trip/hl-waterfall.webp'),     // Tatai River waterfall
    a('trip/hl-cloud-sunrise.webp'), // Cloud River Mountain sunrise
  ],

  /* Trip details — "Where you'll stay" cards (one per stay, in trip order) */
  tripStays: {
    siemReap: a('trip/stay-siem-reap.webp'),
    battambang: a('trip/day4-colonial.webp'),
    tatai: a('trip/stay-tatai.webp'),
    phumTeukSre: a('trip/stay-phum-teuk-sre.webp'),
    kampot: a('trip/stay-kampot.webp'),
  },

  /* Trip details — day-by-day itinerary */
  itineraryIntro: a('cc9ad.webp'),
  itineraryDays: [
    { main: a('25a6c.webp') },                                               // Day 01 Arrival in Siem Reap
    { main: a('83bf1.webp'), second: a('a40d9.webp') },                       // Day 02 Angkor Wat and quiet temples
    { main: a('trip/day3-boat.webp') },                                      // Day 03 Boat to Battambang
    { main: a('trip/day4-battambang.webp'), second: a('trip/day4-colonial.webp') }, // Day 04 Battambang and the bat cave
    { main: a('trip/day5-cardamoms.webp') },                                 // Day 05 Into the Cardamoms
    { main: a('trip/day6-kayak.webp') },                                     // Day 06 Tatai River and rainforest
    { main: a('trip/day7-bungalow.webp'), second: a('trip/day7-cabin.webp') }, // Day 07 Phum Teuk Sre
    { main: a('trip/day8-cloud-river.webp') },                               // Day 08 Cloud River Mountain to Kampot
    { main: a('trip/day9-kampot.webp') },                                    // Day 09 Kampot at leisure
    { main: a('trip/day10-road.webp') },                                     // Day 10 Onward to Vietnam or Phnom Penh
  ],
  /* Trip details — photos shown when a day is opened in "What you'll do" (first = the day's main photo) */
  itineraryGallery: [
    [a('25a6c.webp'), a('cc9ad.webp'), a('trip/stay-siem-reap.webp')],                                          // Day 01
    [a('83bf1.webp'), a('a40d9.webp'), a('blog-guide-angkor-wat.webp'), a('blog-guide-bayon.webp'), a('blog-guide-ta-prohm.webp')], // Day 02
    [a('trip/day3-boat.webp'), a('7563c.webp'), a('cam-stilt-village.webp'), a('cam-river-homes.webp')],          // Day 03
    [a('trip/day4-battambang.webp'), a('trip/day4-colonial.webp'), a('cam-bicycles.webp'), a('trip/hl-bats.webp')], // Day 04
    [a('trip/day5-cardamoms.webp'), a('cam-cardamom.webp'), a('trip/stay-tatai.webp')],                          // Day 05
    [a('trip/day6-kayak.webp'), a('trip/hl-waterfall.webp'), a('trip/day6-mangrove.webp')],                      // Day 06
    [a('trip/day7-bungalow.webp'), a('trip/day7-cabin.webp'), a('trip/stay-phum-teuk-sre.webp'), a('cam-rice-field.webp')], // Day 07
    [a('trip/day8-cloud-river.webp'), a('trip/hl-cloud-sunrise.webp'), a('trip/day8-ridge.webp')],               // Day 08
    [a('trip/day9-kampot.webp'), a('trip/day9-pepper.webp'), a('trip/stay-kampot.webp')],                        // Day 09
    [a('trip/day10-road.webp'), a('cam-phnom-penh.webp'), a('day7-palace.webp')],                                // Day 10
  ],
  itineraryEnd: a('149a7.webp'),     // Photo behind the final "book" call to action
}
