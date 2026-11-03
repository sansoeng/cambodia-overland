import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reveal } from './motion'
import { goTo, scrollToTarget, type NavItem } from './smooth'
import { primaryNav, secondaryNav, socials } from './SiteNav'
import { images } from './siteImages'
import { StoryCard, stories } from './content'

gsap.registerPlugin(ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Arrow = ({ dir = 'right' }: { dir?: 'left' | 'right' | 'up' }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ transform: dir === 'left' ? 'rotate(180deg)' : dir === 'up' ? 'rotate(-90deg)' : undefined }}>
    <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

/** Tengile MalaMala split button: label block + square icon block, both darken on hover. */
export function PillButton({ href, children, tone = 'light', onClick, className = '' }: { href: string; children: ReactNode; tone?: 'light' | 'cream'; onClick?: (e: MouseEvent) => void; className?: string }) {
  return (
    <a className={`btn-split is-${tone} ${className}`.trim()} href={href} onClick={onClick}>
      <span className="btn-split__label">{children}</span>
      <span className="btn-split__icon"><Arrow /></span>
    </a>
  )
}

const sectionLink = (item: NavItem) => (e: MouseEvent) => { e.preventDefault(); goTo(item) }

/* ------------------------------------------------------------------ Community */

const cloud = [
  { src: images.community[0], alt: 'Two girls with bicycles on a village road in rural Cambodia' },
  { src: images.community[1], alt: 'Stilt homes and boats along a river on the Tonlé Sap' },
  { src: images.community[2], alt: 'Green rice paddies and sugar palms in the Cambodian countryside' },
  { src: images.community[3], alt: 'Brightly painted stilt houses in a Cambodian fishing village' },
  { src: images.community[4], alt: 'Sugar palms and forested hills in the Cardamom Mountains' },
  { src: images.community[5], alt: 'Pink sandstone shrine at Banteay Srei' },
]

/* The six resting angles of Tengile's conservation image cloud. */
const ANGLES = [325, 253, 220, 140, 68, 35]

/**
 * Tengile MalaMala "Conservation" cloud, retold for Cambodia: six images burst out from behind the
 * centred copy along an ellipse (clip-path reveal, ~2s) and then drift slowly around it. The burst resets whenever
 * the section leaves the screen (either direction), so it replays every time the section scrolls back into view.
 */
