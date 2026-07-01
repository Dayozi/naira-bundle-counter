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
      <div className={styles.brand}>
        <img src="/logo.png" alt="DayoziHQ" className={styles.logo} />
        <div>
          <p className={styles.brandName}>DayoziHQ</p>
          <p className={styles.brandSub}>Web Development · Digital Innovation</p>
        </div>
      </div>

      <h2 className={styles.heading}>Your Profile</h2>

      {[
        { key: 'name',    label: 'Your Name',                placeholder: 'e.g. Amaka Obi'         },
        { key: 'branch',  label: 'Branch / Location',         placeholder: 'e.g. Kano Branch'       },
        { key: 'staffId', label: 'Personal Reference (optional)', placeholder: 'Any reference you choose — not your official bank staff ID' },
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

      {/* Privacy & Disclaimer */}
      <div className={styles.disclaimerBox}>
        <h3>🔒 Privacy & Disclaimer</h3>
        <p>
          This application performs all calculations locally on your device and works fully offline.
          Transaction history and references are stored only in your browser's local storage. No
          transaction data, customer references, cash counts, or history are transmitted to, collected
          by, or stored on any server, and no third-party services are loaded by this application.
        </p>
        <p>
          This tool is provided as a counting aid only. Users are responsible for verifying all
          calculations before processing transactions. This tool does not replace your bank's official
          cash counting machine or manual verification procedures, and is not an official record of
          any transaction.
        </p>
        <p>
  Please do not enter your official bank staff ID, account numbers, or any sensitive customer
  information into this app. The "Personal Reference" field is for your own use only.
</p>
<p>
  Users are responsible for ensuring this tool complies with their organisation's IT and
  data security policies before use on work or employer-owned devices. Transaction data
  saved by this app is stored in the browser's local storage of the device being used —
  on shared or work-owned computers this data may be accessible to other users of the
  same browser profile.
</p>
      </div>

      <p className={styles.version}>₦ Bundle Counter v1.0 · Built by DayoziHQ</p>
    </div>
  )
}