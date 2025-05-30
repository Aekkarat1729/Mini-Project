<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { useFetch } from '#imports'
import { ref } from 'vue'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

// ตัวแปรหลัก
const router = useRouter()
const tokenCookie = useCookie<string | null>('token')

// ตรวจสอบ token
if (!tokenCookie.value) {
  router.replace('/login')
}

const documents = ref<any[]>([])
const pending = ref<boolean>(true)
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)

const logout = () => {
  tokenCookie.value = null
  router.replace('/login')
}

const fetchDocuments = async () => {
  try {
    pending.value = true
    error.value = null
    const response = await useFetch(`http://localhost:3001/documents?page=${currentPage.value}&limit=${pageSize.value}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
    })

    if (response.error.value) {
      if (response.error.value.statusCode === 401) {
        tokenCookie.value = null
        router.replace('/login')
        throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่')
      }
      throw new Error(`API Error: ${response.error.value.message || 'ไม่ทราบสาเหตุ'}`)
    }

    const data = response.data.value as { status?: string; data?: any[]; message?: string }
    if (data && data.status === 'success') {
      documents.value = data.data || []
    } else {
      throw new Error(`Invalid Response: ${data?.message || 'การตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง'}`)
    }
  } catch (err: any) {
    error.value = `ไม่สามารถดึงข้อมูลเอกสารได้: ${err.message}`
  } finally {
    pending.value = false
  }
}

// ตัวแปรสำหรับอัปโหลดเอกสารใหม่
const showUploadPopup = ref<boolean>(false)
const description = ref<string>('')
const file = ref<File | null>(null)
const uploadMessage = ref<string | null>(null)
const uploadPending = ref<boolean>(false)
const uploadError = ref<string | null>(null)

// ตัวแปรสำหรับแก้ไขเอกสาร
const showEditPopup = ref<boolean>(false)
const editDocumentId = ref<number | null>(null)
const editDescription = ref<string>('')
const editFile = ref<File | null>(null)

const handleFileChange = (event: Event, isEdit = false) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0] || null
  if (selectedFile) {
    if (!selectedFile.type.startsWith('application/pdf')) {
      uploadMessage.value = 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น'
      if (isEdit) editFile.value = null
      else file.value = null
    } else if (selectedFile.size > 10 * 1024 * 1024) {
      uploadMessage.value = 'ไฟล์มีขนาดเกิน 10MB'
      if (isEdit) editFile.value = null
      else file.value = null
    } else {
      uploadMessage.value = null
      if (isEdit) editFile.value = selectedFile
      else file.value = selectedFile
    }
  }
}

const uploadFile = async () => {
  if (!file.value) {
    uploadMessage.value = 'กรุณาเลือกไฟล์ PDF'
    return
  }

  uploadPending.value = true
  uploadError.value = null
  uploadMessage.value = null

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('title', file.value.name)
  formData.append('description', description.value || '')

  try {
    const response = await fetch('http://localhost:3001/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json() as { status: string; message?: string; data?: any }
    if (data.status === 'success') {
      uploadMessage.value = 'อัปโหลดไฟล์สำเร็จ'
      description.value = ''
      file.value = null
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      showUploadPopup.value = false
      await fetchDocuments()
    } else {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด')
    }
  } catch (err: any) {
    if (err.message.includes('401')) {
      tokenCookie.value = null
      router.replace('/login')
      uploadError.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
    } else {
      uploadError.value = `เกิดข้อผิดพลาด: ${err.message}`
    }
  } finally {
    uploadPending.value = false
  }
}

const openEditPopup = (doc: any) => {
  editDocumentId.value = doc.id
  editDescription.value = doc.description || ''
  editFile.value = null
  showEditPopup.value = true
}

const updateDocument = async () => {
  uploadPending.value = true
  uploadError.value = null
  uploadMessage.value = null

  const formData = new FormData()
  if (editFile.value) {
    formData.append('file', editFile.value)
    formData.append('title', editFile.value.name)
  }
  formData.append('description', editDescription.value || '')

  try {
    const response = await fetch(`http://localhost:3001/documents/${editDocumentId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json() as { status: string; message?: string }
    if (data.status === 'success') {
      uploadMessage.value = 'แก้ไขเอกสารสำเร็จ'
      showEditPopup.value = false
      await fetchDocuments()
    } else {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการแก้ไข')
    }
  } catch (err: any) {
    if (err.message.includes('401')) {
      tokenCookie.value = null
      router.replace('/login')
      uploadError.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
    } else {
      uploadError.value = `เกิดข้อผิดพลาด: ${err.message}`
    }
  } finally {
    uploadPending.value = false
  }
}

const deleteDocument = async (id: number) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?')) return

  try {
    const response = await useFetch(`http://localhost:3001/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
    })

    if (response.error.value) {
      throw new Error(response.error.value.message || 'เกิดข้อผิดพลาดในการลบ')
    }

    const data = response.data.value as { status: string; message?: string }
    if (data.status === 'success') {
      await fetchDocuments()
    } else {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการลบ')
    }
  } catch (err: any) {
    if (err.response?.status === 401) {
      tokenCookie.value = null
      router.replace('/login')
      error.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
    } else {
      error.value = `เกิดข้อผิดพลาด: ${err.message}`
    }
  }
}

const formatDate = (date: string) => {
  if (!date) return 'ไม่มีวันที่'
  try {
    return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
  } catch {
    return 'วันที่ไม่ถูกต้อง'
  }
}

fetchDocuments()
</script>

<template>
  <!-- Template ยังคงเหมือนเดิม -->
  <div class="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-extrabold text-gray-800 font-sans tracking-tight">
        เอกสารของฉัน
      </h1>
      <button
        @click="logout"
        class="group px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium text-sm hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Logout
        <i class="i-lucide-log-out w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
      </button>
    </div>

    <div v-if="pending" class="text-center py-12 text-gray-600 font-sans">
      <i class="i-lucide-loader-2 w-8 h-8 animate-spin inline-block mr-3"></i>
      กำลังโหลดข้อมูล...
    </div>
    <div v-if="error" class="text-center py-6 text-red-500 font-sans bg-red-50 rounded-xl">
      {{ error }}
    </div>

    <div v-if="!pending && !error" class="space-y-8">
      <button
        @click="showUploadPopup = true"
        class="group px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium text-sm hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <i class="i-lucide-plus w-5 h-5 mr-2 inline-block group-hover:animate-pulse"></i>
        เพิ่มเอกสาร
      </button>

      <div v-if="documents.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center space-x-3 mb-3">
            <i class="i-lucide-file-text w-8 h-8 text-red-500"></i>
            <h3 class="text-lg font-semibold text-gray-800 font-sans truncate">{{ doc.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 font-sans line-clamp-2 mb-2">{{ doc.description || 'ไม่มีคำอธิบาย' }}</p>
          <p class="text-xs text-gray-400 font-sans mb-4">{{ formatDate(doc.createdAt) }}</p>
          <div class="flex justify-end space-x-2">
            <button
              @click="openEditPopup(doc)"
              class="group px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full text-sm font-medium font-sans hover:from-yellow-600 hover:to-yellow-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <i class="i-lucide-edit w-4 h-4 mr-1 inline-block group-hover:animate-pulse"></i>
              แก้ไข
            </button>
            <button
              @click="deleteDocument(doc.id)"
              class="group px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-medium font-sans hover:from-red-600 hover:to-red-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <i class="i-lucide-trash w-4 h-4 mr-1 inline-block group-hover:animate-pulse"></i>
              ลบ
            </button>
            <a
              :href="`/documents/${doc.id}/download`"
              target="_blank"
              class="group px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium font-sans hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <i class="i-lucide-download w-4 h-4 mr-1 inline-block group-hover:animate-pulse"></i>
              ดาวน์โหลด
            </a>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-600 font-sans bg-gray-50 rounded-xl">
        คุณยังไม่มีเอกสาร
      </div>

      <!-- Pagination -->
      <div class="flex justify-center space-x-4">
        <button
          @click="currentPage.value = Math.max(1, currentPage.value - 1); fetchDocuments()"
          :disabled="currentPage.value === 1"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium text-sm disabled:opacity-50"
        >
          ก่อนหน้า
        </button>
        <span class="text-gray-600 font-sans">หน้า {{ currentPage.value }}</span>
        <button
          @click="currentPage.value += 1; fetchDocuments()"
          :disabled="documents.length < pageSize.value"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium text-sm disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>
    </div>

    <!-- Popup for uploading file -->
    <Teleport to="body">
      <div v-if="showUploadPopup" class="fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 animate-fade-in">
          <h2 class="text-2xl font-bold text-gray-800 font-sans mb-6">อัปโหลดเอกสาร</h2>
          <div v-if="uploadPending" class="text-center py-3 text-gray-600 font-sans">
            <i class="i-lucide-loader-2 w-6 h-6 animate-spin inline-block mr-2"></i>
            กำลังอัปโหลด...
          </div>
          <div v-if="uploadError" class="text-center py-3 text-red-500 font-sans bg-red-50 rounded-lg">
            {{ uploadError }}
          </div>
          <div v-if="uploadMessage" class="text-center py-3 text-green-500 font-sans bg-green-50 rounded-lg">
            {{ uploadMessage }}
          </div>

          <form @submit.prevent="uploadFile" class="space-y-5" v-if="!uploadPending">
            <div>
              <label for="popup-description" class="block text-sm font-medium text-gray-700 font-sans">คำอธิบาย</label>
              <textarea
                v-model="description"
                id="popup-description"
                class="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-sm"
                placeholder="กรอกคำอธิบาย (ไม่บังคับ)"
                rows="3"
              />
            </div>
            <div>
              <label for="popup-file" class="block text-sm font-medium text-gray-700 font-sans">เลือกไฟล์ PDF</label>
              <input
                id="popup-file"
                type="file"
                @change="handleFileChange($event, false)"
                class="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-sm"
                accept=".pdf"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showUploadPopup = false"
                class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-300 transition-all duration-300"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium text-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                :disabled="uploadPending"
              >
                <i v-if="uploadPending" class="i-lucide-loader-2 w-5 h-5 animate-spin inline-block mr-2"></i>
                <span v-else>อัปโหลด</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Popup for editing file -->
    <Teleport to="body">
      <div v-if="showEditPopup" class="fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 animate-fade-in">
          <h2 class="text-2xl font-bold text-gray-800 font-sans mb-6">แก้ไขเอกสาร</h2>
          <div v-if="uploadPending" class="text-center py-3 text-gray-600 font-sans">
            <i class="i-lucide-loader-2 w-6 h-6 animate-spin inline-block mr-2"></i>
            กำลังอัปเดต...
          </div>
          <div v-if="uploadError" class="text-center py-3 text-red-500 font-sans bg-red-50 rounded-lg">
            {{ uploadError }}
          </div>
          <div v-if="uploadMessage" class="text-center py-3 text-green-500 font-sans bg-green-50 rounded-lg">
            {{ uploadMessage }}
          </div>

          <form @submit.prevent="updateDocument" class="space-y-5" v-if="!uploadPending">
            <div>
              <label for="edit-description" class="block text-sm font-medium text-gray-700 font-sans">คำอธิบาย</label>
              <textarea
                v-model="editDescription"
                id="edit-description"
                class="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-sm"
                placeholder="กรอกคำอธิบาย (ไม่บังคับ)"
                rows="3"
              />
            </div>
            <div>
              <label for="edit-file" class="block text-sm font-medium text-gray-700 font-sans">เลือกไฟล์ PDF (ถ้าต้องการเปลี่ยน)</label>
              <input
                id="edit-file"
                type="file"
                @change="handleFileChange($event, true)"
                class="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-sm"
                accept=".pdf"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditPopup = false"
                class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-300 transition-all duration-300"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium text-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                :disabled="uploadPending"
              >
                <i v-if="uploadPending" class="i-lucide-loader-2 w-5 h-5 animate-spin inline-block mr-2"></i>
                <span v-else>บันทึก</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Smooth transitions for inputs, buttons, and cards */
input,
textarea,
button,
div.hover:shadow-xl {
  transition: all 0.3s ease;
}

/* Icon hover effects */
i {
  transition: transform 0.3s ease, color 0.3s ease;
}
.group:hover i {
  transform: scale(1.15);
}

/* Disabled state styling */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Popup styling */
.fixed.inset-0 {
  z-index: 50;
}

/* Animation for popup */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

/* Line clamp for description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>