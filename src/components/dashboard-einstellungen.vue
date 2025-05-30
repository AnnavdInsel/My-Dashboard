<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="einstellungen">
    <h2>Dashboard-Titel</h2>
    <input v-model="dashboardTitle" @blur="saveTitle" placeholder="Titel eingeben" />
    <p v-if="feedback" style="color: green">{{ feedback }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardTitle: '',
      feedback: '',
    }
  },
  async mounted() {
    // Lade den aktuellen Titel vom Backend
    try {
      const res = await fetch('http://localhost:3000/api/dashboard-title')
      const data = await res.json()
      this.dashboardTitle = data.title
    } catch (err) {
      console.error('Fehler beim Laden des Titels:', err)
    }
  },
  methods: {
    async saveTitle() {
      // Speichern nur, wenn Titel nicht leer ist
      if (!this.dashboardTitle.trim()) return

      try {
        const res = await fetch('http://localhost:3000/api/dashboard-title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: this.dashboardTitle }),
        })

        const data = await res.json()
        if (data.success) {
          this.feedback = 'Titel gespeichert!'
          setTimeout(() => (this.feedback = ''), 2000)
        }
      } catch (err) {
        console.error('Fehler beim Speichern des Titels:', err)
      }
    },
  },
}
</script>

<style scoped>
.einstellungen {
  padding: 1rem;
}
input {
  font-size: 1.1rem;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}
</style>
