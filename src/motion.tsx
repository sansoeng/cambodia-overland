import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getSvgPath } from 'figma-squircle'

gsap.registerPlugin(ScrollTrigger)

/* Scroll-section background colors come from --color-dark / --color-background in index.css. */
const cssColor = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

/**
 * Figma-style smoothed corners. Any element under `root` with `data-squircle="<radius>"`
 * gets a clip-path squircle (60% smoothing) that is regenerated whenever it resizes.
 */
export function useSquircles(root: RefObject<HTMLElement | null>, smoothing = 0.6) {
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const apply = (node: HTMLElement, width: number, height: number) => {
      if (!width || !height) return
      const r = Math.min(Number(node.dataset.squircle) || 0, width / 2, height / 2)
      node.style.clipPath = `path('${getSvgPath({ width, height, cornerRadius: r, cornerSmoothing: smoothing, preserveSmoothing: true })}')`
      node.style.borderRadius = '0'
    }
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const box = e.borderBoxSize?.[0]
        apply(e.target as HTMLElement, box ? box.inlineSize : e.contentRect.width, box ? box.blockSize : e.contentRect.height)
      }
    })
    el.querySelectorAll<HTMLElement>('[data-squircle]').forEach((n) => ro.observe(n, { box: 'border-box' }))
    return () => ro.disconnect()
  }, [root, smoothing])
}

/** ScrollTrigger measures pins in px; smooth CSS scrolling and late-loading images/fonts both skew those measurements. */
export function usePinRefresh() {
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    let t = 0
    const refresh = () => {
      clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    }
    const imgs = Array.from(document.images).filter((img) => !img.complete)
    imgs.forEach((img) => img.addEventListener('load', refresh, { once: true }))
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => {
      clearTimeout(t)
      html.style.scrollBehavior = prev
      imgs.forEach((img) => img.removeEventListener('load', refresh))
      window.removeEventListener('load', refresh)
    }
  }, [])
}

/** The Bend Club `Reveal`: fades and rises once the element enters the viewport. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(true)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`rise ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export type Feature = { img: string; alt: string; title: string; eyebrow?: string; text?: string }

/**
 * The Bend Club "sticky features": pinned at center, clip-path inset reveal of each image,
 * staggered text swap, and a page background that eases to dark around the pin.
 * The background tween targets the closest `[data-bg-root]` ancestor.
 */
