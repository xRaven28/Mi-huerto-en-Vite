import React, { createContext, useContext, useEffect, useState } from "react";

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  productos: { name: string; precio: number; cantidad: number; img?: string }[];
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password?: string;
  run?: string;
  telefono?: string;
  direccion?: string;
  rol?: "admin" | "usuario";
  fechaRegistro?: string;
  compras?: Compra[];
}

interface AuthContextType {
  usuario: Usuario | null;
  esAdmin: boolean;
  login: (correo: string, password: string, recordar?: boolean) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  esAdmin: false,
  login: () => false,
  logout: () => {},
});

const STORAGE_KEY = "usuarioActual";
const USERS_KEY = "usuarios";
const ADMIN_EMAIL = "admin@huertohogar.cl";
const ADMIN_PASS = "admin";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  //Restaurar sesión y sincronizar en tiempo real
  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUsuario(JSON.parse(raw));
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      }
    };

    window.addEventListener("storage", syncUser);
    syncUser();
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  //Guardar sesión siempre en localStorage
  const persistUser = (user: Usuario) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUsuario(user);
    window.dispatchEvent(new Event("storage"));
  };

  //Iniciar sesión
  const login = (correo: string, password: string, recordar: boolean = false): boolean => {
    if (correo === ADMIN_EMAIL && password === ADMIN_PASS) {
      const adminUser: Usuario = {
        id: 1,
        nombre: "Administrador",
        correo: ADMIN_EMAIL,
        rol: "admin",
      };
      persistUser(adminUser);
      return true;
    }

    try {
      const lista: Usuario[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const user = lista.find((u) => u.correo === correo && u.password === password);
      if (user) {
        const actualizado = { ...user, rol: user.rol || "usuario" };
        persistUser(actualizado);
        return true;
      }
    } catch (e) {
      console.error("Error leyendo usuarios:", e);
    }
    return false;
  };

  //Cerrar sesión
  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setUsuario(null);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error cerrando sesión:", e);
    }
  };

  const esAdmin = usuario?.rol === "admin" || usuario?.correo === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