export function Community() {
  const section = useRef<HTMLElement>(null)
  const box = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const sec = section.current
    const area = box.current
    if (!sec || !area) return
    const still = reduced()
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('.community__media', area)
      const progress = { value: 0 }
      let visible = false
      const items = els.map((el, i) => ({ el, angle: (ANGLES[i] * Math.PI) / 180, rx: 0, ry: 0, drift: 0 }))
      const measure = () => items.forEach((it) => {
        it.rx = area.offsetWidth / 2 - it.el.offsetWidth / 2
        it.ry = area.offsetHeight / 2 - it.el.offsetHeight / 2
      })
      measure()
      const ro = new ResizeObserver(measure)
      ro.observe(area)
      gsap.set(els, { xPercent: -50, yPercent: -50, clipPath: 'inset(100% round 24px)' })
      const intro = gsap.to(progress, { value: 1, duration: still ? 0.01 : 2, ease: 'power3.out', paused: true })
      const reset = () => {
        intro.pause(0)
        items.forEach((it) => { it.drift = 0 })
        gsap.set(els, { x: 0, y: 0, clipPath: 'inset(100% round 24px)' })
      }
      ScrollTrigger.create({
        trigger: sec,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (st) => { visible = st.isActive },
        onEnter: () => intro.restart(),
        onEnterBack: () => intro.restart(),
        onLeave: reset,
        onLeaveBack: reset,
      })
      const tick = () => {
        const v = progress.value
        if (!visible || v === 0) return
        for (const it of items) {
          if (!still) it.drift += 0.0006 * gsap.ticker.deltaRatio(60) * v
          const a = it.angle * v + it.drift
          gsap.set(it.el, { x: Math.cos(a) * it.rx * v, y: Math.sin(a) * it.ry * v, clipPath: `inset(${100 - 100 * v}% round 24px)` })
        }
      }
      gsap.ticker.add(tick)
      return () => { gsap.ticker.remove(tick); ro.disconnect() }
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section className="community" id="community" ref={section}>
      <div className="community__expander">
        <div className="community__cloud" ref={box} aria-hidden="true">
          {cloud.map((img) => (
            <div className="community__media" key={img.src}><img src={img.src} alt="" loading="lazy" /></div>
          ))}
        </div>
      </div>
      <div className="community__content">
        <p className="community__eyebrow">Community &amp; Conservation</p>
        <h2>Travel That<br />Gives Back</h2>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Our purpose (community marquee) */

const purposePhotos = [
  'A woman carrying two baskets along a Cambodian street',
  'A group of young Cambodian children standing together',
  'A market vendor sitting beside her tray of vegetables',
  'Villagers gathered together in Cambodia',
  'A man selling coconuts under a market umbrella',
  'A farmer in a wide-brimmed hat in rural Cambodia',
].map((alt, i) => ({ src: images.purpose[i], alt }))

/** Tengile MalaMala's "Community" marquee: label and statement, then a slow, endlessly looping row of photos. */
export function Purpose() {
  return (
    <section className="purpose" aria-label="Our purpose">
      <div className="purpose__container">
        <Reveal>
          <h2>Our purpose extends beyond the temples – it&rsquo;s about people. We work hand-in-hand with village families, local guides and community-based tourism partners across Cambodia to create lasting social and economic impact.</h2>
        </Reveal>
        <Reveal className="purpose__btn" delay={120}><PillButton href="#/ethical-tourism">Travel with integrity</PillButton></Reveal>
      </div>
      <div className="purpose__marquee">
        <div className="purpose__track">
          {[0, 1].map((copy) =>
            purposePhotos.map((p) => (
              <div className="purpose__media" key={`${copy}-${p.src}`} aria-hidden={copy === 1 || undefined}>
                <img src={p.src} alt={copy === 0 ? p.alt : ''} loading="lazy" draggable={false} data-squircle="34" />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Latest Stories */

/** Here & Away carousel behaviour: snap-scrolling track, arrows step one card and disable at either end. */
export function useCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', update); ro.disconnect() }
  }, [])

  /* Drag to swipe with a mouse (touch already scrolls natively); release flings and snaps to a card. */
  useEffect(() => {
    const el = track.current
    if (!el) return
    let down = false
    let moved = false
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let lastT = 0
    let v = 0
    let t = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true
      moved = false
      startX = lastX = e.clientX
      lastT = e.timeStamp
      startLeft = el.scrollLeft
      v = 0
      clearTimeout(t)
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 5) { moved = true; el.classList.add('is-dragging') }
      if (!moved) return
      e.preventDefault()
      el.scrollLeft = startLeft - dx
      const dt = e.timeStamp - lastT
      if (dt > 0) v = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * v
      lastX = e.clientX
      lastT = e.timeStamp
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      down = false
      if (!moved) return
      if (e.timeStamp - lastT > 100) v = 0
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
      const base = el.getBoundingClientRect().left
      const projected = el.scrollLeft - v * 250
      let best = el.scrollLeft
      let dist = Infinity
      for (const child of Array.from(el.children)) {
        const pos = child.getBoundingClientRect().left - base + el.scrollLeft - pad
        if (Math.abs(pos - projected) < dist) { dist = Math.abs(pos - projected); best = pos }
      }
      el.scrollTo({ left: Math.max(0, Math.min(best, el.scrollWidth - el.clientWidth)), behavior: reduced() ? 'auto' : 'smooth' })
      t = window.setTimeout(() => el.classList.remove('is-dragging'), 600)
      // The click that follows a drag must not open a card.
      window.setTimeout(() => { moved = false }, 0)
    }
    const onClick = (e: Event) => { if (moved) { e.preventDefault(); e.stopPropagation() } }
    const onDragStart = (e: Event) => e.preventDefault()
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    el.addEventListener('dragstart', onDragStart)
    return () => {
      clearTimeout(t)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  const step = (dir: number) => {
    const el = track.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduced() ? 'auto' : 'smooth' })
  }

  return { track, edge, step }
}

export function CarouselArrows({ edge, step, label }: { edge: { start: boolean; end: boolean }; step: (dir: number) => void; label: string }) {
  return (
    <div className="carousel-arrows">
      <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><Arrow dir="left" /></button>
      <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={`Next ${label}`}><Arrow /></button>
    </div>
  )
}

/**
 * Here & Away "Latest Stories": header with prev/next arrows over a horizontal, snap-scrolling
 * carousel of square image cards (zoom + darken on hover, category label, title).
 */
export function Stories() {
  const { track, edge, step } = useCarousel()

  return (
    <section className="stories" id="stories" aria-labelledby="stories-title">
      <div className="stories__head">
        <Reveal><h2 id="stories-title">Stories</h2></Reveal>
        <CarouselArrows edge={edge} step={step} label="stories" />
      </div>
      <div className="carousel-track" ref={track}>
        {stories.map((s) => <StoryCard key={s.title} story={s} />)}
      </div>
      <div className="section-more">
        <PillButton href="#/stories">View all stories</PillButton>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Plan your trip */

/** Tengile MalaMala full-bleed "Plan a trip" cover: a short text-only introduction over a parallax image and dark bottom gradient. */
export function PlanTrip() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const sec = ref.current
    if (!sec || reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.plan__cover img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, sec)
    return () => ctx.revert()
  }, [])
  return (
    <section className="plan" id="plan" ref={ref} aria-label="Plan a trip">
      <div className="plan__expander">
        <div className="plan__container">
          <div className="plan__content">
            <Reveal><p className="plan__text">Our Siem Reap–based travel specialists craft every journey with care, shaping seamless experiences from the first conversation to your return home.</p></Reveal>
          </div>
        </div>
        <div className="plan__cover" aria-hidden="true">
          <img src={images.planCover} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  )
}


/* ------------------------------------------------------------------ Footer */

/** Live Siem Reap clock, e.g. "14:32:07 (GMT+7)", ticking every second (Neutomni's "our local time"). */
function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const tz = 'Asia/Phnom_Penh'
  const time = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const offset = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value.replace('UTC', 'GMT') ?? 'GMT+7'
  return (
    <p className="footer__time">
      <span>Local time in Siem Reap</span>
      <time dateTime={now.toISOString()}>{time} ({offset})</time>
    </p>
  )
}

/** Brand wordmark scaled so it spans the footer edge to edge. */
function Wordmark({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = box.current
    const w = word.current
    if (!el || !w) return
    const fit = () => {
      w.style.fontSize = '100px'
      const width = w.getBoundingClientRect().width
      if (width) w.style.fontSize = `${(100 * el.clientWidth) / width}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return <div className="footer__wordmark" ref={box} aria-hidden="true"><span ref={word}>{text}</span></div>
}

/**
 * Neutomni-style footer: solid brand block with the live Siem Reap time and plain link lists,
 * a full-width wordmark at the bottom, and a dark shade that lifts as the footer is revealed.
 */
/* Footer links: the main pages and company pages in one list (no in-page Community / Our Story / Plan Your Trip anchors). */
const footerNav = [...primaryNav, ...secondaryNav].filter((item) => !['Community', 'Our Story', 'Plan Your Trip'].includes(item.label))

export function Footer() {
  const footer = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = footer.current
    const content = inner.current
    if (!el || !content || reduced()) return
    const reveal = { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.fromTo(content, { yPercent: -60 }, { yPercent: 0, ease: 'none', scrollTrigger: reveal })
    })
    const fade = gsap.fromTo(shade.current, { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: reveal })
    return () => { mm.revert(); fade.scrollTrigger?.kill(); fade.kill() }
  }, [])

  const link = (item: NavItem) => (
    <li key={item.label}><a className="footer__link" href={item.route ?? `#${item.section}`} onClick={sectionLink(item)}>{item.label}</a></li>
  )

  return (
    <footer className="footer" id="contact" ref={footer}>
      <div className="footer__inner" ref={inner}>
        <div className="footer__container">
          <div className="footer__nav">
            <LocalTime />
            <div className="footer__lists">
              <ul aria-label="Site">{footerNav.map(link)}</ul>
              <ul aria-label="Follow us">
                {socials.map((s) => <li key={s.label}><a className="footer__link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__meta">
              <p>© 2026 Cambodia Overland · Reg. No. 5000636459 · All rights reserved.</p>
              <nav className="footer__legal" aria-label="Legal">
                <a className="footer__link" href="#/privacy">Privacy Policy</a>
                <a className="footer__link" href="#/terms">Terms &amp; Conditions</a>
              </nav>
              <button type="button" className="footer__link footer__top-btn" onClick={() => scrollToTarget(0)}>Back to top</button>
            </div>
            <Wordmark text="Cambodia Overland" />
          </div>
        </div>
      </div>
      <div className="footer__shade" ref={shade} aria-hidden="true" />
    </footer>
  )
}
