export interface Period {
  /** `YYYY` or `YYYY-MM` */
  start: string
  /** `YYYY` or `YYYY-MM`; omitted means the same as start */
  end?: string
  ongoing?: boolean
}

function formatPoint(point: string, months: string[]) {
  const [year, month] = point.split('-')
  return month ? `${months[Number(month) - 1]} ${year}` : year!
}

export function formatPeriod(period: Period | undefined, months: string[], ongoingLabel: string, separator = ' – ') {
  if (!period) return ''
  const start = formatPoint(period.start, months)
  if (period.ongoing) return `${start}${separator}${ongoingLabel}`
  return period.end ? `${start}${separator}${formatPoint(period.end, months)}` : start
}
