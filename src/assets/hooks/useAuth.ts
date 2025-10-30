import { useEffect, useState } from 'react';
import { Usuario } from '../types';

const KEY = 'usuarioActual';

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUsuario(JSON.parse(raw));
    } catch (err) {
      console.error('Error leyendo usuario actual', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const iniciarSesion = (u: Usuario, recordar = false) => {
    try {
      const storage = recordar ? localStorage : sessionStorage;
      storage.setItem(KEY, JSON.stringify(u));
      setUsuario(u);
    } catch (err) {
      console.error('Error iniciando sesión', err);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch (err) {
      console.error('Error cerrando sesión', err);
    }
    setUsuario(null);
  };

  const login = (correo: string, password: string, recordar = false) => {
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios') || '[]') as Usuario[];
    const usuariosAdmin = JSON.parse(localStorage.getItem('USUARIOS') || '[]') as Usuario[];
    const allUsers = [...usuariosLocal, ...usuariosAdmin];
    const found = allUsers.find(u => (u.correo === correo || (u as any).email === correo) && u.password === password);
    if (found) {
      iniciarSesion(found, recordar);
      return true;
    }
    return false;
  };

  const register = (nuevoUsuario: Omit<Usuario, 'id'>) => {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]') as Usuario[];
      if (usuarios.some(u => u.correo === nuevoUsuario.correo)) return false;
      const usuarioCompleto: Usuario = { ...nuevoUsuario, id: Date.now() };
      usuarios.push(usuarioCompleto);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      iniciarSesion(usuarioCompleto, true);
      return true;
    } catch (err) {
      console.error('Error registrando', err);
      return false;
    }
  };

  return {
    usuario,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.correo === 'admin@huertohogar.cl',
  };
};
