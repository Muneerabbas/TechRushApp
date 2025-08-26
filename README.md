# 🚀 TechRushApp — CampusPay

Repo for **TechRush Hackathon** 🏆

CampusPay is a **smart student payment & social platform** built with [Expo](https://expo.dev) and React Native.  
It makes transactions, event management, and social interactions seamless for college campuses.

---

## 📸 Screenshots

| | | |
|---|---|---|
| ![s1](https://github.com/user-attachments/assets/832817a5-75c2-4597-9114-11bcb1b1b6b6) | ![s2](https://github.com/user-attachments/assets/16f93c15-e93f-49db-bd86-d677d707cb01) | ![s3](https://github.com/user-attachments/assets/84bb824f-6299-436f-bf1d-bbaeabf85375) |
| ![s4](https://github.com/user-attachments/assets/5dea2e9e-26be-472d-8bd0-79293e108fd8) | ![s5](https://github.com/user-attachments/assets/97e7563d-4453-47e1-928d-d345a8ee60a1) | ![s6](https://github.com/user-attachments/assets/4f3d6c1a-6634-4b62-9202-ae61498b01e4) |
| ![s7](https://github.com/user-attachments/assets/8932268d-f009-4fbc-9606-83b91e335d75) | ![s8](https://github.com/user-attachments/assets/25dd8839-800b-412a-be25-c8960074229d) | ![s9](https://github.com/user-attachments/assets/cef6aff1-841f-449e-b310-b86f0af13555) |

---

## ✨ Features

### Authentication
- Login & signup with JWT-based auth.
- Profile picture upload (backend `multer` integration supported).
- Token persisted locally for session management.

### Transactions
- Send and receive money between users.
- Transaction list with clear credit/debit distinction.
- Smooth scrolling and basic animations for better UX.
- Store transaction history and basic filtering (by date/type).

### Events & Tickets
- Browse upcoming campus events.
- Purchase tickets inside the app (mock flow or integrated backend).
- Event cards support horizontal scrolling and tappable details.

### Social & Clubs
- Community feed: share text + image posts.
- Join/see clubs, view club posts and event announcements.
- Like and comment UI hooks (backend endpoints can be wired up).

### Profile & Wallet
- View and edit basic profile details.
- Wallet overview with balance and quick actions.
- Transaction analytics / activity log (simple list view).

---

## Quick setup

1. Install:
   ```bash
   npm install

2. Start:

   ```bash
   npx expo start
   ```

   Open the app via:

   * Expo Go (quick test)
   * Development build
   * Android Emulator / iOS Simulator

3. Reset project (optional):

   ```bash
   npm run reset-project
   ```

   Moves starter code to `app-example` and creates a fresh `app/`.

---

## Project structure (high level)

```
/app
  /(auth)         # login, signup screens
  /(main)         # dashboard, home, tabs
  /transactions   # transaction list + card components
  /events         # event listing + event detail
  /social         # community feed, post composer
  /profile        # profile + settings
/api
  auth.js         # auth routes
  users.js
  posts.js
  events.js
  transactions.js
```

---

## Backend notes (recommended)

* Use **Node.js + Express** for APIs.
* Store users, events, posts, and transactions in **MongoDB**.
* Protect routes with JWT middleware.
* For image uploads use `multer` and store either in cloud (S3) or as accessible file URLs.

---

## Built with

* React Native (Expo Router)
* Node.js + Express (backend)
* MongoDB (database)
* JWT (authentication)
* Axios (API requests)

---

## Tips for polishing

* Add input validation on forms and show inline errors.
* Use optimistic UI updates for transactions and posts.
* Add better offline handling for the wallet (cache last-known balance).
* Add unit tests for critical API endpoints (auth, transactions, events).

---

```
```
