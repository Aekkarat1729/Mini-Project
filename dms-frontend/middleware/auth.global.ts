// middleware/auth.global.ts
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  role: 'ADMIN' | 'USER'
  exp?: number
  [key: string]: any
}

export default defineNuxtRouteMiddleware((to, from) => {
  const publicPages = ['/', '/login', '/register']
  const tokenCookie = useCookie<string | null>('token')
  const token = tokenCookie.value

  // 1. หากหน้า public → อนุญาตผ่าน
  if (publicPages.includes(to.path)) return

  // 2. ไม่มี token → ไป login พร้อม returnUrl
  if (!token) {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }

  // 3. decode token
  let payload: JwtPayload
  try {
    payload = jwtDecode<JwtPayload>(token)
  } catch (e) {
    tokenCookie.value = null
    return navigateTo('/login')
  }

  // 4. ตรวจ expiration
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    tokenCookie.value = null
    return navigateTo('/login')
  }

  // 5. ตรวจ role ตาม route
  if (to.path.startsWith('/admin') && payload.role !== 'ADMIN') {
    return navigateTo('/unauthorized') // คุณควรมีหน้า /unauthorized
  }

  if (to.path.startsWith('/user') && payload.role !== 'USER') {
    return navigateTo('/unauthorized')
  }

  // ✅ ถ้าผ่านทุกอย่าง → อนุญาต
})
