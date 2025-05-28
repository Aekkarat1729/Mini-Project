<template>
  <div class="flex h-screen">
    <!-- ดึง Sidebar มาใช้ -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-auto bg-gray-50">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue'
</script>
