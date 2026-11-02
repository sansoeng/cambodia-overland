import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PageHero } from './Hero'
import { Footer, PillButton, PlanTrip } from './sections'
import { Reveal, ScrollRevealText, StickyFeatures, usePinRefresh, useSquircles, type Feature } from './motion'
import { images } from './siteImages'

const stats = [
  { value: 12, suffix: '+', label: 'Years guiding travellers across Cambodia' },
  { value: 40, suffix: '', label: 'Local guides, drivers and trip specialists' },
  { value: 25, suffix: '', label: 'Partner villages and family homestays' },
]

/** Counts from 0 to `to` the first time it scrolls into view (instant with reduced motion). */
function CountUp({ to, suffix = '', delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return }
    let raf = 0, timer = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      timer = window.setTimeout(() => {
        const start = performance.now(), dur = 1800
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          setN(Math.round(to * (1 - Math.pow(1 - t, 4)))) // ease-out quart
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }, delay)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [to, delay])
  return (
    <strong ref={ref} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">{n}{suffix}</span>
    </strong>
  )
}

const values: Feature[] = [
  { img: images.about.values[0], alt: 'Two children with bicycles on a village road', eyebrow: 'What we believe', title: 'Local first.', text: 'Every guide, driver and host we work with is Cambodian. They lead the way, set the pace and share the stories only locals know.' },
  { img: images.about.values[1], alt: 'Stilt homes and boats along the Tonlé Sap', eyebrow: 'What we believe', title: 'Travel slowly.', text: 'We leave room in every day for long lunches, quiet temples and unplanned conversations, because that is where the best moments happen.' },
  { img: images.about.values[2], alt: 'Rainforest hills of the Cardamom Mountains', eyebrow: 'What we believe', title: 'Leave it better.', text: 'A share of every booking supports village schools, forest protection in the Cardamoms and the families who welcome us into their homes.' },
]

/* Placeholder team: replace names, roles and intros with your own people (photos live in siteImages.ts → about.team). */
const team = [
  { name: 'Sokha Chan', role: 'Founder & lead guide', intro: 'Grew up in a village outside Siem Reap and began guiding at Angkor as a teenager. Twelve years on, he still knows the quietest path to every temple.' },
  { name: 'Sreymom Kim', role: 'Trip specialist', intro: 'Plans every route and answers every message herself. She knows each homestay family by name, and exactly which dishes to ask them for.' },
  { name: 'Dara Pich', role: 'Driver & dirt-bike guide', intro: 'Knows the red-dirt back roads to the Cardamom Mountains better than any map, and keeps every bike and van running perfectly.' },
  { name: 'Channary Ouk', role: 'Community & homestays', intro: 'Works with our partner villages so every visit is fair and welcome, from school mornings to evening meals with host families.' },
].map((m, i) => ({ ...m, img: images.about.team[i] }))

/**
 * Telha Clarke "Meet the team": a column of large names beside a portrait. The section pins while you scroll and
 * steps through the team — the active name turns dark and the portrait, role and short intro crossfade to that
 * person (hovering a name on desktop also selects it).
 */
