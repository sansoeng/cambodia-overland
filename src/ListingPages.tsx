import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteNav from './SiteNav'
import { PageHero, WordTitle } from './Hero'
import { images } from './siteImages'
import { Footer } from './sections'
import { Reveal, ScrollRevealText, usePinRefresh, useSquircles } from './motion'
import { StoryCard, TourCard, stories, tours } from './content'

function useListingPage() {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()
  return root
}

const lengths = [
  { label: 'All', test: () => true },
  { label: 'Up to 5 days', test: (d: number) => d <= 5 },
  { label: '6–9 days', test: (d: number) => d >= 6 && d <= 9 },
  { label: '10+ days', test: (d: number) => d >= 10 },
]

/** #/tours — every tour package in a grid, filterable by trip length. */
export function ToursPage() {
  const root = useListingPage()
  const [filter, setFilter] = useState(0)
  const shown = tours.filter((t) => lengths[filter].test(t.days))
  // The footer reveal is scroll-driven, so re-measure once the grid height changes.
  useEffect(() => { ScrollTrigger.refresh() }, [filter])

  return (
    <div className="listing" ref={root} data-bg-root>
      <PageHero img={images.toursPage.hero} alt="Temples of Angkor in the forest" lines={['Journeys across', 'Cambodia']} intro="Small-group trips from three days to two weeks, planned and guided by our local team." />
      <main>
        <section className="about listing__about" aria-label="About our tour packages">
          <p className="eyebrow">Our tour packages</p>
          <div>
            <ScrollRevealText text="Every journey is planned and guided by our own Siem Reap team: small groups, local homestays and quiet trails, from ancient temples to the Cardamom rainforest and the coast." />
          </div>
        </section>
        <div className="listing__bar">
          <div className="listing__filters" role="group" aria-label="Filter by trip length">
            {lengths.map((l, i) => (
              <button key={l.label} type="button" className="listing__filter" aria-pressed={filter === i} onClick={() => setFilter(i)}>{l.label}</button>
            ))}
          </div>
          <p className="listing__count" aria-live="polite">{shown.length} {shown.length === 1 ? 'package' : 'packages'}</p>
        </div>
        <div className="listing__grid">
          {shown.map((tour, i) => (
            <Reveal key={tour.id} delay={(i % 3) * 80}><TourCard tour={tour} showLength /></Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

/** #/stories — the latest story featured large, then every other story in a grid. */
export function BlogPage() {
  const root = useListingPage()
  const [featured, ...rest] = stories
  return (
    <div className="listing" ref={root} data-bg-root>
      <SiteNav tone="dark" />
      <main>
        <WordTitle word="Stories" />
        <Reveal className="listing__featured"><StoryCard story={featured} detailed featured /></Reveal>
        <div className="listing__bar">
          <h2 className="listing__sub">More stories</h2>
          <p className="listing__count">{rest.length} articles</p>
        </div>
        <div className="listing__grid">
          {rest.map((story, i) => (
            <Reveal key={story.title} delay={(i % 3) * 80}><StoryCard story={story} detailed /></Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
