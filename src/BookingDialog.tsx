import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSquircles } from './motion'
import { PillButton } from './sections'
import { contact } from './ContactPage'
import { images } from './siteImages'
import { lockScroll } from './smooth'

/*
 * "Request to book" form for the package page. Every "Book our tour now" button opens it.
 * Requests are sent with Web3Forms (https://web3forms.com) straight to the inbox linked to the access key in
 * VITE_WEB3FORMS_ACCESS_KEY. Until that key is set, the request opens in the visitor's email app instead.
 */

/* The trip this page sells — keep in sync with the package page header and booking card. */
const trip = {
  name: 'Cambodia Discovery: Temples to Rainforests',
  dates: '29 Nov – 8 Dec 2026',
  length: '10 days',
  price: 1350,
  img: images.tours.discovery,
}
const departures = [`${trip.dates} (group departure)`, 'Other dates in 2026–27', 'A private trip on my own dates']
const rooms = ['Twin or double share', 'Single room (supplement applies)', 'Not sure yet']
const MAX_TRAVELLERS = 16
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined
const money = (n: number) => `$${n.toLocaleString('en-US')}`
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
/* The loading animation shows for at least this long, so the hand-off to the check mark never flickers. */
const MIN_LOADING_MS = 1200

const BookingContext = createContext<() => void>(() => {})

/** Provides `useBooking()` to the page and renders the booking dialog once. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  return (
    <BookingContext.Provider value={show}>
      {children}
      <BookingDialog open={open} onClose={close} />
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)

/** "Book our tour now" pill that opens the form. `onBefore` closes the dialog it sits in, if any. */
export function BookButton({ className = '', onBefore }: { className?: string; onBefore?: () => void }) {
  const open = useBooking()
  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    onBefore?.()
    open()
  }
  return <PillButton href="#/package" className={className} onClick={onClick}>Book our tour now</PillButton>
}

type Field = 'name' | 'email'
type Status = { kind: 'form' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string; viaEmail: boolean } | { kind: 'error' }

