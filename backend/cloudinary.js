// File: backend/cloudinary.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dxjdrzfeh', 
  api_key: '731457931762759', 
  api_secret: 'Aa24vLg9A6mjJfW_fiTEkyrrKg0',
  secure: true
});

module.exports = cloudinary;