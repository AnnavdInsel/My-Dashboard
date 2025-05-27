<template>
  <div>
    <h2>📝 ToDo-Liste</h2>
    <p>Was musst du tun? Schreibe es auf und bestätige die Eingabe mit Enter!</p>

    <input
      type="text"
      v-model="task"
      @keyup.enter="saveTask"
      id="user-input"
      placeholder="Gib hier deine Aufgabe ein"
    />
    <br />
    <div class="task-section">
      <h3>Meine heutigen Aufgaben:</h3>
      <ul class="task-list">
        <li
          class="task-item"
          :class="{ done: eintrag.done }"
          v-for="(eintrag, index) in taskList"
          :key="index"
        >
          <span class="task-text">{{ eintrag.text }}</span>
          <div class="task-actions">
            <button @click="completeTask(index)">✅</button>
            <button @click="deleteTask(index)">❌</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const task = ref('')
const taskList = ref([])

const saved = localStorage.getItem('myTodos')
if (saved) {
  taskList.value = JSON.parse(saved)
}

function saveTask() {
  if (task.value.trim() !== '') {
    taskList.value.push({ text: task.value, done: false })
    task.value = ''
    updateLocalStorage()
  }
}

function completeTask(index) {
  taskList.value[index].done = true
  updateLocalStorage()
}

function deleteTask(index) {
  taskList.value.splice(index, 1)
  updateLocalStorage()
}

function updateLocalStorage() {
  localStorage.setItem('myTodos', JSON.stringify(taskList.value))
}
</script>

<style scoped>
/* Optionales Styling */
#user-input {
  padding: 0.5em;
  text-align: center;
  font-size: 20px;
  width: 100%;
  box-sizing: border-box;
  background: #d9ebfa;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.task-section {
  max-width: 600px;
  margin: 60px auto 0 auto;
  padding: 1rem;
  background: #bbd9f5;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  background: #d9ebfa;
  padding: 12px 18px;
  margin: 12px 0;
  border-radius: 12px;
  font-size: 18px;
  display: grid;
  grid-template-columns: 1fr auto; /* Text links, Buttons rechts */
  gap: 1rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease;
  word-break: break-word;
}

.task-item:hover {
  background: #ffffff;
}

.task-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.task-actions {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.task-actions button {
  margin-left: 5px;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-size: 20px;
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.4);
}

.done {
  background: linear-gradient(to right, #c8f7c5 0%, #c8f7c5 100%);
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: greenSwipe 0.8s ease-out forwards;
}

.done .task-actions button:first-child {
  display: none;
}

@keyframes greenSwipe {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}
</style>
