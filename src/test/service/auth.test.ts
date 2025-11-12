import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "../../assets/services/auth";
import { Usuario } from "../../assets/types";

//Limpieza antes de cada prueba
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("AuthService", () => {
  const usuarioBase: Usuario = {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan@correo.cl",
    password: "1234",
    confirpassword: "1234",
    rut: "12.345.678-9",
    telefono: "987654321",
    direccion: "Calle Falsa 123",
    rol: "CLIENTE",
    estado: "Activo",
    bloqueado: false,
    historial: [],
  };

  it("1.Guarda y obtiene usuario actual en localStorage ", () => {
    AuthService.iniciarSesion(usuarioBase, true);
    const user = AuthService.obtenerUsuarioActual();
    expect(user?.correo).toBe("juan@correo.cl");
    expect(localStorage.getItem("usuarioActual")).not.toBeNull();
  });

  it("2.Guarda usuario en sessionStorage si recordar = false", () => {
    AuthService.iniciarSesion(usuarioBase, false);
    const user = AuthService.obtenerUsuarioActual();
    expect(user?.nombre).toBe("Juan Pérez");
    expect(sessionStorage.getItem("usuarioActual")).not.toBeNull();
  });

  it("3.Cierra sesión correctamente eliminando usuarioActual", () => {
    AuthService.iniciarSesion(usuarioBase, true);
    AuthService.cerrarSesion();
    const user = AuthService.obtenerUsuarioActual();
    expect(user).toBeNull();
    expect(localStorage.getItem("usuarioActual")).toBeNull();
    expect(sessionStorage.getItem("usuarioActual")).toBeNull();
  });

  it("4.Detecta correctamente si el usuario es administrador", () => {
    const admin = { ...usuarioBase, correo: "admin@huertohogar.cl" };
    expect(AuthService.esAdmin(admin)).toBe(true);
    expect(AuthService.esAdmin(usuarioBase)).toBe(false);
  });

  it("5.Maneja errores de forma segura si el almacenamiento falla", () => {
    const original = localStorage.setItem;
    (localStorage.setItem as any) = () => {
      throw new Error("Simulación de error");
    };
    expect(() => AuthService.iniciarSesion(usuarioBase, true)).not.toThrow();
    localStorage.setItem = original;
  });
});
