<template> 
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">DMS MINI</h1>
        <NuxtLink to="/register" class="text-sm font-medium text-purple-600 hover:underline">Register</NuxtLink>
      </div>

      <h2 class="text-xl font-semibold text-gray-700 mb-8">Login to your account</h2>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-600 mb-1">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Your username" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
        </div>

        <button type="submit" class="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Log In</button>
      </form>

      <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useCookie } from '#imports'
import {jwtDecode}   from 'jwt-decode'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

// cookie เก็บ token
const tokenCookie = useCookie('token')

interface TokenPayload {
  role: string
  exp?: number
}

// ถ้ามี token อยู่แล้ว ให้ redirect ตาม role
onMounted(() => {
  const token = tokenCookie.value
  if (token) {
    try {
      const payload = jwtDecode<TokenPayload>(token)
      if (payload.role === 'ADMIN') return router.replace('/admin')
      if (payload.role === 'USER')  return router.replace('/user')
    } catch {
      // ถ้า decode ไม่ได้ ล้าง token แล้วอยู่หน้า login ต่อ
      tokenCookie.value = null
    }
  }
})

async function onSubmit() {
  error.value = ''
  try {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    if (!res.ok) throw new Error('Invalid credentials')

    const { data } = await res.json()
    const token = data.token as string
    if (!token) throw new Error('No token received')

    tokenCookie.value = token

    const payload = jwtDecode<TokenPayload>(token)
    if (payload.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/user')
    }
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  }
}
</script>
