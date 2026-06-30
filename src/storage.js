// ── CONSTANTS ──────────────────────────────────────────
export const DENOMS = [
  { label: '₦1,000', value: 1000 },
  { label: '₦500',   value: 500  },
  { label: '₦200',   value: 200  },
  { label: '₦100',   value: 100  },
  { label: '₦50',    value: 50   },
  { label: '₦20',    value: 20   },
  { label: '₦10',    value: 10   },
  { label: '₦5',     value: 5    },
]

export const PACK_SIZE   = 100   // notes per pack
export const BUNDLE_SIZE = 500   // notes per bundle (5 packs)

// ── FORMATTERS ─────────────────────────────────────────
export function fmt(n) {
  if (n === 0) return '₦0'
  return '₦' + n.toLocaleString('en-NG')
}

export function fmtDate(ts) {
  const d = new Date(ts)
  return (
    d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  )
}

// ── HISTORY ────────────────────────────────────────────
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('nbc_history')) || []
  } catch {
    return []
  }
}

export function saveToHistory(tx) {
  const history = getHistory()
  history.unshift(tx)
  localStorage.setItem('nbc_history', JSON.stringify(history))
}

export function clearHistory() {
  localStorage.removeItem('nbc_history')
}

// ── PROFILE ────────────────────────────────────────────
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem('nbc_profile')) || {}
  } catch {
    return {}
  }
}

export function saveProfile(profile) {
  localStorage.setItem('nbc_profile', JSON.stringify(profile))
}

// ── WELCOME MODAL ─────────────────────────────────────
export function hasAcceptedWelcome() {
  try {
    return localStorage.getItem('nbc_welcome_accepted') === 'true'
  } catch {
    return false
  }
}

export function setAcceptedWelcome() {
  localStorage.setItem('nbc_welcome_accepted', 'true')
}

// ── HELPERS ────────────────────────────────────────────
export function calcDenom(bundles, packs, loose, denomValue) {
  const notes = bundles * BUNDLE_SIZE + packs * PACK_SIZE + loose
  const value = notes * denomValue
  return { notes, value }
}

export function buildEmptyRows() {
  return DENOMS.map(() => ({ bundles: '', packs: '', loose: '' }))
}