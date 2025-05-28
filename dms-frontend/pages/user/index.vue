<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useRouter, useCookie } from '#imports'
const router = useRouter()
const tokenCookie = useCookie('token')

function logout() {
  tokenCookie.value = null
  router.replace('/login')
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">User Home</h1>
      <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Logout
      </button>
    </div>
    <!-- … เนื้อหาอื่นๆ … -->
  </div>
</template>
