<template>
  <div>
    <h2>📝 ToDo-Liste</h2>
    <p>Hier kommt deine ToDo-Liste rein.</p>

    <input type="text" v-model="task" placeholder="Gib hier deine Aufgabe ein" />
    <br />
    <h3>Heutigen Aufgaben:</h3>
    <p>{{ taskOutput }}</p>
    <button @click="saveTask">Speichern</button>
  </div>
</template>

<script setup>
// Platz für Logik
import { ref } from 'vue'

const task = ref('')
const taskOutput = ref('Hier stehen die zu erledigenden Aufgaben')

function saveTask() {
  taskOutput.value = task.value
}
</script>

<style scoped>
/* Optionales Styling */
#taskInput {
  margin: 0.5em;
  font-size: 20px;
  padding: 10px;
  text-align: center;
}

h3 {
  text-decoration: underline;
  font-size: 25px;
}

#taskOutput {
  font-size: 18px;
  background-color: grey;
  height: 200px;
}
</style>
