<template>
  <div>
    <h3>⏳ Timer</h3>
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
    interval = setInterval(() => {
      time.value++
    }, 1000)
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
h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
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
  margin: 0.25rem;
}
</style>
