<template>
  <div class="timer-page">
    <LiveClock />

    <div class="timer-sections">
      <div class="timer-section">
        <h2>Stoppuhr</h2>
        <SingleStopwatch />
      </div>

      <div class="timer-section">
        <h2>Countdown</h2>
        <SingleTimer />
      </div>
    </div>

    <div class="timer-section log-section">
      <h2>Einfacher Timer</h2>
      <p class="zeit">{{ formattedTime }}</p>
      <button class="timer-btn" @click="toggleTimer">{{ running ? 'Stop' : 'Start' }}</button>
      <p v-if="lastDuration" class="last">Letzte Dauer: {{ lastDuration }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import LiveClock from './LiveClock.vue'
import SingleStopwatch from './SingleStopwatch.vue'
import SingleTimer from './SingleTimer.vue'

let interval = null
const startTime = ref(null)
const elapsed = ref(0)
const running = ref(false)
const lastDuration = ref('')

const toggleTimer = () => {
  if (!running.value) {
    startTime.value = Date.now() - elapsed.value
    interval = setInterval(() => {
      elapsed.value = Date.now() - startTime.value
    }, 1000)
    running.value = true
  } else {
    clearInterval(interval)
    running.value = false
    const formatted = formatTime(elapsed.value)
    lastDuration.value = formatted
    sendToBackend(formatted)
    elapsed.value = 0
  }
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const formattedTime = computed(() => formatTime(elapsed.value))

async function sendToBackend(duration) {
  try {
    await axios.post('http://localhost:3000/api/timer-log', { duration })
  } catch (err) {
    console.error('Fehler beim Protokollieren:', err)
  }
}
</script>

<style scoped>
.timer-page {
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  padding: 1rem;
}

.timer-sections {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
}

.timer-section {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 280px;
}

.timer-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #444;
}

.log-section {
  max-width: 400px;
  margin: 0 auto;
}

.zeit {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

.timer-btn {
  font-size: 1.2rem;
  padding: 0.8rem 2rem;
  border-radius: 10px;
  border: none;
  background-color: #ffd166;
  cursor: pointer;
  transition: background 0.3s;
}

.timer-btn:hover {
  background-color: #ffc300;
}

.last {
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;
}
</style>
