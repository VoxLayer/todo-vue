export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}`
}

export function isOverdue(iso) {
  if (!iso) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(iso) < today
}

export function isToday(iso) {
  if (!iso) return false
  return new Date().toISOString().slice(0, 10) === iso
}