function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const uid = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  useSquircles(rootRef)
  const [travellers, setTravellers] = useState(2)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'form' })

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus({ preventScroll: true })
    // Capture phase + stopPropagation: Esc closes this form only, not a photo or day dialog underneath it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      lockScroll(false)
      prev?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  // A finished request resets to a fresh form the next time the dialog opens.
  useEffect(() => {
    if (open) return
    const t = window.setTimeout(() => {
      setStatus((s) => (s.kind === 'sent' || s.kind === 'error' ? { kind: 'form' } : s))
      setErrors({})
    }, 400)
    return () => clearTimeout(t)
  }, [open])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const next: Partial<Record<Field, string>> = {}
    if (!v('name')) next.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) next.email = 'Please enter a valid email address.'
    setErrors(next)
    const first = (['name', 'email'] as const).find((k) => next[k])
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    if (f.get('botcheck')) return // honeypot ticked: a bot, drop silently

    const details = {
      Trip: trip.name,
      Departure: v('departure'),
      Travellers: String(travellers),
      Room: v('room'),
      'Estimated total': `from ${money(travellers * trip.price)} (${travellers} × ${money(trip.price)})`,
      Name: v('name'),
      Email: v('email'),
      Phone: v('phone') || '—',
      Message: v('message') || '—',
    }
    const subject = `Booking request: ${trip.name} — ${v('name')}`
    const started = performance.now()
    const settle = () => wait(Math.max(0, MIN_LOADING_MS - (performance.now() - started)))
    setStatus({ kind: 'sending' })

    if (!ACCESS_KEY) {
      // Not connected yet: hand the request to the visitor's email app, ready to send.
      const body = Object.entries(details).map(([k, val]) => `${k}: ${val}`).join('\n')
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      await settle()
      setStatus({ kind: 'sent', name: v('name'), email: v('email'), viaEmail: true })
      return
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: ACCESS_KEY, subject, from_name: 'Cambodia Overland website', replyto: v('email'), ...details }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`)
      await settle()
      setStatus({ kind: 'sent', name: v('name'), email: v('email'), viaEmail: false })
      form.reset()
      setTravellers(2)
    } catch {
      await settle()
      setStatus({ kind: 'error' })
    }
  }

  const field = (name: Field) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  })
  const err = (name: Field) => errors[name] && <span className="ct__err" id={`${uid}-${name}-err`}>{errors[name]}</span>
  const sending = status.kind === 'sending'

  return createPortal(
    <div ref={rootRef} className={`pd-dlg bk${open ? ' is-open' : ''}`} inert={!open} onClick={onClose}>
      <div className="pd-dlg__panel bk__panel" role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="pd-dlg__close" type="button" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        </button>
        <div className="pd-dlg__sheet" data-squircle="36">
          <div className="bk__body" data-lenis-prevent>
            {status.kind === 'sent' ? (
              <div className="bk__state bk__done" role="status">
                {/* Animated check: the ring draws, fills, then the tick draws in. */}
                <svg className="bk__check" viewBox="0 0 88 88" aria-hidden="true">
                  <circle className="bk__check-ring" cx="44" cy="44" r="40" />
                  <path className="bk__check-tick" d="M28 45.5 38.5 56 61 33.5" />
                </svg>
                <h2 id={`${uid}-title`}>{status.viaEmail ? 'Almost done' : 'Booking request sent'}</h2>
                <p className="bk__lead">We’ll get back to you as soon as possible, usually within one working day.</p>
                {status.viaEmail ? (
                  <p>Thank you, {status.name}. Your email app should have opened with your booking request filled in. Just press send.</p>
                ) : (
                  <p>Thank you, {status.name}. We’ll reply to <strong>{status.email}</strong> to confirm availability for {trip.dates}. No payment is taken until you confirm.</p>
                )}
                <p className="bk__small">Questions in the meantime? Email <a href={`mailto:${contact.email}`}>{contact.email}</a> or call us on <a href={contact.phoneHref}>{contact.phone}</a>.</p>
                <button type="button" className="ct__again" onClick={onClose}>Back to the trip</button>
              </div>
            ) : (
              <>
              {sending && (
                <div className="bk__state bk__loading" role="status">
                  <svg className="bk__spinner" viewBox="0 0 56 56" aria-hidden="true">
                    <circle className="bk__spinner-track" cx="28" cy="28" r="24" />
                    <circle className="bk__spinner-arc" cx="28" cy="28" r="24" />
                  </svg>
                  <p>Sending your booking request…</p>
                </div>
              )}
              {/* Kept mounted (just hidden) while sending, so nothing typed is lost if the request fails. */}
              <form ref={formRef} className="bk__form" onSubmit={onSubmit} noValidate hidden={sending}>
                <p className="bk__eyebrow">Request to book</p>
                <h2 id={`${uid}-title`}>{trip.name}</h2>
                <div className="bk__trip">
                  <img src={trip.img} alt="" />
                  <div>
                    <strong>{trip.dates}</strong>
                    <span>{trip.length} · from {money(trip.price)} per person</span>
                  </div>
                </div>

                <div className="ct__grid bk__grid">
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
                    <span>Phone number <em>(optional)</em></span>
                    <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 000" />
                  </label>
                  <div className="ct__field" role="group" aria-labelledby={`${uid}-trav`}>
                    <span id={`${uid}-trav`}>Travellers</span>
                    <div className="bk__stepper">
                      <button type="button" aria-label="Remove a traveller" disabled={travellers <= 1} onClick={() => setTravellers((n) => Math.max(1, n - 1))}>−</button>
                      <output aria-live="polite">{travellers} {travellers === 1 ? 'traveller' : 'travellers'}</output>
                      <button type="button" aria-label="Add a traveller" disabled={travellers >= MAX_TRAVELLERS} onClick={() => setTravellers((n) => Math.min(MAX_TRAVELLERS, n + 1))}>+</button>
                    </div>
                  </div>
                  <label className="ct__field ct__field--full" htmlFor={`${uid}-departure`}>
                    <span>Departure</span>
                    <select id={`${uid}-departure`} name="departure" defaultValue={departures[0]}>
                      {departures.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </label>
                  <label className="ct__field ct__field--full" htmlFor={`${uid}-room`}>
                    <span>Room</span>
                    <select id={`${uid}-room`} name="room" defaultValue={rooms[0]}>
                      {rooms.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </label>
                  <label className="ct__field ct__field--full" htmlFor={`${uid}-message`}>
                    <span>Anything we should know? <em>(optional)</em></span>
                    <textarea id={`${uid}-message`} name="message" rows={4} placeholder="Dietary needs, celebrations, questions about the trip…" />
                  </label>
                  {/* Honeypot for spam bots: hidden from people and screen readers. */}
                  <input type="checkbox" name="botcheck" className="bk__hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                </div>

                {status.kind === 'error' && (
                  <p className="bk__error" role="alert">Sorry, we couldn’t send your request. Please try again, or email us at <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
                )}

                <div className="bk__foot">
                  <div className="bk__total">
                    <span>Estimated total</span>
                    <strong>from {money(travellers * trip.price)}</strong>
                    <small>No payment now. We confirm availability and the final price first.</small>
                  </div>
                  <button type="submit" className="btn-split is-light bk__submit" disabled={sending}>
                    <span className="btn-split__label">Send booking request</span>
                    <span className="btn-split__icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </button>
                </div>
              </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