export function StickyFeatures({ features, id }: { features: Feature[]; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const wrap = ref.current
    if (!wrap) return
    const page = wrap.closest<HTMLElement>('[data-bg-root]')
    const ctx = gsap.context(() => {
      const visuals = gsap.utils.toArray<HTMLElement>('[data-sf-visual]', wrap)
      const items = gsap.utils.toArray<HTMLElement>('[data-sf-item]', wrap)
      const count = Math.min(visuals.length, items.length)
      if (count < 1) return
      const dur = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : 0.75
      const ease = 'power4.inOut'
      const open = 'inset(0% round 44px)'
      const closed = 'inset(50% round 44px)'
      const texts = (el: HTMLElement) => el.querySelectorAll('[data-sf-text]')
      gsap.set(visuals[0], { clipPath: open })
      gsap.set(items[0], { autoAlpha: 1 })
      const steps = Math.max(1, count - 1)
      let current = 0

      const swap = (from: number, to: number) => {
        if (from === to) return
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } })
        if (from < to) tl.to(visuals[to], { clipPath: open, duration: dur, ease }, 0)
        else tl.to(visuals[from], { clipPath: closed, duration: dur, ease }, 0)
        const out = items[from]
        gsap.to(texts(out), { autoAlpha: 0, y: -30, ease: 'power4.out', duration: 0.4, onComplete: () => { gsap.set(out, { autoAlpha: 0 }) } })
        gsap.set(items[to], { autoAlpha: 1 })
        gsap.fromTo(texts(items[to]), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: 'power4.out', duration: dur, stagger: 0.1 })
      }

      const pin = ScrollTrigger.create({
        trigger: wrap,
        start: 'center center',
        end: () => `+=${100 * steps}%`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          let next = Math.floor((Math.min(self.progress, 0.7) / 0.7) * steps + 1e-6)
          next = Math.max(0, Math.min(steps, next))
          if (next !== current) {
            swap(current, next)
            current = next
          }
        },
      })

      if (page) {
        ScrollTrigger.create({
          start: () => pin.start - 220,
          end: () => pin.end + 220,
          onToggle: (self) => gsap.to(page, { backgroundColor: self.isActive ? cssColor('--color-primary', '#09201a') : cssColor('--color-background', '#ffffff'), duration: 0.9, ease: 'power2.out', overwrite: 'auto' }),
        })
      }
    }, wrap)
    return () => {
      ctx.revert()
      if (page) page.style.backgroundColor = ''
    }
  }, [])

  return (
    <div className="sf-outer" id={id}>
      <div className="sf" ref={ref}>
        <div className="sf__scroll">
          <div className="sf__container">
            <div className="sf__col is-img" data-squircle="44">
              <div className="sf__imgs">
                {features.map((f) => (
                  <div className="sf__visual" data-sf-visual key={f.title}>
                    <img src={f.img} alt={f.alt} />
                  </div>
                ))}
              </div>
            </div>
            <div className="sf__col">
              <div className="sf__texts">
                {features.map((f, i) => (
                  <div className="sf__item" data-sf-item key={f.title} style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>
                    {f.eyebrow && <p className="sf__eyebrow" data-sf-text>{f.eyebrow}</p>}
                    <h3 data-sf-text>{f.title}</h3>
                    {f.text && <p className="sf__desc" data-sf-text>{f.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Tengile MalaMala action-card label: follows the cursor vertically inside the card media
 * (clamped to its bounds) and stays under the pointer while the page scrolls. Desktop pointers only.
 */
export function useFloatingLabel(card: RefObject<HTMLElement | null>, label: RefObject<HTMLElement | null>, bounds: RefObject<HTMLElement | null>, inset = 18) {
  useEffect(() => {
    const el = card.current
    const lab = label.current
    if (!el || !lab) return
    const mq = window.matchMedia('(hover: hover) and (min-width: 1024px)')
    let y = 0
    let top = 0
    const clamp = (v: number) => {
      const h = bounds.current?.offsetHeight ?? el.offsetHeight
      return Math.min(Math.max(v, inset), h - lab.offsetHeight - inset)
    }
    const onScroll = () => {
      const t = el.getBoundingClientRect().top
      y = clamp(y - (t - top))
      top = t
      gsap.set(lab, { y })
    }
    const onMove = (e: MouseEvent) => {
      if (!mq.matches) return
      const r = el.getBoundingClientRect()
      top = r.top
      y = clamp(e.clientY - r.top - lab.offsetHeight / 2)
      gsap.set(lab, { y })
    }
    const onEnter = (e: MouseEvent) => {
      onMove(e)
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    const onLeave = () => window.removeEventListener('scroll', onScroll)
    const onMq = () => { if (!mq.matches) gsap.set(lab, { clearProps: 'transform' }) }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    mq.addEventListener('change', onMq)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      mq.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
      gsap.set(lab, { clearProps: 'transform' })
    }
  }, [card, label, bounds, inset])
}

/**
 * The Bend Club statement reveal: the text is split into words that start faint (12% opacity)
 * and fill in one after another, scrubbed by scroll as the block passes through the viewport.
 */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const words = text.split(' ')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set('.reveal-word', { opacity: 0.12 })
      gsap.to('.reveal-word', {
        opacity: 1,
        ease: 'none',
        stagger: { each: 0.05, from: 'start' },
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
      })
    }, el)
    return () => ctx.revert()
  }, [text])

  return (
    <h2 className={className} ref={ref} aria-label={text}>
      {words.map((w, i) => (
        <span className="reveal-word" aria-hidden="true" key={`${w}-${i}`}>{w}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </h2>
  )
}

/**
 * Letter reveal for big page titles on the inner pages (same motion as the home banner title): each h1 is split
 * into word clip-boxes and characters that rise out of a blur when it scrolls into view. Section headings (h2) stay
 * static; titles with their own animation (banners, word titles, dialogs) are skipped. Waits for the page transition.
 */
const TITLE_SKIP = '.hero, .wtitle, .pd-dlg, .ptx, .pd__do-title, [data-no-title-reveal]'
export function useTitleReveal(route: string) {
  useEffect(() => {
    if (route === '#/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const heads = [...document.querySelectorAll<HTMLElement>('main h1, .pd h1')]
      .filter((h, i, all) => all.indexOf(h) === i && !h.closest(TITLE_SKIP) && !h.querySelector('.reveal-word'))
    const split = (h: HTMLElement) => {
      h.dataset.titleSplit = '1'
      if (!h.hasAttribute('aria-label')) h.setAttribute('aria-label', h.textContent?.replace(/\s+/g, ' ').trim() ?? '')
      let n = 0
      const walk = (node: Node) => {
        for (const child of [...node.childNodes]) {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment()
            for (const part of (child.textContent ?? '').split(/(\s+)/)) {
              if (!part) continue
              if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); continue }
              const word = document.createElement('span')
              word.className = 'tr-word'
              word.setAttribute('aria-hidden', 'true')
              for (const ch of part) {
                const c = document.createElement('span')
                c.className = 'tr-char'
                c.style.setProperty('--i', String(Math.min(n++, 40)))
                c.textContent = ch
                word.append(c)
              }
              frag.append(word)
            }
            child.replaceWith(frag)
          } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') walk(child)
        }
      }
      walk(h)
      h.classList.add('tr')
    }
    const show = (h: HTMLElement) => {
      if (!root.classList.contains('is-page-loading')) return h.classList.add('is-in')
      const mo = new MutationObserver(() => { if (!root.classList.contains('is-page-loading')) { mo.disconnect(); h.classList.add('is-in') } })
      mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    }
    // Split once; (re)observe anything not yet revealed, so a re-run of this effect (dev StrictMode, HMR) can't strand a heading.
    heads.forEach((h) => { if (!h.dataset.titleSplit) split(h) })
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { io.unobserve(e.target); show(e.target as HTMLElement) }
    }), { threshold: 0.25, rootMargin: '0px 0px -6% 0px' })
    heads.filter((h) => !h.classList.contains('is-in')).forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [route])
}
