import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Reveal } from './motion'

/*
 * Reviews: "What travellers are saying" title with arrows on the left, a sliding row of up to five
 * review cards on the right.
 */
type Review = { name: string; from: string; text: string }

const reviews: Review[] = [
  { name: 'Hannah', from: 'Melbourne, Australia', text: 'Sunrise at Angkor Wat was everything we hoped for. Our guide Sokha timed every visit so we had the quieter temples almost to ourselves. We never felt rushed for a moment.' },
  { name: 'Marcus', from: 'Hamburg, Germany', text: 'Ten days that felt like a month in the best way. Kayaking the Tatai River at dawn is something I will never forget. Every transfer was on time and comfortable.' },
  { name: 'Priya', from: 'London, UK', text: 'I travelled solo and felt looked after from start to finish. The group was small, friendly and easy to be around. I would book with this team again without hesitation.' },
  { name: 'Daniel', from: 'Toronto, Canada', text: 'A beautifully planned route with excellent guides. Kampot and Kep were relaxed after the busy temple days. I only wish we had one more free afternoon in Siem Reap.' },
  { name: 'Sofia', from: 'Lisbon, Portugal', text: 'Our guide shared so much history at the Royal Palace and Tuol Sleng. The hotels were charming and central. Amok and Kampot crab are now firm favourites.' },
].slice(0, 5)


function ReviewCard({ r, i }: { r: Review; i: number }) {
  return (
    <article className="rv__card" style={{ '--i': i } as CSSProperties} aria-label={`Review by ${r.name}`}>
      <div className="rv__who">
        <span className="rv__avatar" aria-hidden="true">{r.name[0]}</span>
        <div><strong>{r.name}</strong><span>{r.from}</span></div>
      </div>
      <p className="rv__text">{r.text}</p>
    </article>
  )
}

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  // Keep the arrow states in sync with the track's scroll position.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', update); ro.disconnect() }
  }, [])

  const go = (dir: 1 | -1) => {
    const el = trackRef.current
    const card = el?.querySelector<HTMLElement>('.rv__card')
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  return (
    <section className="rv" aria-labelledby="rv-title">
      <Reveal className="rv__side">
        <h2 className="rv__title" id="rv-title">
          What travellers<br />are saying
        </h2>
        <div className="rv__arrows">
          <button type="button" className="rv__arrow" aria-label="Previous reviews" disabled={edge.start} onClick={() => go(-1)}><Arrow flip /></button>
          <button type="button" className="rv__arrow" aria-label="Next reviews" disabled={edge.end} onClick={() => go(1)}><Arrow /></button>
        </div>
      </Reveal>
      <Reveal className="rv__main">
        <div className="rv__track" ref={trackRef}>
          {reviews.map((r, i) => <ReviewCard key={r.name} r={r} i={i} />)}
        </div>
      </Reveal>
    </section>
  )
}
