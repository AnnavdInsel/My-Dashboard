<template>
  <div class="stopwatch-wrapper">
    <button class="plus-button" @click="$emit('add-stopwatch')">+</button>
    <h3>⏱️ Stoppuhr</h3>
    <p class="time-display">{{ formatted }}</p>
    <div>
      <button @click="toggle">{{ running ? 'Pause' : 'Start' }}</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const time = ref(0)
const running = ref(false)
let interval = null

const formatted = computed(() => {
  const min = String(Math.floor(time.value / 60)).padStart(2, '0')
  const sec = String(time.value % 60).padStart(2, '0')
  return `${min}:${sec}`
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
.stopwatch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
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

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2b2b2b;
  margin-bottom: 0.75rem;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
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

button {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  margin: 0.3rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: inherit;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
