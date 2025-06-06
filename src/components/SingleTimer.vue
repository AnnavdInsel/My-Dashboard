<template>
  <div class="countdown-wrapper">
    <h3>⏳ Timer</h3>

    <div class="countdown-grid">
      <div class="input-group">
        <label for="minutes">Minuten:</label>
        <input id="minutes" v-model.number="minutes" type="number" min="0" />
      </div>
      <div class="input-group">
        <label for="seconds">Sekunden:</label>
        <input id="seconds" v-model.number="seconds" type="number" min="0" />
      </div>
    </div>

    <p class="time-display">{{ formatted }}</p>

    <div>
      <button @click="toggle" :disabled="isInputInvalid">
        {{ running ? 'Pause' : 'Start' }}
      </button>
      <button @click="reset">Reset</button>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const minutes = ref(0)
const seconds = ref(0)
const totalSeconds = ref(0)
const running = ref(false)
let interval = null

const formatted = computed(() => {
  const m = String(Math.floor(totalSeconds.value / 60)).padStart(2, '0')
  const s = String(totalSeconds.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

const isInputInvalid = computed(() => minutes.value === 0 && seconds.value === 0)

function toggle() {
  if (running.value) {
    clearInterval(interval)
  } else {
    if (totalSeconds.value <= 0) {
      totalSeconds.value = minutes.value * 60 + seconds.value
    }
    interval = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        clearInterval(interval)
        running.value = false
      }
    }, 1000)
  }
  running.value = !running.value
}

function reset() {
  clearInterval(interval)
  totalSeconds.value = 0
  running.value = false
}

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.countdown-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2b2b2b;
  margin-bottom: 0.75rem;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.countdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.25rem;
  margin-bottom: 1rem;
  justify-items: start;
  align-items: center;
}

.input-group {
  display: contents;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  text-align: right;
}

.input-group input {
  width: 80px;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  text-align: center;
  font-family: inherit;
  transition: 0.2s;
}

.input-group input:focus {
  border-color: #007bff;
  background-color: #fff;
  outline: none;
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

.add-button {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 1.8rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
}

.add-button:hover {
  color: #007bff;
}
</style>
