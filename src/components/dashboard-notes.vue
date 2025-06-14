<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="notes-container">
    <h2>🗒️ Notizen</h2>
    <p>Hier kannst du dir Notizen machen.</p>
    <textarea v-model="noteText" placeholder="Schreibe deine Notizen hier..."></textarea>
    <div class="buttons">
      <button @click="saveNote">💾 Speichern</button>
      <button @click="clearNote" class="delete">🗑️ Löschen</button>
    </div>
    <p v-if="savedMessage" class="saved-message">Gespeichert!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const noteText = ref('')
const savedMessage = ref(false)
const today = new Date().toISOString().slice(0, 10) // z.B. "2025-05-30"

const loadNote = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/notes')
    const notes = await res.json()
    noteText.value = notes[today] || ''
  } catch (err) {
    console.error('Fehler beim Laden der Notiz:', err)
  }
}

const saveNote = async () => {
  if (!noteText.value.trim()) return

  try {
    await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, note: noteText.value.trim() }),
    })

    noteText.value = ''
    savedMessage.value = true
    window.dispatchEvent(new Event('notiz-gespeichert'))

    setTimeout(() => (savedMessage.value = false), 2000)
  } catch (err) {
    console.error('Fehler beim Speichern der Notiz:', err)
  }
}

const clearNote = () => {
  noteText.value = ''
}

onMounted(() => {
  loadNote()
})
</script>

<style scoped>
/* 👇 Alles bleibt 1:1 wie im Original – Design wird NICHT verändert */
.notes-container {
  background: #fffdf5;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

textarea {
  width: 580px;
  height: 650px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  resize: vertical;
  font-size: 16px;
  line-height: 28px;
  background: repeating-linear-gradient(
    to bottom,
    #fffdf5 0px,
    #fffdf5 28px,
    #e0e0e0 28px,
    #e0e0e0 29px
  );
  background-position: left 12px top 12px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

textarea:focus {
  outline: none;
  background-color: #fefbe9;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ffcc70;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffb347;
}

button.delete {
  background-color: #f88;
}

button.delete:hover {
  background-color: #e66;
}

.saved-message {
  margin-top: 0.5rem;
  color: green;
  font-weight: bold;
}
</style>
