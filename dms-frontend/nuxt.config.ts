// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  
  // 1) เปิด Nuxt Devtools
  devtools: { enabled: true },

  // 2) Runtime config: public API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },

  // 3) ใช้ @nuxtjs/tailwindcss module แทน config เอง
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/ui',
    '@nuxt/ui-pro'
  ],
  

   //4) ทุก route ผ่าน middleware/auth.global.ts (rename your middleware file to auth.global.ts for global middleware)
   // To apply global middleware, place your middleware file as middleware/auth.global.ts (no need to configure in nuxt.config.ts)

   
  

  // 5) Auto-import composables ในโฟลเดอร์ composables/
  imports: {
    dirs: ['composables']
  },

  // 6) (ถ้าต้องการ) ปรับค่า Vite / Nitro เพิ่มเติม
  vite: {
    server: {
      fs: { strict: false }
    }
  }


  
})