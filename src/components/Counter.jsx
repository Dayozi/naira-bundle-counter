import { useState, useCallback } from 'react'
import DenomCard from './DenomCard'
import {
  DENOMS, BUNDLE_SIZE, PACK_SIZE,
  fmt, buildEmptyRows, saveToHistory, calcDenom
} from '../storage'
import styles from './Counter.module.css'

export default function Counter({ onShowToast }) {
  const [rows, setRows]         = useState(buildEmptyRows())
  const [ref, setRef]           = useState('')
  const [slipAmount, setSlip]   = useState('')
  const [discResult, setDisc]   = useState(null) // null | { match, diff }
  const [showClear, setShowClear] = useState(false)

  // ── totals ──
  const totals = DENOMS.map((d, i) => {
    const b = parseInt(rows[i].bundles) || 0
    const p = parseInt(rows[i].packs)   || 0
    const l = parseInt(rows[i].loose)   || 0
    return calcDenom(b, p, l, d.value)
  })
  const grandTotal  = totals.reduce((s, t) => s + t.value, 0)
  const totalNotes  = totals.reduce((s, t) => s + t.notes, 0)

  const handleChange = useCallback((index, key, val) => {
    setRows(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: val }
      return next
    })
    setDisc(null)
  }, [])

  // ── discrepancy check ──
  function checkDisc() {
    const slip = parseFloat(slipAmount) || 0
    if (!slip)       { onShowToast('Enter deposit slip amount first'); return }
    if (!grandTotal) { onShowToast('No count entered yet'); return }
    const match = grandTotal === slip
    setDisc({ match, diff: grandTotal - slip, slip })
  }

  // ── save ──
  function handleSave() {
    if (!grandTotal) { onShowToast('Nothing to save — enter a count first'); return }
    const slip = parseFloat(slipAmount) || null
    const denomDetails = DENOMS.map((d, i) => {
      const b = parseInt(rows[i].bundles) || 0
      const p = parseInt(rows[i].packs)   || 0
      const l = parseInt(rows[i].loose)   || 0
      const { notes, value } = calcDenom(b, p, l, d.value)
      return { label: d.label, value: d.value, b, p, l, notes, total: value }
    }).filter(d => d.notes > 0)

    saveToHistory({
      id: Date.now(),
      ref: ref.trim() || 'Customer',
      total: grandTotal,
      notes: totalNotes,
      denoms: denomDetails,
      slip,
      matched: slip !== null ? grandTotal === slip : null,
      ts: Date.now(),
    })
    onShowToast('✓ Transaction saved!')
  }

  // ── clear ──
  function handleClear() {
    setRows(buildEmptyRows())
    setRef('')
    setSlip('')
    setDisc(null)
    setShowClear(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      {/* Customer ref */}
      <div className={styles.refBox}>
        <label>Customer Ref</label>
        <input
          type="text"
          placeholder="Name or slip number (optional)"
          value={ref}
          onChange={e => setRef(e.target.value)}
        />
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>1 Bundle <em>= 5 Packs</em></span>
        <span className={styles.legendItem}>1 Pack <em>= 100 Notes</em></span>
        <span className={styles.legendItem}>Loose <em>= &lt;100 Notes</em></span>
      </div>

      <p className={styles.sectionTitle}>Enter Count Per Denomination</p>

      {DENOMS.map((d, i) => (
        <DenomCard
          key={d.value}
          denom={d}
          index={i}
          row={rows[i]}
          onChange={handleChange}
        />
      ))}

      {/* Discrepancy checker */}
      <div className={styles.discBox}>
        <h3>🔍 Discrepancy Checker</h3>
        <div className={styles.discRow}>
          <label>Deposit Slip ₦</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Enter slip amount"
            value={slipAmount}
            onChange={e => { setSlip(e.target.value); setDisc(null) }}
          />
        </div>
        <button className={styles.discBtn} onClick={checkDisc}>
          CHECK AGAINST COUNT
        </button>
        {discResult && (
          <div className={`${styles.discResult} ${discResult.match ? styles.match : styles.mismatch}`}>
            <span className={styles.discIcon}>{discResult.match ? '✅' : '❌'}</span>
            <div>
              {discResult.match ? (
                <><strong>MATCH!</strong><br />Count ({fmt(grandTotal)}) matches deposit slip.</>
              ) : (
                <>
                  <strong>MISMATCH!</strong><br />
                  Count: {fmt(grandTotal)} &nbsp;|&nbsp; Slip: {fmt(discResult.slip)}<br />
                  Difference: <strong>{discResult.diff > 0 ? '+' : ''}{fmt(discResult.diff)}</strong>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Total bar */}
      <div className={styles.totalBar}>
        <span className={styles.totalLabel}>Grand Total</span>
        <div className={styles.totalRow}>
          <div>
            <div className={`${styles.totalAmount} ${grandTotal === 0 ? styles.zero : ''}`}>
              {fmt(grandTotal)}
            </div>
            <div className={styles.noteCount}>
              {totalNotes.toLocaleString()} note{totalNotes !== 1 ? 's' : ''} counted
            </div>
          </div>
          <div className={styles.barBtns}>
            <button className={styles.saveBtn} onClick={handleSave}>💾 SAVE</button>
            <button className={styles.clearBtn} onClick={() => setShowClear(true)}>NEW CUSTOMER</button>
          </div>
        </div>
      </div>

      {/* Clear modal */}
      {showClear && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>New Customer?</h2>
            <p>This will clear all entries. Save first if needed.</p>
            <div className={styles.modalBtns}>
              <button className={styles.btnCancel} onClick={() => setShowClear(false)}>Cancel</button>
              <button className={styles.btnConfirm} onClick={handleClear}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
