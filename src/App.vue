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

    <div class="modal-background" v-if="activeComponent" @click.self="activeComponent = null">
      <div class="modal">
        <component :is="activeComponent" />
        <button class="btn" @click="activeComponent = null">Schließen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeComponent = ref(null)

const components = [
  { name: 'ToDo-Liste', component: () => import('./components/ToDo.vue') },
  { name: 'Kalender', component: () => import('./components/Calendar.vue') },
  { name: 'Timer', component: () => import('./components/Timer.vue') },
  { name: 'Notizen', component: () => import('./components/Notes.vue') },
  { name: 'Einstellungen', component: () => import('./components/Settings.vue') },
  { name: 'Produktivität', component: () => import('./components/Productivity.vue') },
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
  gap: 1rem;
  justify-items: center;
  padding: 1rem;
  grid-template-columns: 1fr;
}

.card {
  background-color: #fffbea; /* sanfter Papierfarbton */
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
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
  background: white;
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
  padding: 15px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  background-color: #666;
  margin: 10px 0;
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
</style>
