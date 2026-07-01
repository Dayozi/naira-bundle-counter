# ₦ Bundle Counter

A professional cash bundle counting tool built for bank tellers and cash handlers.
Built by **DayoziHQ** — Web Development · Digital Innovation.

🌐 **Live App:** https://nairabundlecounter.netlify.app

---

## What It Does

Bank tellers deal with bundles, packs, and loose notes every day across multiple
denominations. This tool replaces the manual calculator process — enter your
bundles, packs, and loose pieces per denomination and get an instant grand total.

---

## Features

- ₦1000, ₦500, ₦200, ₦100, ₦50, ₦20, ₦10, ₦5 denominations
- Bundle / Pack / Loose piece entry per denomination
- Auto-calculated subtotal per denomination and grand total
- Discrepancy checker — compare count against deposit slip instantly
- Transaction history with today's summary
- Teller profile (name and branch)
- Works 100% offline — no internet needed after first load
- Installable as a home screen app (PWA) on Android and iPhone
- No data collected, no server, no tracking — everything stays on your device

---

## Privacy

This application performs all calculations locally on your device.
Transaction history and references are stored only in your browser's local storage.
No transaction data, customer references, cash counts, or history are transmitted
to, collected by, or stored on any server.

This tool is provided as a counting aid only. Users are responsible for verifying
all calculations before processing transactions.

---

## Built With

- React 19
- Vite 8
- vite-plugin-pwa (Workbox)
- CSS Modules

---

## Local Development

```bash
npm install
npm run dev

## License & Ownership
© 2025 DayoziHQ. All rights reserved.
