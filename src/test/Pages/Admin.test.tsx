import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "../../assets/pages/Admin";

// ✅ Mock del hook para manipular localStorage directamente
vi.mock("../../assets/hooks/useProductos", () => ({
  useProductos: () => ({
    productos: JSON.parse(localStorage.getItem("productos") || "[]"),
    loading: false,
    agregarProducto: vi.fn(),
    actualizarProducto: vi.fn(),
    eliminarProducto: (id: number) => {
      const nuevos = JSON.parse(localStorage.getItem("productos") || "[]").filter((p: any) => p.id !== id);
      localStorage.setItem("productos", JSON.stringify(nuevos));
    },
  }),
}));

describe("Admin - CRUD real con localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Muestra tabla con productos existentes", async () => {
    const productos = [
      { id: 1, name: "Papa", categoria: "Verduras", precio: 1000, habilitado: true },
      { id: 2, name: "Zanahoria", categoria: "Verduras", precio: 700, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({ nombre: "Admin", rol: "admin", correo: "admin@huertohogar.cl" })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });

    const btnGestionar = screen.getByRole("button", { name: /gestionar productos/i });
    await act(async () => fireEvent.click(btnGestionar));

    expect(await screen.findByText(/Papa/i)).toBeInTheDocument();
    expect(await screen.findByText(/Zanahoria/i)).toBeInTheDocument();
  });

  it("Eliminar producto actualiza localStorage", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    const productos = [{ id: 1, name: "Papa", categoria: "Verdura", precio: 1000, habilitado: true }];
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({ nombre: "Admin", rol: "admin", correo: "admin@huertohogar.cl" })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });

    const btnGestionar = screen.getByRole("button", { name: /gestionar productos/i });
    await act(async () => fireEvent.click(btnGestionar));

    const eliminar = await screen.findByRole("button", { name: /eliminar/i });
    await act(async () => fireEvent.click(eliminar));

    const productosRestantes = JSON.parse(localStorage.getItem("productos") || "[]");
    expect(productosRestantes.length).toBe(0);

    vi.restoreAllMocks();
  });
});
