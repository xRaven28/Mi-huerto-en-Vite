import { createContext, useContext, useState, useEffect } from "react";
import { loginUsuario } from "../services/usuario.service";
import type { Usuario } from "../types"; // importa tu interfaz real

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  esAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  login: async () => false,
  logout: () => {},
  esAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // 🔄 Cargar usuario desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem("usuarioActual");
    if (raw) {
      const user = JSON.parse(raw) as Usuario;
      user.rol = user.rol?.toUpperCase() || "CLIENTE";
      setUsuario(user);
    }
  }, []);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    try {
      const data = await loginUsuario({ email, password });

      // Mapear LO QUE SÍ devuelve el backend
      const usuarioLogin: Usuario = {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol?.toUpperCase() || "CLIENTE",
        token: data.token,

        // Campos opcionales de tu interfaz ↓
        id: undefined,
        apellido: undefined,
        rut: undefined,
        password: "",
        confirpassword: "",
        telefono: undefined,
        direccion: undefined,
        estado: "Activo",
        bloqueado: false,
        historial: [],
        compras: [],
        fechaRegistro: undefined,
      };

      // Guardar
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioLogin));
      localStorage.setItem("token", data.token);

      setUsuario(usuarioLogin);

      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        esAdmin: usuario?.rol === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
