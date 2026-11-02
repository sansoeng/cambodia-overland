import { useRef } from 'react'
import { PageHero } from './Hero'
import { Footer, PillButton, PlanTrip } from './sections'
import { Reveal, ScrollRevealText, usePinRefresh, useSquircles } from './motion'
import { images } from './siteImages'

/* Promises we make on every trip */
const commitments = [
  { title: 'Fair pay, always', text: 'Guides, drivers and homestay hosts are paid fairly and on time, and every tip goes straight to the person who earned it.' },
  { title: 'Wildlife stays wild', text: 'No elephant rides, animal shows or captive wildlife. We only visit sanctuaries and forests that put animals first.' },
  { title: 'Children are not attractions', text: 'We never visit orphanages or schools during lessons, and follow child-safe travel guidance in every community.' },
  { title: 'A lighter footprint', text: 'Small groups, refillable water on every vehicle, locally owned stays and meals that keep money in Cambodian hands.' },
]

/* How travellers can help, in the spirit of "Be mindful of…" */
const guide = [
  {
    title: 'Be mindful of people.',
    img: images.ethical.guide[0], alt: 'Two children with bicycles on a village road',
    tips: [
      { lead: 'Ask before you take a photo.', text: 'Monks, market vendors and families are happy to say yes, but respect a no, especially when it comes to children.' },
      { lead: 'Spend locally.', text: 'Eat at family restaurants, buy from artisans and markets, and the money you spend stays in the community.' },
      { lead: 'Learn a few Khmer words.', text: '“Choum reap suor” (hello) and “arkoun” (thank you) go a long way. And smile, it is the universal language.' },
    ],
  },
  {
    title: 'Be mindful of culture.',
    img: images.ethical.guide[1], alt: 'Inside a Buddhist pagoda in Cambodia',
    tips: [
      { lead: 'Cover shoulders and knees.', text: 'Temples, pagodas and the Royal Palace are sacred places. Light, loose clothing keeps you cool and respectful.' },
      { lead: 'Shoes and hats off indoors.', text: 'Remove them before entering a pagoda or a home, and never point your feet towards a Buddha image or a monk.' },
      { lead: 'Know the small gestures.', text: 'Greet with a sampeah, palms together. Avoid touching anyone’s head, and women should not hand items directly to monks.' },
    ],
  },
  {
    title: 'Be mindful of the land.',
    img: images.ethical.guide[2], alt: 'Green rice paddies in the Cambodian countryside',
    tips: [
      { lead: 'Refill, don’t rebuy.', text: 'Bring a reusable bottle. We carry refill water on every vehicle, so you will never need single-use plastic.' },
      { lead: 'Leave the stones where they are.', text: 'Do not climb on fragile ruins, sit on carvings or take fragments home. Angkor has stood for 900 years; let’s keep it that way.' },
      { lead: 'Stay on marked paths.', text: 'In the forest and the countryside, trails are marked for a reason. Follow your guide and respect every “no entry” sign.' },
    ],
  },
  {
    title: 'Be mindful of wildlife.',
    img: images.ethical.guide[3], alt: 'Rainforest hills of the Cardamom Mountains',
    tips: [
      { lead: 'Skip the animal photo props.', text: 'Avoid paying to hold or ride animals, or to watch them perform. If it seems wrong, it probably is.' },
      { lead: 'Don’t buy wildlife products.', text: 'Say no to souvenirs, medicines or dishes made from wild or endangered animals.' },
      { lead: 'Choose genuine sanctuaries.', text: 'Visit rescue and conservation centres that let animals live naturally. We are happy to recommend the ones we trust.' },
    ],
  },
  {
    title: 'Be mindful of children.',
    img: images.ethical.guide[4], alt: 'Stilt houses in a village on the Tonlé Sap',
    tips: [
      { lead: 'Don’t give money or sweets.', text: 'It can keep children out of school and on the street. Support community programmes and established charities instead.' },
      { lead: 'Never visit orphanages.', text: 'Orphanage tourism can do real harm, separating children from families. We never include these visits, and ask you not to either.' },
      { lead: 'Protect their privacy.', text: 'Ask a parent before taking a photo, and think twice before sharing images of children online.' },
    ],
  },
]

/** #/ethical-tourism: "Travel With Integrity", our responsible-travel promises and a guide for travellers. */
export default function EthicalTourismPage() {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()

  return (
    <div className="ab et" ref={root} data-bg-root>
      <PageHero img={images.ethical.hero} alt="Carved sandstone temple of Banteay Srei" lines={['Travel', 'with integrity']} intro="Ethical, responsible travel is the only way we explore Cambodia." />

      <main>
        <section className="about" aria-label="Our approach">
          <p className="eyebrow">Ethical tourism</p>
          <div>
            <ScrollRevealText text="When we travel, we are guests in someone else's home. The best trip is one that leaves Cambodia a little better than we found it." />
            <div className="ab__cols">
              <Reveal><p>That means respecting the culture, the land and the wildlife, and making sure the people who welcome us benefit from every visit. It is why we exist: to share Cambodia through local eyes, in a way locals are proud of.</p></Reveal>
              <Reveal delay={100}><p>Below are the promises we make on every trip, and a few simple ways you can travel well too. Soak it all in, and make sure Cambodia would love to have you back.</p></Reveal>
            </div>
          </div>
        </section>

        <section className="ab__resp" aria-labelledby="et-promise-title">
          <div className="ab__resp-head">
            <div>
              <Reveal><p className="eyebrow">Our promises</p></Reveal>
              <Reveal delay={120}><h2 id="et-promise-title">What we do on<br />every single trip.</h2></Reveal>
            </div>
          </div>
          <div className="ab__resp-grid">
            <Reveal className="ab__resp-img">
              <img src={images.ethical.promises} alt="Monks in saffron robes walking at Angkor Wat" loading="lazy" />
            </Reveal>
            {commitments.map((c, i) => (
              <Reveal className="ab__resp-card" key={c.title} delay={i * 90}>
                <span className="ab__resp-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="et__guide" aria-labelledby="et-guide-title">
          <div className="et__guide-head">
            <Reveal><p className="eyebrow">Your part</p></Reveal>
            <Reveal delay={120}><h2 id="et-guide-title">How to travel well<br />in Cambodia.</h2></Reveal>
          </div>
          {guide.map((g, i) => (
            <article className="et__row" key={g.title}>
              <Reveal className="et__row-img">
                <img src={g.img} alt={g.alt} loading="lazy" />
              </Reveal>
              <div className="et__row-copy">
                <Reveal><span className="ab__resp-num">{String(i + 1).padStart(2, '0')}</span></Reveal>
                <Reveal delay={80}><h3>{g.title}</h3></Reveal>
                <ul>
                  {g.tips.map((t, k) => (
                    <li key={t.lead}>
                      <Reveal delay={140 + k * 80}><strong>{t.lead}</strong> {t.text}</Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="et__ask" aria-labelledby="et-ask-title">
          <Reveal className="et__ask-box">
            <h2 id="et-ask-title">Questions about travelling responsibly in Cambodia?</h2>
            <p>Our Siem Reap team is always happy to help, from what to pack for temple visits to which sanctuaries we trust.</p>
            <PillButton href="#/contact">Get in touch</PillButton>
          </Reveal>
        </section>

        <PlanTrip />
      </main>
      <Footer />
    </div>
  )
}
