import { useRef } from 'react'
import SiteNav from './SiteNav'
import { Footer, PillButton } from './sections'
import { Reveal, usePinRefresh, useSquircles } from './motion'
import { StoryCard, formatDate, stories } from './content'
import { blogPosts } from './blogPosts'

/** #/stories/<slug>: the full article for one blog story, with related stories below. */
export default function BlogPostPage({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null)
  useSquircles(root)
  usePinRefresh()
  const index = stories.findIndex((s) => s.slug === slug)
  const story = stories[index]
  const post = story && blogPosts[story.slug]

  if (!story || !post) {
    return (
      <div className="listing" ref={root} data-bg-root>
        <SiteNav tone="dark" />
        <main className="post post--missing">
          <p className="eyebrow">Stories</p>
          <h1 className="post__title">We couldn’t find that story.</h1>
          <PillButton href="#/stories">Back to all stories</PillButton>
        </main>
        <Footer />
      </div>
    )
  }

  // The next three stories, wrapping around the list.
  const related = [1, 2, 3].map((n) => stories[(index + n) % stories.length])

  return (
    <div className="listing" ref={root} data-bg-root>
      <SiteNav tone="dark" />
      <main>
        <article className="post">
          <header className="post__head">
            <Reveal><a className="post__back" href="#/stories"><span aria-hidden="true">←</span> All stories</a></Reveal>
            <Reveal delay={60}>
              <p className="post__meta"><span>{story.tag}</span><span><time dateTime={story.date}>{formatDate(story.date)}</time></span><span>{story.read} min read</span></p>
            </Reveal>
            <Reveal delay={120}><h1 className="post__title">{story.title}</h1></Reveal>
            <Reveal delay={180}><p className="post__lede">{story.excerpt}</p></Reveal>
          </header>

          <Reveal delay={120} className="post__hero">
            <div className="post__hero-media" data-squircle="44">
              <img src={story.img} alt="" />
            </div>
          </Reveal>

          <div className="post__body">
            <aside className="post__aside">
              <p className="post__label">Author</p>
              <div className="post__profile">
                {post.author.avatar
                  ? <img className="post__avatar" src={post.author.avatar} alt="" />
                  : <span className="post__avatar" aria-hidden="true">{post.author.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>}
                <div>
                  <p className="post__author">{post.author.name}</p>
                  {post.author.role && <p className="post__role">{post.author.role}</p>}
                </div>
              </div>
            </aside>
            <div className="post__prose">
              {post.intro && <p className="post__intro">{post.intro}</p>}
              {post.sections.map((s, i) => (
                <section key={s.heading}>
                  {s.image && (
                    <figure className="post__figure">
                      <img src={s.image.src} alt={s.image.caption} loading="lazy" />
                      <figcaption>{s.image.caption}</figcaption>
                    </figure>
                  )}
                  <h2>{s.heading}</h2>
                  {s.paragraphs.map((p, j) => typeof p === 'string' ? <p key={j}>{p}</p> : (
                    <ol className="post__ranking" key={j}>
                      {p.ranking.map((r) => <li key={r.name}><span className="post__rank">{r.rank}</span><span>{r.name}</span></li>)}
                    </ol>
                  ))}
                  {i === 0 && post.quote && (
                    <blockquote className="post__quote">
                      <p>“{post.quote.text}”</p>
                      <footer>{post.quote.by}</footer>
                    </blockquote>
                  )}
                </section>
              ))}
              {post.tips && (
                <div className="post__tips">
                  <h2>Good to know</h2>
                  <ul>{post.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        </article>

        <div className="listing__bar">
          <h2 className="listing__sub">Keep reading</h2>
          <a className="listing__count post__all" href="#/stories">View all stories</a>
        </div>
        <div className="listing__grid">
          {related.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}><StoryCard story={s} detailed /></Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
