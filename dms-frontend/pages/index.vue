<template>
  <div class="min-h-screen flex flex-col bg-gray-50/95 backdrop-blur-md">
    <!-- Hero Section -->
    <section class="flex-1 flex items-center justify-center px-6 py-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-4xl text-center space-y-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 font-sans transition-all duration-300">
          Welcome to DMS MINI
        </h1>
        <p class="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
          ระบบจัดการเอกสารออนไลน์ที่เรียบง่าย ปลอดภัย และใช้งานง่ายสำหรับทุกคน
        </p>
        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/login"
            class="group px-6 py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 hover:shadow-md transition-all duration-300 transform hover:scale-103"
          >
            Login
            <i class="i-lucide-log-in w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="group px-6 py-3 border border-gray-800 text-gray-800 rounded-xl font-medium text-sm hover:bg-gray-100/80 hover:shadow-md transition-all duration-300 transform hover:scale-103"
          >
            Register
            <i class="i-lucide-user-plus w-5 h-5 ml-2 inline-block group-hover:animate-pulse"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white/95 backdrop-blur-md">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <div
          class="group bg-white/95 border border-gray-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-103"
        >
          <i class="i-lucide-file-text w-8 h-8 mx-auto mb-3 text-gray-600 group-hover:animate-pulse"></i>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 font-sans">จัดการเอกสาร</h3>
          <p class="text-gray-600 text-sm font-sans">
            สร้าง แก้ไข และจัดเก็บเอกสารได้อย่างปลอดภัยและมีประสิทธิภาพ
          </p>
        </div>
        <div
          class="group bg-white/95 border border-gray-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-103"
        >
          <i class="i-lucide-history w-8 h-8 mx-auto mb-3 text-gray-600 group-hover:animate-pulse"></i>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 font-sans">เวอร์ชันประวัติ</h3>
          <p class="text-gray-600 text-sm font-sans">
            เข้าถึงและย้อนกลับไปยังเวอร์ชันก่อนหน้าได้อย่างสะดวก
          </p>
        </div>
        <div
          class="group bg-white/95 border border-gray-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-103"
        >
          <i class="i-lucide-users w-8 h-8 mx-auto mb-3 text-gray-600 group-hover:animate-pulse"></i>
          <h3 class="text-lg font-semibold text-gray-800 mb-2 font-sans">ผู้ใช้งาน & สิทธิ์</h3>
          <p class="text-gray-600 text-sm font-sans">
            กำหนดสิทธิ์การเข้าถึงแยกตามบทบาทผู้ใช้ได้อย่างแม่นยำ
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="py-6 bg-white/95 backdrop-blur-md border-t border-gray-200 text-sm text-gray-500 text-center font-sans"
    >
      © 2025 DMS MINI. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
// ไม่มี logic พิเศษสำหรับหน้า Home
</script>

<style scoped>
/* Smooth hover effects for icons */
i {
  transition: transform 0.3s ease, color 0.3s ease;
}
.group:hover i {
  transform: scale(1.15);
}

/* Glassmorphism effect */
.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

/* Smooth transitions for buttons and cards */
a,
div.group {
  transition: all 0.3s ease;
}
</style>