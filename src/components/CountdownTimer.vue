<template>
  <div class="countdown-wrapper">
    <div class="plus-button" @click="$emit('add-timer')">＋</div>

    <h3>⏲️ Countdown-Timer:</h3>

    <div class="countdown-grid" v-if="!running">
      <!-- Eingabegruppen -->
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

<style scoped>
/* ===============================
   Countdown Wrapper & Plus-Button
================================= */
.card-wrapper {
  position: relative;
}

.plus-button {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 1.8rem;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  color: #777;
  z-index: 1;
  transition: color 0.2s ease;
}

.plus-button:hover {
  color: #007bff;
}
.time-display {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 1px;
  text-align: center;
  color: #222;
  margin: 1rem 0;
}
</style>
