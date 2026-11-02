import { images } from './siteImages'

/* Long-form article content for each blog story, keyed by the story slug in content.tsx.
   'cambodia-travel-guide' comes from the Cambodia Overland Webflow site; the others are
   placeholder editorial copy to review before publishing. */
export type Ranking = { name: string; rank: string }[]
export type BlogPost = {
  /* avatar: profile photo URL; initials are shown when it is missing. */
  author: { name: string; role?: string; avatar?: string }
  intro?: string
  /* A paragraph entry may also be a ranked list. */
  sections: { heading: string; image?: { src: string; caption: string }; paragraphs: (string | { ranking: Ranking })[] }[]
  quote?: { text: string; by: string }
  tips?: string[]
}

export const blogPosts: Record<string, BlogPost> = {
  'cambodia-travel-guide': {
    author: { name: 'Laoda' },
    sections: [
      { heading: 'A proud moment for Cambodia', paragraphs: [
        'Cambodia is home to countless places that tell our story, from the grand capitals of the Khmer Empire to sacred sites preserving the most poignant chapters of our modern history. This year, four Cambodian landmarks have been recognized among the Top 25 Attractions in Asia in Tripadvisor’s 2026 Travelers’ Choice Awards:',
        { ranking: [
          { name: 'Angkor Wat', rank: '#2' },
          { name: 'Bayon Temple', rank: '#13' },
          { name: 'Tuol Sleng Genocide Museum (S-21)', rank: '#20' },
          { name: 'Ta Prohm Temple', rank: '#23' },
        ] },
        'For a country of our size, having four places represented in Asia’s Top 25 is something worth celebrating. What I particularly like about this list is that these four places do not tell the same story. Three take us back to the height of the Khmer Empire, while one asks us to remember a much more recent and painful period of Cambodian history.',
      ]},
      { heading: 'Angkor Archaeological Park: A Living Landscape', image: { src: images.blogGuide.angkorPark, caption: 'Angkor Wat in the jungle' }, paragraphs: [
        'Before exploring individual temples, it is essential to understand their setting: the Angkor Archaeological Park.',
        'Angkor is not simply a collection of stone monuments. Spanning roughly 400 square kilometers, this UNESCO World Heritage Site preserves the remains of successive capitals of the Khmer Empire from the 9th to the 15th centuries. Across this terrain lies an advanced network of temples, hydraulic canals, reservoirs, roads, and cities that demonstrate just how sophisticated Khmer civilization was.',
        'Angkor is also a living cultural landscape. Active farming villages, rice paddies, and local communities still call this area home today, maintaining a continuous human connection to the land that goes far beyond the stone ruins. Three of the four award-winning landmarks reside within this extraordinary park.',
      ]},
      { heading: 'Angkor Wat, 2nd in Asia', image: { src: images.blogGuide.angkorWat, caption: 'Angkor Wat during sunset' }, paragraphs: [
        'There are few places that represent Cambodia as powerfully as Angkor Wat.',
        'Built in the early 12th century during the reign of King Suryavarman II, Angkor Wat was originally dedicated to the Hindu god Vishnu. Over time, it became an important Buddhist place of worship, a role that continues today.',
        'Its five famous towers have become one of the most recognisable symbols of Cambodia and appear at the centre of our national flag. But Angkor Wat is much more interesting when you get closer.',
        'Walk through its galleries and you begin to see the incredible detail of the monument. Its long bas-reliefs depict Hindu mythology, historical processions, battles and scenes connected to ideas of heaven and the underworld. The architecture itself was designed with enormous symbolic meaning.',
        'This is why I always encourage people not to visit Angkor Wat only for the sunrise. Watching the temple slowly appear as the morning light changes is beautiful, but stay afterwards. Walk through the galleries. Look closely at the carvings. Understand why it was built and what it represented.',
        'Being ranked 2nd among Asia’s top attractions is an incredible recognition for a monument that has represented Cambodia for more than 900 years.',
      ]},
      { heading: 'Bayon Temple, 13th in Asia', image: { src: images.blogGuide.bayon, caption: 'Bayon Temple' }, paragraphs: [
        'At the centre of the ancient walled city of Angkor Thom stands one of the most fascinating temples in Cambodia, Bayon.',
        'Bayon was constructed around the late 12th and early 13th centuries during the reign of King Jayavarman VII, one of the most important rulers of the Khmer Empire.',
        'It feels completely different from Angkor Wat. Bayon is best known for its monumental stone faces looking out from its towers. Depending on where you stand, one face disappears behind another while a new one appears between the stones.',
        'The identity and meaning of these faces continue to be discussed by scholars, but they have become one of the defining images of Angkor.',
        'There is another part of Bayon that I think deserves just as much attention, its bas-reliefs. They show battles and royal processions, but they also contain wonderful scenes of ordinary life during the Angkorian period. Markets, cooking, fishing and other daily activities appear in stone. These details give us glimpses into the lives of people who lived here centuries ago.',
        'Its position at 13th in Asia gives another reason for travellers to look beyond Angkor Wat and spend time understanding Angkor Thom and the wider archaeological landscape.',
      ]},
      { heading: 'Ta Prohm Temple, 23rd in Asia', image: { src: images.blogGuide.taProhm, caption: 'Ta Prohm Temple' }, paragraphs: [
        'Ta Prohm offers another completely different experience. Built during the reign of Jayavarman VII from the late 12th century, the temple was originally associated with a Buddhist monastery and was dedicated in honour of the king’s mother.',
        'Today, it is famous around the world for something that happened many centuries after its construction. Nature became part of the architecture. Huge tree roots stretch across walls, wrap around doorways and grow over collapsed galleries. Stone and forest have become so closely connected that separating the two visually is almost impossible.',
        'That atmosphere is what makes Ta Prohm so memorable. Its international fame increased significantly after appearing in the Tomb Raider film, but there is much more here than its connection to cinema.',
        'Ta Prohm helps visitors imagine what parts of Angkor may have looked like when European explorers and researchers began documenting the monuments more extensively. Its partially ruined appearance also gives us an opportunity to think about conservation itself, including the difficult decisions involved in preserving ancient monuments surrounded by a living forest.',
        'It now stands 23rd among Tripadvisor’s Top 25 Attractions in Asia.',
      ]},
      { heading: 'Tuol Sleng Genocide Museum (S-21), Phnom Penh, 20th in Asia', image: { src: images.blogGuide.tuolSleng, caption: 'Tuol Sleng Genocide Museum, Phnom Penh' }, paragraphs: [
        'The fourth Cambodian place on the list tells a very different story. Tuol Sleng Genocide Museum in Phnom Penh is not somewhere we visit because it is beautiful. We visit because remembering this history matters.',
        'The site was originally a school. During the Democratic Kampuchea period, the Khmer Rouge converted the compound into Security Prison 21, better known as S-21. Between 1975 and 1979, it became a secret detention, interrogation and torture centre. Thousands of people were imprisoned there during this period. The classrooms were transformed into cells and interrogation rooms. Prisoners arriving at S-21 were photographed and documented, leaving behind an extraordinary archive that today helps preserve the identities and stories of its victims.',
        'After the fall of the Khmer Rouge regime in 1979, the site became a museum and memorial. Today, visitors can still walk through the former classrooms and cells. Photographs, documents, shackles, personal belongings and paintings by S-21 survivor Vann Nath help explain what happened within these buildings.',
        'It can be a difficult place to visit, and it should be. For Cambodians, Tuol Sleng is part of our recent history. For international visitors, it provides important context for understanding what Cambodia experienced only a few decades ago.',
        'Its recognition as the 20th attraction in Asia is therefore very different from the recognition received by our ancient temples. It demonstrates that travellers are also taking time to understand Cambodia beyond Angkor.',
      ]},
    ],
  },
  'pagodas-of-siem-reap': {
    author: { name: 'Dara Kim', role: 'Culture specialist' },
    intro: 'Long before the tuk-tuks start their engines, a line of saffron robes moves quietly through the streets of Siem Reap. Pagodas are the heart of every Cambodian neighbourhood, and spending a morning inside one reveals a side of the country most visitors never see.',
    sections: [
      { heading: 'The morning alms round', paragraphs: [
        'At first light, novice monks walk barefoot from house to house carrying their bowls. Families wait outside with rice, fruit and small parcels of food, offering them in silence and receiving a blessing in return.',
        'It is a deeply personal moment, not a performance. We watch from a respectful distance and only join in when a local family invites us, which happens more often than you might think.',
      ]},
      { heading: 'Life inside the pagoda walls', paragraphs: [
        'Many young monks come from rural villages, and the pagoda is where they receive an education they might not otherwise have. Between prayers they study Pali, English and mathematics, sweep the courtyards and tend the gardens.',
        'Afternoons are often the best time to talk. Several of the monks we know love to practise their English and are full of questions about where you come from.',
      ]},
      { heading: 'Chanting at dusk', paragraphs: [
        'As the light fades, the monks gather in the main hall for evening chanting. The sound fills the room, steady and hypnotic, while incense drifts past murals of the life of the Buddha.',
        'Sit at the back, feet tucked away from the altar, and simply listen. It is one of the calmest half hours you will spend in Cambodia.',
      ]},
    ],
    quote: { text: 'The pagoda is our school, our community hall and our place of peace. Visitors are always welcome if they come with an open heart.', by: 'A senior monk at Wat Bo' },
    tips: [
      'Remove shoes and hats before entering any temple building.',
      'Women should not touch monks or hand items to them directly; place offerings on a cloth or tray instead.',
      'Never point your feet towards a Buddha image or a monk when sitting.',
    ],
  },
  'phnom-penh-48-hours': {
    author: { name: 'Vanna Sok', role: 'Phnom Penh trip specialist' },
    intro: 'Phnom Penh is loud, warm, chaotic and utterly charming. Cambodia’s capital rewards those who slow down, and two unhurried days are enough to see its golden palaces, bustling markets and riverside sunsets, and to begin to understand its history.',
    sections: [
      { heading: 'Day one: palaces and the riverside', paragraphs: [
        'Start early at the Royal Palace and the Silver Pagoda, whose floor is laid with thousands of silver tiles. The gardens are at their best before the midday heat.',
        'Next door, the National Museum’s terracotta courtyard holds one of the world’s finest collections of Khmer sculpture. As the sun drops, walk Sisowath Quay along the riverfront, where families gather to exercise, picnic and watch the boats.',
      ]},
      { heading: 'Remembering the past', paragraphs: [
        'No visit to Phnom Penh is complete without learning about the Khmer Rouge years. The Tuol Sleng Genocide Museum and the Choeung Ek memorial are difficult places to visit, but they are essential to understanding modern Cambodia.',
        'We always visit with a local guide who can share the context with care, and we leave space in the day afterwards for quiet reflection.',
      ]},
      { heading: 'Day two: markets, food and the Mekong', paragraphs: [
        'Spend the morning at the Art Deco Central Market or the maze-like Russian Market, where you can find silk, silverware and excellent iced coffee.',
        'In the evening, take a sunset cruise where the Tonlé Sap meets the mighty Mekong, then finish with a table of Khmer dishes, including fish amok, beef lok lak and fresh spring rolls, in one of the city’s family-run restaurants.',
      ]},
    ],
    quote: { text: 'To know Phnom Penh, you have to see both its sorrow and its joy. The city has every reason to be sad, and yet it smiles.', by: 'Vanna Sok' },
    tips: [
      'Dress modestly for the Royal Palace: shoulders and knees must be covered.',
      'Use a ride-hailing app for fair, fixed tuk-tuk prices around the city.',
      'The palace closes for lunch, so plan your visit for the morning or mid-afternoon.',
    ],
  },
  'remote-ruins': {
    author: { name: 'Rithy Prak', role: 'Adventure guide' },
    intro: 'Angkor Wat may be the star, but the Khmer Empire built hundreds of temples across Cambodia. Many are still half-hidden in the forest, wrapped in roots and moss, and visited by only a handful of travellers a day.',
    sections: [
      { heading: 'Beng Mealea: the jungle temple', paragraphs: [
        'An hour and a half east of Siem Reap, Beng Mealea is a vast sandstone complex that has been left largely unrestored. Wooden walkways lead you over collapsed galleries, through doorways framed by giant strangler figs.',
        'Arrive early or late in the day and you might hear nothing but birds and the creak of the trees.',
      ]},
      { heading: 'Koh Ker: a forgotten capital', paragraphs: [
        'For a brief period in the 10th century, Koh Ker was the capital of the Khmer Empire. Today its seven-tiered pyramid, Prasat Thom, rises out of the forest like something from another world.',
        'The site is spread out, so we explore by bicycle or tuk-tuk, stopping at small shrines where locals still leave offerings.',
      ]},
      { heading: 'Travelling safely and respectfully', paragraphs: [
        'Remote temples are fragile. Many stones are loose, and some areas are still being surveyed. Stick to the paths and walkways, and resist the urge to climb.',
        'Travelling with a local guide also means your entrance fees and lunches support the villages that look after these sites.',
      ]},
    ],
    quote: { text: 'Out here you see what the explorers saw: temples and forest fighting a slow, beautiful battle.', by: 'Rithy Prak' },
    tips: [
      'Wear sturdy shoes with good grip; walkways can be slippery after rain.',
      'Koh Ker and Beng Mealea need separate tickets from the Angkor Pass.',
      'In remote areas, always stay on marked paths and follow your guide.',
    ],
  },
  'tonle-sap-homestay': {
    author: { name: 'Srey Mom', role: 'Community partnerships' },
    intro: 'The Tonlé Sap is Southeast Asia’s largest freshwater lake, and in the rainy season it can grow to five times its dry-season size. The families who live on and around it have built a life that rises and falls with the water.',
    sections: [
      { heading: 'Arriving by boat', paragraphs: [
        'We leave the paved road behind and continue by long-tail boat, passing stilt houses, floating gardens and children paddling to school in tin basins.',
        'Our hosts, a fishing family who have lived on the lake for generations, greet us with iced tea and a tour of their home, which sits on bamboo pilings almost ten metres high.',
      ]},
      { heading: 'A day on the lake', paragraphs: [
        'In the afternoon we head out with our host to check the fishing nets, then paddle through the flooded forest, where trees stand waist-deep in water and kingfishers flash between the branches.',
        'Back at the house, everyone helps prepare dinner: grilled fish, morning glory with garlic, and rice cooked over a wood fire.',
      ]},
      { heading: 'Why homestays matter', paragraphs: [
        'Overfishing and changing water levels have made life on the lake harder in recent years. Homestays give families a valuable second income while letting them stay in their community.',
        'Every guest night we book goes directly to the family, and part of each trip supports the village school.',
      ]},
    ],
    quote: { text: 'When guests stay with us, my children practise their English and my husband can fish less. It helps our family and our lake.', by: 'Our homestay host in Kampong Phluk' },
    tips: [
      'Bring a head torch, insect repellent and a quick-dry towel.',
      'Facilities are simple: a mattress, mosquito net and shared bathroom.',
      'Water levels change through the year; November to January is the most beautiful time to visit.',
    ],
  },
  'replanting-the-cardamoms': {
    author: { name: 'Bopha Lim', role: 'Conservation lead' },
    intro: 'The Cardamom Mountains in south-west Cambodia are one of the last great rainforests in Southeast Asia, home to elephants, clouded leopards and hundreds of bird species. They are also under pressure, and a small army of rangers and villagers is working to protect them.',
    sections: [
      { heading: 'A forest under pressure', paragraphs: [
        'Logging, land clearing and poaching have taken their toll on parts of the Cardamoms. Without protection, forest that took centuries to grow can disappear in a single season.',
        'Over the past two decades, community rangers and conservation groups have helped turn the tide, with patrols, wildlife monitoring and replanting projects.',
      ]},
      { heading: 'A morning in the nursery', paragraphs: [
        'We join a group of village volunteers at a tree nursery near Chi Phat, where thousands of native seedlings are grown in recycled bags before being planted on cleared land.',
        'Each traveller plants a seedling of their own, and the team records its location so you can follow its progress.',
      ]},
      { heading: 'Tourism that protects', paragraphs: [
        'Community ecotourism gives former hunters and loggers a better way to earn a living, as guides, cooks and homestay hosts.',
        'When you trek with local guides, stay in village guesthouses and pay community fees, you are helping make the forest worth more standing than cut down.',
      ]},
    ],
    quote: { text: 'I used to cut trees for a living. Now I show visitors the forest and help grow it back. My children will know these mountains.', by: 'A community ranger in Chi Phat' },
    tips: [
      'Pack light, breathable layers, a rain jacket and leech socks during the wet season.',
      'Treks range from easy half-days to multi-day hikes; we tailor them to your fitness.',
      'Stay on trails at all times and never buy wildlife products.',
    ],
  },
}
