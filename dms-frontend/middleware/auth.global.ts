// middleware/auth.global.ts
import {jwtDecode} from 'jwt-decode'

type JwtPayloadWithRole = {
  role: string
  exp?: number
  [key: string]: any
}

export default defineNuxtRouteMiddleware((to) => {
  // หน้าสาธารณะที่ไม่ต้องล็อกอิน
  const publicPages = ['/', '/login', '/register']
  if (publicPages.includes(to.path)) return

  // อ่าน token จาก cookie
  const token = useCookie('token').value
  if (!token) {
    return navigateTo('/login')
  }

  try {
    const payload = jwtDecode<JwtPayloadWithRole>(token)
    const now = Math.floor(Date.now() / 1000)

    // ตรวจ expiration
    if (payload.exp && now > payload.exp) {
      useCookie('token').value = null
      return navigateTo('/login')
    }

    // ตรวจ role
    if (to.path.startsWith('/admin') && payload.role !== 'ADMIN') {
      useCookie('token').value = null
      return navigateTo('/login')
    }
    if (to.path.startsWith('/user') && payload.role !== 'USER') {
      useCookie('token').value = null
      return navigateTo('/login')
    }
  } catch {
    useCookie('token').value = null
    return navigateTo('/login')
  }
})
