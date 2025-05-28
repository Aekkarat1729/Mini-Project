<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useRouter, useCookie, useRuntimeConfig, useFetch } from '#imports'
import { ref } from 'vue'

// ตัวแปรและคอนฟิกพื้นฐาน
const router = useRouter()
const tokenCookie = useCookie('token')
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// ฟังก์ชัน logout
function logout() {
  tokenCookie.value = null
  router.replace('/login')
}

// อินเตอร์เฟสข้อมูล
interface User {
  id: number
  username: string
  email?: string
  role: 'ADMIN' | 'USER'
}

interface UserResponse {
  status: string
  message: string
  data: User[]
}

// ตัวแปรผู้ใช้
const users = ref<User[]>([])
const pending = ref(true)
const error = ref<Error | null>(null)

// ดึงข้อมูลผู้ใช้
const fetchUsers = async () => {
  try {
    pending.value = true

    const { data } = await useFetch<UserResponse>(`${apiBase}/users`, {
      headers: { Authorization: `Bearer ${tokenCookie.value}` }
    })

    users.value = data.value?.data || []
  } catch (err: any) {
    error.value = err
  } finally {
    pending.value = false
  }
}

await fetchUsers()

// อัปเดตผู้ใช้
async function updateUser(u: User) {
  try {
    await $fetch(`${apiBase}/users/${u.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
      body: { username: u.username, email: u.email, role: u.role }
    })
    await fetchUsers()
  } catch (e: any) {
    alert(e.message || 'ไม่สามารถบันทึกข้อมูลได้')
  }
}

// ลบผู้ใช้
async function deleteUser(id: number) {
  if (!confirm('ยืนยันการลบผู้ใช้นี้?')) return
  try {
    await $fetch(`${apiBase}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenCookie.value}` }
    })
    await fetchUsers()
  } catch (e: any) {
    alert(e.message || 'ไม่สามารถลบผู้ใช้ได้')
  }
}
</script>

<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
      <button @click="logout"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        Logout
      </button>
    </div>

    <!-- Loading / Error -->
    <div v-if="pending" class="text-center py-10 text-gray-500">กำลังโหลดข้อมูล...</div>
    <div v-if="error" class="text-center py-4 text-red-500">
      {{ error.message || 'เกิดข้อผิดพลาด' }}
    </div>

    <!-- ตารางผู้ใช้ -->
    <div v-if="users.length" class="overflow-auto bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ u.id }}</td>
            <td class="px-6 py-4">
              <input v-model="u.username" class="w-full border rounded px-2 py-1 text-sm" />
            </td>
            <td class="px-6 py-4">
              <input v-model="u.email" type="email" class="w-full border rounded px-2 py-1 text-sm" />
            </td>
            <td class="px-6 py-4">
              <select v-model="u.role" class="border rounded px-2 py-1 text-sm">
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </td>
            <td class="px-6 py-4 text-center space-x-2">
              <button @click="updateUser(u)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                บันทึก
              </button>
              <button @click="deleteUser(u.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ไม่มีผู้ใช้ -->
    <div v-else-if="!pending" class="py-10 text-center text-gray-500">
      ไม่มีผู้ใช้งานในระบบ
    </div>
  </div>
</template>

<style scoped>
/* ใช้ Tailwind CSS อยู่แล้ว ไม่จำเป็นต้องเขียนเพิ่ม */
</style>
