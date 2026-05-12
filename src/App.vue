<script setup>
import { ref, computed, watch, nextTick, provide } from 'vue'
import { useI18n } from './i18n/index.js'
import LangSwitcher from './components/LangSwitcher.vue'

const { state, t, setLocale } = useI18n()
provide('i18n', { state, t, setLocale })

const STORAGE_KEY = 'todo_hero_data'
const todos = ref([])
const filter = ref('all')
const editingId = ref(null)
const newText = ref('')
const inputRef = ref(null)
const editInputRef = ref(null)

// --- load / save ---
function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) todos.value = JSON.parse(data)
  } catch { todos.value = [] }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}
watch(todos, save, { deep: true })

// --- computed ---
const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.done)
  if (filter.value === 'completed') return todos.value.filter(t => t.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter(t => !t.done).length)
const hasCompleted = computed(() => todos.value.some(t => t.done))
const hasAny = computed(() => todos.value.length > 0)

// --- actions ---
let nextId = 1
function uid() {
  while (todos.value.some(t => t.id === nextId)) nextId++
  return nextId++
}

function addTodo() {
  const text = newText.value.trim()
  if (!text) return
  todos.value.push({ id: uid(), text, done: false })
  newText.value = ''
  nextTick(() => inputRef.value?.focus())
}

function toggle(id) {
  const t = todos.value.find(t => t.id === id)
  if (t) t.done = !t.done
}

function remove(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.done)
}

function startEdit(id) {
  editingId.value = id
  nextTick(() => editInputRef.value?.focus())
}

function finishEdit(todo) {
  const el = editInputRef.value
  if (el) {
    const v = el.value.trim()
    if (v) todo.text = v
    else remove(todo.id)
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

// --- init ---
load()
</script>

<template>
  <div class="app-shell">
    <!-- ====== HEADER ====== -->
    <header class="hero-header">
      <LangSwitcher />
      <div class="title-burst">{{ t.title }}</div>
      <div class="title-sub">{{ t.subtitle }}</div>
    </header>

    <!-- ====== INPUT ====== -->
    <div class="input-panel">
      <input
        ref="inputRef"
        v-model="newText"
        type="text"
        :placeholder="t.placeholder"
        maxlength="200"
        @keydown.enter="addTodo"
      />
      <button class="btn-add" @click="addTodo">
        <span>{{ t.addBtn }}</span>
      </button>
    </div>

    <!-- ====== LIST ====== -->
    <div class="list-panel">
      <div v-if="!hasAny" class="empty-state">
        <div class="empty-icon">🦸</div>
        <p>{{ t.emptyTitle }}</p>
        <p>{{ t.emptySub }}</p>
      </div>

      <TransitionGroup name="item" tag="ul" class="todo-list" v-else-if="filteredTodos.length">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ done: todo.done, editing: editingId === todo.id }"
        >
          <!-- Checkbox -->
          <label class="check-wrap">
            <input
              type="checkbox"
              :checked="todo.done"
              @change="toggle(todo.id)"
            />
            <span class="check-box"></span>
          </label>

          <!-- Edit mode -->
          <template v-if="editingId === todo.id">
            <input
              ref="editInputRef"
              class="edit-input"
              :value="todo.text"
              maxlength="200"
              @keydown.enter="finishEdit(todo)"
              @keydown.escape="cancelEdit"
              @blur="finishEdit(todo)"
            />
          </template>

          <!-- View mode -->
          <template v-else>
            <span class="todo-text" @dblclick="startEdit(todo.id)">
              {{ todo.text }}
            </span>
            <button class="btn-del" @click="remove(todo.id)">{{ t.deleteBtn }}</button>
          </template>
        </li>
      </TransitionGroup>
    </div>

    <!-- ====== FOOTER ====== -->
    <div v-if="hasAny" class="footer-panel">
      <span class="counter">{{ t.counter.replace('{n}', remaining) }}</span>
      <div class="filters">
        <button
          v-for="f in [
            { key: 'all', label: t.filterAll },
            { key: 'active', label: t.filterActive },
            { key: 'completed', label: t.filterCompleted },
          ]"
          :key="f.key"
          :class="{ active: filter === f.key }"
          @click="filter = f.key"
        >
          {{ f.label }}
        </button>
      </div>
      <button v-if="hasCompleted" class="btn-clear" @click="clearCompleted">
        {{ t.clearBtn }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* =========== APP SHELL =========== */
.app-shell {
  position: relative;
}

/* =========== HEADER =========== */
.hero-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.title-burst {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 72px;
  color: #e53935;
  text-shadow:
    3px 3px 0 #ffeb3b,
    5px 5px 0 #1a1a1a,
    8px 8px 0 rgba(0,0,0,0.15);
  letter-spacing: 4px;
  line-height: 1;
  transform: rotate(-2deg);
}

.title-sub {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 64px;
  color: #fdd835;
  -webkit-text-stroke: 3px #1a1a1a;
  text-shadow:
    4px 4px 0 #e53935,
    7px 7px 0 #1a1a1a;
  letter-spacing: 8px;
  margin-top: -16px;
  transform: rotate(1deg);
}

/* =========== INPUT PANEL =========== */
.input-panel {
  display: flex;
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0 #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  transform: rotate(-0.5deg);
}

.input-panel input {
  flex: 1;
  border: none;
  outline: none;
  padding: 16px 20px;
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  background: #fffef7;
  color: #1a1a1a;
}

.input-panel input::placeholder {
  color: #bbb;
  font-weight: 400;
}

.btn-add {
  border: none;
  border-left: 3px solid #1a1a1a;
  background: #00bcd4;
  padding: 0 22px;
  cursor: pointer;
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 24px;
  color: #1a1a1a;
  text-shadow: 2px 2px 0 rgba(255,255,255,0.4);
  letter-spacing: 2px;
  transition: background .1s;
}

.btn-add:hover {
  background: #00acc1;
}

.btn-add:active {
  transform: scale(0.94);
}

/* =========== LIST PANEL =========== */
.list-panel {
  background: #fffef7;
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0 #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(0.5deg);
  margin-bottom: 16px;
}

.todo-list {
  list-style: none;
}

/* =========== TODO ITEM =========== */
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 2px dashed #ddd;
  transition: background .15s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: #fffde7;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  text-decoration-thickness: 3px;
  text-decoration-color: #e53935;
  color: #bbb;
  font-style: italic;
}

