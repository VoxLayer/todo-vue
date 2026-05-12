import { reactive, computed } from 'vue'
import zh from './zh.js'
import en from './en.js'

const messages = { zh, en }

const state = reactive({
  locale: localStorage.getItem('todo_lang') || 'zh',
})

const t = computed(() => messages[state.locale])

export function useI18n() {
  function setLocale(lang) {
    state.locale = lang
    localStorage.setItem('todo_lang', lang)
  }

  return { state, t, setLocale }
}
