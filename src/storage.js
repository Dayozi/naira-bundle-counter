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

export const PACK_SIZE   = 100
export const BUNDLE_SIZE = 500

// ── SCHEMA VERSION ─────────────────────────────────────
// Bump this number whenever the shape of a saved transaction changes.
// getHistory() will detect old records and migrate them automatically.
const SCHEMA_VERSION = 1

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

// ── MIGRATION ──────────────────────────────────────────
// Called once on load. Fixes any old records missing fields
// introduced in later versions so they never cause crashes.
function migrateHistory(records) {
  let changed = false
  const migrated = records.map((tx, index) => {
    let t = { ...tx }

    // FIX 1: backfill missing id (the delete-collision bug)
    // Old records saved before we added `id` all have id === undefined.
    // We give them a stable unique id based on timestamp + index.
    if (t.id === undefined || t.id === null) {
      t.id = (t.ts || Date.now()) + '_' + index
      changed = true
    }

    // FIX 2: backfill missing schemaVersion
    if (t.schemaVersion === undefined) {
      t.schemaVersion = SCHEMA_VERSION
      changed = true
    }

    // FIX 3: ensure denoms is always an array so .map() never throws
    if (!Array.isArray(t.denoms)) {
      t.denoms = []
      changed = true
    }

    // FIX 4: ensure matched is explicitly null not undefined
    if (t.matched === undefined) {
      t.matched = null
      changed = true
    }

    return t
  })

  // Only write back if something actually changed — avoids unnecessary writes
  if (changed) {
    try {
      localStorage.setItem('nbc_history', JSON.stringify(migrated))
    } catch {
      // If write fails (quota, Safari private) we still return good data in memory
    }
  }

  return migrated
}

// ── HISTORY ────────────────────────────────────────────
export function getHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem('nbc_history')) || []
    return migrateHistory(raw)
  } catch {
    return []
  }
}

export function saveToHistory(tx) {
  try {
    const history = getHistory()
    const record = {
      ...tx,
      id: tx.id ?? Date.now(),
      schemaVersion: SCHEMA_VERSION,
      denoms: Array.isArray(tx.denoms) ? tx.denoms : [],
      matched: tx.matched ?? null,
    }
    history.unshift(record)
    localStorage.setItem('nbc_history', JSON.stringify(history))
  } catch (err) {
    console.error('saveToHistory failed:', err)
    throw err // re-throw so the caller can show a toast if needed
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem('nbc_history')
  } catch (err) {
    console.error('clearHistory failed:', err)
  }
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
  try {
    localStorage.setItem('nbc_profile', JSON.stringify(profile))
  } catch (err) {
    console.error('saveProfile failed:', err)
    throw err
  }
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
  try {
    localStorage.setItem('nbc_welcome_accepted', 'true')
  } catch {
    // fail silently — not critical
  }
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