<template>
  <aside
    :class="[collapsed ? 'w-16' : 'w-72', 'h-screen bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-lg transition-all duration-400 ease-in-out flex flex-col fixed top-0 left-0 z-1000']"
  >
    <!-- Logo & Toggle -->
    <div class="flex items-center justify-between px-6 py-6 border-b border-gray-200">
      <img
        v-if="!collapsed"
        src="https://digixsites.azurewebsites.net/wp-content/uploads/2021/12/LOGO-digix-01.png"
        alt="Digix Logo"
        class="h-12 w-auto transition-transform duration-300"
      />
      <button
        @click="collapsed = !collapsed"
        class="p-2 rounded-full hover:bg-gray-100/80 backdrop-blur-sm transition-colors duration-200"
        aria-label="Toggle Sidebar"
      >
        <i
          :class="collapsed ? 'i-lucide-menu' : 'i-lucide-x'"
          class="w-6 h-6 text-gray-600 hover:text-gray-900 transition-transform duration-200 group-hover:scale-110"
        ></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-2">
      <template v-for="item in filteredLinks" :key="item.to">
        <!-- Single Link -->
        <NuxtLink
          v-if="!item.children"
          :to="item.to"
          class="group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-300 transform hover:scale-103 hover:shadow-sm"
          :class="{ 'bg-gray-100/90 text-gray-900 font-semibold shadow-md': route.path === item.to }"
        >
          <i :class="item.icon" class="w-6 h-6 group-hover:animate-pulse"></i>
          <span v-if="!collapsed" class="truncate font-sans">{{ item.label }}</span>
          <span
            v-if="collapsed"
            class="absolute left-16 bg-gray-900/90 text-white text-xs rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
          >
            {{ item.label }}
          </span>
        </NuxtLink>

        <!-- Link with Children -->
        <div v-else>
          <button
            @click="toggleOpen(item.label)"
            class="group flex items-center w-full gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-300"
          >
            <i :class="item.icon" class="w-6 h-6 group-hover:animate-pulse"></i>
            <span v-if="!collapsed" class="flex-1 text-left truncate font-sans">{{ item.label }}</span>
            <i
              v-if="!collapsed"
              :class="isOpen(item.label) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
              class="w-5 h-5 transition-transform duration-300"
              :style="{ transform: isOpen(item.label) && !collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }"
            ></i>
          </button>
          <transition name="slide-fade">
            <div v-if="isOpen(item.label) && !collapsed" class="ml-8 mt-2 space-y-1">
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 transform hover:translate-x-1 hover:shadow-sm"
                :class="{ 'bg-gray-50/90 text-gray-900 font-semibold': route.path === child.to }"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </transition>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useCookie } from '#app'

// Share the collapsed state using provide
const collapsed = ref(false)
provide('sidebarCollapsed', collapsed) // Provide the collapsed state for injection

const route = useRoute()
const token = useCookie<string | null>('token')
const openGroups = ref<string[]>([])

const toggleOpen = (label: string) => {
  if (openGroups.value.includes(label)) {
    openGroups.value = openGroups.value.filter(l => l !== label)
  } else {
    openGroups.value.push(label)
  }
}
const isOpen = (label: string) => openGroups.value.includes(label)

let role = 'GUEST'
try {
  if (token.value) {
    const payload = JSON.parse(atob(token.value.split('.')[1]))
    role = payload.role || 'GUEST'
  }
} catch {
  role = 'GUEST'
}

const links = [
  { label: 'จัดการผู้ใช้', icon: 'i-lucide-layout-dashboard', to: '/admin', role: 'ADMIN' },
  { label: 'Test', icon: 'i-lucide-inbox', to: '/admin/inbox', role: 'ADMIN' },
  { label: 'Test', icon: 'i-lucide-send', to: '/admin/send', role: 'ADMIN' },
  { label: 'Test', icon: 'i-lucide-list-checks', to: '/admin/status', role: 'ADMIN' },
  { label: 'Test', icon: 'i-lucide-download', to: '/admin/download', role: 'ADMIN' },
  { label: 'Test', icon: 'i-lucide-message-circle', to: '/admin/messages', role: 'ADMIN' },
  {
    label: 'บัญชีของฉัน',
    icon: 'i-lucide-user',
    role: 'USER',
    children: [
      { label: 'เอกสารของฉัน', to: '/user/document' },
      { label: 'แก้ไขโปรไฟล์', to: '/user/profile' },
    ],
  },
]

const filteredLinks = computed(() => links.filter(link => link.role === role))
</script>

<style scoped>
/* Slide and fade transition for sub-menus */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Smooth hover effects for icons */
i {
  transition: transform 0.3s ease, color 0.3s ease;
}
.group:hover i {
  transform: scale(1.15);
}

/* Tooltip styling for collapsed state */
.group:hover span {
  display: block;
}

/* Ensure sidebar is fixed */
aside {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

/* Subtle shadow and blur effects */
a,
button {
  transition: all 0.3s ease;
}

/* Glassmorphism effect for sidebar */
.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}
</style>