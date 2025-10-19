import { store } from '../utils/memStore'


export default defineEventHandler(async (event) => {
  const body = await readBody<{ userId?: string; password?: string }>(event)
  const userId = (body.userId || '').trim()
  const password = (body.password || '')


  if (!userId || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'userId / password が必須です' })
  }


  // ⚠️ デモ用: 認証ロジックは超簡略化（パスワード検証ほぼ無し）
  // 実運用では絶対にこうしないこと！
  if (password.length < 1) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: '認証失敗' })
  }


  // 疑似セッションIDを発行（超簡易）
  const sessionId = `session_${Math.random().toString(36).slice(2)}_${Date.now()}`
  store.sessions.set(sessionId, { userId, issuedAt: Date.now() })

  setCookie(event, 'session_id', sessionId, {
    httpOnly: false, // クライアントからも参照可能にする（あえて脆弱にしている）
    sameSite: 'lax', // CSRF対策弱め
    secure: false, // 開発用に secure 属性は付けない
  })


  // CSRF対策なし / セッション固定対策なし
  return { message: 'OK' }
})