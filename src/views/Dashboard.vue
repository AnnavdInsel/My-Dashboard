<template>
  <div class="card-wrapper">
    <header class="card-header">
      <h1>📚 Mein Dashboard</h1>
    </header>
    <main class="card-dashboard">
      <component
        v-for="(comp, index) in components"
        :is="comp.component"
        :key="index"
        class="card-item"
        :class="comp.class"
        @click="openModal(comp.component, comp.class)"
      />
    </main>

    <div class="modal" v-if="activeComponent">
      <div class="modal-content">
        <component :is="activeComponent" class="modal-inner" />
        <div class="modal-buttons">
          <button @click="save" class="save-button">Speichern</button>
          <button @click="closeModal" class="close-button">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TodoList from '@/components/TodoList.vue'
import Calendar from '@/components/Calendar.vue'
import Timer from '@/components/Timer.vue'
import Notes from '@/components/Notes.vue'
import Settings from '@/components/Settings.vue'
import Productivity from '@/components/Productivity.vue'

const activeComponent = ref(null)

const components = [
  { component: TodoList, class: 'todo' },
  { component: Calendar, class: 'calendar' },
  { component: Timer, class: 'timer' },
  { component: Notes, class: 'notes' },
  { component: Settings, class: 'settings' },
  { component: Productivity, class: 'productivity' },
]

function openModal(component, styleClass) {
  activeComponent.value = component
}

function closeModal() {
  activeComponent.value = null
}

function save() {
  console.log('Gespeichert!')
  closeModal()
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.card-wrapper {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #fefbf6, #e5f0ff);
  display: grid;
  grid-template-rows: auto 1fr;
  place-items: center;
  box-sizing: border-box;
  padding: 2rem;
  gap: 0.5rem;
}

.card-header {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 0;
}

.card-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  row-gap: 1rem;
  column-gap: 1.5rem;
  height: auto;
  width: 100%;
  max-width: 1200px;
  align-content: center;
  justify-content: center;
}

.card-item {
  width: 300px;
  height: 200px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
  background-color: white;
  cursor: pointer;
}

.card-item:hover {
  transform: scale(1.03);
}

.todo {
  background-color: #ffe4e1;
}
.calendar {
  background-color: #e0f7fa;
}
.timer {
  background-color: #f3e5f5;
}
.notes {
  background-color: #fff9c4;
}
.settings {
  background-color: #dcedc8;
}
.productivity {
  background-color: #f8bbd0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 80vw;
  height: 80vh;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.save-button,
.close-button {
  background-color: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
</style>
