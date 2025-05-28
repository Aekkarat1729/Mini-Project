<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6">
      <div class="max-w-2xl text-center space-y-6">
        <h1 class="text-5xl font-extrabold">Welcome to DMS MINI</h1>
        <p class="text-lg">ระบบจัดการเอกสารออนไลน์ สำหรับผู้ดูแลและผู้ใช้งานทั่วไป</p>
        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/login"
            class="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Register
          </NuxtLink>
        </div>
      </div>
    </section>


 



    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-medium mb-2">จัดการเอกสาร</h3>
          <p class="text-gray-600">สร้าง แก้ไข และจัดเก็บเอกสารได้อย่างปลอดภัย</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-medium mb-2">เวอร์ชันประวัติ</h3>
          <p class="text-gray-600">ย้อนกลับไปยังเวอร์ชันก่อนหน้าได้ง่ายดาย</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-medium mb-2">ผู้ใช้งาน & สิทธิ์</h3>
          <p class="text-gray-600">กำหนดสิทธิ์ ADMIN/USER อย่างละเอียด</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-6 bg-gray-800 text-gray-400 text-center">
      © 2025 DMS MINI. All rights reserved.
    </footer>
  </div>
</template>


<script setup>
// ไม่มี logic พิเศษสำหรับหน้า Home
</script>

<style scoped>
/* ถ้าต้องการ override เพิ่มเติม ให้ใส่ที่นี่ */
</style>
