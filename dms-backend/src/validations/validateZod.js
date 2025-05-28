// src/validations/validateZod.js
const Boom = require('@hapi/boom');

/**
 * รับ Zod schema แล้วคืนฟังก์ชันให้ Hapi เรียกตรวจ
 * ถ้า validate ผ่าน จะคืน data ที่ parsed แล้ว
 * ถ้าไม่ผ่าน จะ throw BadRequest พร้อมข้อความ error
 */
module.exports = (schema) => {
  return (value, options) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      // รวมข้อความ error ทั้งหมด
      const messages = result.error.errors.map((e) => e.message).join(', ');
      throw Boom.badRequest(messages);
    }
    // คืนค่าที่ผ่านการ parse มาแล้ว ให้ request.params / payload ถูก overwrite ด้วย type ที่ตรงกัน
    return result.data;
  };
};
