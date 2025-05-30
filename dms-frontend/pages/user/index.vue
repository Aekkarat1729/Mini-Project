<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { useRouter, useCookie } from '#imports'

const router = useRouter()
const tokenCookie = useCookie<string | null>('token')

function logout() {
  tokenCookie.value = null
  router.replace('/login')
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 font-sans">User Home</h1>
      <button
        @click="logout"
        class="group px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 hover:shadow-md transition-all duration-300 transform hover:scale-103"
      >
        Logout
        <i class="i-lucide-log-out w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
      </button>
    </div>
    <div class="bg-white/95 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 text-gray-600 font-sans text-sm">
      สวัสดีผู้ใช้! คุณสามารถดูเอกสารหรือข้อมูลของคุณได้จากเมนูด้านซ้าย
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

/* Smooth transitions for buttons */
button {
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