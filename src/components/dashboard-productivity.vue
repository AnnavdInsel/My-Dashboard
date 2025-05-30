<template>
  <div class="productivity-container">
    <h2>📊 Produktivität</h2>

    <div class="controls">
      <label for="category">Kategorie:</label>
      <select v-model="selectedCategory" id="category">
        <option disabled value="">Bitte wählen</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>

      <button :disabled="!selectedCategory" @click="toggleTimer">
        {{ running ? 'Stop' : 'Start' }}
      </button>
    </div>

    <p class="live-timer" v-if="running">{{ formattedTime }}</p>
    <p class="last-log" v-if="lastTracked">
      Letzter Eintrag: {{ lastTracked.category }} – {{ lastTracked.time }}
    </p>

    <div class="chart" v-if="Object.keys(stats).length">
      <Doughnut :data="chartData" />
    </div>

    <table v-if="Object.keys(stats).length">
      <thead>
        <tr>
          <th>Kategorie</th>
          <th>Zeit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(seconds, cat) in stats" :key="cat">
          <td>{{ cat }}</td>
          <td>{{ formatTime(seconds * 1000) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const categories = ['Lernen', 'Haushalt', 'Freizeit', 'Sport', 'Arbeit']
const selectedCategory = ref('')
const running = ref(false)
const elapsed = ref(0)
const stats = ref({})
const lastTracked = ref(null)

let interval = null
let startTime = null

const formattedTime = computed(() => formatTime(elapsed.value))

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function toggleTimer() {
  if (!running.value) {
    // START
    startTime = Date.now() - elapsed.value
    interval = setInterval(() => {
      elapsed.value = Date.now() - startTime
    }, 1000)
    running.value = true
  } else {
    // STOP
    clearInterval(interval)
    running.value = false
    const durationMs = elapsed.value
    const durationSec = Math.floor(durationMs / 1000)

    lastTracked.value = {
      category: selectedCategory.value,
      time: formatTime(durationMs),
    }

    axios
      .post('http://localhost:3000/api/productivity', {
        category: selectedCategory.value,
        durationSec,
      })
      .then(() => fetchStats())
      .catch((err) => console.error('Fehler beim Speichern:', err))

    elapsed.value = 0
  }
}

function fetchStats() {
  axios
    .get('http://localhost:3000/api/productivity')
    .then((res) => {
      stats.value = res.data
    })
    .catch((err) => console.error('Fehler beim Laden:', err))
}

onMounted(fetchStats)

const chartData = computed(() => {
  const labels = Object.keys(stats.value)
  const data = Object.values(stats.value)
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C084FC'],
      },
    ],
  }
})
</script>

<style scoped>
.productivity-container {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

select,
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
}

button {
  background-color: #ffd166;
  cursor: pointer;
}

button:hover {
  background-color: #ffc300;
}

.live-timer {
  font-size: 2rem;
  font-weight: bold;
  color: #555;
  margin: 1rem 0;
}

.last-log {
  color: #888;
  margin-bottom: 1rem;
}

table {
  margin: 2rem auto;
  width: 80%;
  border-collapse: collapse;
  font-size: 1rem;
}

th,
td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
}

.chart {
  max-width: 400px;
  margin: 2rem auto;
}
</style>
