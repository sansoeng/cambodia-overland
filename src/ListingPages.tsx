import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteNav from './SiteNav'
import { PageHero, WordTitle } from './Hero'
import { images } from './siteImages'
import { Footer } from './sections'
import { Reveal, ScrollRevealText, usePinRefresh, useSquircles } from './motion'
import { StoryCard, TourCard, allTours, stories, type TourStyle } from './content'

function useListingPage() {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()
  return root
}

const styles: { label: string; style: TourStyle | null }[] = [
  { label: 'All tours', style: null },
  { label: 'Group tours', style: 'group' },
  { label: 'Dirt bike tours', style: 'dirt-bike' },
  { label: 'Day tours', style: 'day' },
]

const lengths = [
  { label: 'All', test: () => true },
  { label: 'Up to 5 days', test: (d: number) => d <= 5 },
  { label: '6–9 days', test: (d: number) => d >= 6 && d <= 9 },
  { label: '10+ days', test: (d: number) => d >= 10 },
]

/** #/tours — every tour package in a grid, filterable by tour type and trip length (both apply together). */
export function ToursPage() {
  const root = useListingPage()
  const [style, setStyle] = useState(0)
  const [filter, setFilter] = useState(0)
  const shown = allTours.filter((t) => (styles[style].style === null || t.style === styles[style].style) && lengths[filter].test(t.days))
  // The footer reveal is scroll-driven, so re-measure once the grid height changes.
  useEffect(() => { ScrollTrigger.refresh() }, [style, filter])

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
          <div className="listing__filter-groups">
            <div className="listing__filters" role="group" aria-label="Filter by tour type">
              {styles.map((st, i) => (
                <button key={st.label} type="button" className="listing__filter" aria-pressed={style === i} onClick={() => setStyle(i)}>{st.label}</button>
              ))}
            </div>
            <div className="listing__filters" role="group" aria-label="Filter by trip length">
              {lengths.map((l, i) => (
                <button key={l.label} type="button" className="listing__filter" aria-pressed={filter === i} onClick={() => setFilter(i)}>{i === 0 ? 'Any length' : l.label}</button>
              ))}
            </div>
          </div>
          <p className="listing__count" aria-live="polite">{shown.length} {shown.length === 1 ? 'package' : 'packages'}</p>
        </div>
        <div className="listing__grid">
          {shown.map((tour, i) => (
            <Reveal key={tour.id} delay={(i % 3) * 80}><TourCard tour={tour} showLength /></Reveal>
          ))}
        </div>
        {shown.length === 0 && (
          <p className="listing__empty">No packages match these filters yet. <button type="button" onClick={() => { setStyle(0); setFilter(0) }}>Show all tours</button></p>
        )}
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
