import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Carrito from "../../assets/pages/Carrito";

describe("Componente Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("1.Renderiza correctamente según si hay o no productos", async () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // Espera dinámicamente según el contenido real
    const vacio = screen.queryByText(/tu carrito está vacío/i);
    const titulo = screen.queryByText(/carrito de compras/i);

    if (vacio) {
      console.log("El carrito está vacío}");
      expect(vacio).toBeInTheDocument();
    } else if (titulo) {
      console.log("El carrito tiene productos }");
      expect(titulo).toBeInTheDocument();
    } else {
      throw new Error(
        "No se encontró ni el título ni el mensaje de carrito vacío."
      );
    }
  });

  test("2.Si el carrito está vacío muestra el mensaje y el botón de ir a productos", () => {
    localStorage.clear(); 
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/tu carrito está vacío/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ir a productos/i })
    ).toBeInTheDocument();
  });

  test("3.Si el carrito tiene datos, se muestra la tabla y el botón de pagar", async () => {
    const carritoEjemplo = [
      {
        id: 1,
        name: "Tomate",
        categoria: "Verdura",
        precio: 1000,
        cantidad: 2,
        oferta: false,
      },
    ];
    localStorage.setItem("carrito", JSON.stringify(carritoEjemplo));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(await screen.findByText(/carrito de compras/i)).toBeInTheDocument();
    expect(screen.getByText(/Tomate/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pagar ahora/i })).toBeInTheDocument();
  });
});
