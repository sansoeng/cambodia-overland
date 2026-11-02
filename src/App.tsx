import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PackageDetails from './PackageDetails'
import AboutPage from './AboutPage'
import EthicalTourismPage from './EthicalTourismPage'
import ContactPage from './ContactPage'
import BlogPostPage from './BlogPostPage'
import { PrivacyPage, TermsPage } from './LegalPage'
import { BlogPage, ToursPage } from './ListingPages'
import { TourCard, tours } from './content'
import SiteNav from './SiteNav'
import { HeroLine, useHeroScroll } from './Hero'
import { CarouselArrows, Community, Footer, PillButton, PlanTrip, Purpose, Stories, useCarousel } from './sections'
import { getLenis, lockScroll, scrollToTarget } from './smooth'
import { Reveal, ScrollRevealText, StickyFeatures, usePinRefresh, useSquircles, useTitleReveal, type Feature } from './motion'
import { images } from './siteImages'
import { logoParts as LP } from './logoParts'


const days: Feature[] = [
  { img: images.homePanels[0], alt: 'Angkor Wat temple towers', eyebrow: 'Explore 3 regions', title: 'Culture & History', text: 'Begin where time stands still among ancient stones, flooded forests, and floating villages on Tonle Sap. Every carving tells a millennium-old story of living heritage and hidden temples.' },
  { img: images.homePanels[1], alt: 'Travellers kayaking on a Cambodian lake', eyebrow: 'Explore 3 regions', title: 'Eco-East', text: 'The Mekong greets you with endless life: fishermen, bird-filled trails. Beyond the river, highland forests showcase authentic community conservation.' },
  { img: images.homePanels[2], alt: 'Jungle temple ruins at dusk', eyebrow: 'Explore 3 regions', title: 'Southern Coast & Mountains', text: 'Where emerald peaks meet the sea, unwind along sleepy riverside towns, fragrant pepper plantations, and Kep’s crab markets. Deeper in the Cardamom ridges, secluded jungle waterways await.' },
]

/* Tour packages in a Here & Away-style carousel: arrows in the header step one card at a time. */
function Tours() {
  const { track, edge, step } = useCarousel()
  /* The Bend Club pillars: cards start staggered (140 / 70 / 0px) and settle as you scroll. */
  useLayoutEffect(() => {
    const grid = track.current
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const offsets = [140, 70, 0]
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pillar', grid)
      gsap.set(cards, { y: (i: number) => offsets[i % offsets.length] })
      gsap.to(cards, { y: 0, ease: 'none', scrollTrigger: { trigger: grid, start: 'top 95%', end: 'center 60%', scrub: 0.8, invalidateOnRefresh: true } })
    }, grid)
    return () => ctx.revert()
  }, [track])
  return (
    <section className="packages" id="tours">
      <div className="packages__head">
        <div>
          <Reveal><p className="eyebrow">Tourpackage</p></Reveal>
          <Reveal delay={120}><h2>A travel tour.<br />but a living story.</h2></Reveal>
        </div>
        <CarouselArrows edge={edge} step={step} label="tours" />
      </div>
      <div className="pillars carousel-track" ref={track}>
        {tours.map((tour) => <TourCard key={tour.id} tour={tour} datePrefix="" />)}
      </div>
      <div className="section-more">
        <PillButton href="#/tours">View all tour packages</PillButton>
      </div>
    </section>
  )
}

const heroLines = ['Explore Cambodia,', 'beyond the ordinary']

/**
 * Tengile MalaMala hero: the photo stays pinned (sticky inside a 200%-tall layer) so the page slides up over it,
 * while scrolling pushes the title lines apart (+/-5%) and sinks the copy at half the scroll speed.
 */
