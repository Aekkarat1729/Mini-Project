// server-middleware/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware'

export default defineEventHandler(async (event) => {
  const proxy = createProxyMiddleware({
    target: 'http://localhost:3001', // ชี้ไปที่ Backend
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // ลบ /api ออกเมื่อส่งไป Backend
    },
    onProxyReq(proxyReq) {
      // ตรวจสอบและส่ง headers ที่จำเป็น
      proxyReq.setHeader('Host', 'localhost:3001')
    },
    onError(err, req, res) {
      console.error('Proxy Error:', err)
      res.statusCode = 500
      res.end('Proxy Error: ' + err.message)
    },
  })

  return new Promise((resolve, reject) => {
    proxy(event.node.req, event.node.res, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
})