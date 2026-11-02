import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Lenis smooth scrolling (same engine Tengile MalaMala uses), driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  // In-page "#section" links glide via Lenis; "#/route" hashes are left to the router.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
    const id = a?.getAttribute('href')?.slice(1)
    if (e.defaultPrevented || !id || id.startsWith('/')) return
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    scrollToTarget(el)
  })
  return lenis
}

export const getLenis = () => lenis

// Counted so stacked overlays (e.g. the photo viewer over a dialog) only release scrolling when the last one closes.
let locks = 0
export function lockScroll(locked: boolean) {
  locks = Math.max(0, locks + (locked ? 1 : -1))
  const on = locks > 0
  if (on) lenis?.stop()
  else lenis?.start()
  document.documentElement.classList.toggle('lock-scroll', on)
}

export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) return lenis.scrollTo(target, { immediate, force: true, duration: immediate ? 0 : 1.4 })
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  // Lenis only stays off for reduced-motion users, so the fallback jumps instead of animating.
  window.scrollTo({ top, behavior: 'auto' })
}

export type NavItem = { label: string; route?: string; section?: string; href?: string }

/** Hash-route or in-page navigation that works from either page. */
export function goTo(item: NavItem) {
  if (item.section) {
    const el = document.getElementById(item.section)
    if (el) return scrollToTarget(el)
    window.location.hash = '#/'
    // The home page mounts after the page transition, so wait for the section to exist (up to ~3s).
    let tries = 0
    const find = () => {
      const next = document.getElementById(item.section!)
      if (next && !document.documentElement.classList.contains('is-page-loading')) return void window.setTimeout(() => scrollToTarget(next), 200)
      if (++tries < 30) window.setTimeout(find, 100)
    }
    window.setTimeout(find, 300)
    return
  }
  const route = item.route ?? '#/'
  const here = window.location.hash === route || (route === '#/' && window.location.hash === '')
  if (here) scrollToTarget(0)
  else window.location.hash = route
}
