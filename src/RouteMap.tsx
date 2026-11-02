import { useMemo, useState, type CSSProperties } from 'react'
import { Reveal } from './motion'
import { cambodiaPath, lakePath, project } from './cambodiaGeo'
import { images } from './siteImages'

/*
 * "Your route": a plain list of stops beside a quiet map of Cambodia (true outline from Natural Earth).
 * On reveal the route draws once and the pins fade in; hovering a stop (list or pin) shows its name and a photo above it.
 */
type Stop = { name: string; days: string; lon: number; lat: number; label: 'l' | 'r'; img: string }

const stops: Stop[] = [
  { name: 'Siem Reap', days: 'Day 01–02', lon: 103.86, lat: 13.362, label: 'r', img: images.itineraryDays[1].main },
  { name: 'Battambang', days: 'Day 03–04', lon: 103.198, lat: 13.095, label: 'l', img: images.itineraryDays[3].main },
  { name: 'Tatai River', days: 'Day 05–06', lon: 103.12, lat: 11.58, label: 'l', img: images.tripHighlights[1] },
  { name: 'Phum Teuk Sre', days: 'Day 07', lon: 103.77, lat: 11.12, label: 'r', img: images.itineraryDays[6].main },
  { name: 'Kampot', days: 'Day 08–09', lon: 104.18, lat: 10.61, label: 'l', img: images.itineraryDays[8].main },
  { name: 'Ha Tien, Vietnam', days: 'Day 10', lon: 104.48, lat: 10.38, label: 'r', img: images.itineraryDays[9].main },
]

// Catmull-Rom spline through the stops, as cubic Béziers.
function smooth(pts: [number, number][]) {
  const f = (v: number) => v.toFixed(1)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i - 1] ?? pts[i], b = pts[i], c = pts[i + 1], e = pts[i + 2] ?? c
    d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`
  }
  return d
}

export default function RouteMap() {
  const [active, setActive] = useState<number | null>(null)
  const pts = useMemo(() => stops.map((s) => project([s.lon, s.lat])), [])
  const route = useMemo(() => smooth(pts), [pts])
  const hover = (i: number | null) => () => setActive(i)

  return (
    <section className="rm" aria-labelledby="rm-title">
      <Reveal className="rm__side">
        <p className="pd__label">Your route</p>
        <h2 className="rm__title" id="rm-title">Six stops,<br />one journey</h2>
        <ol className="rm__list">
          {stops.map((s, i) => (
            <li key={s.name} style={{ '--i': i } as CSSProperties}>
              <button
                type="button"
                className={`rm__stop${active === i ? ' is-active' : ''}${active !== null && active !== i ? ' is-dim' : ''}`}
                onMouseEnter={hover(i)} onMouseLeave={hover(null)} onFocus={hover(i)} onBlur={hover(null)}
              >
                <span className="rm__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="rm__name">{s.name}</span>
                <span className="rm__days">{s.days}</span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="rm__mapwrap">
        <figure className="rm__map" data-squircle="44">
          <div className="rm__canvas">
          <svg viewBox="20 18 560 472" role="img" aria-label="Map of the route through Cambodia: Siem Reap, Battambang, Tatai River, Phum Teuk Sre, Kampot and on to Ha Tien in Vietnam">
            <path className="rm__kh" d={cambodiaPath} />
            <path className="rm__lake" d={lakePath} />
            <path className="rm__route" d={route} pathLength={1} />
            {stops.map((s, i) => {
              const [x, y] = pts[i]
              const left = s.label === 'l'
              return (
                <g
                  key={s.name}
                  className={`rm__pin${active === i ? ' is-active' : ''}`}
                  style={{ '--i': i } as CSSProperties}
                  transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                  onMouseEnter={hover(i)} onMouseLeave={hover(null)}
                >
                  <circle className="rm__hit" r={16} />
                  <circle className="rm__dot" r={6} />
                  <text className="rm__lab" x={left ? -14 : 14} y={0.5} textAnchor={left ? 'end' : 'start'}>{s.name}</text>
                </g>
              )
            })}
          </svg>
          {/* Photo cards sit above each pin (positioned in % of the 560×472 viewBox) and fade in on hover. */}
          {stops.map((s, i) => (
            <div
              key={s.name}
              className={`rm__card${active === i ? ' is-active' : ''}`}
              style={{ left: `${((pts[i][0] - 20) / 560) * 100}%`, top: `${((pts[i][1] - 18) / 472) * 100}%` }}
              aria-hidden="true"
            >
              <img src={s.img} alt="" loading="lazy" />
            </div>
          ))}
          </div>
        </figure>
      </Reveal>
    </section>
  )
}