function TeamList() {
  const [active, setActive] = useState(0)
  const section = useRef<HTMLElement>(null)
  // Layout effect + refreshPriority: the pin must be measured before every trigger further down the page
  // (statement reveal, What we believe pin, Plan a trip, footer); otherwise they all fire one pin-length early.
  useLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const n = team.length
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.6 * (n - 1)}`,
        pin: true,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onUpdate: (st) => setActive(Math.min(n - 1, Math.floor(st.progress * n))),
      })
    }, el)
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])
  return (
    <section className="ab__team" ref={section} aria-labelledby="ab-team-title">
      <h2 className="ab__team-label" id="ab-team-title">Meet the team</h2>
      <Reveal className="ab__team-names">
        <ul>
          {team.map((m, i) => (
            <li key={m.name} className={i === active ? 'is-active' : undefined} onMouseEnter={() => setActive(i)}>
              {m.name}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className="ab__team-media" delay={120}>
        <div className="ab__team-photo" data-squircle="34" aria-hidden="true">
          {/* Loaded up front (not lazy): the hidden, stacked crossfade images inside the clipped, pinned frame made
              lazy-loading thrash and freeze the page; preloading also keeps the swap instant. */}
          {team.map((m, i) => <img key={m.name} src={m.img} alt="" decoding="async" className={i === active ? 'is-active' : undefined} />)}
        </div>
        <div className="ab__team-roles" aria-live="polite">
          {team.map((m, i) => <span key={m.name} className={i === active ? 'is-active' : undefined} aria-hidden={i !== active}>{m.role}</span>)}
        </div>
      </Reveal>
      <div className="ab__team-intro">
        {team.map((m, i) => <p key={m.name} className={i === active ? 'is-active' : undefined} aria-hidden={i !== active}>{m.intro}</p>)}
      </div>
    </section>
  )
}

/* Placeholder licences and partners: confirm each one (or swap in your own) before going live. Logos live in
   siteImages.ts → about.partners; `mark` is the text shown until a logo is added. */
const partners = [
  { name: 'Ministry of Tourism, Cambodia', mark: 'Ministry of Tourism' },
  { name: 'Cambodia Association of Travel Agents', mark: 'CATA' },
  { name: 'Tripadvisor', mark: 'Tripadvisor' },
  { name: 'Village schools, Siem Reap', mark: 'Village Schools' },
  { name: 'Cardamom forest rangers', mark: 'Cardamom Rangers' },
  { name: 'Homestay families', mark: 'Homestay Families' },
].map((p, i) => ({ ...p, logo: images.about.partners[i] }))

/**
 * #/about — built from the home page's language: scroll-reveal story, numbers, meet the team, pinned values,
 * travel-with-integrity highlight, licences & partners and plan-a-trip.
 */
export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()

  return (
    <div className="ab" ref={root} data-bg-root>
      <PageHero img={images.about.hero} alt="Monks in saffron robes at Angkor" lines={['Meet about the', 'Cambodia Overland']} intro="A small Siem Reap team of guides, drivers and trip specialists, planning every journey ourselves." />

      <main>
        <section className="about" aria-label="Our story">
          <p className="eyebrow">Our story</p>
          <div>
            <ScrollRevealText text="It started with a guide, a tuk-tuk and a simple idea: the best way to see Cambodia is with the people who call it home." />
            <div className="ab__cols">
              <Reveal><p>Our founder grew up in a village outside Siem Reap and began guiding at the temples of Angkor as a teenager. Travellers kept asking to see more: the countryside, the markets, the families behind the food. So he started showing them.</p></Reveal>
              <Reveal delay={100}><p>Today we are a close team of guides, drivers and trip specialists, still based in Siem Reap. We plan every trip ourselves, travel every route we sell, and stay with you from the first message to the ride back to the airport.</p></Reveal>
            </div>
            <PillButton href="#/tours" className="about__btn">Explore our tours</PillButton>
          </div>
        </section>

        <Reveal className="ab__stats">
          {stats.map((s, i) => (
            <div className="ab__stat" key={s.label} style={{ '--i': i } as CSSProperties}>
              <CountUp to={s.value} suffix={s.suffix} delay={i * 150} />
              <span>{s.label}</span>
            </div>
          ))}
        </Reveal>

        <TeamList />

        {/* Tengile MalaMala "reveal text" statement: very large type, words filling in as you scroll. */}
        <section className="ab__purpose" aria-label="Our purpose">
          <ScrollRevealText className="ab__purpose-text" text="Our purpose extends beyond the temples, it’s about people, and the living heritage of the warm-hearted Khmer." />
        </section>

        <StickyFeatures features={values} />

        <section className="ab__integrity" aria-labelledby="ab-integrity-title">
          <div className="ab__integrity-box">
            <Reveal className="ab__integrity-img">
              <img src={images.about.responsible} alt="Farmers planting rice in a green Cambodian paddy field" loading="lazy" />
            </Reveal>
            <div className="ab__integrity-copy">
              <Reveal delay={120}><h2 id="ab-integrity-title">Travel intergrity</h2></Reveal>
              <Reveal delay={200}><p>We are guests in Cambodia&apos;s temples, forests and villages. Fair pay for local teams, no animal or orphanage tourism, and a lighter footprint on every trip. Here is how we travel, and how you can too.</p></Reveal>
              <Reveal delay={280}><PillButton href="#/ethical-tourism">See more</PillButton></Reveal>
            </div>
          </div>
        </section>

        <section className="ab__partners" aria-labelledby="ab-partners-title">
          <div className="ab__resp-head">
            <div>
              <Reveal><p className="eyebrow">Licences &amp; partners</p></Reveal>
              <Reveal delay={120}><h2 id="ab-partners-title">Licensed, trusted and<br />locally connected.</h2></Reveal>
            </div>
            <Reveal delay={200}><p>We are a registered Cambodian tour operator, working alongside the schools, rangers and families who make every trip possible.</p></Reveal>
          </div>
          <div className="ab__partners-grid">
            {partners.map((p, i) => (
              <Reveal className="ab__partner" key={p.name} delay={(i % 6) * 60}>
                {p.logo
                  ? <img src={p.logo} alt={p.name} loading="lazy" />
                  : <span className="ab__partner-mark" title={p.name}>{p.mark}</span>}
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
