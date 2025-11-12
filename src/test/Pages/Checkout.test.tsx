import React from "react";
import { describe, it, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../../assets/pages/Checkout";

describe("Checkout - flujo real con localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Muestra alerta si el carrito está vacío", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("Carga datos del usuario actual en el formulario", () => {
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({ nombre: "Juan Pérez", direccion: "Calle Falsa 123" })
    );
    localStorage.setItem(
      "carrito",
      JSON.stringify([{ id: 1, name: "Manzana", precio: 500, cantidad: 2 }])
    );

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Calle Falsa 123")).toBeInTheDocument();
  });

  it("Muestra resumen del pedido con totales", () => {
    localStorage.setItem(
      "carrito",
      JSON.stringify([
        { id: 1, name: "Tomate", precio: 1000, cantidad: 1 },
        { id: 2, name: "Lechuga", precio: 1500, cantidad: 2 },
      ])
    );

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/resumen del pedido/i)).toBeInTheDocument();
    expect(screen.getByText(/Tomate/i)).toBeInTheDocument();
    expect(screen.getByText(/Lechuga/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /finalizar compra/i })).toBeInTheDocument();
  });
});
