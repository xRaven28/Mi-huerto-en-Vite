import axios from "axios";

const API = "http://localhost:8080/api/usuarios";
const AUTH_API = "http://localhost:8080/api/auth";

// Registrar usuario
export async function registrarUsuario(usuario: any) {
  const res = await axios.post(`${API}/registrar`, usuario);
  return res.data;
}

// LOGIN (ruta correcta)
export async function loginUsuario(credentials: { email: string; password: string }) {
  const res = await axios.post(`${AUTH_API}/login`, credentials);
  return res.data;
}

// Obtener usuarios
export async function obtenerUsuarios() {
  const res = await axios.get(API);
  return res.data;
}

// Obtener usuario por ID
export async function obtenerUsuario(id: number) {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
}

// Actualizar usuario
export async function actualizarUsuario(id: number, data: any) {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
}

// Cambiar contraseña por ID
export async function cambiarPassword(id: number, body: any) {
  const res = await axios.put(`${API}/${id}/password`, body);
  return res.data;
}

// Cambiar contraseña por EMAIL
export async function cambiarPasswordEmail(body: any) {
  const res = await axios.post(`${API}/cambiar-password-email`, body);
  return res.data;
}

// Eliminar usuario
export async function eliminarUsuario(id: number) {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
}
