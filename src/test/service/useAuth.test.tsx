import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "@testing-library/react";

import { AuthProvider, useAuth } from "../../assets/hooks/useAuth";
import { AuthService } from "../../assets/services/auth";
import type { Usuario } from "../../assets/types";

//Wrapper con Router + AuthProvider
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={["/"]}>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);
//Limpieza antes de cada test
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("useAuth", () => {
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

  it("1.Cuando no hay nada en storage, usuario debe ser null", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(result.current.usuario).toBeNull();
  });

  it("2.Si existe usuario en localStorage (recordar = true), el hook lo lee al iniciar", () => {
    AuthService.iniciarSesion(usuarioBase, true);
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(localStorage.getItem("usuarioActual")).not.toBeNull();
    expect(result.current.usuario?.correo).toBe("juan@correo.cl");
  });

  it("3.Si existe usuario en sessionStorage (recordar = false), el hook lo lee al iniciar", () => {
    AuthService.iniciarSesion(usuarioBase, false);
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(sessionStorage.getItem("usuarioActual")).not.toBeNull();
    expect(result.current.usuario?.correo).toBe("juan@correo.cl");
  });

  it("4.Al cerrar sesión se limpia el storage y el hook queda con usuario null (tras re-render)", async () => {
    AuthService.iniciarSesion(usuarioBase, true);
    const { result, rerender } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current.usuario).not.toBeNull();

    await act(async () => {
      AuthService.cerrarSesion();
      window.dispatchEvent(new Event("storage")); 
      rerender();
    });

    expect(localStorage.getItem("usuarioActual")).toBeNull();
    expect(sessionStorage.getItem("usuarioActual")).toBeNull();
    expect(result.current.usuario).toBeNull();
  });

  it("5.Detecta correctamente al usuario administrador (correo admin@huertohogar.cl)", () => {
    const admin: Usuario = { ...usuarioBase, correo: "admin@huertohogar.cl" };
    AuthService.iniciarSesion(admin, true);
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(result.current.usuario?.correo).toBe("admin@huertohogar.cl");
  });
});
