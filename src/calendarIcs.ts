/** Wedding details for calendar export (iOS Calendar, Google Calendar, etc.). */
export const WEDDING_CALENDAR = {
  title: 'Wedding — Mahmoud & Nourhan',
  location: 'Infantry House (Star Garden)',
  /** Maps link included so guests can open directions from the event. */
  description:
    'Celebration of marriage — Mahmoud & Nourhan. Maps: https://maps.app.goo.gl/7uWuVi5djJRUnc346',
  /** Floating local time: 7:00 PM on the guest’s device (same as invite wording). */
  dtStart: '20260627T190000',
  dtEnd: '20260627T230000',
} as const

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function formatDtStampUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

/** Fold long iCalendar lines per RFC 5545 (max 75 octets per segment). */
function foldIcsLine(line: string): string {
  const max = 75
  if (line.length <= max) return line
  const parts: string[] = []
  let rest = line
  while (rest.length > max) {
    parts.push(rest.slice(0, max))
    rest = ` ${rest.slice(max)}`
  }
  parts.push(rest)
  return parts.join('\r\n')
}

export function buildWeddingIcsFile(): string {
  const dtStamp = formatDtStampUtc(new Date())
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MahmoudNourhan//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-mahmoud-nourhan-20260627@local',
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${WEDDING_CALENDAR.dtStart}`,
    `DTEND:${WEDDING_CALENDAR.dtEnd}`,
    `SUMMARY:${escapeIcsText(WEDDING_CALENDAR.title)}`,
    `LOCATION:${escapeIcsText(WEDDING_CALENDAR.location)}`,
    `DESCRIPTION:${escapeIcsText(WEDDING_CALENDAR.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(foldIcsLine).join('\r\n')
}

function isMobileUserAgent(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function triggerDownload(icsBody: string, filename: string): void {
  const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 2500)
}

/**
 * Prefer opening the system calendar / share sheet instead of only downloading a file.
 * 1) Web Share with .ics (iOS/Android often show “Add to Calendar” or similar)
 * 2) Open calendar data in a new tab (no `download` attribute)
 * 3) Same-tab open on mobile if pop-ups are blocked (user can go Back)
 * 4) Download .ics as last resort (typical desktop fallback)
 */
export async function addEventToNativeCalendar(
  icsBody: string,
  filename: string,
): Promise<void> {
  const file = new File([icsBody], filename, {
    type: 'text/calendar',
    lastModified: Date.now(),
  })

  const sharePayload: ShareData = {
    files: [file],
    title: WEDDING_CALENDAR.title,
    text: 'Add this wedding to your calendar.',
  }

  if (typeof navigator.share === 'function') {
    try {
      const canShareFiles =
        typeof navigator.canShare !== 'function' || navigator.canShare(sharePayload)
      if (canShareFiles) {
        await navigator.share(sharePayload)
        return
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
    }
  }

  const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const revokeLater = () => window.setTimeout(() => URL.revokeObjectURL(url), 120_000)

  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (opened) {
    revokeLater()
    return
  }

  if (isMobileUserAgent()) {
    window.location.assign(url)
    return
  }

  triggerDownload(icsBody, filename)
}
