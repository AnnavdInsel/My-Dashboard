<!-- components/SingleTimer.vue -->
<template>
  <div>
    <h3>⏲️ Timer</h3>
    <div class="countdown-grid" v-if="!running">
      <div class="input-group">
        <label>Stunden</label>
        <input type="number" v-model.number="h" min="0" />
      </div>
      <div class="input-group">
        <label>Minuten</label>
        <input type="number" v-model.number="m" min="0" max="59" />
      </div>
      <div class="input-group">
        <label>Sekunden</label>
        <input type="number" v-model.number="s" min="0" max="59" />
      </div>
    </div>

    <p class="time-display">{{ formatted }}</p>

    <button @click="start" :disabled="running">Start</button>
    <button @click="stop" :disabled="!running">Stop</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const h = ref(0)
const m = ref(0)
const s = ref(0)
const time = ref(0)
const running = ref(false)
let interval = null

const formatted = computed(() => {
  const hh = String(Math.floor(time.value / 3600)).padStart(2, '0')
  const mm = String(Math.floor((time.value % 3600) / 60)).padStart(2, '0')
  const ss = String(time.value % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
})

function start() {
  time.value = h.value * 3600 + m.value * 60 + s.value
  if (time.value <= 0) return
  running.value = true
  interval = setInterval(() => {
    if (time.value > 0) time.value--
    else stop()
  }, 1000)
}

function stop() {
  clearInterval(interval)
  running.value = false
}

function reset() {
  stop()
  time.value = 0
}

onUnmounted(() => {
  clearInterval(interval)
})
</script>
