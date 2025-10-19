import { store } from '../utils/memStore'


function requireAuth(event: any) {
  const sessionId = getCookie(event, 'session_id') || ''
  console.log(sessionId)
  const info = store.sessions.get(sessionId)
  if (!info) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: '無効なセッション' })
  return info
}


export default defineEventHandler((event) => {
  requireAuth(event)
  return { items: store.messages.slice().reverse() }
})