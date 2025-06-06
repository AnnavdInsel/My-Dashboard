<template>
  <div class="grid-container" style="padding-top: 1rem; padding-bottom: 1rem;">
    <!-- Spalte 1: LiveClock -->
    <div class="column single">
      <div class="card">
        <LiveClock />
      </div>
    </div>

    <!-- Spalte 2: Stopwatches -->
    <div class="column scrollable">
      <draggable v-model="stopwatches" item-key="id" :animation="200">
        <template #item="{ element }">
          <div class="card">
            <component :is="element.component" />
          </div>
        </template>

        <template #footer>
          <div class="card">
            <Stopwatch @add-stopwatch="addStopwatch" />
          </div>
        </template>
      </draggable>
    </div>

    <!-- Spalte 3: Timer -->
    <div class="column scrollable">
      <div class="card">
        <CountdownTimer @add-timer="addTimer" />
      </div>
      <draggable v-model="timers" item-key="id" :animation="200">
        <template #item="{ element }">
          <div class="card">
            <component :is="element.component" />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

import LiveClock from '@/components/LiveClock.vue'
import Stopwatch from '@/components/Stopwatch.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import SingleTimer from '@/components/SingleTimer.vue'
import SingleStopwatch from '@/components/SingleStopwatch.vue'

let nextTimerId = 1
let nextStopwatchId = 1

const timers = ref([])
const stopwatches = ref([])

function addTimer() {
  timers.value.push({ id: nextTimerId++, component: SingleTimer })
}

function addStopwatch() {
  stopwatches.value.push({ id: nextStopwatchId++, component: SingleStopwatch })
}
</script>

<style scoped>
/* ===============================
   Layout: 3-Spalten-Gitter
================================= */
.timer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.grid-container {
  display: flex;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  gap: 2rem;
}

/* Spalten */
.column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  position: relative;
}

.column.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 80px);
  padding-right: 0.5rem;
}

.single {
  align-items: center;
}

/* ===============================
   Karten-Design
================================= */
.card {
  width: 280px; /* Einheitliche Breite */
  min-height: 220px; /* Einheitliche Höhe */
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative; /* wichtig für Positionierung von Plus */
  padding-right: 2.5rem;
}

.card:hover {
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.08);
}

.card:active {
  transform: scale(0.99);
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
}

/* ===============================
   Überschriften & Uhranzeige
================================= */
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

/* ===============================
   Eingabefelder für Countdown
================================= */
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

/* ===============================
   Buttons (Start, Stop, Reset)
================================= */
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

/* ===============================
   Plus-Button (oben rechts)
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
</style>
