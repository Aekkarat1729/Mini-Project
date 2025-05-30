<template>
  <div class="flex h-screen">
    <Sidebar />
    <main
      :class="[
        collapsed ? 'ml-16' : 'ml-72',
        'flex-1 p-8 bg-white/95 backdrop-blur-md transition-all duration-400 ease-in-out overflow-auto'
      ]"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import Sidebar from '~/components/Sidebar.vue'

// Inject the collapsed state from the sidebar with a fallback
const collapsed = inject('sidebarCollapsed', ref(false))
</script>

<style scoped>
/* Glassmorphism effect */
.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

/* Ensure smooth transitions */
main {
  transition: margin-left 0.4s ease-in-out;
}
</style>