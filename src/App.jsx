import { useState, useEffect } from 'react'
import Counter from './components/Counter'
import History from './components/History'
import Profile from './components/Profile'
import { getProfile } from './storage'
import styles from './App.module.css'

const TABS = ['counter', 'history', 'profile']

export default function App() {
  const [tab, setTab]         = useState('counter')
  const [profile, setProfile] = useState(getProfile)
  const [toast, setToast]     = useState({ msg: '', show: false })

  let toastTimer
  function showToast(msg) {
    setToast({ msg, show: true })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>₦ Bundle Counter</h1>
          <button className={styles.tellerBadge} onClick={() => setTab('profile')}>
            {profile.name ? `👤 ${profile.name}` : '⚙ Setup'}
          </button>
        </div>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.active : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Pages */}
      <main>
        {tab === 'counter' && <Counter onShowToast={showToast} />}
        {tab === 'history' && <History onShowToast={showToast} />}
        {tab === 'profile' && <Profile onShowToast={showToast} onProfileUpdate={setProfile} />}
      </main>

      {/* Toast */}
      <div className={`${styles.toast} ${toast.show ? styles.toastShow : ''}`}>
        {toast.msg}
      </div>
    </div>
  )
}