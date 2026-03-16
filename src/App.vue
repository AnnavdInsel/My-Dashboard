<template>
  <div class="dashboard" :class="{ 'has-notes': savedNotes.length > 0 }">
    <div class="sticky-sidebar">
      <button class="add-note-btn" @click="addNote">+</button>
      <draggable
        v-model="savedNotes"
        item-key="id"
        handle=".drag-handle"
        animation="200"
        tag="div"
        class="sticky-notes-inner"
      >
        <template #item="{ element, index }">
          <div class="sticky-note" @dblclick="startEditing(index)">
            <div class="drag-handle" style="cursor: grab">☰</div>
            <button class="delete-note" @click.stop="deleteNote(index)">✖</button>

            <template v-if="editingNoteIndex === index">
              <textarea
                :id="`edit-note-${index}`"
                v-model="editedText"
                @blur="saveEditedNote(index)"
                @keyup.enter="saveEditedNote(index)"
                class="note-editor"
              ></textarea>
            </template>

            <template v-else>
              {{ element.text }}
            </template>
          </div>
        </template>
      </draggable>
    </div>

    <div class="main-content">
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
    </div>

    <div class="dashboard-buttons">
      <button class="dashboard-btn right" @click="resetBoard">Board loeschen</button>
      <button class="settings-btn" @click="openModal(() => import('./components/dashboard-einstellungen.vue'))">⚙️</button>
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
import draggable from 'vuedraggable'
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const input = ref(null)
const isEditing = ref(false)
const dashboardTitle = ref('Mein Dashboard')
const activeComponent = ref(null)
const savedNotes = ref([])
const editingNoteIndex = ref(null)
const editedText = ref('')

function enableEditing() {
  isEditing.value = true
  nextTick(() => input.value && input.value.focus())
}

function disableEditing() {
  if (!isEditing.value) return // 🔒 Nur einmal ausführen
  isEditing.value = false

  axios
    .post('http://localhost:3000/api/dashboard-title', {
      title: dashboardTitle.value,
    })
    .then(() => {
      console.log('📤 Dashboard-Titel erfolgreich an Backend gesendet')
    })
    .catch((err) => {
      console.error('❌ Fehler beim Senden des Dashboard-Titels:', err)
    })
}

function loadNotes() {
  try {
    const raw = localStorage.getItem('notizen')
    const parsed = raw ? JSON.parse(raw) : []
    savedNotes.value = parsed.map((note, i) =>
      typeof note === 'string' ? { id: Date.now() + i, text: note } : note,
    )
  } catch (e) {
    console.warn('Fehler beim Parsen von Notizen. Reset:', e)
    savedNotes.value = []
  }
}

function addNote() {
  const newNote = { id: Date.now(), text: 'Neue Notiz' }
  savedNotes.value.push(newNote)
  localStorage.setItem('notizen', JSON.stringify(savedNotes.value))
  nextTick(() => startEditing(savedNotes.value.length - 1))
}

function openModal(componentImport) {
  componentImport().then((mod) => {
    activeComponent.value = mod.default
  })
}

function deleteNote(index) {
  savedNotes.value.splice(index, 1)
  localStorage.setItem('notizen', JSON.stringify(savedNotes.value))
}

function startEditing(index) {
  editingNoteIndex.value = index
  editedText.value = savedNotes.value[index].text
  nextTick(() => {
    const input = document.querySelector(`#edit-note-${index}`)
    if (input) input.focus()
  })
}

function saveEditedNote(index) {
  if (editedText.value.trim() !== '') {
    savedNotes.value[index].text = editedText.value
    localStorage.setItem('notizen', JSON.stringify(savedNotes.value))
  }
  editingNoteIndex.value = null
}

async function resetBoard() {
  const confirmed = window.confirm('Alles wird geloescht (Todos, Notizen, Produktivitaet, Titel). Bist du sicher?')
  if (!confirmed) return

  try {
    await axios.delete('http://localhost:3000/api/reset')
    dashboardTitle.value = 'Mein Dashboard'
    savedNotes.value = []
    localStorage.removeItem('notizen')
    window.location.reload()
  } catch (err) {
    console.error('Fehler beim Zuruecksetzen:', err)
  }
}

onMounted(() => {
  // ⬇️ Titel vom Server laden
  axios
    .get('http://localhost:3000/api/dashboard-title')
    .then((response) => {
      dashboardTitle.value = response.data.title
      console.log('🟢 Titel vom Server geladen:', dashboardTitle.value)
    })
    .catch((err) => {
      console.error('❌ Fehler beim Laden des Dashboard-Titels:', err)
    })

  loadNotes()
})

const components = [
  {
    name: 'ToDo-Liste',
    component: () => import('./components/dashboard-todo.vue'),
    color: '#d0ebff',
  },
  {
    name: 'Kalender',
    component: () => import('./components/dashboard-calendar.vue'),
    color: '#ffe0e9',
  },
  { name: 'Timer', component: () => import('./components/dashboard-timer.vue'), color: '#e0ffe0' },
  {
    name: 'Notizen',
    component: () => import('./components/dashboard-notes.vue'),
    color: '#fff4cc',
  },
  {
    name: 'Dateien',
    component: () => import('./components/dashboard-dateien.vue'),
    color: '#e0f7fa',
  },
  {
    name: 'Produktivität',
    component: () => import('./components/dashboard-productivity.vue'),
    color: '#f3e5f5',
  },
]
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.dashboard {
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  background-color: #fff5f7;
  box-sizing: border-box;
  display: flex;
  padding: 2rem;
  gap: 2rem;
}

.sticky-sidebar {
  width: 45px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  transition: width 0.3s ease;
}

.has-notes .sticky-sidebar {
  width: 180px;
}

.main-content {
  flex: 1;
  text-align: center;
  min-width: 0;
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
  gap: 2rem;
  justify-content: center;
  padding: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-width: 100%;
  margin: 0 auto;
}

.card {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 300px;
  height: 160px;
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

@media (min-width: 850px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.add-note-btn {
  position: sticky;
  top: 0;
  z-index: 10;
  width: 36px;
  height: 36px;
  padding: 0;
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
  font-weight: bold;
  background-color: #fffbe6;
  border: 2px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  transition: background-color 0.2s ease, color 0.2s ease;
  line-height: 1;
}

.add-note-btn:hover {
  background-color: #fff4b0;
  color: #666;
}

.sticky-notes-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
}

.sticky-note {
  position: relative;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #fffbe6 0%, #fff8cc 100%);
  padding: 28px 10px 10px 10px;
  border-radius: 2px;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.15),
    inset 0 -2px 3px rgba(0, 0, 0, 0.04);
  font-family: 'Segoe UI', sans-serif;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  box-sizing: border-box;
}

.sticky-note::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  background: linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 100%);
  border-radius: 2px 2px 0 0;
}

.delete-note {
  position: absolute;
  top: 3px;
  right: 4px;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  color: rgba(117, 115, 115, 0.6);
  z-index: 2;
}

.delete-note:hover {
  color: #c00;
}

.note-editor {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: none;
  border-radius: 2px;
  padding: 0;
  font-size: 13px;
  resize: none;
  font-family: 'Segoe UI', sans-serif;
  box-sizing: border-box;
  background-color: transparent;
  outline: none;
}

.drag-handle {
  position: absolute;
  top: 3px;
  left: 5px;
  font-size: 0.9rem;
  color: rgba(117, 115, 115, 0.5);
  user-select: none;
  z-index: 2;
}

.settings-btn {
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
  pointer-events: auto;
}

.settings-btn:hover {
  background-color: #f0f0f0;
}
</style>
