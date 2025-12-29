import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

import App from './App.jsx'

// initialize axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')).render(
    <App />
)