import { useState } from 'react'
import { getHistory, clearHistory as clearAll, fmt, fmtDate } from '../storage'
import styles from './History.module.css'

export default function History({ onShowToast }) {
  const [history, setHistory] = useState(getHistory)
  const [showConfirm, setShowConfirm] = useState(false)

  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const todayTx    = history.filter(t => t.ts >= todayStart.getTime())
  const todayTotal = todayTx.reduce((s, t) => s + t.total, 0)

  function handleClear() {
    clearAll()
    setHistory([])
    setShowConfirm(false)
    onShowToast('History cleared')
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
        history.map(tx => (
          <div key={tx.id} className={styles.item}>
            <div className={styles.itemTop}>
              <span className={styles.itemRef}>{tx.ref}</span>
              <span className={styles.itemTime}>{fmtDate(tx.ts)}</span>
            </div>
            <div className={styles.itemAmount}>{fmt(tx.total)}</div>
            <div className={styles.itemNotes}>{tx.notes?.toLocaleString()} notes</div>
            <div className={styles.itemDenoms}>
              {tx.denoms?.map((d, i) => (
                <span key={i} className={styles.denomTag}>{d.label}: {fmt(d.total)}</span>
              ))}
            </div>
            {tx.matched !== null && (
              <span className={`${styles.discTag} ${tx.matched ? styles.match : styles.mismatch}`}>
                {tx.matched ? '✅ Slip matched' : `❌ Mismatch — slip was ${fmt(tx.slip)}`}
              </span>
            )}
          </div>
        ))
      )}

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