/* --- Custom checkbox --- */
.check-wrap {
  position: relative;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  cursor: pointer;
}

.check-wrap input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.check-box {
  position: absolute;
  inset: 0;
  border: 3px solid #1a1a1a;
  background: #fff;
  transition: all .15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-wrap input:checked + .check-box {
  background: #fdd835;
  background-image:
    radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px);
  background-size: 6px 6px;
}

.check-wrap input:checked + .check-box::after {
  content: '✓';
  font-family: 'Bangers', sans-serif;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 900;
}

/* --- Text --- */
.todo-text {
  flex: 1;
  font-size: 17px;
  font-weight: 600;
  word-break: break-all;
  cursor: default;
  color: #1a1a1a;
}

.edit-input {
  flex: 1;
  font-size: 17px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: none;
  outline: none;
  background: transparent;
  border-bottom: 4px solid #e53935;
  padding: 2px 0;
}

/* --- Delete button --- */
.btn-del {
  border: 2px solid #1a1a1a;
  background: #e53935;
  color: #fff;
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 5px 12px;
  cursor: pointer;
  box-shadow: 2px 2px 0 #1a1a1a;
  transition: all .1s;
  white-space: nowrap;
}

.btn-del:hover {
  background: #c62828;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #1a1a1a;
}

.btn-del:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* =========== TRANSITIONS =========== */
.item-enter-active,
.item-leave-active {
  transition: all .3s ease;
}

.item-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.9) rotate(-3deg);
}

.item-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9) rotate(3deg);
}

.item-leave-active {
  position: absolute;
}

/* =========== EMPTY STATE =========== */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.empty-state p {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 22px;
  color: #ccc;
  letter-spacing: 1px;
}

.empty-state p + p {
  font-size: 16px;
  color: #ddd;
  margin-top: 4px;
}

/* =========== FOOTER =========== */
.footer-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  background: #fffef7;
  border: 3px solid #1a1a1a;
  box-shadow: 3px 3px 0 #1a1a1a;
  border-radius: 8px;
  transform: rotate(-0.3deg);
  flex-wrap: wrap;
}

.counter {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 18px;
  color: #1a1a1a;
  letter-spacing: 1px;
}

.filters {
  display: flex;
  gap: 4px;
}

.filters button {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  border: 2px solid transparent;
  background: none;
  color: #888;
  padding: 5px 14px;
  cursor: pointer;
  transition: all .15s;
  border-radius: 4px;
}

.filters button:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.filters button.active {
  background: #fdd835;
  border-color: #1a1a1a;
  color: #1a1a1a;
  box-shadow: 2px 2px 0 #1a1a1a;
}

.btn-clear {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
  border: 2px solid #1a1a1a;
  background: #fff;
  color: #e53935;
  padding: 5px 14px;
  cursor: pointer;
  box-shadow: 2px 2px 0 #1a1a1a;
  transition: all .1s;
  border-radius: 4px;
}

.btn-clear:hover {
  background: #e53935;
  color: #fff;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #1a1a1a;
}

.btn-clear:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* =========== RESPONSIVE =========== */
@media (max-width: 480px) {
  .title-burst { font-size: 52px; }
  .title-sub { font-size: 44px; -webkit-text-stroke: 2px #1a1a1a; }
  .footer-panel { flex-direction: column; align-items: stretch; text-align: center; }
}
</style>
