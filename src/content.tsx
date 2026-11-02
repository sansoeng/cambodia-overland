import { useRef, type ReactNode } from 'react'
import { useFloatingLabel } from './motion'
import { images } from './siteImages'

/* ------------------------------------------------------------------ Tour packages */

export type Tour = { id: string; image: string; type: string; title: ReactNode; price: string; dates: string; days: number }

export const tours: Tour[] = [
  { id: 'discovery', image: images.tours.discovery, type: 'Adventure', title: <>Cambodia Discovery:<br />Temples to Rainforests</>, price: '$1,350', dates: 'Nov 29 – Dec 8, 2026', days: 10 },
  { id: 'photography', image: images.tours.photography, type: 'Photography', title: <>Siem Reap – Photography<br />& Cultural Tour</>, price: '$980', dates: 'Apr 18–24, 2027', days: 7 },
  { id: 'secret-siem-reap', image: images.tours.secretSiemReap, type: 'Active', title: <>Secret Siem Reap: 3-Day Hidden<br />Trails & Remote Ruins</>, price: '$620', dates: 'Jun 6–8, 2027', days: 3 },
  { id: 'tonle-sap', image: images.tours.tonleSap, type: 'Community', title: <>Tonlé Sap: Floating<br />Villages & Homestays</>, price: '$540', dates: 'Jul 11–13, 2027', days: 3 },
  { id: 'phnom-penh', image: images.tours.phnomPenh, type: 'City & Culture', title: <>Phnom Penh & the<br />Mekong Riverside</>, price: '$760', dates: 'Aug 22–26, 2027', days: 5 },
  { id: 'cardamom', image: images.tours.cardamom, type: 'Trekking', title: <>Cardamom Mountains:<br />Rainforest Trek</>, price: '$1,120', dates: 'Oct 3–9, 2027', days: 7 },
]

/* Tengile MalaMala hover: a pill label follows the cursor over the image and slides up from a mask. */
export function TourCard({ tour, showLength = false, datePrefix = 'from ' }: { tour: Tour; showLength?: boolean; datePrefix?: string }) {
  const card = useRef<HTMLAnchorElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  useFloatingLabel(card, label, media)
  return (
    <a className="pillar" href="#/package" ref={card}>
      <div className="pillar__img" ref={media} data-squircle="44">
        <img src={tour.image} alt="" loading="lazy" />
        <div className="pillar__overlay" aria-hidden="true">
          <div className="pillar__label" ref={label}>
            <span className="pill">From {tour.price}</span>
            <span className="pill pill--icon">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </span>
          </div>
        </div>
      </div>
      <div className="pillar__meta">
        <p>{tour.type}{showLength && ` · ${tour.days} days`}</p>
        <h3>{tour.title}</h3>
        <p className="pillar__date">{datePrefix}{tour.dates}</p>
        <span className="sr-only">From {tour.price} per person</span>
      </div>
    </a>
  )
}

/* ------------------------------------------------------------------ Blog */

export type Story = { slug: string; img: string; tag: string; title: string; excerpt: string; date: string; read: number }

export const stories: Story[] = [
  { slug: 'cambodia-travel-guide', img: images.stories[0], tag: 'Travel Guide', title: 'Cambodia Travel Guide: The 4 Iconic Destinations Ranked Among Asia’s Best', excerpt: 'Angkor Wat, Bayon, Ta Prohm and the Tuol Sleng Genocide Museum have been named among Asia’s Top 25 attractions in Tripadvisor’s 2026 Travelers’ Choice Awards. Here is why each one matters.', date: '2025-09-06', read: 7 },
  { slug: 'pagodas-of-siem-reap', img: images.stories[1], tag: 'Culture', title: 'Inside the Pagodas: Daily Life With the Monks of Siem Reap', excerpt: 'Alms rounds, chanting and saffron robes drying in the sun: a morning spent alongside the novice monks of Siem Reap.', date: '2026-02-26', read: 5 },
  { slug: 'phnom-penh-48-hours', img: images.stories[2], tag: 'City Guides', title: '48 Hours in Phnom Penh, From the Royal Palace to the Riverside', excerpt: 'Palaces, markets and riverside sunsets: how to spend two unhurried days in Cambodia’s capital.', date: '2026-02-09', read: 8 },
  { slug: 'remote-ruins', img: images.stories[3], tag: 'Hidden Temples', title: 'Where the Jungle Won: Exploring Remote Ruins Beyond the Crowds', excerpt: 'Beyond the crowds of Angkor, forest-swallowed ruins reward travellers who are willing to venture a little further.', date: '2026-01-21', read: 7 },
  { slug: 'tonle-sap-homestay', img: images.stories[4], tag: 'Community', title: 'A Night on the Water: Homestays of the Tonlé Sap', excerpt: 'Life on the Tonlé Sap rises and falls with the lake. We spent a night with a floating-village family to see it up close.', date: '2026-01-04', read: 6 },
  { slug: 'replanting-the-cardamoms', img: images.stories[5], tag: 'Conservation', title: 'Replanting the Cardamoms, One Seedling at a Time', excerpt: 'Meet the rangers and village volunteers restoring one of Southeast Asia’s last great rainforests.', date: '2025-12-15', read: 5 },
]

export const formatDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/** Here & Away story card: square image (zoom + darken on hover), category, title; the blog page adds an excerpt and date. Links to the article (#/stories/<slug>). */
export function StoryCard({ story, detailed = false, featured = false }: { story: Story; detailed?: boolean; featured?: boolean }) {
  const Title = featured ? 'h2' : 'h3'
  return (
    <a className={`story${featured ? ' story--featured' : ''}`} href={`#/stories/${story.slug}`}>
      <div className="story__media">
        <img src={story.img} alt="" loading={featured ? undefined : 'lazy'} />
      </div>
      <div className="story__body">
        <p className="story__tag">{story.tag}</p>
        <Title className="story__title">{story.title}</Title>
        {detailed && (
          <>
            <p className="story__excerpt">{story.excerpt}</p>
            <p className="story__meta"><time dateTime={story.date}>{formatDate(story.date)}</time> · {story.read} min read</p>
          </>
        )}
      </div>
    </a>
  )
}
