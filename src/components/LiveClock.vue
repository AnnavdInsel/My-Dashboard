<template>
  <div class="clock-wrapper">
    <h3>🕒 Uhrzeit</h3>
    <p class="clock-display">{{ currentTime }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.clock-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2b2b2b;
  margin-bottom: 0.75rem;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.clock-display {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 1px;
  text-align: center;
  color: #222;
  margin: 1rem 0;
}
</style>
