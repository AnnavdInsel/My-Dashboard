<template>
  <div class="upload-wrapper">
    <label class="upload-box" for="fileInput">
      <span class="plus">+</span>
      <span>Lade deine Datei hoch</span>
    </label>
    <input type="file" id="fileInput" @change="uploadFile" hidden />
    <p v-if="uploadSuccess" class="success">✅ Hochgeladen!</p>
    <p v-if="uploadError" class="error">❌ Fehler beim Hochladen</p>

    <div class="file-list" v-if="files.length">
      <h3>📂 Hochgeladene Dateien:</h3>
      <ul>
        <li v-for="file in files" :key="file" class="file-item">
          <template v-if="isImage(file)">
            <img :src="fileUrl(file)" class="preview" />
            <p>{{ file }}</p>
          </template>

          <template v-else>
            <a :href="fileUrl(file)" target="_blank">{{ file }}</a>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const uploadSuccess = ref(false)
const uploadError = ref(false)
const files = ref([])

function fileUrl(file) {
  return `http://localhost:3000/uploads/${file}`
}

function isImage(file) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
}

async function loadFiles() {
  try {
    const res = await axios.get('http://localhost:3000/api/files')
    files.value = res.data
  } catch (err) {
    console.error('Fehler beim Laden der Dateien:', err)
  }
}

async function uploadFile(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    await axios.post('http://localhost:3000/api/upload', formData)
    uploadSuccess.value = true
    uploadError.value = false
    loadFiles()
  } catch (err) {
    console.error('Fehler beim Upload:', err)
    uploadSuccess.value = false
    uploadError.value = true
  }

  setTimeout(() => {
    uploadSuccess.value = false
    uploadError.value = false
  }, 3000)
}

onMounted(loadFiles)
</script>

<style scoped>
.upload-wrapper {
  text-align: center;
  margin-top: 4rem;
}

.upload-box {
  display: inline-block;
  padding: 2rem;
  border: 2px dashed #aaa;
  border-radius: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-box:hover {
  background: #f4f4f4;
}

.plus {
  display: block;
  font-size: 5rem;
  color: #888;
  line-height: 1;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.file-list {
  margin-top: 3rem;
  text-align: center;
}

.file-item {
  margin: 1rem auto;
  word-break: break-all;
}

.preview {
  max-width: 200px;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}
</style>
