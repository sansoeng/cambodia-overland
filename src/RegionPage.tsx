import { useRef } from 'react'
import { PageHero } from './Hero'
import { Footer, PillButton, PlanTrip } from './sections'
import { Reveal, ScrollRevealText, StickyFeatures, usePinRefresh, useSquircles } from './motion'
import { TourCard, allTours } from './content'
import { regionBySlug, regions } from './regions'

/**
 * #/regions/<slug> — one page per region from the homepage "Explore 3 regions" section, built from the same pieces
 * as the other pages: photo banner, scroll-reveal story, key facts, pinned highlights, tours in the region,
 * the other regions, and Plan a trip.
 */
export default function RegionPage({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()
  const region = regionBySlug(slug) ?? regions[0]
  const tours = region.tours.map((id) => allTours.find((t) => t.id === id)).filter((t) => t !== undefined)
  const others = regions.filter((r) => r.slug !== region.slug)

  return (
    <div className="ab rg" ref={root} data-bg-root>
      <PageHero img={region.hero} alt={region.heroAlt} lines={region.lines} intro={region.intro} button={{ href: '#rg-tours', label: 'See tours in this region' }} />

      <main>
        <section className="about" aria-label={`About ${region.name}`}>
          <p className="eyebrow">{region.name}</p>
          <div>
            <ScrollRevealText text={region.statement} />
            <div className="ab__cols">
              <Reveal><p>{region.paragraphs[0]}</p></Reveal>
              <Reveal delay={100}><p>{region.paragraphs[1]}</p></Reveal>
            </div>
          </div>
        </section>

        <Reveal className="rg__facts">
          <dl>
            {region.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <StickyFeatures features={region.highlights} />

        <section className="rg__tours" id="rg-tours" aria-labelledby="rg-tours-title">
          <div className="listing__bar">
            <h2 className="listing__sub" id="rg-tours-title">Tours in {region.name}</h2>
            <p className="listing__count">{tours.length} {tours.length === 1 ? 'package' : 'packages'}</p>
          </div>
          <div className="listing__grid">
            {tours.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 80}><TourCard tour={tour} showLength /></Reveal>
            ))}
          </div>
          <div className="rg__more"><PillButton href="#/tours">View all tour packages</PillButton></div>
        </section>

        <section className="rg__others" aria-labelledby="rg-others-title">
          <div className="listing__bar">
            <h2 className="listing__sub" id="rg-others-title">Explore the other regions</h2>
          </div>
          <div className="rg__others-grid">
            {others.map((r, i) => (
              <Reveal key={r.slug} delay={i * 90}>
                <a className="rg__region" href={`#/regions/${r.slug}`}>
                  <div className="rg__region-img" data-squircle="34"><img src={r.hero} alt="" loading="lazy" /></div>
                  <div className="rg__region-copy">
                    <h3>{r.name}</h3>
                    <p>{r.card}</p>
                    <span className="rg__region-link">Explore region <span aria-hidden="true">→</span></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <PlanTrip />
      </main>
      <Footer />
    </div>
  )
}