function HomeHero() {
  const hero = useRef<HTMLElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const [playing, setPlaying] = useState(false)
  const closePlayer = useCallback(() => setPlaying(false), [])
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  useHeroScroll(hero, copy)
  /* Cursor label: pinned 32px below-right of the pointer while it is over the banner (desktop pointers only). */
  useEffect(() => {
    const el = hero.current
    const lab = label.current
    if (!el || !lab || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e: MouseEvent) => { lab.style.transform = `translate(${e.clientX + 32}px, ${e.clientY + 32}px)` }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseenter', move)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseenter', move) }
  }, [])
  return (
    <header className="hero home-hero" ref={hero}>
      <div className="hero__cover">
        <div className="hero__media">
          <div className="hero__pin">
            <video src={mobile ? images.heroVideo.previewMobile : images.heroVideo.preview} poster={images.hero} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
          </div>
        </div>
      </div>
      <SiteNav />
      <button type="button" className="hero__play" onClick={() => setPlaying(true)} aria-label="Play video"><span>Watch video</span></button>
      <span className="hero__label" ref={label} aria-hidden="true"><span>Play Video</span></span>
      <div className="hero__copy" ref={copy}>
        <h1 aria-label={heroLines.join(' ')}>
          <HeroLine text={heroLines[0]} />
          <HeroLine text={heroLines[1]} className="hero__line2" />
        </h1>
        <div className="hero__desc">
          <p>From jungles and rugged dirt trails to ancient wonders temples, through unforgettable dirt bike path adventures all over Cambodia.</p>
          <PillButton href="#tours" className="hero__btn">Explore tour packages</PillButton>
        </div>
      </div>
      {playing && <VideoPlayer src={mobile ? images.heroVideo.fullMobile : images.heroVideo.full} onClose={closePlayer} />}
    </header>
  )
}

/** Full-screen film player opened from the banner; Esc or the close button returns to the page. */
function VideoPlayer({ src, onClose }: { src: string; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    lockScroll(true)
    close.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey) }
  }, [onClose])
  return (
    <div className="hero-player" role="dialog" aria-modal="true" aria-label="Cambodia Overland film">
      <video src={src} autoPlay controls playsInline />
      <button type="button" className="hero-player__close" ref={close} onClick={onClose}>Close</button>
    </div>
  )
}

function Home() {
  const rootRef = useRef<HTMLElement>(null)
  useSquircles(rootRef)
  usePinRefresh()
  return (
    <main className="home" ref={rootRef} data-bg-root>
      <HomeHero />

      <section className="about" id="about">
        <p className="eyebrow">About us</p>
        <div>
          <ScrollRevealText text="We are a Cambodia Overland is a proudly local tour operator creating authentic adventures and dirt bike journeys. From remote wilderness to ancient history and vibrant local communities, we take you beyond the ordinary to discover the lost spirit of Cambodia." />
          <PillButton href="#/about" className="about__btn">About Us</PillButton>
        </div>
      </section>

      <StickyFeatures features={days} id="overview" />

      <Tours />

      <Community />

      <Purpose />

      <Stories />

      <PlanTrip />

      <Footer />
    </main>
  )
}

const pages: Record<string, ComponentType> = { '#/package': PackageDetails, '#/tours': ToursPage, '#/stories': BlogPage, '#/about': AboutPage, '#/ethical-tourism': EthicalTourismPage, '#/contact': ContactPage, '#/privacy': PrivacyPage, '#/terms': TermsPage }

// Old #/blog links (and #/blog/<slug>) still work: they open the Stories pages.
const normRoute = (hash: string, current: string) => (hash === '' || hash === '#/' ? '#/' : hash.startsWith('#/blog') ? hash.replace('#/blog', '#/stories') : hash.startsWith('#/') ? hash : current)

/** Resolves once the new page's banner photo (or first image) is decoded, or after `max` ms. */
function heroReady(max = 1200) {
  const img = document.querySelector<HTMLImageElement>('.hero__pin img, main img, .pd img')
  if (!img) return Promise.resolve()
  const ready = img.complete ? img.decode().catch(() => {}) : new Promise<void>((res) => { img.addEventListener('load', () => res(), { once: true }); img.addEventListener('error', () => res(), { once: true }) })
  return Promise.race([ready, new Promise<void>((res) => setTimeout(res, max))])
}

/** Blocks wheel, touch and scroll keys during the transition without hiding the scrollbar (so nothing shifts sideways). */
function holdScroll(on: boolean) {
  const lenis = getLenis()
  if (on) lenis?.stop(); else lenis?.start()
  const opts = { passive: false } as const
  const block = (e: Event) => e.preventDefault()
  const keys = (e: KeyboardEvent) => { if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) e.preventDefault() }
  const w = window as Window & { __ptxHold?: () => void }
  w.__ptxHold?.()
  w.__ptxHold = undefined
  if (!on) return
  window.addEventListener('wheel', block, opts)
  window.addEventListener('touchmove', block, opts)
  window.addEventListener('keydown', keys)
  w.__ptxHold = () => { window.removeEventListener('wheel', block); window.removeEventListener('touchmove', block); window.removeEventListener('keydown', keys) }
}

