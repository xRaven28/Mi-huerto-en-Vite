import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const USUARIOS_API = `${API_BASE}/usuarios`;
const AUTH_API = `${API_BASE}/auth`;

// Configuración de axios con interceptores para el token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Registrar usuario
export async function registrarUsuario(usuario: any) {
  const res = await axios.post(`${USUARIOS_API}/registrar`, usuario);
  return res.data;
}

// Login
export async function loginUsuario(credentials: { email: string; password: string }) {
  const res = await axios.post(`${AUTH_API}/login`, credentials);
  
  if (res.data.token) {
    localStorage.setItem('authToken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data));
  }
  
  return res.data;
}

// Logout
export function logoutUsuario() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
}

// Obtener usuarios
export async function obtenerUsuarios() {
  const res = await axios.get(USUARIOS_API);
  return res.data;
}

// Obtener usuario por ID
export async function obtenerUsuario(id: number) {
  const res = await axios.get(`${USUARIOS_API}/${id}`);
  return res.data;
}

// Actualizar usuario
export async function actualizarUsuario(id: number, data: any) {
  const res = await axios.put(`${USUARIOS_API}/${id}`, data);
  return res.data;
}

// Cambiar contraseña por ID
export async function cambiarPassword(id: number, body: { currentPassword: string; newPassword: string }) {
  const res = await axios.put(`${USUARIOS_API}/${id}/password`, body);
  return res.data;
}

// Cambiar contraseña por EMAIL
export async function cambiarPasswordEmail(body: { email: string; newPassword: string }) {
  const res = await axios.post(`${USUARIOS_API}/cambiar-password-email`, body);
  return res.data;
}

// Eliminar usuario
export async function eliminarUsuario(id: number) {
  const res = await axios.delete(`${USUARIOS_API}/${id}`);
  return res.data;
}

// Verificar autenticación
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

// Obtener datos del usuario desde localStorage
export function getCurrentUser() {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}