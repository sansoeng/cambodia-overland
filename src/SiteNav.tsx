import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { goTo, lockScroll, type NavItem } from './smooth'
import { images } from './siteImages'


export const primaryNav: NavItem[] = [
  { label: 'Home', route: '#/' },
  { label: 'Tour Packages', route: '#/tours' },
  { label: 'Community', section: 'community' },
  { label: 'Stories', route: '#/stories' },
]

export const secondaryNav: NavItem[] = [
  { label: 'About Us', route: '#/about' },
  { label: 'Our Story', section: 'overview' },
  { label: 'Plan Your Trip', section: 'plan' },
  { label: 'Contact', route: '#/contact' },
]

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
]

/* Full-screen menu: the main pages (minus Community) plus About Us and Contact, all as large links (the footer keeps its own lists). */
const menuNav: NavItem[] = [...primaryNav.filter((item) => item.label !== 'Community'), ...secondaryNav.filter((item) => item.label === 'About Us' || item.label === 'Contact')]

const hrefOf = (item: NavItem) => item.route ?? `#${item.section}`

/**
 * Tengile MalaMala menu: a panel grows out of the top-right corner while a backdrop fades in,
 * primary links blur-rise in with a stagger, socials slide up from a mask.
 * Closing plays the same timeline in reverse at 1.25x.
 */
function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const links = useRef<HTMLAnchorElement[]>([])
  const subs = useRef<HTMLSpanElement[]>([])
  const tl = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true })
      // The container has a fixed CSS size, so the panel can animate to its measured box.
      t.fromTo(panel.current, { width: 0, height: 0 }, { width: () => container.current!.offsetWidth, height: () => container.current!.offsetHeight, ease: 'power3.inOut', duration: 0.7 }, 'start')
      t.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, ease: 'power3.inOut', duration: 0.7 }, 'start')
      t.fromTo(links.current, { y: 20, filter: 'blur(10px)', opacity: 0 }, { y: 0, filter: 'blur(0px)', opacity: 1, ease: 'power2.out', stagger: 0.05, duration: 0.3 }, '-=0.2')
      t.fromTo(subs.current, { yPercent: 100 }, { yPercent: 0, ease: 'power2.out', stagger: 0.05, duration: 0.3 }, '-=0.2')
      tl.current = t
    })
    const onResize = () => {
      const t = tl.current
      if (!t) return
      const p = t.progress()
      t.invalidate().progress(p)
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); ctx.revert() }
  }, [])

  useEffect(() => {
    const t = tl.current
    if (!t) return
    const fast = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 1
    if (open) {
      t.timeScale(fast).play()
      close.current?.focus({ preventScroll: true })
    } else if (t.progress() > 0) {
      t.timeScale(1.25 * fast).reverse()
    }
    if (!open) return
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keyup', onKey)
    return () => { window.removeEventListener('keyup', onKey); lockScroll(false) }
  }, [open, onClose])

  const go = (e: MouseEvent, item: NavItem) => {
    e.preventDefault()
    onClose()
    window.setTimeout(() => goTo(item), 420)
  }

  let s = 0
  const sub = (el: HTMLSpanElement | null, i: number) => { if (el) subs.current[i] = el }

  return createPortal(
    <div className={`menu${open ? ' is-visible' : ''}`} id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" inert={!open} data-lenis-prevent>
      <div className="menu__backdrop" ref={backdrop} onClick={onClose} />
      <div className="menu__panel" ref={panel}>
        <div className="menu__container" ref={container}>
          <button type="button" className="menu__close" ref={close} onClick={onClose} aria-label="Close menu">Close</button>
          <div className="menu__content">
            <nav className="menu__primary" aria-label="Main navigation">
              <ul>
                {menuNav.map((item, i) => (
                  <li key={item.label}>
                    <a href={hrefOf(item)} ref={(el) => { if (el) links.current[i] = el }} onClick={(e) => go(e, item)}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="menu__socials" aria-label="Social media">
              {socials.map((item) => {
                const i = s++
                return (
                  <li key={item.label}>
                    <span ref={(el) => sub(el, i)}><a href={item.href} target="_blank" rel="noreferrer">{item.label}</a></span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * Tengile MalaMala header: sits over the page top, turns into a compact cream bar past 120px,
 * hides while scrolling down and slides back in on scroll up.
 */
function useHeaderState() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    let t = 0
    const on = () => {
      const y = window.scrollY
      const past = y > 120
      setScrolled(past)
      if (!past) { clearTimeout(t); t = 0; setAnimated(false); setHidden(false) }
      else if (!t) t = window.setTimeout(() => setAnimated(true), 300)
      if (past && y > last) setHidden(true)
      else if (y < last) setHidden(false)
      last = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', on) }
  }, [])
  return { scrolled, hidden: scrolled && hidden, animated }
}

export default function SiteNav({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const onClose = useCallback(() => setOpen(false), [])
  const { scrolled, hidden, animated } = useHeaderState()

  useEffect(() => {
    if (wasOpen.current && !open) toggle.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  const home = (e: MouseEvent) => { e.preventDefault(); goTo({ label: 'Home', route: '#/' }) }
  const cls = ['header', `is-${tone}`, scrolled && 'is-scrolled', hidden && 'is-hidden', animated && 'has-transitions'].filter(Boolean).join(' ')

  return (
    <>
      {createPortal(
        <header className={cls}>
          <div className="header__container">
            <a className="header__logo" href="#/" onClick={home} aria-label="Cambodia Overland home">
              {/* Cream wordmark over photos; the green one fades in on light pages and the scrolled bar. */}
              <img className="header__logo-light" src={images.logoLight} alt="" />
              <img className="header__logo-dark" src={images.logo} alt="" />
            </a>
            <button type="button" className="header__toggle" ref={toggle} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
              <span className="header__toggle-icon" aria-hidden="true"><i /><i /></span>
              Menu
            </button>
          </div>
        </header>,
        document.body,
      )}
      <Menu open={open} onClose={onClose} />
    </>
  )
}
