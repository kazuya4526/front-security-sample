export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin') || ''

  setHeader(event, 'Access-Control-Allow-Origin', origin)

  setHeader(event, 'Access-Control-Allow-Credentials', 'true')
  setHeader(
    event,
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  setHeader(
    event,
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )

  // OPTIONSリクエスト（プリフライト）を即座に返す
  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})