/**
 * Tengile MalaMala page transition: a green panel wipes up over the page with the logo rising in, the next page
 * mounts behind it at the top, then (once its banner photo is ready) the panel wipes off upwards. While covered,
 * the new page's entrance animations are paused (html.is-page-loading) and resume once the panel is ~30% gone.
 * The panel blocks clicks while it is on screen; ScrollTrigger re-measures the new page just before it lifts.
 * While the panel fully covers the screen, the page underneath is hidden (html.ptx-covered), so the browser has
 * nothing heavy to draw behind it and the logo build stays smooth.
 */
export default function App() {
  const [route, setRoute] = useState(() => normRoute(window.location.hash, '#/'))
  const routeRef = useRef(route)
  const overlay = useRef<HTMLDivElement>(null)
  const logo = useRef<SVGSVGElement>(null)
  const busy = useRef(false)
  useEffect(() => {
    const root = document.documentElement
    const swap = (next: string) => { routeRef.current = next; setRoute(next); scrollToTarget(0, true) }
    const reveal = () => {
      const el = overlay.current
      if (!el) return
      // Measure pins and scroll effects while the page is still covered, so nothing jumps once it is uncovered.
      ScrollTrigger.refresh()
      root.classList.remove('ptx-covered')
      // One frame for the new page to paint under the panel, then lift it.
      requestAnimationFrame(() => {
        gsap.to(logo.current, { y: -28, autoAlpha: 0, duration: 0.55, ease: 'power2.in' })
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power2.inOut',
          onUpdate() { if (this.progress() >= 0.3) root.classList.remove('is-page-loading') },
          onComplete: () => {
            root.classList.remove('is-page-loading')
            gsap.set(el, { visibility: 'hidden', pointerEvents: 'none', clipPath: 'inset(100% 0% 0% 0%)' })
            holdScroll(false)
            busy.current = false
            // A link clicked by browser history while we were busy: catch up now.
            if (normRoute(window.location.hash, routeRef.current) !== routeRef.current) on()
          },
        })
      })
    }
    const on = () => {
      const next = normRoute(window.location.hash, routeRef.current)
      if (next === routeRef.current || busy.current) return
      const el = overlay.current, mark = logo.current
      if (!el || !mark || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return swap(next)
      busy.current = true
      holdScroll(true)
      gsap.killTweensOf([el, mark])
      gsap.set(el, { visibility: 'visible', pointerEvents: 'auto', clipPath: 'inset(100% 0% 0% 0%)' })
      // Cinematic logo build: the mountain rises from below the horizon on a long ease,
      // then the sun comes up behind the mountain on a gentle arc, warming from ember to orange inside a soft glow
      // that blooms and fades. Then the letters of "Cambodia" / "verland" rise into place.
      const q = gsap.utils.selector(mark)
      const l1 = q('.ptx__l1'), l2 = q('.ptx__l2'), peak = q('.ptx__mountain')
      const sunrise = q('.ptx__sunrise'), sun = q('.ptx__sun'), glow = q('.ptx__glow')
      gsap.killTweensOf([mark, ...l1, ...l2, ...peak, ...sunrise, ...sun, ...glow])
      gsap.set(mark, { autoAlpha: 1, y: 0 })
      gsap.set([...l1, ...l2], { y: 90 })   // each letter starts fully below its line
      gsap.set(peak, { y: 108 })            // mountain below the horizon
      gsap.set(sunrise, { x: -12, y: 86 })  // sun below the horizon, a little to the left (it rises on an arc)
      gsap.set(sun, { fill: LP.colors.dawn })
      gsap.set(glow, { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' })
      gsap.timeline({
        onComplete: () => {
          root.classList.add('is-page-loading')
          swap(normRoute(window.location.hash, routeRef.current))
          // Let the new page mount, then wait for its banner photo before lifting the panel.
          requestAnimationFrame(() => requestAnimationFrame(() => { heroReady().then(reveal) }))
        },
      })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' }, 0)
        // Fully covered: hide the page underneath so only the panel and logo are drawn during the build.
        .call(() => root.classList.add('ptx-covered'), undefined, 0.8)
        .to(peak, { y: 0, duration: 0.9, ease: 'expo.out' }, 0.36)
        .to(sunrise, { y: 0, duration: 1.05, ease: 'power3.out' }, 0.5)
        .to(sunrise, { x: 0, duration: 1.05, ease: 'sine.out' }, 0.5)
        .to(sun, { fill: LP.colors.sun, duration: 0.9, ease: 'power1.inOut' }, 0.5)
        .to(glow, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.62)
        .to(glow, { autoAlpha: 0, scale: 1.25, duration: 0.45, ease: 'power1.in' }, 1.15)
        .to(l1, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03 }, 0.66)
        .to(l2, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03 }, 0.78)
        .to({}, { duration: 0.08 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useTitleReveal(route)
  // Story articles live at #/stories/<slug>.
  const Page = route.startsWith('#/stories/') ? null : pages[route] ?? Home
  return (
    <>
      {Page ? <Page key={route} /> : <BlogPostPage key={route} slug={decodeURIComponent(route.slice('#/stories/'.length))} />}
      <div className="ptx" ref={overlay} aria-hidden="true">
        {/* Logo built from separate pieces (src/logoParts.ts) so the transition can animate it. Static masks:
            the letters rise inside their own line, the sun and mountain rise from behind the horizon. */}
        <svg ref={logo} className="ptx__logo" viewBox={LP.viewBox} fill="none">
          <defs>
            <clipPath id="ptx-c1"><rect x={-10} y={-10} width={LP.width + 20} height={LP.line1Bottom + 10} /></clipPath>
            <clipPath id="ptx-c2"><rect x={-10} y={LP.line2Top} width={LP.width + 20} height={LP.height - LP.line2Top + 10} /></clipPath>
            <clipPath id="ptx-cs"><rect x={-60} y={-60} width={LP.width + 120} height={LP.horizon + 60} /></clipPath>
            <clipPath id="ptx-cm"><rect x={-10} y={-10} width={LP.width + 20} height={LP.height + 12} /></clipPath>
            <clipPath id="ptx-mtn"><path d={LP.mountain.body} /></clipPath>
            {/* Soft sunrise glow (a radial fade, no blur filter, so it stays smooth while animating). */}
            <radialGradient id="ptx-glow">
              <stop offset="0" stopColor={LP.colors.sun} stopOpacity={0.55} />
              <stop offset="0.45" stopColor={LP.colors.sun} stopOpacity={0.22} />
              <stop offset="1" stopColor={LP.colors.sun} stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* Glow behind the lettering; it rises with the sun (both carry .ptx__sunrise). */}
          <g clipPath="url(#ptx-cs)">
            <g className="ptx__sunrise">
              <circle className="ptx__glow" cx={LP.sunCenter.x} cy={LP.sunCenter.y} r={LP.sunCenter.r * 2.4} fill="url(#ptx-glow)" />
            </g>
          </g>
          <g clipPath="url(#ptx-c1)">{LP.line1.map((d) => <path key={d} className="ptx__l1" fill="currentColor" d={d} />)}</g>
          <g clipPath="url(#ptx-c2)">{LP.line2.map((d) => <path key={d} className="ptx__l2" fill="currentColor" d={d} />)}</g>
          <g clipPath="url(#ptx-cs)">
            <g className="ptx__sunrise">
              <path className="ptx__sun" fill={LP.colors.sun} d={LP.sun} />
            </g>
          </g>
          <g clipPath="url(#ptx-cm)">
            <g className="ptx__mountain">
              <path fill="#fff" d={LP.mountain.body} />
              <g clipPath="url(#ptx-mtn)">
                {LP.mountain.planes.map((d) => <path key={d} fill={LP.colors.dark} d={d} />)}
                <path stroke="#fff" strokeWidth={LP.mountain.rim} strokeLinejoin="round" d={LP.mountain.body} />
              </g>
              <path stroke={LP.colors.dark} strokeWidth={LP.mountain.outline} strokeLinejoin="round" d={LP.mountain.body} />
            </g>
          </g>
        </svg>
      </div>
    </>
  )
}
