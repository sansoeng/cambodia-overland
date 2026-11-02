import { useId, useRef, useState, type FormEvent } from 'react'
import SiteNav, { socials } from './SiteNav'
import { WordTitle } from './Hero'
import { Footer } from './sections'
import { Reveal, usePinRefresh, useSquircles } from './motion'
import { images } from './siteImages'

/* Placeholder contact details: replace with the real ones before publishing. */
export const contact = {
  email: 'hello@cambodiaoverland.com',
  phone: '+855 12 345 678',
  phoneHref: 'tel:+85512345678',
  whatsapp: 'https://wa.me/85512345678',
  address: ['No. 24, Sivatha Boulevard', 'Svay Dangkum, Siem Reap', 'Cambodia'],
  hours: 'Mon – Sat, 8:00 – 18:00 (GMT+7)',
}

const tripOptions = [
  'Cambodia Discovery: Temples to Rainforests',
  'Siem Reap – Photography & Cultural Tour',
  'Secret Siem Reap: Hidden Trails & Remote Ruins',
  'Tonlé Sap: Floating Villages & Homestays',
  'Phnom Penh & the Mekong Riverside',
  'Cardamom Mountains: Rainforest Trek',
  'A private, tailor-made trip',
  'Not sure yet',
]

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

function ContactForm() {
  const uid = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const next: Errors = {}
    if (!v('name')) next.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) next.email = 'Please enter a valid email address.'
    if (v('message').length < 10) next.message = 'Please write a short message (at least 10 characters).'
    setErrors(next)
    const first = (['name', 'email', 'message'] as const).find((k) => next[k])
    if (first) {
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    const body = [
      `Name: ${v('name')}`,
      `Email: ${v('email')}`,
      v('phone') ? `Phone: ${v('phone')}` : null,
      `Trip: ${v('trip')}`,
      v('month') ? `Travel month: ${v('month')}` : null,
      `Travellers: ${v('travellers')}`,
      '',
      v('message'),
    ].filter((l) => l !== null).join('\n')
    // No backend yet: hand the enquiry to the visitor's email app, ready to send.
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Trip enquiry from ${v('name')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const field = (name: keyof Errors) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  })
  const err = (name: keyof Errors) => errors[name] && <span className="ct__err" id={`${uid}-${name}-err`}>{errors[name]}</span>

  if (sent) {
    return (
      <div className="ct__sent" role="status">
        <h2>Thank you, your message is ready to send.</h2>
        <p>Your email app should have opened with your enquiry filled in. Press send and our Siem Reap team will reply within one working day.</p>
        <p>Nothing opened? Email us directly at <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
        <button type="button" className="ct__again" onClick={() => setSent(false)}>Write another message</button>
      </div>
    )
  }

  return (
    <form className="ct__form" onSubmit={onSubmit} noValidate>
      <h2>Send us a message</h2>
      <p className="ct__form-intro">Tell us a little about your trip and we will reply within one working day.</p>
      <div className="ct__grid">
        <label className="ct__field" htmlFor={`${uid}-name`}>
          <span>Full name</span>
          <input {...field('name')} type="text" autoComplete="name" placeholder="Your name" />
          {err('name')}
        </label>
        <label className="ct__field" htmlFor={`${uid}-email`}>
          <span>Email</span>
          <input {...field('email')} type="email" autoComplete="email" placeholder="you@example.com" />
          {err('email')}
        </label>
        <label className="ct__field" htmlFor={`${uid}-phone`}>
          <span>Phone or WhatsApp <em>(optional)</em></span>
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 000" />
        </label>
        <label className="ct__field" htmlFor={`${uid}-trip`}>
          <span>Trip you are interested in</span>
          <select id={`${uid}-trip`} name="trip" defaultValue="Not sure yet">
            {tripOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="ct__field" htmlFor={`${uid}-month`}>
          <span>When would you like to travel? <em>(optional)</em></span>
          <input id={`${uid}-month`} name="month" type="month" />
        </label>
        <label className="ct__field" htmlFor={`${uid}-travellers`}>
          <span>Travellers</span>
          <select id={`${uid}-travellers`} name="travellers" defaultValue="2">
            {['1', '2', '3', '4', '5', '6', '7–10', '10+'].map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label className="ct__field ct__field--full" htmlFor={`${uid}-message`}>
          <span>Your message</span>
          <textarea {...field('message')} rows={5} placeholder="What would you love to see, taste or experience in Cambodia?" />
          {err('message')}
        </label>
      </div>
      <button type="submit" className="btn-split is-light ct__submit">
        <span className="btn-split__label">Send message</span>
        <span className="btn-split__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
    </form>
  )
}

/** #/contact: enquiry form, direct contact details and the Siem Reap office. */
export default function ContactPage() {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()

  return (
    <div className="listing ct" ref={root} data-bg-root>
      <SiteNav tone="dark" />
      <main>
        <WordTitle word="Contact">
          <p>Questions about a tour, a private trip or travelling responsibly? Our Siem Reap team is here to help, from the first idea to the ride back to the airport.</p>
        </WordTitle>

        <section className="ct__body" aria-label="Get in touch">
          <Reveal className="ct__panel"><ContactForm /></Reveal>

          <aside className="ct__info">
            <Reveal className="ct__img">
              <img src={images.contact} alt="Riverside homes and boats on the Tonlé Sap" loading="lazy" />
            </Reveal>
            <Reveal delay={80} className="ct__items">
              <div className="ct__item">
                <p className="eyebrow">Email</p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
              <div className="ct__item">
                <p className="eyebrow">Phone &amp; WhatsApp</p>
                <a href={contact.phoneHref}>{contact.phone}</a>
                <a className="ct__small" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
              </div>
              <div className="ct__item">
                <p className="eyebrow">Visit our office</p>
                <address>{contact.address.map((l) => <span key={l}>{l}</span>)}</address>
              </div>
              <div className="ct__item">
                <p className="eyebrow">Office hours</p>
                <p>{contact.hours}</p>
              </div>
              <div className="ct__item">
                <p className="eyebrow">Follow us</p>
                <ul className="ct__socials">
                  {socials.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
                </ul>
              </div>
            </Reveal>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}
