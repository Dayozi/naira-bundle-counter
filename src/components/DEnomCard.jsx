import { fmt, BUNDLE_SIZE, PACK_SIZE } from '../storage'
import styles from './DenomCard.module.css'

export default function DenomCard({ denom, index, row, onChange }) {
  const b = parseInt(row.bundles) || 0
  const p = parseInt(row.packs)   || 0
  const l = parseInt(row.loose)   || 0
  const notes = b * BUNDLE_SIZE + p * PACK_SIZE + l
  const value = notes * denom.value
  const hasValue = notes > 0

  const breakdown = []
  if (b > 0) breakdown.push(`${b} bundle${b > 1 ? 's' : ''} = ${fmt(b * BUNDLE_SIZE * denom.value)}`)
  if (p > 0) breakdown.push(`${p} pack${p > 1 ? 's' : ''} = ${fmt(p * PACK_SIZE * denom.value)}`)
  if (l > 0) breakdown.push(`${l} loose = ${fmt(l * denom.value)}`)

  return (
    <div className={`${styles.card} fade-in`}>
      <div className={styles.header}>
        <span className={styles.name}>{denom.label}</span>
        <span className={`${styles.subtotal} ${hasValue ? styles.hasValue : ''}`}>
          {hasValue ? fmt(value) : '—'}
        </span>
      </div>

      <div className={styles.inputs}>
        {[
          { key: 'bundles', label: 'Bundles', hint: `${fmt(denom.value * BUNDLE_SIZE)} ea` },
          { key: 'packs',   label: 'Packs',   hint: `${fmt(denom.value * PACK_SIZE)} ea`   },
          { key: 'loose',   label: 'Loose',   hint: 'single notes'                          },
        ].map(({ key, label, hint }) => (
          <div key={key} className={styles.inputGroup}>
            <label>{label}</label>
            <span className={styles.hint}>{hint}</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={row[key]}
              onChange={e => onChange(index, key, e.target.value)}
              onFocus={e => e.target.select()}
            />
          </div>
        ))}
      </div>

      {hasValue && (
        <div className={styles.breakdown}>
          {breakdown.map((b, i) => (
            <span key={i} className={styles.breakItem}>{b}</span>
          ))}
        </div>
      )}
    </div>
  )
}