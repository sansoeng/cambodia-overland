import { useId, useState, type CSSProperties } from 'react'
import { Reveal } from './motion'

/* Frequently asked questions: title on the left, an accordion on the right (same split as Reviews). */
const faqs = [
  { q: 'How fit do I need to be?', a: 'The activity level is “Exploration”: mostly easy walking around temples and towns, with one more active day of jungle trails and kayaking in the Cardamom Mountains. If you can walk for two to three hours with breaks, you will be comfortable. Your guide always sets a pace that suits the group.' },
  { q: 'Can I join on my own?', a: 'Absolutely. Many of our travellers join solo. You will be part of a small group of 8–22 people, and we can pair you with a same-gender roommate to avoid the single supplement, or you can book a private room.' },
  { q: 'Do I need a visa for Cambodia?', a: 'Most nationalities need a tourist visa, which you can get online as an e-visa before you travel or on arrival at the airport. Your passport should be valid for at least six months after your arrival date. We send a full checklist once you book.' },
  { q: 'What is the weather like in late November?', a: 'It is the start of the dry season, and one of the best times to visit. Expect warm, sunny days around 30°C, cooler mornings for the Angkor sunrise and very little rain. The countryside is still green from the wet season.' },
  { q: 'What happens if I need to cancel?', a: 'You can cancel for free up to 60 days before departure and receive a full refund of your deposit. After that, a sliding scale applies. We strongly recommend travel insurance that covers cancellation.' },
  { q: 'Are meals and dietary needs covered?', a: 'Daily breakfast is included, along with the welcome dinner, the farewell cruise and the meals listed in the itinerary. Vegetarian, vegan, gluten-free and allergy requirements are easy to accommodate, just let us know when you book.' },
]

function Item({ q, a, i, open, onToggle }: { q: string; a: string; i: number; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className={`faq__item${open ? ' is-open' : ''}`} style={{ '--i': i } as CSSProperties}>
      <h3>
        <button type="button" className="faq__q" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <span>{q}</span>
          <span className="faq__icon" aria-hidden="true"><i /><i /></span>
        </button>
      </h3>
      <div className="faq__a" id={id} role="region" aria-label={q} inert={!open}>
        <div><p>{a}</p></div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="faq" aria-labelledby="faq-title">
      <Reveal className="faq__side">
        <p className="pd__label">Good to know</p>
        <h2 className="faq__title" id="faq-title">Questions,<br />answered</h2>
      </Reveal>
      <Reveal className="faq__list">
        {faqs.map((f, i) => <Item key={f.q} {...f} i={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
      </Reveal>
    </section>
  )
}
