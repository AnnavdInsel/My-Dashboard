<template>
  <div>
    <h2>📝 ToDo-Liste</h2>
    <p>Hier kommt deine ToDo-Liste rein.</p>

    <input type="text" v-model="task" id="user-input" placeholder="Gib hier deine Aufgabe ein" />
    <br />
    <h3>Heutigen Aufgaben:</h3>
    <ul class="task-list">
      <li class="task-item" v-for="(eintrag, index) in taskList" :key="index">
        {{ eintrag }}
      </li>
    </ul>
    <button class="btn" @click="saveTask">Speichern</button>
  </div>
</template>

<script setup>
// Platz für Logik
import { ref } from 'vue'

const task = ref('')
const taskList = ref([])

function saveTask() {
  if (task.value.trim() !== '') {
    taskList.value.push(task.value)
    task.value = ''
  }
}
</script>

<style scoped>
/* Optionales Styling */
#user-input {
  padding: 0.5em;
  text-align: center;
  font-size: 20px;
}

.task-list {
  border: solid 1px black;
  list-style: decimal;
  padding: 0;
}

.task-item {
  background: #e0e0e0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  font-size: 25px;
}

.task-item:hover {
  background: #666;
}

.btn {
  padding: 15px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  background-color: #666;
}
</style>
