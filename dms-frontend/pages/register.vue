<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''
  try {
    const res = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value || undefined,
        password: password.value,
        role: 'USER'
      }),
    })
    if (!res.ok) throw new Error('Registration failed')
    router.push('/login')
  } catch (e: any) {
    error.value = e.message || 'Register failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/95 backdrop-blur-md flex items-center justify-center px-4">
    <div
      class="bg-white/95 backdrop-blur-md shadow-lg rounded-xl w-full max-w-md p-8 border border-gray-200 transition-all duration-300"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 font-sans">Create Account</h1>
        <p class="text-sm text-gray-600 font-sans mt-2">Sign up to get started</p>
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
          <label class="block text-sm font-medium text-gray-700 mb-2 font-sans">Email</label>
          <div class="relative">
            <i class="i-lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"></i>
            <input
              v-model="email"
              type="email"
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 hover:shadow-sm"
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
          Register
          <i class="i-lucide-user-plus w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
        </button>
      </form>

      <p v-if="error" class="mt-6 text-center text-sm text-red-500 font-sans">{{ error }}</p>

      <p class="mt-6 text-center text-sm text-gray-600 font-sans">
        Already have an account?
        <NuxtLink
          to="/login"
          class="group text-gray-900 font-medium hover:text-gray-800 hover:underline transition-all duration-200"
        >
          Login
          <i class="i-lucide-log-in w-4 h-4 ml-1 inline-block group-hover:animate-pulse"></i>
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