/**
 * Cliente HTTP simple para el backend Laravel de UNES Orienta IA.
 *
 * En dev: VITE_API_URL=http://localhost:8000/api
 * En prod: define VITE_API_URL con la URL pública de tu Laravel.
 *
 * Guarda el token de Sanctum en localStorage bajo `aquila_token`.
 * El PIN admin no se guarda: solo la `admin_session` que devuelve el backend,
 * que es un token efímero.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const TOKEN_KEY = 'aquila_token'
export const USER_KEY = 'aquila_user'
export const ADMIN_KEY = 'aquila_admin_session'

const authHeader = () => {
  const t = localStorage.getItem(TOKEN_KEY)
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const adminHeader = () => {
  const s = localStorage.getItem(ADMIN_KEY)
  return s ? { 'X-Admin-Session': s } : {}
}

async function req(method, path, body = null, extraHeaders = {}) {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders
  }
  // Sin cookies: la API es stateless, usamos tokens Bearer.
  // Esto evita el CSRF de Laravel Sanctum y problemas cross-origin.
  const opts = { method, headers, credentials: 'omit' }
  if (body !== null && body !== undefined) {
    headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }

  let res, data
  try {
    res = await fetch(`${BASE}${path}`, opts)
  } catch (e) {
    throw new ApiError(0, 'network', 'No hay conexión con el servidor.', {})
  }
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.code || 'http_error',
      data.message || `Error ${res.status}`,
      data
    )
  }
  return data
}

export class ApiError extends Error {
  constructor(status, code, message, data) {
    super(message)
    this.status = status
    this.code = code
    this.data = data
  }
}

// ---------------- Auth ----------------
export const api = {
  auth: {
    login: (email) => req('POST', '/auth/login', { email }),
    register: (payload) => req('POST', '/auth/register', payload),
    me: () => req('GET', '/auth/me', null, authHeader()),
    logout: () => req('POST', '/auth/logout', null, authHeader())
  },
  chat: {
    send: (messages) =>
      req('POST', '/chat', { messages }, authHeader())
  },
  admin: {
    login: (pin) => req('POST', '/admin/login', { pin }),
    logout: () => req('POST', '/admin/logout', null, adminHeader()),
    getConfig: () => req('GET', '/admin/bot-config', null, adminHeader()),
    updateConfig: (payload) =>
      req('PUT', '/admin/bot-config', payload, adminHeader()),
    testConnection: () =>
      req('POST', '/admin/bot-config/test', null, adminHeader()),

    // --- Gestión de usuarios registrados ---
    users: {
      list: ({
        q = '',
        ciclo = '',
        desde = '',
        hasta = '',
        page = 1,
        perPage = 25,
        sort = 'created_at',
        dir = 'desc'
      } = {}) => {
        const p = new URLSearchParams()
        if (q) p.set('q', q)
        if (ciclo) p.set('ciclo', ciclo)
        if (desde) p.set('desde', desde)
        if (hasta) p.set('hasta', hasta)
        p.set('page', page)
        p.set('per_page', perPage)
        p.set('sort', sort)
        p.set('dir', dir)
        return req('GET', `/admin/users?${p.toString()}`, null, adminHeader())
      },
      get: (id) => req('GET', `/admin/users/${id}`, null, adminHeader()),
      remove: (id) => req('DELETE', `/admin/users/${id}`, null, adminHeader()),
      /**
       * URL directa a la descarga CSV. Aplica los mismos filtros que list().
       * Devuelve string, no request.
       */
      exportCsvUrl: ({ q = '', ciclo = '', desde = '', hasta = '' } = {}) => {
        const s = localStorage.getItem(ADMIN_KEY) || ''
        const p = new URLSearchParams({ admin_session: s })
        if (q) p.set('q', q)
        if (ciclo) p.set('ciclo', ciclo)
        if (desde) p.set('desde', desde)
        if (hasta) p.set('hasta', hasta)
        return `${BASE}/admin/users/export.csv?${p.toString()}`
      }
    },

    // --- Dashboard analítico ---
    stats: ({ desde = '', hasta = '', ciclo = '' } = {}) => {
      const p = new URLSearchParams()
      if (desde) p.set('desde', desde)
      if (hasta) p.set('hasta', hasta)
      if (ciclo) p.set('ciclo', ciclo)
      const qs = p.toString()
      return req('GET', `/admin/stats${qs ? '?' + qs : ''}`, null, adminHeader())
    },

    // --- Base de conocimiento (RAG) ---
    knowledge: {
      list: (category) =>
        req(
          'GET',
          '/admin/knowledge' + (category ? `?category=${encodeURIComponent(category)}` : ''),
          null,
          adminHeader()
        ),
      get: (id) => req('GET', `/admin/knowledge/${id}`, null, adminHeader()),
      create: (payload) => req('POST', '/admin/knowledge', payload, adminHeader()),
      update: (id, payload) =>
        req('PUT', `/admin/knowledge/${id}`, payload, adminHeader()),
      remove: (id) => req('DELETE', `/admin/knowledge/${id}`, null, adminHeader()),
      reindexOne: (id) =>
        req('POST', `/admin/knowledge/${id}/reindex`, null, adminHeader()),
      reindexAll: () =>
        req('POST', '/admin/knowledge/reindex-all', null, adminHeader()),
      preview: (query, topK = 4) =>
        req('POST', '/admin/knowledge/preview', { query, top_k: topK }, adminHeader())
    }
  }
}

// ---------------- Persistencia local del usuario ----------------
export const authStore = {
  save({ token, user }) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  user() {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  token() {
    return localStorage.getItem(TOKEN_KEY)
  },
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY)
  }
}

export const adminStore = {
  save(token) {
    if (token) localStorage.setItem(ADMIN_KEY, token)
  },
  clear() {
    localStorage.removeItem(ADMIN_KEY)
  },
  token() {
    return localStorage.getItem(ADMIN_KEY)
  },
  isActive() {
    return !!localStorage.getItem(ADMIN_KEY)
  }
}
