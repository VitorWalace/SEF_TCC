// File: frontend/src/services/api.js

import axios from 'axios';

// A baseURL agora é APENAS o endereço do servidor.
const api = axios.create({
  baseURL: 'http://localhost:3001', 
});

export default api;