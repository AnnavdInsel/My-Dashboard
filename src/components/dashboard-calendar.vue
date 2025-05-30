<template>
  <div class="calendar">
    <h2>📅 Kalender</h2>
    <div class="calendar-header">
      <button @click="prevMonth">◀</button>
      <span>{{ currentMonthName }} {{ currentYear }}</span>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="day-names">
      <div v-for="day in weekDays" :key="day">{{ day }}</div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in days.filter((d) => d.date !== '')"
        :key="index"
        class="calendar-day"
        :title="day.note ? `Notiz: ${day.note.length} Zeichen` : ''"
        @click="selectDay(day)"
        @dblclick="deleteNote(day)"
        :class="{ 'has-note': !!day.note }"
      >
        <div class="day-number">{{ day.date }}</div>
        <div class="note">{{ day.note }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const allNotes = ref({})
const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() =>
  currentDate.value.toLocaleString('default', { month: 'long' }),
)
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const days = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  const result = []

  let startDay = (date.getDay() + 6) % 7
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  for (let i = 0; i < startDay; i++) {
    result.push({ date: '', note: '' })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const note = allNotes.value[dateKey] || ''
    result.push({ date: d, note })
  }

  return result
})

onMounted(loadNotes)

async function loadNotes() {
  try {
    const res = await axios.get('http://localhost:3000/api/notes')
    allNotes.value = res.data
    console.log('📥 Notizen geladen:', allNotes.value)
  } catch (err) {
    console.error('Fehler beim Laden der Notizen:', err)
  }
}

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

async function selectDay(day) {
  const fullDate = getFullDate(day.date)
  const note = prompt('Notiz für diesen Tag', day.note)
  if (note !== null) {
    try {
      await axios.post('http://localhost:3000/api/notes', {
        date: fullDate,
        note,
      })
      allNotes.value[fullDate] = note
    } catch (err) {
      console.error('Fehler beim Speichern der Notiz:', err)
    }
  }
}

async function deleteNote(day) {
  const fullDate = getFullDate(day.date)
  if (!day.note) return
  const confirmDelete = confirm('Notiz wirklich löschen?')
  if (confirmDelete) {
    try {
      await axios.post('http://localhost:3000/api/notes', {
        date: fullDate,
        note: '',
      })
      allNotes.value[fullDate] = ''
    } catch (err) {
      console.error('Fehler beim Löschen der Notiz:', err)
    }
  }
}

function getFullDate(dayNum) {
  return `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
}
</script>

<style scoped>
h2 {
  padding-top: 2vh;
  text-align: center;
  color: #ff6b9a;
}

.calendar {
  max-width: 800px;
  margin: 2rem auto;
  font-family: 'Segoe UI', sans-serif;
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff6b9a;
  margin-bottom: 1.5rem;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ff6b9a;
  cursor: pointer;
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #ff6b9a;
  margin-bottom: 1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  background: #ffe0e9;
  min-height: 80px;
  border-radius: 12px;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #b6004c;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-day:hover {
  background: #ffd4e1;
}

.day-number {
  font-weight: bold;
  font-size: 1.1rem;
}

.note {
  font-size: 0.75rem;
  color: #90003a;
  word-break: break-word;
}

.has-note {
  border: 2px solid #ff6b9a;
  box-shadow: inset 0 0 0 2px #ff6b9a;
}
</style>
