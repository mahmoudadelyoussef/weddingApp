import { useCallback } from 'react'
import './App.css'
import { buildWeddingIcsFile, downloadIcsFile } from './calendarIcs'

const TICKER =
  'YOU ARE INVITED • MAHMOUD & NOURHAN • YOU ARE INVITED • MAHMOUD & NOURHAN • '

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function App() {
  const handleAddToCalendar = useCallback(() => {
    const ics = buildWeddingIcsFile()
    downloadIcsFile(ics, 'mahmoud-nourhan-wedding.ics')
  }, [])

  return (
    <div className="invitation">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>{TICKER.repeat(6)}</span>
          <span>{TICKER.repeat(6)}</span>
        </div>
      </div>

      <div className="invitation__scene">
        <div className="watercolor watercolor--one" aria-hidden="true" />
        <div className="watercolor watercolor--two" aria-hidden="true" />
        <div className="watercolor watercolor--three" aria-hidden="true" />
        <div className="watercolor watercolor--four" aria-hidden="true" />

        <div className="card-shell">
          <main className="card">
            <header className="card__header card-reveal">
              <span className="card__heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <p className="card__together">Together with</p>
            </header>

            <h1 className="card__names card-reveal">
              Mahmoud <span className="card__ampersand">&amp;</span> Nourhan
            </h1>

            <p className="card__honour card-reveal">
              Request the honour of your presence at the celebration of their marriage
            </p>

            <div className="card__facts card-reveal">
              <div className="fact">
                <IconCalendar className="fact__icon" />
                <span className="fact__label">Date</span>
                <span className="fact__value">Saturday 27/6/2026</span>
              </div>
              <div className="fact">
                <IconClock className="fact__icon" />
                <span className="fact__label">Time</span>
                <span className="fact__value">7:00 PM</span>
              </div>
              <div className="fact">
                <IconPin className="fact__icon" />
                <span className="fact__label">Location</span>
                <span className="fact__value">Infantry House ( Star Garden )</span>
              </div>
            </div>

            <div className="card__actions card-reveal">
              <a
                className="card__cta"
                href="https://maps.app.goo.gl/7uWuVi5djJRUnc346"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Location
              </a>
              <button
                type="button"
                className="card__cta card__cta--secondary"
                onClick={handleAddToCalendar}
              >
                Add to calendar
              </button>
            </div>

            <p className="card__footer card-reveal">
              We look forward to celebrating with you
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
