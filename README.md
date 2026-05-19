# 🦸 Todo Hero

Comic-themed todo app built with **Vue 3** + **Vite**. Manage tasks with superhero style — punchy sounds, bold visuals, and powerful features.

**Live Demo:** [voxlayer.github.io/todo-vue](https://voxlayer.github.io/todo-vue/)

## ✨ Features

- **Comic Aesthetic** — Bangers font, black borders, comic sound effects (Web Audio API)
- **📱 PWA** — Installable on mobile/home screen, offline support via Service Worker
- **📅 Due Dates** — Set deadlines, see overdue items highlighted with pulsing animation
- **↕️ Drag-to-Reorder** — SortableJS with full touch/mobile support
- **🔊 Sound Effects** — POW, BAM, ZAP, POP with mute toggle
- **↩️ Undo Delete** — 3-second toast to recover removed tasks
- **🌐 i18n** — English / 中文 switchable
- **🔔 Daily Reminder** — 6:00 AM Web Notification for tasks due today
- **💾 Auto-Save** — All data persisted to localStorage

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Build | Vite |
| PWA | vite-plugin-pwa + Workbox |
| Drag | SortableJS |
| Sound | Web Audio API (synthesized, no files) |
| Icons | Emoji + CSS |
| Deployment | GitHub Pages |

## 🚀 Quick Start

```bash
npm install
npm run dev      # → http://localhost:5173/todo-vue/
npm run build    # → dist/
```

## 📂 Project Structure

```
src/
├── App.vue              # Single-file SPA (all logic, template, styles)
├── components/
│   └── LangSwitcher.vue
├── i18n/
│   ├── index.js
│   ├── en.js
│   └── zh.js
├── utils/
│   ├── date.js          # formatDate, isOverdue, isToday
│   ├── sound.js         # Web Audio comic sound generator
│   └── notify.js        # Web Notification reminder
└── style.css            # Global reset + body styles
```

## 📄 License

MIT
