export function formatClock(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatCalendar(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

export function formatRelativeTime(timestamp: string) {
  const diffMs = new Date(timestamp).getTime() - Date.now()
  const minuteMs = 60_000
  const hourMs = 60 * minuteMs
  const dayMs = 24 * hourMs
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffMs) < hourMs) {
    return rtf.format(Math.round(diffMs / minuteMs), 'minute')
  }

  if (Math.abs(diffMs) < dayMs) {
    return rtf.format(Math.round(diffMs / hourMs), 'hour')
  }

  return rtf.format(Math.round(diffMs / dayMs), 'day')
}

export function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1)}…`
}
