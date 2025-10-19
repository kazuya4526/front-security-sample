// 超簡易インメモリストア（プロセス内だけ）
// 本番NG: プロセス再起動で消える / スケールアウト不可


type SessionInfo = { userId: string; issuedAt: number }


type Message = {
  id: string
  userId: string
  content: string // XSSデモ: サニタイズしない
  createdAt: number
}


type MemStore = {
  sessions: Map<string, SessionInfo>
  messages: Message[]
}


const globalAny = globalThis as any


if (!globalAny.__INSECURE_STORE__) {
  globalAny.__INSECURE_STORE__ = {
    sessions: new Map<string, SessionInfo>(),
    messages: [] as Message[]
  } as MemStore
}


export const store: MemStore = globalAny.__INSECURE_STORE__