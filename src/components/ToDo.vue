<template>
  <div>
    <h2>📝 ToDo-Liste</h2>
    <p>Hier kommt deine ToDo-Liste rein.</p>

    <input
      type="text"
      v-model="task"
      @keyup.enter="saveTask"
      id="user-input"
      placeholder="Gib hier deine Aufgabe ein"
    />
    <br />
    <div class="task-section">
      <h3>Heutigen Aufgaben:</h3>
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
}

.task-section {
  width: 500px;
  margin: 0 auto;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  background: #e0e0e0;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 6px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-item:hover {
  background: #d0d0d0;
}

.task-text {
  flex-grow: 1;
  text-align: left;
  padding-right: 1rem;
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

.done:hover {
  background-color: #c8f7c5;
  cursor: default;
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
