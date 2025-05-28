<template>
  <aside
    :class="[
      'bg-white border-r h-full flex flex-col transition-width duration-200 ease-in-out',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Toggle Button -->
    <div class="flex items-center justify-end p-2">
      <button
        @click="collapsed = !collapsed"
        class="p-2 hover:bg-gray-100 rounded"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <!-- simple hamburger / close icon -->
        <svg v-if="!collapsed" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Logo / Title -->
    <div class="flex items-center px-4 py-4">
      <i class="i-lucide-box text-purple-600 text-xl"></i>
      <span
        v-if="!collapsed"
        class="ml-2 text-2xl font-bold text-purple-600 whitespace-nowrap"
      >
        DMS MINI
      </span>
    </div>

    <!-- Menu Links -->
    <nav class="flex-1 px-2 space-y-1">
      <NuxtLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="flex items-center px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        :class="{'bg-gray-200 font-semibold': isActive(item.to)}"
      >
        <i :class="item.icon + ' w-5 h-5'"></i>
        <span
          v-if="!collapsed"
          class="ml-3"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)

const links = [
  { label: 'Dashboard', icon: 'i-lucide-home',      to: '/admin'           },
  { label: 'Users',     icon: 'i-lucide-users',     to: '/admin/users'     },
  { label: 'Documents', icon: 'i-lucide-file-text', to: '/admin/documents' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<style scoped>
/* Tailwind ไม่มี utility สำหรับ transition-width อัตโนมัติ ให้เพิ่มเอง */
.transition-width {
  transition-property: width;
}
</style>
