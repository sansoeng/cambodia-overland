import type { CSSProperties } from 'react'
import { images } from './siteImages'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/cambodiaoverland.travel/',
    icon: (
      <svg className="coming-soon__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/cambodiaoverland.travels/',
    icon: (
      <svg className="coming-soon__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/447398898675',
    icon: (
      <svg className="coming-soon__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
]

export default function ComingSoonPage() {
  const word1 = ['U', 'n', 'd', 'e', 'r']
  const word2 = ['M', 'a', 'i', 'n', 't', 'e', 'n', 'a', 'n', 'c', 'e']

  return (
    <div className="coming-soon">
      {/* Background Image */}
      <div className="coming-soon__bg" aria-hidden="true">
        <img
          src={images.comingSoonBg}
          alt="Great Hornbill flying across Cambodian jungle"
          className="coming-soon__bg-img"
        />
        <div className="coming-soon__overlay" />
      </div>

      {/* Top Header with Logo */}
      <header className="coming-soon__top">
        <a href="#/" aria-label="Cambodia Overland">
          <img
            src={images.logoLight}
            alt="Cambodia Overland"
            className="coming-soon__top-logo"
          />
        </a>
      </header>

      {/* Center Hero: Big Revealing "Under Maintenance" Title & Socials / Contact */}
      <main className="coming-soon__center">
        <h1 className="coming-soon__reveal-title" aria-label="Under Maintenance">
          <span className="coming-soon__word">
            {word1.map((ch, i) => (
              <span
                key={i}
                className="coming-soon__char"
                style={{ '--i': i } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="coming-soon__space">&nbsp;</span>
          <span className="coming-soon__word">
            {word2.map((ch, i) => (
              <span
                key={i}
                className="coming-soon__char"
                style={{ '--i': i + word1.length } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Social Media & Contact Row */}
        <div className="coming-soon__bottom-bar">
          {/* Social Media Icons */}
          <div className="coming-soon__social-icons" aria-label="Social media links">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="coming-soon__social-btn"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Contact Direct Links: Phone & Email */}
          <div className="coming-soon__contact-row">
            <a href="tel:+85581254836" className="coming-soon__contact-link">
              <svg className="coming-soon__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+855 81 254 836</span>
            </a>

            <a href="mailto:hi@cambodiaoverlandtravel.com" className="coming-soon__contact-link">
              <svg className="coming-soon__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>hi@cambodiaoverlandtravel.com</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
