import styles from './WelcomeModal.module.css'

export default function WelcomeModal({ onAccept }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className={styles.modal}>
        <h2 id="welcome-title" className={styles.title}>Welcome to ₦ Bundle Counter</h2>

        <div className={styles.body}>
          <p>
            This application performs all calculations locally on your device and works fully offline.
            Transaction history and references are stored only in your browser&apos;s local storage. No
            transaction data, customer references, cash counts, or history are transmitted to, collected
            by, or stored on any server, and no third-party services are loaded by this application.
          </p>

          <p>
            This tool is provided as a counting aid only. Users are responsible for verifying all
            calculations before processing transactions. This tool does not replace your bank&apos;s official
            cash counting machine or manual verification procedures, and is not an official record of any
            transaction.
          </p>

          <p>
            Please do not enter your official bank staff ID, account numbers, or any sensitive customer
            information into this app. The Personal Reference field is for your own use only.
          </p>

          <p>
            Users are responsible for ensuring this tool complies with their organisation&apos;s IT and
            data security policies before use on work or employer-owned devices. Transaction data saved
            by this app is stored in the browser&apos;s local storage of the device being used — on shared
            or work-owned computers this data may be accessible to other users of the same browser profile.
          </p>
        </div>

        <button className={styles.button} onClick={onAccept}>
          I Understand — Continue
        </button>
      </div>
    </div>
  )
}
