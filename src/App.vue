<template>
  <div class="app-wrapper">
    <main class="app-content">
      <Dashboard />
    </main>
  </div>
</template>

<script setup>
import Dashboard from './views/Dashboard.vue'
</script>

<style scoped>
.app-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fefbf6;
  font-family: 'Dancing Script', cursive;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
}

.app-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  box-sizing: border-box;
}
</style>
