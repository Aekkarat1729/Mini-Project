<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const tokenCookie = useCookie<string | null>('token')
const username = ref('')
const password = ref('')
const error = ref('')

interface TokenPayload {
  role: 'ADMIN' | 'USER'
  exp?: number
}

onMounted(() => {
  const token = tokenCookie.value
  if (token) {
    try {
      const payload = jwtDecode<TokenPayload>(token)
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        tokenCookie.value = null
        return
      }
      router.replace(payload.role === 'ADMIN' ? '/admin' : '/user')
    } catch {
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
    router.push(payload.role === 'ADMIN' ? '/admin' : '/user')
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/95 backdrop-blur-md flex items-center justify-center px-4">
    <div
      class="bg-white/95 backdrop-blur-md shadow-lg rounded-xl w-full max-w-md p-8 border border-gray-200 transition-all duration-300"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 font-sans">Welcome Back</h1>
        <p class="text-sm text-gray-600 font-sans mt-2">Login to access your account</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 font-sans">Username</label>
          <div class="relative">
            <i class="i-lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
            <input
              v-model="username"
              type="text"
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 font-sans">Password</label>
          <div class="relative">
            <i class="i-lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
            <input
              v-model="password"
              type="password"
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="group w-full py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300 transform hover:scale-103"
        >
          Login
          <i class="i-lucide-log-in w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
        </button>
      </form>

      <p v-if="error" class="mt-6 text-center text-sm text-red-500 font-sans">{{ error }}</p>

      <p class="mt-6 text-center text-sm text-gray-600 font-sans">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="group text-gray-900 font-medium hover:text-gray-800 hover:underline transition-all duration-200"
        >
          Register
          <i class="i-lucide-user-plus w-4 h-4 ml-1 inline-block group-hover:animate-pulse"></i>
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism effect */
.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

/* Smooth transitions for inputs and buttons */
input,
button,
a {
  transition: all 0.3s ease;
}

/* Icon hover effects */
i {
  transition: transform 0.3s ease, color 0.3s ease;
}
.group:hover i {
  transform: scale(1.15);
}
</style>