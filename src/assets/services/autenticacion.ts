import { useState, useEffect } from 'react';
import { Usuario } from '../types/index';
import { AuthService } from '../services/auth';


export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioActual = AuthService.obtenerUsuarioActual();
    setUsuario(usuarioActual);
    setLoading(false);
  }, []);

  const login = (correo: string, password: string, recordarme: boolean = false): boolean => {
    const usuariosLocal: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuariosAdmin: Usuario[] = JSON.parse(localStorage.getItem("USUARIOS") || "[]");
    const allUsers: Usuario[] = [...usuariosLocal, ...usuariosAdmin];

    const usuarioEncontrado = allUsers.find(u =>
      (u.correo === correo ) && u.password === password
    );

    if (usuarioEncontrado) {
      AuthService.iniciarSesion(usuarioEncontrado, recordarme);
      setUsuario(usuarioEncontrado);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    AuthService.cerrarSesion();
    setUsuario(null);
  };

  return {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario
  };
};