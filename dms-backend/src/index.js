// src/index.js
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJwt2 = require('hapi-auth-jwt2');
const Pack = require('../package.json');

// Plugins
const prismaPlugin = require('./plugin/prisma');

// Route modules
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const documentsRoutes = require('./routes/documents');
const versionsRoutes = require('./routes/versions');
const tagsRoutes = require('./routes/tags');
const documentTagsRoutes = require('./routes/documentTags');
const auditLogsRoutes = require('./routes/auditLogs');

const init = async () => {
  // สร้าง Hapi server
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
      origin: ['*'],       // หรือใส่ domain ที่ปลอดภัย
      credentials: true
     },
      validate: {
        failAction: (request, h, err) => { throw err; }
      }
    }
  });

  // Register Swagger-related plugins
  const swaggerOptions = {
    info: {
      title: 'DMS API Documentation',
      version: Pack.version,
      description: 'Auto-generated API docs for Document Management System',
    },
    grouping: 'tags',
    documentationPath: '/docs',
  };
  await server.register([
    Inert,
    Vision,
    { plugin: HapiSwagger, options: swaggerOptions },
  ]);

  // Register Prisma plugin
  await server.register(prismaPlugin);

  // Register JWT auth plugin & strategy
  await server.register(HapiAuthJwt2);
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
      // ตรวจสอบ user ในฐานข้อมูล
      const user = await server.app.prisma.user.findUnique({ where: { id: decoded.id } });
      return { isValid: !!user, credentials: decoded };
    },
    verifyOptions: { algorithms: ['HS256'] }
  });
  // หากต้องการให้ทุก route default ใช้ JWT ให้ uncomment บรรทัดนี้:
  // server.auth.default('jwt');

  // Register all routes (auth first so it remains unprotected)
  server.route([
    ...authRoutes,
    ...usersRoutes,
    ...documentsRoutes,
    ...versionsRoutes,
    ...tagsRoutes,
    ...documentTagsRoutes,
    ...auditLogsRoutes,
  ]);

  // Start server
  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

// จับ unhandledRejection
process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

// เรียกสตาร์ท
init();
