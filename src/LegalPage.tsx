import { useRef } from 'react'
import SiteNav from './SiteNav'
import { Footer } from './sections'
import { Reveal, usePinRefresh, useSquircles } from './motion'
import { contact } from './ContactPage'

/*
 * Legal pages (#/privacy, #/terms): title + "last updated", a sticky contents list that jumps to each section,
 * and the sections. Wording is a general template for a Cambodian tour operator — have it reviewed
 * by a lawyer before launch.
 */
type Section = { id: string; title: string; body: (string | string[])[] }
type Doc = { title: string; eyebrow?: string; updated: string; intro: string; sections: Section[] }

const company = 'Cambodia Overland'
const regNo = '5000636459'

const privacy: Doc = {
  title: 'Privacy Policy',
  eyebrow: 'Legal',
  updated: '28 October 2026',
  intro: `This policy explains what personal information ${company} collects when you visit our website, enquire or book a trip, how we use it, and the choices you have.`,
  sections: [
    { id: 'who-we-are', title: 'Who we are', body: [`${company} (Cambodia registered company no. ${regNo}) is a locally owned tour operator based in Siem Reap, Cambodia. We are responsible for the personal information described in this policy.`] },
    { id: 'what-we-collect', title: 'Information we collect', body: ['We only collect what we need to plan and run your trip:', ['Contact details such as your name, email address, phone or WhatsApp number.', 'Booking details such as travel dates, group size, passport details where required for permits or accommodation, dietary needs and room preferences.', 'Health or accessibility information you choose to share so we can keep you safe and comfortable.', 'Messages you send us through our contact form, email or social media.', 'Basic technical data such as browser type, device and pages visited, collected through cookies.']] },
    { id: 'how-we-use', title: 'How we use your information', body: [['To reply to enquiries and prepare trip proposals.', 'To confirm bookings, arrange accommodation, transport, guides and permits.', 'To contact you before and during your trip, including in an emergency.', 'To improve our website and services.', 'To send occasional news or offers, only if you have agreed to receive them.']] },
    { id: 'sharing', title: 'Who we share it with', body: ['We never sell your personal information. We share only what is needed with trusted partners who help deliver your trip, such as hotels, homestays, boat and transport operators, local guides and, where required, government authorities for permits or border crossings. Each partner receives only the details necessary for their part of your journey.'] },
    { id: 'cookies', title: 'Cookies', body: ['Our website uses a small number of cookies to make it work properly and to understand how visitors use it. You can block or delete cookies in your browser settings; some parts of the site may not work as intended without them.'] },
    { id: 'storage', title: 'How long we keep it', body: ['We keep booking records for as long as needed to deliver your trip and to meet accounting and legal obligations, usually up to five years. Enquiries that do not lead to a booking are deleted after two years.'] },
    { id: 'security', title: 'Keeping it safe', body: ['We use reasonable technical and organisational measures to protect your information from loss, misuse or unauthorised access. Payment details are handled by our secure payment provider and are not stored on our systems.'] },
    { id: 'your-rights', title: 'Your rights', body: ['You can ask us at any time to see the personal information we hold about you, correct it, delete it, or stop sending you marketing messages. We will respond within 30 days.'] },
    { id: 'changes', title: 'Changes to this policy', body: ['We may update this policy from time to time. The date at the top of this page shows when it was last changed.'] },
    { id: 'contact-us', title: 'Contact us', body: [`If you have any questions about this policy or your information, contact us at ${contact.email} or ${contact.phone}, or write to us at ${contact.address.join(', ')}.`] },
  ],
}

const terms: Doc = {
  title: 'Terms & Conditions',
  updated: '28 October 2026',
  intro: `These terms apply to every trip booked with ${company}. Please read them before booking; by confirming a booking you agree to them.`,
  sections: [
    { id: 'booking', title: 'Booking and confirmation', body: ['A booking is confirmed once we have received your deposit and sent you a written confirmation. Please check all details on your confirmation and tell us straight away if anything is incorrect.'] },
    { id: 'payment', title: 'Prices and payment', body: [['A deposit of 30% of the trip price is due at booking.', 'The balance is due 45 days before departure. Bookings made within 45 days of departure must be paid in full.', 'Prices are per person in US dollars and include the services listed in your itinerary. International flights, visas, travel insurance, tips and personal expenses are not included.']] },
    { id: 'cancellation', title: 'Cancellation by you', body: ['If you need to cancel, please tell us in writing. The following charges apply, based on the total trip price:', ['More than 60 days before departure: loss of deposit.', '60 to 31 days before departure: 50% of the trip price.', '30 days or less before departure: 100% of the trip price.'], 'We strongly recommend travel insurance that covers cancellation.'] },
    { id: 'changes-by-us', title: 'Changes and cancellation by us', body: ['Travel in rural Cambodia can be affected by weather, road and river conditions. We may need to change an itinerary, accommodation or activity for your safety; we will always offer an alternative of similar standard. If we cancel a trip for reasons within our control, you will receive a full refund of the money paid to us.'] },
    { id: 'insurance', title: 'Travel insurance', body: ['Comprehensive travel insurance is a condition of joining our trips. It must cover medical treatment, emergency evacuation and repatriation, and ideally cancellation and lost belongings.'] },
    { id: 'documents', title: 'Passports, visas and health', body: ['You are responsible for holding a valid passport (at least six months’ validity), the correct visas for Cambodia and any onward countries such as Vietnam, and any vaccinations recommended by your doctor.'] },
    { id: 'conduct', title: 'Your responsibilities', body: ['Please follow the reasonable instructions of your guide, respect local customs, communities and wildlife, and take part in activities only within your own fitness and ability. We may remove a traveller from a trip, without refund, if their behaviour puts others at risk.'] },
    { id: 'liability', title: 'Our responsibility', body: ['We take care in choosing our partners and planning every trip. Our liability is limited to the value of the services you purchased from us, and we are not responsible for events beyond our reasonable control, such as natural disasters, political unrest, illness or transport delays.'] },
    { id: 'complaints', title: 'Complaints', body: ['If something is not right during your trip, please tell your guide straight away so we can try to fix it. If it cannot be resolved, write to us within 30 days of your return and we will respond promptly.'] },
    { id: 'law', title: 'Governing law', body: [`These terms are governed by the laws of the Kingdom of Cambodia. ${company} is registered in Cambodia under company no. ${regNo}.`] },
    { id: 'contact-us', title: 'Contact us', body: [`Questions about these terms? Contact us at ${contact.email} or ${contact.phone}.`] },
  ],
}

function LegalPage({ doc }: { doc: Doc }) {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()
  return (
    <div className="listing legal" ref={root} data-bg-root>
      <SiteNav tone="dark" />
      <main>
        <header className="legal__head">
          {doc.eyebrow && <Reveal><p className="eyebrow">{doc.eyebrow}</p></Reveal>}
          <Reveal delay={80}><h1>{doc.title}</h1></Reveal>
          <Reveal delay={140}><p className="legal__updated">Last updated {doc.updated}</p></Reveal>
        </header>
        <div className="legal__body">
          <nav className="legal__toc" aria-label="On this page">
            <p className="eyebrow">On this page</p>
            <ol>
              {doc.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
            </ol>
          </nav>
          <article className="legal__content">
            <p className="legal__intro">{doc.intro}</p>
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="legal__section">
                <h2>{s.title}</h2>
                {s.body.map((b, j) => Array.isArray(b)
                  ? <ul key={j}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
                  : <p key={j}>{b}</p>)}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const PrivacyPage = () => <LegalPage doc={privacy} />
export const TermsPage = () => <LegalPage doc={terms} />
