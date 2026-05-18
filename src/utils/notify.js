const NOTIFY_KEY = 'todo_hero_last_notify'

export function isSupported() {
  return 'Notification' in window
}

export function isGranted() {
  return isSupported() && Notification.permission === 'granted'
}

export async function requestPermission() {
  if (!isSupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

export function sendDueNotification(count) {
  if (!isGranted() || count <= 0) return
  const today = new Date().toISOString().slice(0, 10)
  if (localStorage.getItem(NOTIFY_KEY) === today) return

  const body = count === 1
    ? 'You have 1 task due today!'
    : `You have ${count} tasks due today!`

  new Notification('Todo Hero', {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'todo-due-today',
    requireInteraction: true,
  })

  localStorage.setItem(NOTIFY_KEY, today)
}

export function checkAndNotify(todos) {
  const today = new Date().toISOString().slice(0, 10)
  const dueToday = todos.filter(t => !t.done && t.dueDate === today).length
  sendDueNotification(dueToday)
}

export function scheduleMorningCheck(todosRef) {
  const now = new Date()
  const target = new Date(now)
  target.setHours(6, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)

  const delay = target.getTime() - now.getTime()
  return setTimeout(() => {
    checkAndNotify(todosRef.value)
    // Re-schedule for next day
    const next = setTimeout(() => {
      checkAndNotify(todosRef.value)
      // After that, use setInterval every 24h
      setInterval(() => checkAndNotify(todosRef.value), 86400000)
    }, 86400000)
  }, delay)
}
