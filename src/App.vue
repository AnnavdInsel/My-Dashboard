<template>
  <div class="dashboard">
    <h1>📚 Mein Dashboard</h1>
    <div class="cards">
      <div
        v-for="(card, index) in components"
        :key="index"
        class="card"
        @click="openModal(card.component)"
      >
        {{ card.name }}
      </div>
    </div>

    <div class="modal" v-if="activeComponent">
      <component :is="activeComponent" />
      <button class="close-btn" @click="activeComponent = null">Schließen</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeComponent = ref(null)

const components = [
  { name: 'ToDo', component: () => import('./components/ToDo.vue') },
  { name: 'Calendar', component: () => import('./components/Calendar.vue') },
  { name: 'Timer', component: () => import('./components/Timer.vue') },
  { name: 'Notes', component: () => import('./components/Notes.vue') },
  { name: 'Settings', component: () => import('./components/Settings.vue') },
  { name: 'Productivity', component: () => import('./components/Productivity.vue') },
]

function openModal(componentImport) {
  componentImport().then((mod) => {
    activeComponent.value = mod.default
  })
}
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.card {
  background-color: #f0f0f0;
  padding: 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: scale(1.05);
}
.modal {
  position: fixed;
  top: 5%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: white;
  border: 2px solid #ccc;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.close-btn {
  margin-top: 2rem;
}
</style>
