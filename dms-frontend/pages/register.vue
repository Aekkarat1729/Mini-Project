<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">DMS MINI</h1>
        <NuxtLink to="/login" class="text-sm font-medium text-purple-600 hover:underline">Sign In</NuxtLink>
      </div>

      <h2 class="text-xl font-semibold text-gray-700 mb-8 text-center">Create Your Account</h2>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-600 mb-1">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Enter your username" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Email (optional)</label>
          <input id="email" v-model="email" type="email" placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
        </div>

        <button type="submit" class="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition">Register</button>
      </form>

      <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>

      <p class="mt-6 text-center text-sm text-gray-600">
        By registering, you agree to our
        <NuxtLink to="#" class="text-purple-600 hover:underline">Terms & Conditions</NuxtLink> and
        <NuxtLink to="#" class="text-purple-600 hover:underline">Privacy Policy</NuxtLink>.
      </p>
    </div>
  </div>
</template>

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
    // TODO: เชื่อมต่อ Backend register API
    // ตัวอย่างเช่น
    // await $fetch('/users', { method: 'POST', body: { username: username.value, password: password.value, email: email.value } })

    // สมมติ register สำเร็จ ให้ไปหน้า login
    router.push('/login')
  } catch (e) {
    error.value = 'Registration failed'
  }
}
</script>
