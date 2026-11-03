/* ================================================================
   SITE IMAGES — every photo on the site in one place.
   To change an image, either:
     • upload the file to public/assets/ and write a('your-file.jpg'), or
     • paste a full web address: 'https://…/photo.jpg'
   Small icons (arrows, calendar, ticks) are not listed here.
   ================================================================ */
const a = (file: string) => `/assets/${file}`

export const images = {
  /* Header */
  logo: a('brand/logo.svg'),            // Wordmark, dark green (light backgrounds)
  logoLight: a('brand/logo-light.svg'),  // Wordmark, cream (photos and dark backgrounds)

  /* Home — top of page */
  hero: a('149a7.png'),          // Poster shown while the banner video loads
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
    a('a40d9.jpg'), // Sunrise over Angkor Wat
    a('7563c.jpg'), // The North Side Tonlé Sap
    a('cc9ad.jpg'), // Lanterns along the Siem Reap River
  ],

  /* Home — Explore our Tour cards */
  tours: {
    discovery: a('83bf1.jpg'),          // Cambodia Discovery: Temples to Rainforests
    photography: a('7563c.jpg'),        // Siem Reap – Photography & Cultural Tour
    secretSiemReap: a('b351f.jpg'),     // Secret Siem Reap
    tonleSap: a('cam-stilt-village.jpg'), // Tonlé Sap: Floating Villages
    phnomPenh: a('cam-phnom-penh.jpg'), // Phnom Penh & the Mekong Riverside
    cardamom: a('cam-cardamom.jpg'),    // Cardamom Mountains: Rainforest Trek
    /* Tour Packages page only (placeholders) */
    northernTrails: a('cam-rice-field.jpg'),   // Northern Trails: Dirt Bike Adventure
    cardamomEnduro: a('cam-river-homes.jpg'),  // Cardamom Enduro: Jungle Dirt Bike Tour
    angkorSunrise: a('a40d9.jpg'),             // Angkor Sunrise & Temple Day Tour
    banteaySrei: a('cam-banteay-srei.jpg'),    // Banteay Srei & Countryside Day Tour
  },

  /* Home — Community image cloud (6 photos) */
  community: [
    a('cam-bicycles.jpg'),
    a('cam-river-homes.jpg'),
    a('cam-rice-field.jpg'),
    a('cam-stilt-village.jpg'),
    a('cam-cardamom.jpg'),
    a('cam-banteay-srei.jpg'),
  ],

  /* Home — "Our purpose" scrolling photo row under Community (6 photos) */
  purpose: [
    a('people-1.jpg'),
    a('people-2.jpg'),
    a('people-3.jpg'),
    a('people-4.jpg'),
    a('people-5.jpg'),
    a('people-6.jpg'),
  ],

  /* Home — Latest Stories cards (in order) */
  stories: [
    a('blog-guide-hero.jpg'), // Cambodia Travel Guide
    a('cam-pagoda.jpg'),      // Inside the Pagodas
    a('cam-phnom-penh.jpg'),  // 48 Hours in Phnom Penh
    a('cc9ad.jpg'),           // Where the Jungle Won
    a('cam-river-homes.jpg'), // A Night on the Water
    a('cam-cardamom.jpg'),    // Replanting the Cardamoms
  ],

  /* Blog article: Cambodia Travel Guide (in-article photos) */
  blogGuide: {
    angkorPark: a('blog-guide-angkor-park.jpg'),
    angkorWat: a('blog-guide-angkor-wat.jpg'),
    bayon: a('blog-guide-bayon.jpg'),
    taProhm: a('blog-guide-ta-prohm.jpg'),
    tuolSleng: a('blog-guide-tuol-sleng.jpg'),
  },

  /* Home — Plan a trip full-width photo */
  planCover: a('plan-cover.jpg'),

  /* Tour packages page (#/tours) — banner photo */
  toursPage: { hero: a('83bf1.jpg') },

  /* About us page */
  about: {
    hero: a('cam-monks-angkor.jpg'),   // Full-screen photo behind the page title
    values: [
      a('cam-bicycles.jpg'),           // What we believe: Local first
      a('cam-river-homes.jpg'),        // What we believe: Travel slowly
      a('cam-cardamom.jpg'),           // What we believe: Leave it better
    ],
    responsible: a('cam-rice-field.jpg'), // "Travel with integrity" highlight
    /* Meet the team portraits (placeholders — swap in real photos of your team, same order as the names in AboutPage.tsx) */
    team: [
      a('team-1.jpg'), // Sokha Chan, founder & lead guide
      a('team-2.jpg'), // Sreymom Kim, trip specialist
      a('team-3.jpg'), // Dara Pich, driver & dirt-bike guide
      a('team-4.jpg'), // Channary Ouk, community & homestays
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
  contact: a('cam-river-homes.jpg'),     // Photo beside the contact details

  /* Ethical tourism page (#/ethical-tourism) */
  ethical: {
    hero: a('cam-banteay-srei.jpg'),     // Full-screen photo behind "Travel with integrity"
    promises: a('cam-monks-angkor.jpg'), // Tall photo beside "Our promises"
    guide: [
      a('cam-bicycles.jpg'),             // Be mindful of people
      a('cam-pagoda.jpg'),               // Be mindful of culture
      a('cam-rice-field.jpg'),           // Be mindful of the land
      a('cam-cardamom.jpg'),             // Be mindful of wildlife
      a('cam-stilt-village.jpg'),        // Be mindful of children
    ],
  },

  /* Trip details page */
  tripGallery: [a('cc9ad.jpg'), a('25a6c.jpg'), a('a40d9.jpg'), a('7563c.jpg'), a('83bf1.jpg')],
  guidePhoto: a('59c1e.jpg'),       // Your guide
  reviewerPhoto: a('59c1e.jpg'),    // Review cards avatar
  tripHighlights: [
    a('trip/hl-bats.jpg'),          // Phnom Sampov bats at dusk
    a('trip/hl-waterfall.jpg'),     // Tatai River waterfall
    a('trip/hl-cloud-sunrise.jpg'), // Cloud River Mountain sunrise
  ],

  /* Trip details — "Where you'll stay" cards (one per stay, in trip order) */
  tripStays: {
    siemReap: a('trip/stay-siem-reap.jpg'),
    battambang: a('trip/day4-colonial.jpg'),
    tatai: a('trip/stay-tatai.jpg'),
    phumTeukSre: a('trip/stay-phum-teuk-sre.jpg'),
    kampot: a('trip/stay-kampot.jpg'),
  },

  /* Trip details — day-by-day itinerary */
  itineraryIntro: a('cc9ad.jpg'),
  itineraryDays: [
    { main: a('25a6c.jpg') },                                               // Day 01 Arrival in Siem Reap
    { main: a('83bf1.jpg'), second: a('a40d9.jpg') },                       // Day 02 Angkor Wat and quiet temples
    { main: a('trip/day3-boat.jpg') },                                      // Day 03 Boat to Battambang
    { main: a('trip/day4-battambang.jpg'), second: a('trip/day4-colonial.jpg') }, // Day 04 Battambang and the bat cave
    { main: a('trip/day5-cardamoms.jpg') },                                 // Day 05 Into the Cardamoms
    { main: a('trip/day6-kayak.jpg') },                                     // Day 06 Tatai River and rainforest
    { main: a('trip/day7-bungalow.jpg'), second: a('trip/day7-cabin.jpg') }, // Day 07 Phum Teuk Sre
    { main: a('trip/day8-cloud-river.jpg') },                               // Day 08 Cloud River Mountain to Kampot
    { main: a('trip/day9-kampot.jpg') },                                    // Day 09 Kampot at leisure
    { main: a('trip/day10-road.jpg') },                                     // Day 10 Onward to Vietnam or Phnom Penh
  ],
  /* Trip details — photos shown when a day is opened in "What you'll do" (first = the day's main photo) */
  itineraryGallery: [
    [a('25a6c.jpg'), a('cc9ad.jpg'), a('trip/stay-siem-reap.jpg')],                                          // Day 01
    [a('83bf1.jpg'), a('a40d9.jpg'), a('blog-guide-angkor-wat.jpg'), a('blog-guide-bayon.jpg'), a('blog-guide-ta-prohm.jpg')], // Day 02
    [a('trip/day3-boat.jpg'), a('7563c.jpg'), a('cam-stilt-village.jpg'), a('cam-river-homes.jpg')],          // Day 03
    [a('trip/day4-battambang.jpg'), a('trip/day4-colonial.jpg'), a('cam-bicycles.jpg'), a('trip/hl-bats.jpg')], // Day 04
    [a('trip/day5-cardamoms.jpg'), a('cam-cardamom.jpg'), a('trip/stay-tatai.jpg')],                          // Day 05
    [a('trip/day6-kayak.jpg'), a('trip/hl-waterfall.jpg'), a('trip/day6-mangrove.jpg')],                      // Day 06
    [a('trip/day7-bungalow.jpg'), a('trip/day7-cabin.jpg'), a('trip/stay-phum-teuk-sre.jpg'), a('cam-rice-field.jpg')], // Day 07
    [a('trip/day8-cloud-river.jpg'), a('trip/hl-cloud-sunrise.jpg'), a('trip/day8-ridge.jpg')],               // Day 08
    [a('trip/day9-kampot.jpg'), a('trip/day9-pepper.jpg'), a('trip/stay-kampot.jpg')],                        // Day 09
    [a('trip/day10-road.jpg'), a('cam-phnom-penh.jpg'), a('day7-palace.jpg')],                                // Day 10
  ],
  itineraryEnd: a('149a7.png'),     // Photo behind the final "book" call to action
}
