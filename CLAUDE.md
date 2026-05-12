# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 常用命令

```
npm run dev       # 启动 Vite 开发服务器
npm run build     # 生产构建 → dist/
npm run preview   # 本地预览生产构建
```

**停止开发服务器：** 当用户要求"停止进程"/"停止项目"/"关闭项目"时，必须彻底杀死 Vite 开发服务器的进程（而不仅仅是后台化），使项目无法通过浏览器访问。操作方式：找到占用端口（默认 5173）的进程 PID（`netstat -ano | grep :5173`），然后强制终止（`taskkill //PID <pid> //F`）。不要只使用 TaskStop，因为 TaskStop 不会真正杀死底层进程。

## 架构

单组件 SPA — `App.vue` 持有所有状态、逻辑和渲染。无路由，无 Pinia。

**数据流：**
- `todos` ref 数组（`{ id, text, done }`）是唯一数据源。
- 通过深度 `watch(todos, save)` 在每次变更时自动持久化到 `localStorage`（key: `todo_hero_data`）。
- i18n 状态同样持久化到 `localStorage`（key: `todo_lang`）。

**i18n 模式：**
- `src/i18n/index.js` 导出 `useI18n()`，返回响应式对象 `{ state, t, setLocale }`。
- `App.vue` 调用 `useI18n()` 后通过 `provide('i18n', ...)` 下发，`LangSwitcher.vue` 通过 `inject('i18n')` 获取。
- 语言文件（`zh.js`、`en.js`）导出 key 完全一致的普通对象。`counter` 键使用 `{n}` 作为占位符，在渲染时替换。

**样式：**
- `src/style.css` — 全局重置 + body 背景（黄色网点）+ `#app` 宽度约束。
- 所有组件样式均在各自 `.vue` 文件中使用 `<style scoped>`。
- 美漫主题：粗黑边框、偏移 `box-shadow`（无模糊）、`rotate()` 倾斜、Google Fonts 的 Bangers 展示字体，配色：红 `#e53935`、黄 `#fdd835`、青 `#00bcd4`。
- 响应式断点：480px。

**无抽象层：** todos 逻辑直接内联在 `App.vue` 中。如果项目规模增长，可提取 composables（`useTodos`、`useLocalStorage`）和子组件（`TodoItem`、`TodoFilter`）。
