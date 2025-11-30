# Trading Journal Dashboard (React)

## 🔗 Live & Source

**Live Demo:**  
👉 [https://trading-journal-nu.vercel.app/dashboard]

**GitHub Repository:**  
👉 [https://github.com/Aniket23padalkar/Trading-Journal.git]

This is a **full-featured, responsive Trading Journal application** built to track, analyze, and improve trading performance.

It started as a simple localStorage-based app and eventually evolved into a **fully structured React + Firebase application** with advanced calculations, filtering, and performance analytics.

⚠️ Note: The app is data-dense, so mid-sized screens may feel more compact. Best experience is on desktop & large tablets.

---

## 🚀 Features

### Core Functionality

- Full **CRUD system** for trades
- Firebase integration (migrated from localStorage)
- Secure **Login / Logout**
- Light / Dark mode
- Responsive layout for multiple screen sizes

### Advanced Trade Handling

- Drag effects on:
  - Main dashboard view
  - Add Trade modal
- **Qty feature** → opens another modal to add multiple quantities per trade
- Handles complex trading calculations including:
  - PnL
  - Risk–Reward
  - Win rate
  - Drawdowns
  - Overall performance metrics

### Filters (Multi-level)

- ✅ Yearly filter
- ✅ Monthly filter
- ✅ Status filter (Win / Loss)
- ✅ Order type filter
- ✅ Date range filter
- ✅ Market type filter
- ✅ Position type (Intraday / Swing / Positional)

### Sorting

- By **Date**
- By **PnL**

### Pagination

- Custom pagination with `...` when page numbers exceed limit

### Charts & Analytics

- PnL charts
- Performance dashboard
- Summary cards for quick statistics

### Performance Optimizations

- Lazy loading & Suspense
- `useCallback`
- `useMemo`
- `React.memo`

---

## 🛠️ Tech Stack

- React.js
- React Router
- Firebase (Auth + Database)
- Tailwind CSS
- Toastify
- Custom Hooks
- Recharts / Chart library (for PnL/analytics)

---

## 📌 Why I Built This

I’ve been trading for 5 years and maintained detailed journals manually.  
This project is my attempt to **turn my trading process into a scalable system** that:

- Tracks real performance
- Removes emotional bias
- Improves decision-making
- Creates accountability

It’s not just a project — it’s a personal system that reflects real-world discipline and data-driven thinking.

---
