// API helpers. Base URL: VITE_API_URL if set; otherwise the local Spring Boot server while developing
// and the deployed Render backend in a production build.
const DEPLOYED_BACKEND = 'https://backend-gzvy.onrender.com'
const API = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? DEPLOYED_BACKEND : 'http://localhost:8080')

export function getToken() {
  try { return localStorage.getItem('jwt_token') } catch { return null }
}
export function setToken(token) {
  try { localStorage.setItem('jwt_token', token) } catch { /* storage unavailable */ }
}
export function clearToken() {
  try { localStorage.removeItem('jwt_token') } catch { /* storage unavailable */ }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(`${API}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    const base = API || window.location.origin
    throw new Error(`Can't reach the server at ${base}. Start the backend and open ${base}/api/health in a new tab; if that shows {"status":"ok"} the browser is blocking this page's address (CORS).`)
  }


  if (res.status === 401 && path !== '/auth/login') {
    clearToken()
    window.dispatchEvent(new Event('auth:expired'))
    throw new Error('Your session expired. Sign in again.')
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}