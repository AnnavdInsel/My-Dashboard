<template>
  <div class="stopwatch-wrapper">
    <button class="plus-button" @click="$emit('add-stopwatch')">+</button>
    <h3>⏱️ Stoppuhr:</h3>
    <p class="time-display">{{ formatted }}</p>
    <button @click="toggle">{{ running ? 'Pause' : 'Start' }}</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const time = ref(0)
const running = ref(false)
let interval = null

const formatted = computed(() => {
  const m = String(Math.floor(time.value / 60)).padStart(2, '0')
  const s = String(time.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

function toggle() {
  if (running.value) {
    clearInterval(interval)
  } else {
    interval = setInterval(() => time.value++, 1000)
  }
  running.value = !running.value
}

function reset() {
  clearInterval(interval)
  time.value = 0
  running.value = false
}

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* ===============================
   Stoppuhr Container & Plus-Button
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

/* ===============================
   Zeit-Anzeige
================================= */
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
