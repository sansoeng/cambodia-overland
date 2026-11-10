import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type TouchEvent as ReactTouchEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { getSvgPath } from 'figma-squircle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reveal, StickyFeatures, usePinRefresh, useSquircles, type Feature } from './motion'
import SiteNav from './SiteNav'
import { CarouselArrows, Footer, PillButton } from './sections'
import { images } from './siteImages'
import { lockScroll } from './smooth'
import Reviews from './Reviews'
import RouteMap from './RouteMap'
import Faq from './Faq'
import { BookButton, BookingProvider } from './BookingDialog'


const highlights: Feature[] = [
  { img: images.tripHighlights[0], eyebrow: 'Trip highlight', alt: 'Bats flying across the evening sky', title: 'Bats of Phnom Sampov', text: 'At dusk near Battambang, hundreds of thousands of bats pour from a limestone cave in one long ribbon across the sky' },
  { img: images.tripHighlights[1], eyebrow: 'Trip highlight', alt: 'Waterfall in the rainforest', title: 'Tatai River', text: 'Kayak mangrove channels, swim beneath Tatai Waterfall and fall asleep to the sounds of the Cardamom rainforest' },
  { img: images.tripHighlights[2], eyebrow: 'Trip highlight', alt: 'Misty mountain peak at sunrise', title: 'Cloud River sunrise', text: 'A pre-dawn ride to Cloud River Mountain for sunrise and breakfast above a sea of mist' },
]

type Day = { layout: 'h' | 'v' | 'w'; img: string; img2?: string; place: string; text: string; details: string }
/* Itinerary based on the Cambodia Discovery package (Webflow), shortened. Days 04–05 are not on that page and are
   written from its FAQ and day 06 (Phnom Sampov bat cave; transfer to the Canvas & Orchids Retreat). */
const days: Day[] = [
  { layout: 'h', img: images.itineraryDays[0].main, place: 'Arrival in Siem Reap', text: 'Arrive at Siem Reap-Angkor airport, transfer to your hotel and rest after the journey.', details: 'You’re met at Siem Reap-Angkor International Airport and taken to your hotel. The rest of the day is free to settle in and recover from your flight.' },
  { layout: 'v', img: images.itineraryDays[1].main, img2: images.itineraryDays[1].second, place: 'Angkor Wat and quiet temples', text: 'Angkor Wat and quieter temples, ideally by bike through the forest.', details: 'Explore world-famous Angkor Wat and quieter temples away from the busiest routes. We suggest cycling forest trails between the sites, far from the crowds.' },
  { layout: 'w', img: images.itineraryDays[2].main, place: 'Boat to Battambang', text: 'Cruise Tonle Sap Lake and the Sangkae River past floating villages.', details: 'A 6–7 hour boat journey across Tonle Sap Lake and up the Sangkae River, past floating villages, wetlands and river life. Check in and rest for the evening.' },
  { layout: 'v', img: images.itineraryDays[3].main, img2: images.itineraryDays[3].second, place: 'Battambang and the bat cave', text: 'Countryside by bike, then a river of bats from Phnom Sampov at dusk.', details: 'A gentle bicycle ride through villages and rice fields around Battambang. Before sunset, watch hundreds of thousands of bats stream from the Phnom Sampov cave across the evening sky.' },
  { layout: 'h', img: images.itineraryDays[4].main, place: 'Into the Cardamoms', text: 'Head south into the rainforest to a riverside retreat on the Tatai.', details: 'Leave Battambang for the Cardamom Mountains, one of Southeast Asia’s last great rainforests. Arrive at the Canvas & Orchids Retreat on the Tatai River for a quiet jungle evening.' },
  { layout: 'w', img: images.itineraryDays[5].main, place: 'Tatai River and rainforest', text: 'Kayak mangroves, swim at Tatai Waterfall or take a guided wildlife walk.', details: 'Spend the day your way: kayak mangrove channels to Koh Andet Island, take a boat to Tatai Waterfall and swim in forest pools, or join a guided wildlife walk.' },
  { layout: 'v', img: images.itineraryDays[6].main, img2: images.itineraryDays[6].second, place: 'Tatai River to Phum Teuk Sre', text: 'A slow afternoon in a rural bungalow with golden-hour countryside views.', details: 'After breakfast, head to Phum Teuk Sre in Sre Ambel and check into your rural bungalow. Spend a slow afternoon soaking up the countryside and golden-hour views.' },
  { layout: 'h', img: images.itineraryDays[7].main, place: 'Cloud River Mountain to Kampot', text: 'Sunrise above the clouds, a reservoir cruise, then riverside Kampot.', details: 'Rise early for a motorbike ride up Cloud River Mountain to catch sunrise and breakfast above the misty canopy. After a reservoir cruise, continue south to Kampot for a relaxed evening.' },
  { layout: 'w', img: images.itineraryDays[8].main, place: 'Kampot at leisure', text: 'Wander French-colonial streets or taste Kampot pepper at the source.', details: 'A free day to explore Kampot’s French-colonial streets, café-hop along the river or relax at your hotel. Or join a plantation tour to taste the famous Kampot pepper at the source.' },
  { layout: 'h', img: images.itineraryDays[9].main, place: 'Onward to Vietnam or Phnom Penh', text: 'Cross overland to Ha Tien in Vietnam, or travel on via Phnom Penh.', details: 'Option 1: transfer to the Prek Chak border and cross into Vietnam at Ha Tien. Option 2: travel by road to Phnom Penh, then on to Ho Chi Minh City by flight or bus, depending on your plans and visa.' },
]

