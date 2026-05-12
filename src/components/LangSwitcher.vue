<script setup>
import { inject } from 'vue'

const { state, setLocale } = inject('i18n')

function switchLang(lang) {
  setLocale(lang)
}

const options = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' },
]
</script>

<template>
  <div class="lang-switcher">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="{ active: state.locale === opt.value }"
      @click="switchLang(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 0;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.lang-switcher button {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 13px;
  letter-spacing: 1px;
  border: 2px solid #1a1a1a;
  background: #fff;
  color: #888;
  padding: 4px 12px;
  cursor: pointer;
  transition: all .15s;
}

.lang-switcher button:first-child {
  border-radius: 6px 0 0 6px;
}

.lang-switcher button:last-child {
  border-radius: 0 6px 6px 0;
  border-left: none;
}

.lang-switcher button.active {
  background: #1a1a1a;
  color: #fdd835;
}

.lang-switcher button:hover:not(.active) {
  color: #1a1a1a;
}
</style>
