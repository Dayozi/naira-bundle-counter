import { useState } from 'react'
import { getHistory, clearHistory as clearAll, fmt, fmtDate } from '../storage'
import styles from './History.module.css'

export default function History({ onShowToast }) {
  const [history, setHistory]         = useState(getHistory)
  const [showConfirm, setShowConfirm] = useState(false)
  const [expanded, setExpanded]       = useState({})

  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const todayTx    = history.filter(t => t.ts >= todayStart.getTime())
  const todayTotal = todayTx.reduce((s, t) => s + t.total, 0)

  function handleClear() {
    clearAll()
    setHistory([])
    setExpanded({})
    setShowConfirm(false)
    onShowToast('History cleared')
  }

  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function buildParts(d) {
    // Guard: if d is malformed just return dash
    if (!d || typeof d !== 'object') return '—'
    const parts = []
    if (d.b > 0) parts.push(`${d.b} bundle${d.b > 1 ? 's' : ''}`)
    if (d.p > 0) parts.push(`${d.p} pack${d.p > 1 ? 's' : ''}`)
    if (d.l > 0) parts.push(`${d.l} loose`)
    return parts.join(' + ') || '—'
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Transaction History</h2>
        <button className={styles.clearBtn} onClick={() => setShowConfirm(true)}>Clear All</button>
      </div>

      {/* Today summary */}
      <div className={styles.summary}>
        <p className={styles.summaryLabel}>Today's Summary</p>
        <p className={styles.summaryAmount}>{fmt(todayTotal)}</p>
        <div className={styles.summaryRow}>
          <div className={styles.summaryStat}><strong>{todayTx.length}</strong> today</div>
          <div className={styles.summaryStat}><strong>{history.length}</strong> total saved</div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p>No transactions saved yet.<br />Count cash and tap SAVE.</p>
        </div>
      ) : (
        history.map((tx, index) => {
          // Use tx.id as key — migration guarantees it always exists now
          // Fallback to index just in case (belt and braces)
          const key    = tx.id ?? index
          const isOpen = !!expanded[key]

          return (
            <div key={key} className={styles.item}>

              {/* Collapsed header — always visible, tap to expand */}
              <button
                className={styles.itemHeader}
                onClick={() => toggleExpand(key)}
              >
                <div className={styles.itemHeaderLeft}>
                  <span className={styles.itemRef}>{tx.ref || 'Customer'}</span>
                  <span className={styles.itemTime}>{tx.ts ? fmtDate(tx.ts) : '—'}</span>
                </div>
                <div className={styles.itemHeaderRight}>
                  <span className={styles.itemAmount}>{fmt(tx.total ?? 0)}</span>
                  <span className={styles.itemNotes}>{(tx.notes ?? 0).toLocaleString()} notes</span>
                </div>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▾</span>
              </button>

              {/* Slip match status — always visible */}
              {tx.matched !== null && (
                <div className={styles.discRow}>
                  {tx.matched ? (
                    <span className={`${styles.discTag} ${styles.match}`}>
                      ✅ Slip matched — {fmt(tx.slip ?? 0)}
                    </span>
                  ) : (
                    <span className={`${styles.discTag} ${styles.mismatch}`}>
                      ❌ {(tx.total - (tx.slip ?? 0)) < 0
                        ? `SHORT by ${fmt(Math.abs(tx.total - (tx.slip ?? 0)))}`
                        : `OVER by ${fmt(tx.total - (tx.slip ?? 0))}`
                      } &nbsp;·&nbsp; Slip: {fmt(tx.slip ?? 0)} | Count: {fmt(tx.total)}
                    </span>
                  )}
                </div>
              )}

              {/* Expanded breakdown — receipt style */}
              {isOpen && (
                <div className={styles.breakdown}>
                  <div className={styles.breakdownHeader}>
                    <span>Denomination</span>
                    <span>Breakdown</span>
                    <span>Value</span>
                  </div>
                  {(tx.denoms ?? []).map((d, i) => (
                    <div key={i} className={styles.breakdownRow}>
                      <span className={styles.breakDenom}>{d?.label ?? '—'}</span>
                      <span className={styles.breakParts}>{buildParts(d)}</span>
                      <span className={styles.breakValue}>{fmt(d?.total ?? 0)}</span>
                    </div>
                  ))}
                  <div className={styles.breakdownTotal}>
                    <span>Grand Total</span>
                    <span></span>
                    <span>{fmt(tx.total ?? 0)}</span>
                  </div>
                </div>
              )}

            </div>
          )
        })
      )}

      {/* Confirm clear modal */}
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Clear History?</h2>
            <p>All saved transactions will be permanently deleted.</p>
            <div className={styles.modalBtns}>
              <button className={styles.btnCancel} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className={styles.btnConfirm} onClick={handleClear}>Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}