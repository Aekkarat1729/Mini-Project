// src/validations/validateZod.js
const validateZod = (schema) => {
  return (value, h) => {
    try {
      schema.parse(value);
      return value;
    } catch (error) {
      throw new Error(error.errors.map((err) => err.message).join(", "));
    }
  };
};

module.exports = validateZod;