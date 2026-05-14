import { useState, useEffect } from 'react'
import { getProfile, saveProfile as save } from '../storage'
import styles from './Profile.module.css'

export default function Profile({ onShowToast, onProfileUpdate }) {
  const [form, setForm]         = useState({ name: '', branch: '', staffId: '' })
  const [saved, setSaved]       = useState(false)
  const [installable, setInstallable] = useState(false)
  const [deferredPrompt, setDeferred] = useState(null)

  useEffect(() => {
    const p = getProfile()
    setForm({ name: p.name || '', branch: p.branch || '', staffId: p.staffId || '' })

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      setDeferred(e)
      setInstallable(true)
    })
  }, [])

  function handleSave() {
    save(form)
    onProfileUpdate(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onShowToast('✓ Profile saved!')
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferred(null)
    setInstallable(false)
  }

  return (
    <div className={styles.page}>
      {/* DayoziHQ branding */}
      <div className={styles.brand}>
        <img src="/logo.png" alt="DayoziHQ" className={styles.logo} />
        <div>
          <p className={styles.brandName}>DayoziHQ</p>
          <p className={styles.brandSub}>Web Development · Digital Innovation</p>
        </div>
      </div>

      <h2 className={styles.heading}>Teller Profile</h2>

      {[
        { key: 'name',    label: 'Your Name',         placeholder: 'e.g. Amaka Obi'         },
        { key: 'branch',  label: 'Branch Name',        placeholder: 'e.g. First Bank, Kano'  },
        { key: 'staffId', label: 'Staff ID (optional)', placeholder: 'e.g. T-0042'            },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className={styles.field}>
          <label>{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={form[key]}
            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          />
        </div>
      ))}

      <button className={styles.saveBtn} onClick={handleSave}>SAVE PROFILE</button>
      {saved && <p className={styles.savedMsg}>✓ Profile saved!</p>}

      {/* Install box */}
      <div className={styles.installBox}>
        <h3>📲 Install as App</h3>
        <p>Install on your phone home screen — works offline, no browser bar, opens like a real app.</p>
        <p><strong>Android Chrome:</strong> Tap 3-dot menu → "Add to Home Screen"</p>
        <p><strong>iPhone Safari:</strong> Tap Share → "Add to Home Screen"</p>
        {installable && (
          <button className={styles.installBtn} onClick={handleInstall}>
            INSTALL APP NOW
          </button>
        )}
      </div>

      {/* Version */}
      <p className={styles.version}>₦ Bundle Counter v1.0 · Built by DayoziHQ</p>
    </div>
  )
}
