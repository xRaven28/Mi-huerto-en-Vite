import { createContext, useContext, useState, useEffect } from "react";
import { loginUsuario } from "../services/usuario.service";
import type { Usuario } from "../types";

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

  useEffect(() => {
    const raw = localStorage.getItem("usuarioActual");
    if (raw) {
      const user = JSON.parse(raw) as Usuario;
      user.rol = user.rol?.toUpperCase() || "CLIENTE";
      setUsuario(user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUsuario({ email, password });

      const usuarioLogin: Usuario = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol?.toUpperCase() || "CLIENTE",
        rut: data.rut,
        telefono: data.telefono,
        direccion: data.direccion,
        bloqueado: data.bloqueado ?? false,
        compras: data.compras || [],
        token: data.token,
        password: "",
        confirpassword: "",
        estado: "Activo",

        apellido: data.apellido || "",
        historial: data.historial || [],
        fechaRegistro: data.fechaRegistro || "",
      };

      localStorage.setItem("usuarioActual", JSON.stringify(usuarioLogin));
      localStorage.setItem("token", data.token);

      setUsuario(usuarioLogin);

      return true;
    } catch (error) {
      console.error("Error en login:", error);
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
