const LOGIN_TOKEN_KEY = 'login_token'

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomValues = new Uint32Array(32)
  crypto.getRandomValues(randomValues)
  return Array.from(randomValues, v => chars[v % chars.length]).join('')
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(LOGIN_TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOGIN_TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LOGIN_TOKEN_KEY)
}

export { generateToken }
