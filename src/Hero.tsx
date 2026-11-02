import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import gsap from 'gsap'
import SiteNav from './SiteNav'
import { PillButton } from './sections'

/** Splits a title line into words (clip boxes) and characters for the staggered blur-rise reveal. */
export function HeroLine({ text, start = 0, className = '' }: { text: string; start?: number; className?: string }) {
  let i = start
  return (
    <span className={`hero__line ${className}`.trim()} data-hero-line aria-hidden="true">
      {text.split(' ').map((word, w) => (
        <span key={w}>
          {w > 0 && ' '}
          <span className="hero__word">
            {[...word].map((ch, c) => <span className="hero__char" style={{ '--i': i++ } as CSSProperties} key={c}>{ch}</span>)}
          </span>
        </span>
      ))}
    </span>
  )
}

/** Tengile MalaMala banner scroll: title lines drift apart (+/-5%, desktop) and the copy sinks at half the scroll speed. */
export function useHeroScroll(hero: RefObject<HTMLElement | null>, copy: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = hero.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 1024px)', any: 'all' }, (c) => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', el)
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })
      tl.to(copy.current, { y: () => el.offsetHeight * 0.5, ease: 'none' }, 0)
      if (c.conditions?.desktop) lines.forEach((line, i) => tl.to(line, { xPercent: i % 2 ? -5 : 5, ease: 'none' }, 0))
    })
    return () => mm.revert()
  }, [hero, copy])
}

/**
 * Sub-page banner, identical to the home banner but with a photo: pinned full-screen cover, two-line staggered
 * title (second line indented), intro and optional button starting on the page's centre line.
 */
export function PageHero({ img, alt, lines, intro, button }: { img: string; alt: string; lines: [string, string]; intro?: string; button?: { href: string; label: string } }) {
  const hero = useRef<HTMLElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  useHeroScroll(hero, copy)
  return (
    <header className="hero home-hero page-hero" ref={hero}>
      <div className="hero__cover">
        <div className="hero__media">
          <div className="hero__pin"><img src={img} alt={alt} /></div>
        </div>
      </div>
      <SiteNav />
      <div className="hero__copy" ref={copy}>
        <h1 aria-label={lines.join(' ')}>
          <HeroLine text={lines[0]} />
          <HeroLine text={lines[1]} className="hero__line2" />
        </h1>
        {(intro || button) && (
          <div className="hero__desc">
            {intro && <p>{intro}</p>}
            {button && <PillButton href={button.href} className="hero__btn">{button.label}</PillButton>}
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Tengile MalaMala contact-style title: one word stretched edge to edge and centred in a full-screen space,
 * characters rising in; the optional intro follows below.
 * The font size is fitted to the container so the word spans edge to edge at any screen width.
 */
export function WordTitle({ word, children }: { word: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState<number | null>(null)
  useLayoutEffect(() => {
    const b = box.current, t = text.current
    if (!b || !t) return
    // Scale from the current rendered size (never write to the DOM here, so React's fontSize stays authoritative).
    const fit = () => {
      const w = t.getBoundingClientRect().width
      const current = parseFloat(getComputedStyle(t).fontSize)
      if (!w || !current) return
      const next = (b.clientWidth / w) * current * 0.99
      setSize((prev) => (prev && Math.abs(prev - next) < 0.5 ? prev : next))
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    return () => ro.disconnect()
  }, [word])
  return (
    <>
      <header className="wtitle">
        <div className="wtitle__box" ref={box}>
          <h1 aria-label={word}>
            <span className="wtitle__text" ref={text} style={size ? { fontSize: `${size}px` } : undefined} aria-hidden="true">
              {[...word].map((ch, i) => <span key={i} className="wtitle__char" style={{ '--i': i } as CSSProperties}>{ch}</span>)}
            </span>
          </h1>
        </div>
      </header>
      {children && <div className="wtitle__intro">{children}</div>}
    </>
  )
}
