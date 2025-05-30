<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { useFetch } from '#imports'
import { ref } from 'vue'

// ตัวแปรหลัก
const router = useRouter()
const tokenCookie = useCookie<string | null>('token')

// Check if token exists, redirect to login if not
if (!tokenCookie.value) {
  router.replace('/login')
}

// Hardcode the API URL as specified
const apiBase = 'http://localhost:3001'
const usersUrl = `${apiBase}/users`

function logout() {
  tokenCookie.value = null
  router.replace('/login')
}

interface User {
  id: number
  username: string
  email?: string
  role: 'ADMIN' | 'USER'
  passwordHash: string // Added to match API response
  createdAt: string // Added to match API response
}

interface UserResponse {
  status: string
  message: string
  data: User[]
}

const users = ref<User[]>([])
const pending = ref(true)
const error = ref<string | null>(null)
const updatingUser = ref<number | null>(null)
const deletingUser = ref<number | null>(null)

const fetchUsers = async () => {
  try {
    pending.value = true
    error.value = null
    const response = await useFetch<UserResponse>(usersUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
    })

    if (response.error.value) {
      throw new Error(`API Error: ${response.error.value.message || 'ไม่ทราบสาเหตุ'}`)
    }

    const data = response.data.value
    if (data && data.status === 'success') {
      users.value = data.data || []
    } else {
      throw new Error(`Invalid Response: ${data?.message || 'การตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง'}`)
    }
  } catch (err: any) {
    error.value = `ไม่สามารถดึงข้อมูลผู้ใช้ได้: ${err.message}`
  } finally {
    pending.value = false
  }
}

await fetchUsers()

async function updateUser(u: User) {
  try {
    updatingUser.value = u.id
    error.value = null
    const response = await $fetch(`${usersUrl}/${u.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
      body: { username: u.username, email: u.email, role: u.role }, // Only send editable fields
    })

    if (response.status !== 'success') {
      throw new Error(response.message || 'ไม่สามารถบันทึกข้อมูลได้')
    }

    await fetchUsers()
  } catch (e: any) {
    error.value = `ไม่สามารถบันทึกข้อมูลได้: ${e.message}`
  } finally {
    updatingUser.value = null
  }
}

async function deleteUser(id: number) {
  if (!confirm('ยืนยันการลบผู้ใช้นี้?')) return
  try {
    deletingUser.value = id
    error.value = null
    const response = await $fetch(`${usersUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
    })

    if (response.status !== 'success') {
      throw new Error(response.message || 'ไม่สามารถลบผู้ใช้ได้')
    }

    await fetchUsers()
  } catch (e: any) {
    error.value = `ไม่สามารถลบผู้ใช้ได้: ${e.message}`
  } finally {
    deletingUser.value = null
  }
}
</script>

<template>
  <div class="p-8 bg-white/95 backdrop-blur-md min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 font-sans">จัดการผู้ใช้งาน</h1>
      <button
        @click="logout"
        class="group px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 hover:shadow-md transition-all duration-300 transform hover:scale-103"
      >
        Logout
        <i class="i-lucide-log-out w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
      </button>
    </div>

    <div v-if="pending" class="text-center py-10 text-gray-600 font-sans">
      <i class="i-lucide-loader-2 w-6 h-6 animate-spin inline-block mr-2"></i>
      กำลังโหลดข้อมูล...
    </div>
    <div v-if="error" class="text-center py-4 text-red-500 font-sans">
      {{ error }}
    </div>

    <div v-if="users.length" class="overflow-auto bg-white/95 backdrop-blur-md shadow-lg rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50/95">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase font-sans">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase font-sans">Username</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase font-sans">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase font-sans">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase font-sans">Created At</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase font-sans">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50/80 transition-all duration-200">
            <td class="px-6 py-4 text-sm text-gray-700 font-sans">{{ u.id }}</td>
            <td class="px-6 py-4">
              <div class="relative">
                <i class="i-lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
                <input
                  v-model="u.username"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
                  :disabled="updatingUser === u.id || deletingUser === u.id"
                />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="relative">
                <i class="i-lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
                <input
                  v-model="u.email"
                  type="email"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
                  :disabled="updatingUser === u.id || deletingUser === u.id"
                />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="relative">
                <i class="i-lucide-shield absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
                <select
                  v-model="u.role"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-sans focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
                  :disabled="updatingUser === u.id || deletingUser === u.id"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 font-sans">
              {{ new Date(u.createdAt).toLocaleString('th-TH') }}
            </td>
            <td class="px-6 py-4 text-center space-x-2">
              <button
                @click="updateUser(u)"
                class="group px-3 py-1 bg-blue-600 text-white rounded-xl text-sm font-medium font-sans hover:bg-blue-700 hover:shadow-md transition-all duration-300 transform hover:scale-103"
                :disabled="updatingUser === u.id || deletingUser === u.id"
              >
                <i v-if="updatingUser === u.id" class="i-lucide-loader-2 w-4 h-4 animate-spin inline-block mr-1"></i>
                <span v-else>
                  บันทึก
                  <i class="i-lucide-save w-4 h-4 ml-1 inline-block group-hover:animate-pulse"></i>
                </span>
              </button>
              <button
                @click="deleteUser(u.id)"
                class="group px-3 py-1 bg-red-600 text-white rounded-xl text-sm font-medium font-sans hover:bg-red-700 hover:shadow-md transition-all duration-300 transform hover:scale-103"
                :disabled="updatingUser === u.id || deletingUser === u.id"
              >
                <i v-if="deletingUser === u.id" class="i-lucide-loader-2 w-4 h-4 animate-spin inline-block mr-1"></i>
                <span v-else>
                  ลบ
                  <i class="i-lucide-trash-2 w-4 h-4 ml-1 inline-block group-hover:animate-pulse"></i>
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!pending && !error" class="py-10 text-center text-gray-600 font-sans">
      ไม่มีผู้ใช้งานในระบบ
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism effect */
.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}
.bg-gray-50\/95 {
  background-color: rgba(249, 250, 251, 0.95);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

/* Smooth transitions for inputs, buttons, and table rows */
input,
select,
button,
tr {
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
button:disabled,
input:disabled,
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>