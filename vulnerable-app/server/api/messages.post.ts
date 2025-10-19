import { store } from '../utils/memStore'


function requireAuth(event: any) {
  const sessionId = getCookie(event, 'session_id') || ''
  const info = store.sessions.get(sessionId)
  if (!info) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: '無効なセッション' })
  return info
}


export default defineEventHandler(async (event) => {
  const info = requireAuth(event)
  const body = await readBody<{ content?: string }>(event)
  const content = (body.content || '')


  if (!content) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'content が必須です' })
  }

  store.messages.push({
    id: Math.random().toString(36).slice(2),
    userId: info.userId,
    content,
    createdAt: Date.now()
  })


  return { ok: true }
})