/* Airbnb-style "What you'll do" dialog: every stop as thumbnail, title and full description. */
function DetailsDialog({ open, onClose, onOpenDay }: { open: boolean; onClose: () => void; onOpenDay: (day: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  useSquircles(rootRef)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const footRef = useRef<HTMLDivElement>(null)

  // Clip the frosted sticky title and booking bar to the sheet’s squircle corners (36px, 60% smoothing) so the blur never spills past them.
  useLayoutEffect(() => {
    const bars = [[titleRef.current, 'top'], [footRef.current, 'bottom']] as const
    const ro = new ResizeObserver(() => {
      for (const [el, edge] of bars) {
        if (!el) continue
        const { offsetWidth: width, offsetHeight: height } = el
        if (!width || !height) continue
        const r = Math.min(36, width / 2, height)
        const t = edge === 'top' ? r : 0
        const btm = edge === 'bottom' ? r : 0
        el.style.clipPath = `path('${getSvgPath({ width, height, topLeftCornerRadius: t, topRightCornerRadius: t, bottomLeftCornerRadius: btm, bottomRightCornerRadius: btm, cornerSmoothing: 0.6, preserveSmoothing: true })}')`
      }
    })
    bars.forEach(([el]) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    // Esc closes the photo or day viewer first when one is open on top of this dialog.
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('.pd-tour.is-open, .pd-day.is-open')) onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      prev?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return createPortal(
    <div ref={rootRef} className={`pd-dlg${open ? ' is-open' : ''}`} inert={!open} onClick={onClose}>
      <div className="pd-dlg__panel" role="dialog" aria-modal="true" aria-labelledby="pd-dlg-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="pd-dlg__close" type="button" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        </button>
        <div className="pd-dlg__sheet" data-squircle="36">
        <div className="pd-dlg__body" data-lenis-prevent>
        <h2 id="pd-dlg-title" ref={titleRef}>What you’ll do</h2>
        <ol className="pd-dlg__list">
          {days.map((d, i) => (
            <li key={d.place}>
              <div className="pd-dlg__thumb is-viewable" {...viewable(() => onOpenDay(i), `View Day ${String(i + 1).padStart(2, '0')} photos`)}><img src={d.img} alt="" /></div>
              <div>
                <p className="pd-dlg__day">Day {String(i + 1).padStart(2, '0')}</p>
                <h3>{d.place}</h3>
                <p>{d.details}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="pd-dlg__foot" ref={footRef}>
          <div className="pd-dlg__price">
            <strong>from $1,350</strong>
            <span>for 1 person · 10 days trip</span>
          </div>
          <BookButton className="pd-dlg__cta" onBefore={onClose} />
        </div>
        </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* Insider Madeira "A Day with": pinned horizontal track, growing intro image, curtain reveals, drawn route. */
/* Click (or Enter/Space) on an itinerary photo to open it in the large photo view. */
const viewable = (onOpen: () => void, label: string) => ({
  role: 'button' as const,
  tabIndex: 0,
  'aria-label': label,
  onClick: onOpen,
  onKeyDown: (e: ReactKeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } },
})

function Media({ src, alt, className, onOpen }: { src: string; alt: string; className: string; onOpen: (src: string) => void }) {
  return (
    <div className={`pd__do-media reveal is-viewable ${className}`} data-squircle={className === 'is-small' ? 28 : 44} {...viewable(() => onOpen(src), `View ${alt || 'photo'} larger`)}>
      <img src={src} alt={alt} />
      <div className="pd__do-mask" />
    </div>
  )
}

function DayInfo({ d, i, onExplore }: { d: Day; i: number; onExplore: () => void }) {
  return (
    <div className="pd__do-info">
      <div className="pd__do-time"><span>Day {String(i + 1).padStart(2, '0')}</span><i /><span>{d.place}</span></div>
      <h3>{d.text}</h3>
      {/* Phones only: opens this day's photos and full description. */}
      <button type="button" className="pd__do-explore" onClick={onExplore}>Explore day <span aria-hidden="true">→</span></button>
    </div>
  )
}


/* One itinerary day: the rail shows only that day's photos. */
function DayDialog({ day, onClose }: { day: number | null; onClose: () => void }) {
  const [shown, setShown] = useState(0)
  const [photo, setPhoto] = useState(0)
  const [last, setLast] = useState<number | null>(null)
  // Each time a day is opened, show that day and start from its first photo.
  if (day !== last) { setLast(day); if (day !== null) { setShown(day); setPhoto(0) } }
  const d = days[shown]
  const label = `Day ${String(shown + 1).padStart(2, '0')}`
  const photos = (images.itineraryGallery[shown] ?? [d.img]).map((src, i) => ({ src, label: `${label} photo ${i + 1}` }))
  return (
    <ShowcaseDialog
      open={day !== null} className="pd-day" active={photo} onSelect={setPhoto} onClose={onClose}
      photos={photos} eyebrow={label} title={d.place} text={d.details} alt={`${d.place}, photo ${photo + 1}`} textKey={label}
      nav={{
        edge: { start: shown === 0, end: shown === days.length - 1 },
        step: (dir) => { setShown((n) => Math.max(0, Math.min(days.length - 1, n + dir))); setPhoto(0) },
        label: 'day',
        count: `${String(shown + 1).padStart(2, '0')} / ${days.length}`,
      }}
    />
  )
}

function Itinerary() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const closeDetails = useCallback(() => setDetailsOpen(false), [])
  const openDetails = (e: { preventDefault: () => void }) => { e.preventDefault(); setDetailsOpen(true) }
  const [photo, setPhoto] = useState<number | null>(null)
  const openPhoto = (src: string) => setPhoto(Math.max(0, tourPhotos.findIndex((p) => p.src === src)))
  const closePhoto = useCallback(() => setPhoto(null), [])
  const [dayView, setDayView] = useState<number | null>(null)
  // Phones: the days are a swipeable row; track which card is in view for the counter.
  const contentRef = useRef<HTMLDivElement>(null)
  const [swipe, setSwipe] = useState(0)
  const [edge, setEdge] = useState({ start: true, end: false })
  const cardStep = (el: HTMLElement) => {
    const first = el.querySelector<HTMLElement>('.pd__step')
    return first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth
  }
  const onSwipe = () => {
    const el = contentRef.current
    if (!el || window.innerWidth >= 768) return
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setEdge({ start: el.scrollLeft <= 4, end: atEnd })
    setSwipe(atEnd ? days.length - 1 : Math.max(0, Math.min(days.length - 1, Math.round(el.scrollLeft / cardStep(el)))))
  }
  const stepDays = (dir: number) => {
    const el = contentRef.current
    if (el) el.scrollBy({ left: dir * cardStep(el), behavior: 'smooth' })
  }
  // Phones: tapping a day's photo opens that day; larger screens open the photo viewer.
  const openMedia = (i: number) => (src: string) => (window.innerWidth < 768 ? openDay(i) : openPhoto(src))
  const openDay = useCallback((i: number) => setDayView(i), [])
  const closeDay = useCallback(() => setDayView(null), [])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const btn = btnRef.current
    if (!section || !track || !btn) return
    const q = gsap.utils.selector(section)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const showBtn = () => gsap.to(btn, { autoAlpha: 1, duration: 0.5, overwrite: 'auto' })
    const hideBtn = () => gsap.to(btn, { autoAlpha: 0, duration: 0.5, overwrite: 'auto' })
    const mm = gsap.matchMedia(section)

    mm.add('(min-width: 768px)', () => {
      // Scroll until the spacer after Day 10 reaches the right edge — Firefox leaves trailing margins out of scrollWidth.
      const distance = () => {
        const end = track.querySelector<HTMLElement>('.pd__do-end')
        const right = end ? end.getBoundingClientRect().right - track.getBoundingClientRect().left : track.scrollWidth
        return Math.max(0, Math.max(right, track.scrollWidth) - window.innerWidth)
      }
      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          pin: true,
          scrub: true,
          start: 'center center',
          end: () => `+=${distance() * 0.76}`,
          invalidateOnRefresh: true,
          onEnter: showBtn,
          onLeave: hideBtn,
          onEnterBack: showBtn,
          onLeaveBack: hideBtn,
        },
      })
      const pin = scrollTween.scrollTrigger!

      // Intro image grows past the viewport while the title fades away.
      gsap.to(q('.pd__do-img'), {
        width: '40em',
        height: '63.188em',
        ease: 'none',
        scrollTrigger: { start: () => pin.start, end: () => pin.start + window.innerHeight * 0.4, scrub: true, invalidateOnRefresh: true },
      })
      gsap.to(q('.pd__do-title'), {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { start: () => pin.start - window.innerHeight * 0.15, end: () => pin.start + window.innerHeight * 0.1, scrub: true, invalidateOnRefresh: true },
      })

      const content = q('.pd__do-content')[0]
      gsap.set(content, { opacity: 0 })
      gsap.to(content, {
        opacity: 1,
        scrollTrigger: { trigger: content, containerAnimation: scrollTween, start: 'left center', end: '10% center', scrub: true },
      })


      if (!reduce) {
        q('.pd__do-mask').forEach((mask) => {
          gsap.set(mask, { opacity: 1 })
          gsap.to(mask, {
            x: '100%',
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: mask.closest('.reveal'), containerAnimation: scrollTween, start: 'left center' },
          })
        })
      }
    })

    mm.add('(max-width: 767px)', () => {
      if (reduce) return
      q('.pd__do-mask').forEach((mask) => {
        gsap.set(mask, { opacity: 1 })
        gsap.to(mask, { x: '100%', duration: 1, ease: 'power3.inOut', scrollTrigger: { trigger: mask.closest('.reveal'), start: 'top 75%' } })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="pd__do" ref={sectionRef} aria-label="What you’ll do">
      <div className="pd__do-track" ref={trackRef}>
        <div className="pd__do-intro">
          <div className="pd__do-img is-viewable" data-squircle="44" {...viewable(() => openPhoto(images.itineraryIntro), 'View Ta Prohm photo larger')}><img src={images.itineraryIntro} alt="Ta Prohm temple in the jungle" /></div>
          <h2 className="pd__do-title is-dark">What you’ll <span className="pd__do-bottom">do</span></h2>
          <div className="pd__do-tmask" aria-hidden="true">
            <p className="pd__do-title">What you’ll <span className="pd__do-bottom">do</span></p>
          </div>
        </div>

        <div className="pd__do-content" ref={contentRef} onScroll={onSwipe}>
          {days.map((d, i) =>
            d.layout === 'v' ? (
              <article className={`pd__step is-v${i === 3 ? ' is-bottom' : ''}`} key={d.place}>
                <Media src={d.img} alt={d.place} className="is-tall" onOpen={openMedia(i)} />
                <div className="pd__step-col">
                  <Media src={d.img2!} alt={d.place} className="is-small" onOpen={openMedia(i)} />
                  <DayInfo d={d} i={i} onExplore={() => openDay(i)} />
                </div>
              </article>
            ) : (
              <article className={`pd__step is-${d.layout}${i === days.length - 1 ? ' is-last' : ''}`} key={d.place}>
                {/* Day 10 uses the same tall portrait size as Day 04. */}
                <Media src={d.img} alt={d.place} className={i === days.length - 1 ? 'is-tall' : d.layout === 'w' ? 'is-wide' : 'is-sq'} onOpen={openMedia(i)} />
                <DayInfo d={d} i={i} onExplore={() => openDay(i)} />
              </article>
            ),
          )}
        </div>
        {/* Phones: swipe position under the day cards. */}
        <div className="pd__do-progress">
          <span aria-live="polite">{String(swipe + 1).padStart(2, '0')} / {days.length}</span>
          <i aria-hidden="true"><b style={{ transform: `scaleX(${(swipe + 1) / days.length})` }} /></i>
          <CarouselArrows edge={edge} step={stepDays} label="day" />
        </div>
        {/* Real element (not margin/padding) so every browser keeps clear space after Day 10. */}
        <div className="pd__do-end" aria-hidden="true" />
      </div>
      <div className="pd__do-fixed" ref={btnRef}>
        <PillButton href="#what-youll-do" onClick={openDetails}>See full details</PillButton>
      </div>
      <DetailsDialog open={detailsOpen} onClose={closeDetails} onOpenDay={openDay} />
      <DayDialog day={dayView} onClose={closeDay} />
      <PhotoTour open={photo !== null} start={photo} onClose={closePhoto} />
    </section>
  )
}

/* Every trip photo for the Airbnb-style photo tour: banner photos first, then each itinerary day. */
const tourPhotos = (() => {
  const list: { src: string; alt: string }[] = []
  const add = (src: string | undefined, alt: string) => { if (src && !list.some((p) => p.src === src)) list.push({ src, alt }) }
  images.tripGallery.forEach((src, i) => add(src, `Cambodia trip photo ${i + 1}`))
  add(images.itineraryIntro, 'Ta Prohm temple in the jungle')
  days.forEach((d) => { add(d.img, d.place); add(d.img2, d.place) })
  return list
})()

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={dir === 'left' ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
)
/* Two overlapping rounded squares: Airbnb's "open gallery" glyph. */
const StackIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <rect x="4" y="8" width="12" height="12" rx="2.5" />
    <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h7A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H16" />
  </svg>
)

/*
 * Full-screen tour photo gallery slideshow + masonry grid.
 * Smooth fade & soft scale transition without layout glitches.
 */
function PhotoTour({ open, start, onClose }: { open: boolean; start: number | null; onClose: () => void }) {
  const [view, setView] = useState<'slide' | 'grid'>('slide')
  const [index, setIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touch = useRef(0)
  const closing = useRef(false)
  const n = tourPhotos.length
  const go = useCallback((d: number) => setIndex((i) => Math.min(n - 1, Math.max(0, i + d))), [n])

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const root = rootRef.current
    const img = imgRef.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      closing.current = false
      onClose()
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        closing.current = false
        onClose()
      },
    })
    tl.to(root, { opacity: 0, duration: 0.22, ease: 'power2.inOut' }, 0)
    if (img) {
      tl.to(img, { scale: 0.96, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
    }
  }, [onClose])

  useLayoutEffect(() => {
    if (!open) return
    const s = Math.min(n - 1, Math.max(0, start ?? 0))
    setIndex(s)
    setView('slide')
    closing.current = false
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    if (rootRef.current) {
      gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    }
    return () => {
      lockScroll(false)
      prev?.focus({ preventScroll: true })
    }
  }, [open, start, n])

  // Slide entrance animation: smooth fade and subtle scale
  useLayoutEffect(() => {
    const img = imgRef.current
    if (!open || view !== 'slide' || !img) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(img, { opacity: 1, scale: 1 })
      return
    }
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out', clearProps: 'transform' }
    )
  }, [open, view, index])

  // Back in the grid, bring the photo you were looking at into view.
  useLayoutEffect(() => {
    if (!open || view !== 'grid') return
    scrollRef.current?.querySelectorAll('.pd-tour__tile')[index]?.scrollIntoView({ block: 'nearest' })
  }, [open, view, index])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
      if (view === 'slide' && e.key === 'ArrowRight') go(1)
      if (view === 'slide' && e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, view, go, requestClose])

  const openTile = (i: number) => {
    setIndex(i)
    setView('slide')
  }

  const photo = tourPhotos[index]
  return createPortal(
    <div ref={rootRef} className={`pd-tour${open ? ' is-open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label="My gallery">
      <div className="pd-tour__bar">
        {view === 'slide' && (
          <button type="button" className="pd-tour__icon is-left" aria-label="Change to grid view" onClick={() => setView('grid')}><StackIcon /></button>
        )}
        <p aria-live="polite">{view === 'slide' ? `${index + 1} of ${n}` : 'Cambodia Discovery: Temples to Rainforests'}</p>
        <button ref={closeRef} type="button" className="pd-tour__icon is-right" aria-label="Close" onClick={requestClose}><CloseIcon /></button>
      </div>

      {view === 'slide' ? (
        <div
          className="pd-tour__stage"
          onClick={(e) => {
            if (e.target === e.currentTarget) requestClose()
          }}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1) }}
        >
          <button type="button" className="pd-tour__icon pd-tour__nav is-prev" aria-label="Previous" disabled={index === 0} onClick={() => go(-1)}><Arrow dir="left" /></button>
          <img ref={imgRef} key={photo.src} className="pd-tour__photo" src={photo.src} alt={photo.alt} />
          <button type="button" className="pd-tour__icon pd-tour__nav is-next" aria-label="Next" disabled={index === n - 1} onClick={() => go(1)}><Arrow dir="right" /></button>
        </div>
      ) : (
        <div className="pd-tour__scroll" ref={scrollRef} data-lenis-prevent>
          <div className="pd-tour__grid">
            {tourPhotos.map((p, i) => (
              <button key={p.src} type="button" className="pd-tour__tile" style={{ '--i': i } as CSSProperties} onClick={() => openTile(i)} aria-label={`Photo ${i + 1} of ${n}, opens gallery`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}

/* Banner: Airbnb "My portfolio" collage. One large photo, two stacked beside it, and a round gallery button. */
function Gallery() {
  const [tour, setTour] = useState<number | null>(null)
  const closeTour = useCallback(() => setTour(null), [])
  const imgs = images.tripGallery.slice(0, 3)
  const indexOf = (src: string) => Math.max(0, tourPhotos.findIndex((p) => p.src === src))
  return (
    <div className="pd__gwrap">
      <div className="pd__gallery">
        {imgs.map((img, i) => (
          <button key={img} type="button" className={`pd__gbtn is-${i + 1}`} onClick={() => setTour(indexOf(img))} aria-label={`Photo ${i + 1} of ${tourPhotos.length}, opens gallery`}>
            <img src={img} alt="" draggable={false} />
          </button>
        ))}
        <button type="button" className="pd__allphotos" onClick={() => setTour(0)} aria-label="Open media gallery"><StackIcon /></button>
      </div>
      <PhotoTour open={tour !== null} start={tour} onClose={closeTour} />
    </div>
  )
}

// Key facts under the trip title (dates and length match the booking card).
// Icons are 24px outline paths drawn in the site's 1.5px stroke style.
/* Animated calendar for the Dates fact: frame draws in, rings drop, days pop in and the trip date lights up. */
function DateIcon({ className = 'pd__fact-icon' }: { className?: string }) {
  const days = [[8, 13.5], [12, 13.5], [16, 13.5], [8, 17], [12, 17]]
  return (
    <svg className={`${className} pd__date-icon`} viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path className="pd__date-frame" pathLength={1} d="M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM4 9.5h16" />
      <path className="pd__date-ring" d="M8.5 3v4" />
      <path className="pd__date-ring" d="M15.5 3v4" />
      {days.map(([cx, cy], i) => <circle key={i} className="pd__date-day" cx={cx} cy={cy} r={0.9} fill="currentColor" stroke="none" style={{ animationDelay: `${0.55 + i * 0.07}s` }} />)}
      <rect className="pd__date-pick" x={14.4} y={15.4} width={3.2} height={3.2} rx={0.9} fill="currentColor" stroke="none" />
    </svg>
  )
}

const inclusions = [
  { title: 'What’s included', items: ['Free Guide Tours', 'Transportations', 'Food & Drinks', '9 nights’ accommodation'], no: false },
  { title: 'Not included', items: ['International flights', 'Visa fees', 'Travel insurance', 'Tips & personal expenses'], no: true },
]

const tripFacts = [
  ['Dates', '29 Nov – 8 Dec 2026', 'M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1ZM4 10h16M8 3.5v4M16 3.5v4'],
  ['Duration', '10 days, 9 nights', 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17ZM12 7.5V12l3 2'],
  ['Group size', '8–22 travellers', 'M9 4.5a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5ZM3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5a3 3 0 0 1 0 5.8M18 14.4c1.8.6 3 2.4 3 5.1'],
  ['Activity level', 'Moderate', 'M3 19.5 9.5 8l3.5 6 2-3.5 6 9H3ZM8 11l1.5 1.5L11 11'],
]

const stays = [
  { img: images.tripStays.siemReap, name: 'Boutique hotel', place: 'Siem Reap', nights: 'Nights 1–2', note: 'A calm base near the old market, with a pool for after the temples.', details: 'A calm boutique hotel a short walk from the old market and Pub Street. Rooms open onto a leafy courtyard and saltwater pool, a welcome place to cool off after early starts at Angkor. Breakfast is included each morning.' },
  { img: images.tripStays.battambang, name: 'Colonial guesthouse', place: 'Battambang', nights: 'Nights 3–4', note: 'Restored French-era rooms a short walk from the river.', details: 'A restored French-era house near the Sangkae River, with high ceilings, tiled floors and shuttered windows. It is an easy base for the countryside bike ride and the evening trip to the Phnom Sampov bat cave.' },
  { img: images.tripStays.tatai, name: 'Canvas & Orchids Retreat', place: 'Tatai River', nights: 'Nights 5–6', note: 'Riverside tents deep in the Cardamom rainforest.', details: 'Spacious safari tents on stilts above the Tatai River, reached only by boat. Wake to birdsong in the Cardamom rainforest, kayak from your deck and spend evenings by the water. Meals are served at the riverside lodge.' },
  { img: images.tripStays.phumTeukSre, name: 'Rural bungalow', place: 'Phum Teuk Sre', nights: 'Night 7', note: 'A quiet garden bungalow in the Sre Ambel countryside.', details: 'A simple, comfortable wooden bungalow in a quiet garden in the Sre Ambel countryside. A slow evening of village life and golden-hour views before the early ride up Cloud River Mountain.' },
  { img: images.tripStays.kampot, name: 'Riverside hotel', place: 'Kampot', nights: 'Nights 8–9', note: 'Easy strolls to the old town, cafés and the river.', details: 'A relaxed hotel on the Kampot River, a short stroll from the French-colonial old town, cafés and the night market. Watch the sunset over Bokor Mountain from the terrace after a day among the pepper farms.' },
]
type Stay = (typeof stays)[number]

/*
 * Airbnb Services-style viewer shared by stays and itinerary days: thumbnail rail, large photo, centred
 * eyebrow/title/meta, description and CTA. Arrow keys move through the rail, Esc closes.
 */
type ShowcaseProps = {
  open: boolean
  photos: { src: string; label: string }[]
  active: number
  onSelect: (i: number) => void
  onClose: () => void
  eyebrow?: string
  title: string
  meta?: ReactNode
  text: string
  alt: string
  className?: string
  textKey?: string
  /** Optional prev/next navigation between items (e.g. itinerary days), with swipe support on touch screens. */
  nav?: { edge: { start: boolean; end: boolean }; step: (dir: number) => void; label: string; count: string }
}
function ShowcaseDialog({ open, photos, active, onSelect, onClose, eyebrow, title, meta, text, alt, className = '', textKey, nav }: ShowcaseProps) {
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: ReactTouchEvent) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!nav || !start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x, dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3) return
    if (dx < 0 && !nav.edge.end) nav.step(1)
    if (dx > 0 && !nav.edge.start) nav.step(-1)
  }
  const closeRef = useRef<HTMLButtonElement>(null)
  const n = photos.length
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    return () => { lockScroll(false); prev?.focus({ preventScroll: true }) }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (n > 1 && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) onSelect((active + 1) % n)
      if (n > 1 && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) onSelect((active - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, active, n, onClose, onSelect])
  const photo = photos[active] ?? photos[0]

  return createPortal(
    <div className={`pd-dlg pd-stay ${className}${open ? ' is-open' : ''}`} inert={!open} onClick={onClose}>
      <div className="pd-stay__rail" role="tablist" aria-label="Photos" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button key={p.src + i} type="button" role="tab" aria-selected={i === active} aria-label={p.label} className={i === active ? 'is-active' : ''} onClick={() => onSelect(i)}>
            <img src={p.src} alt="" />
          </button>
        ))}
      </div>
      <div className="pd-stay__panel" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="pd-stay__media">{photo && <img key={photo.src} src={photo.src} alt={alt} />}</div>
        <div className="pd-stay__body" key={textKey ?? title}>
          {eyebrow && <p className="pd-stay__eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {meta && <p className="pd-stay__meta">{meta}</p>}
          <p className="pd-stay__text">{text}</p>
          {nav && (
            <div className="pd-stay__nav">
              <CarouselArrows edge={nav.edge} step={nav.step} label={nav.label} />
              <span aria-live="polite">{nav.count}</span>
            </div>
          )}
          <BookButton className="pd-stay__cta" onBefore={onClose} />
        </div>
        <button ref={closeRef} type="button" className="pd-stay__close" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>,
    document.body,
  )
}

/* Stays: the rail switches between the five places you stay. */
function StayDialog({ index, onSelect, onClose }: { index: number | null; onSelect: (i: number) => void; onClose: () => void }) {
  const [shown, setShown] = useState(0)
  if (index !== null && index !== shown) setShown(index)
  const st: Stay = stays[shown]
  return (
    <ShowcaseDialog
      open={index !== null} active={shown} onSelect={onSelect} onClose={onClose}
      photos={stays.map((t) => ({ src: t.img, label: `${t.name}, ${t.place}` }))}
      title={st.name} meta={<><strong>{st.place}</strong> · {st.nights}</>} text={st.details} alt={`${st.name} in ${st.place}`}
    />
  )
}

/* "Good to know" (Airbnb "Things to know" layout): 24px line icon, title, short note. */
const goodToKnow = [
  { title: 'Group size', text: 'Small groups of 8 to 22 travellers, led by a local guide.', icon: 'M9 4.5a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5ZM3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5a3 3 0 0 1 0 5.8M18 14.4c1.8.6 3 2.4 3 5.1' },
  { title: 'Activity level', text: 'Moderate. Easy bike rides, kayaking, swimming and short walks, as active or restful as you like.', icon: 'M13 4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM9.5 21l2.5-6.5 2.5 2V21M12 14.5l1-5-3 1.5-1.5 3M13 9.5l2 3 3 1M7 21l2.5-5' },
  { title: 'Best time to go', text: 'November to March is dry and warm, around 25–32°C, with short rainforest showers.', icon: 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4' },
  { title: 'What to bring', text: 'Light layers, rain jacket, swimwear, sturdy sandals, insect repellent and motion-sickness tablets.', icon: 'M8 7V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7M6 7h12a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V8.5A1.5 1.5 0 0 1 6 7ZM4.5 12.5h15M9.5 12.5V15M14.5 12.5V15' },
  { title: 'Accessibility', text: 'Some days include boats and uneven trails. Message us for details.', icon: 'M12 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM5 9l7 1 7-1M12 10v4.5M12 14.5l-3 6M12 14.5l3 6' },
]

export default function PackageDetails() {
  const rootRef = useRef<HTMLDivElement>(null)
  useSquircles(rootRef)
  usePinRefresh()
  const [stay, setStay] = useState<number | null>(null)
  const closeStay = useCallback(() => setStay(null), [])

  return (
    <BookingProvider>
    <div className="pd" ref={rootRef} data-bg-root>
      <SiteNav tone="dark" />

      <header className="pd__head">
        <h1>Cambodia Discovery<br />Temples to Rainforests</h1>
        <dl className="pd__facts">
          {tripFacts.map(([label, value, icon]) => (
            <div className="pd__fact" key={label}>
              {label === 'Dates' ? <DateIcon /> : (
                <svg className="pd__fact-icon" viewBox="0 0 24 24" width={24} height={24} aria-hidden="true">
                  <path d={icon} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </header>

      <Gallery />

      <div className="pd__body">
        <div className="pd__main">
          <p className="pd__label">Journey Overview</p>
          <p className="pd__lead">This itinerary brings together Cambodia's ancient heritage, welcoming communities and remarkable natural landscapes. Travel from Siem Reap to Battambang, continue through the Cardamom Mountains and Tatai River, and finish in Kampot with onward connections to Vietnam.</p>

          <hr />
          <div className="pd__incl">
            {inclusions.map(({ title, items, no }) => (
              <div key={title}>
                <h2 className="pd__h3">{title}</h2>
                <Reveal>
                  <ul className={`pd__list${no ? ' is-no' : ''}`}>
                    {items.map((t, i) => (
                      <li key={t} style={{ '--i': i } as CSSProperties}>
                        {/* Circle draws in, then the tick (or cross), staggered per item once the list is in view. */}
                        <svg className="pd__check" viewBox="0 0 28 28" width={28} height={28} aria-hidden="true">
                          <circle cx="14" cy="14" r="13" pathLength={1} />
                          <path d={no ? 'M10.5 10.5l7 7M17.5 10.5l-7 7' : 'M9 14.5l3.2 3.2L19 11'} pathLength={1} />
                        </svg>
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            ))}
          </div>
          <hr />

          <section className="pd-stays" aria-labelledby="pd-stays-title">
            <h2 className="pd__h3" id="pd-stays-title">Where you’ll stay</h2>
            <Reveal>
              <ul className="pd-stays__list">
                {stays.map((st, i) => (
                  <li key={st.name} style={{ '--i': i } as CSSProperties}>
                    <button type="button" className="pd-stays__card" onClick={() => setStay(i)} aria-haspopup="dialog">
                      <img src={st.img} alt="" loading="lazy" />
                      <span className="pd-stays__info">
                        <strong>{st.name}</strong>
                        <span className="pd-stays__note">{st.note}</span>
                        <span className="pd-stays__meta"><b>{st.place}</b> · {st.nights}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
            <StayDialog index={stay} onSelect={setStay} onClose={closeStay} />
          </section>
          <hr />

          <section className="pd-know" aria-labelledby="pd-know-title">
            <h2 className="pd__h3" id="pd-know-title">Good to know</h2>
            <Reveal>
              <ul className="pd-know__grid">
                {goodToKnow.map((g, i) => (
                  <li key={g.title} style={{ '--i': i } as CSSProperties}>
                    <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden="true">
                      <path d={g.icon} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3>{g.title}</h3>
                    <p>{g.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
          <hr />

          <h2 className="pd__h3 pd__guide-title">Meet your guide</h2>
          <div className="pd__guide">
            <div className="pd__guide-card">
              <div className="pd__avatar"><img src={images.guidePhoto} alt="Taimi" /></div>
              <h3>Taimi</h3>
              <p>Expert</p>
            </div>
            <div className="pd__guide-bio">
              <p>Hi! My name is Taimi and I love all things travel. I have hosted many group trips over the years and am most known for my masterfully curated journeys through the temples of Angkor. Join me on my next adventure!</p>
            </div>
          </div>
        </div>

        <aside className="pd__book">
          <div className="pd__price">
            <div>
              <strong>from $1,350</strong>
              <span>for 1 person</span>
            </div>
            <em>10 days trip</em>
          </div>
          <div className="pd__date">
            <DateIcon className="pd__date-svg" />
            <div>
              <span>Travel Date</span>
              <strong>29 Nov - 8 Dec 2026</strong>
            </div>
          </div>
          <BookButton className="pd__cta" />
          <small>No payment now. We confirm availability first.</small>
        </aside>
      </div>

      <RouteMap />

      <StickyFeatures features={highlights} />

      <Itinerary />

      <Reviews />

      <Faq />

      <Footer />

      {/* Phones and tablets: booking bar pinned to the bottom of the screen (Airbnb-style). */}
      <div className="pd-bar">
        <div className="pd-bar__price">
          <strong>from $1,350</strong>
          <span>for 1 person</span>
          <span className="pd-bar__date">29 Nov – 8 Dec 2026</span>
        </div>
        <BookButton className="pd-bar__cta" />
      </div>
    </div>
    </BookingProvider>
  )
}
