<template>
  <div class="timer-container">
    <h2>⏱️ Timer</h2>
    <p class="zeit">{{ formattedTime }}</p>
    <button @click="toggleTimer">{{ running ? 'Stop' : 'Start' }}</button>
    <p v-if="lastDuration" class="last">Letzte Dauer: {{ lastDuration }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

let interval = null
const startTime = ref(null)
const elapsed = ref(0)
const running = ref(false)
const lastDuration = ref('')

const toggleTimer = () => {
  if (!running.value) {
    // START
    startTime.value = Date.now() - elapsed.value
    interval = setInterval(() => {
      elapsed.value = Date.now() - startTime.value
    }, 1000)
    running.value = true
  } else {
    // STOP
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
    console.log('⏱️ Dauer geloggt:', duration)
  } catch (err) {
    console.error('❌ Fehler beim Protokollieren:', err)
  }
}
</script>

<style scoped>
.timer-container {
  text-align: center;
  margin-top: 4rem;
  font-family: 'Segoe UI', sans-serif;
}

.zeit {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

button {
  font-size: 1.2rem;
  padding: 0.8rem 2rem;
  border-radius: 10px;
  border: none;
  background-color: #ffd166;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #ffc300;
}

.last {
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;
}
</style>
