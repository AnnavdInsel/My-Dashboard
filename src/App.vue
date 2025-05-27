<template>
  <div class="dashboard">
    <!-- 📌 Angepinnte Notizzettel -->
    <div class="sticky-notes">
      <div v-for="(note, index) in savedNotes" :key="index" class="sticky-note">
        <button class="delete-note" @click.stop="deleteNote(index)">✖</button>
        {{ note }}
      </div>
    </div>

    <h1>
      📚
      <template v-if="!isEditing">
        <span @dblclick="enableEditing">{{ dashboardTitle }}</span>
      </template>
      <template v-else>
        <input
          v-model="dashboardTitle"
          @blur="disableEditing"
          @keyup.enter="disableEditing"
          ref="input"
        />
      </template>
    </h1>

    <div class="cards">
      <div class="dashboard-buttons">
        <button class="dashboard-btn left">Speichere dein Board</button>
        <button class="dashboard-btn right">Lösche dein Board</button>
        <button class="login/logout">👤</button>
        <button class="Einstellungen">⚙️</button>
      </div>

      <div
        v-for="(card, index) in components"
        :key="index"
        class="card"
        :style="{ backgroundColor: card.color }"
        @click="openModal(card.component)"
      >
        {{ card.name }}
      </div>
    </div>

    <div class="modal-background" v-if="activeComponent" @click.self="activeComponent = null">
      <div class="modal">
        <component :is="activeComponent" />
        <button class="btn" @click="activeComponent = null">Schließen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useToast } from 'vue-toastification'

// popup fenster
const toast = useToast()

// variable für das input-feld oben im Dashboard Titel
const input = ref(null)

// variable für den editier-modus
const isEditing = ref(false)

// editiert den Dashboard Titel
const dashboardTitle = ref('Mein Dashboard')

// aktiviert bearbeitungsmodus durch doppelklick
function enableEditing() {
  isEditing.value = true
  nextTick(() => {
    input.value.focus()
    console.log('Bearbeitungs-Modus wurde aktiviert!')
  })
}

// deaktiviert bearbeitungsmodus durch rausklicken oder enter und sendet neuen namen ans backend
function disableEditing() {
  console.log('Bearbeitungs-Modus deaktiviert!')
  isEditing.value = false

  fetch('http://localhost:3000/api/dashboard-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: dashboardTitle.value }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toast.success('✅ Titel erfolgreich gespeichert!')
      } else {
        toast.warning('⚠️ Antwort vom Server war nicht wie erwartet')
      }
    })
    .catch((err) => {
      toast.error('❌ Netzwerkfehler beim Speichern')
      console.error(err)
    })
}
// Aktive Komponente fürs Modal
const activeComponent = ref(null)

// Gespeicherte Notizen
const savedNotes = ref([])

// Lädt Notizen aus dem localStorage
function loadNotes() {
  try {
    const raw = localStorage.getItem('notizen')
    savedNotes.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Fehler beim Parsen von Notizen. Reset:', e)
    localStorage.removeItem('notizen') // 🧼 kaputten Eintrag entfernen
    savedNotes.value = []
  }
}

onMounted(() => {
  loadNotes()
  window.addEventListener('notiz-gespeichert', loadNotes)

  // Dashboard-Titel vom Server holen
  fetch('http://localhost:3000/api/dashboard-title')
    .then((res) => res.json())
    .then((data) => {
      dashboardTitle.value = data.title
      console.log('Titel vom Server geladen:', data.title)
    })
    .catch((err) => console.error('Fehler beim Laden des Titels:', err))
})

onBeforeUnmount(() => {
  window.removeEventListener('notiz-gespeichert', loadNotes)
})

// Karten-Konfiguration für das Dashboard
const components = [
  { name: 'ToDo-Liste', component: () => import('./components/ToDo.vue'), color: '#d0ebff' },
  { name: 'Kalender', component: () => import('./components/Calendar.vue'), color: '#ffe0e9' },
  { name: 'Timer', component: () => import('./components/Timer.vue'), color: '#e0ffe0' },
  { name: 'Notizen', component: () => import('./components/Notes.vue'), color: '#fff4cc' },
  { name: 'Dateien', component: () => import('./components/Dateien.vue'), color: '#e0f7fa' },
  {
    name: 'Produktivität',
    component: () => import('./components/Productivity.vue'),
    color: '#f3e5f5',
  },
]

// Modal-Komponente dynamisch laden
function openModal(componentImport) {
  componentImport().then((mod) => {
    activeComponent.value = mod.default
  })
}

function deleteNote(index) {
  savedNotes.value.splice(index, 1)
  localStorage.setItem('notizen', JSON.stringify(savedNotes.value))
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.dashboard {
  min-height: 100vh; /* volle Höhe des Viewports */
  width: 100%;
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background-color: #fff5f7;
  box-sizing: border-box;
}
.dashboard-buttons {
  position: fixed;
  bottom: 60px;
  left: 60px;
  right: 60px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 100;
}

.dashboard-btn {
  pointer-events: auto;
  background-color: #ffd6d6;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s ease;
}

.dashboard-btn:hover {
  background-color: #ffbdbd;
}

h1 input {
  background: transparent;
  font-size: 32px;
  text-align: center;
  border: none;
  border-bottom: 2px solid #333;
  outline: none;
  padding: 4px 0;
  font-weight: bold;
}

.cards {
  display: grid;
  gap: 100px;
  justify-content: center;
  padding: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); /* <--- NEU */
  max-width: 1000px;
  margin: 0 auto; /* zentriert den Block */
}

.card {
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 300px;
  height: 180px;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #e0dcbc;
}

.card:hover {
  transform: scale(1.03);
}

.modal {
  position: fixed;
  top: 5%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: rgb(255, 250, 247);
  border: 2px solid #ccc;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.btn {
  padding: 10px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  background-color: #a0a0a0;
  margin: 25px 0;
  cursor: pointer;
}

@media (min-width: 600px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.sticky-notes {
  position: fixed;
  top: 60px;
  left: 50px;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 900;
}

.sticky-note {
  position: relative; /* <- das fehlt! */
  background-color: #fffbe6;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.delete-note {
  position: absolute;
  top: 2px;
  right: 2px;
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: rgb(117, 115, 115);
}

.login\/logout {
  position: fixed;
  top: 60px;
  right: 60px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #333;
  border: 2px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background-color 0.2s ease;
}

.login\/logout:hover {
  background-color: #f0f0f0;
}

.Einstellungen {
  position: fixed;
  bottom: 140px;
  right: 60px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #333;
  border: 2px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background-color 0.2s ease;
}

.Einstellungen:hover {
  background-color: #f0f0f0;
}
</style>
