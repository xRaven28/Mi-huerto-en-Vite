import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Productos from "../../assets/pages/Productos";

/*Mock del hook useProductos */
vi.mock("../../assets/hooks/useProductos", () => ({
  useProductos: () => ({
    productos: JSON.parse(localStorage.getItem("productos") || "[]"),
    loading: false,
    getProductosCliente: (busqueda: string) => {
      const todos = JSON.parse(localStorage.getItem("productos") || "[]");
      return todos.filter((p: any) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    },
  }),
}));

/*Mock simple de StarRating*/
vi.mock("../../assets/components/StarRating", () => ({
  default: () => <div data-testid="star-rating">⭐</div>,
}));

/*Test principal*/
describe("Página Productos", () => {
  const mockToast = vi.fn();
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockToast.mockClear();
    mockAddToCart.mockClear();
  });

  it("1.Renderiza correctamente título y selects", () => {
    render(
      <MemoryRouter>
        <Productos
          onAddToCart={mockAddToCart}
          mostrarToast={mockToast}
          usuario={null}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Todos los Productos/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/todas las categorías/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/ordenar por/i)).toBeInTheDocument();
  });

  it("2.Muestra productos simulados desde useProductos", async () => {
    const productos = [
      { id: 1, name: "Manzana", categoria: "Frutas", precio: 1000, habilitado: true },
      { id: 2, name: "Papa", categoria: "Verduras", precio: 700, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));

    await act(async () => {
      render(
        <MemoryRouter>
          <Productos
            onAddToCart={mockAddToCart}
            mostrarToast={mockToast}
            usuario={null}
          />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/Manzana/i)).toBeInTheDocument();
    expect(await screen.findByText(/Papa/i)).toBeInTheDocument();
  });

  it("3.Añadir al carrito guarda en localStorage y dispara callback", async () => {
    const productos = [
      { id: 5, name: "Zanahoria", categoria: "Verduras", precio: 900, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));

    render(
      <MemoryRouter>
        <Productos
          onAddToCart={mockAddToCart}
          mostrarToast={mockToast}
          usuario={null}
        />
      </MemoryRouter>
    );

    const boton = await screen.findByRole("button", { name: /añadir/i });
    await act(async () => fireEvent.click(boton));

    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    expect(carrito).toHaveLength(1);
    expect(carrito[0].name).toBe("Zanahoria");
    expect(mockAddToCart).toHaveBeenCalled();
  });

  it("4.Muestra mensaje de advertencia si no hay productos", async () => {
    localStorage.setItem("productos", JSON.stringify([]));

    await act(async () => {
      render(
        <MemoryRouter>
          <Productos
            onAddToCart={mockAddToCart}
            mostrarToast={mockToast}
            usuario={null}
          />
        </MemoryRouter>
      );
    });

    expect(
      await screen.findByText(/No se encontraron productos/i)
    ).toBeInTheDocument();
  });

  it("5.Filtra productos por categoría seleccionada", async () => {
    const productos = [
      { id: 1, name: "Manzana", categoria: "Frutas", precio: 1000, habilitado: true },
      { id: 2, name: "Papa", categoria: "Verduras", precio: 700, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));

    render(
      <MemoryRouter>
        <Productos
          onAddToCart={mockAddToCart}
          mostrarToast={mockToast}
          usuario={null}
        />
      </MemoryRouter>
    );

    // Cambiar la categoría a “Verduras”
    const selectCat = screen.getByDisplayValue(/todas las categorías/i);
    await act(async () => fireEvent.change(selectCat, { target: { value: "verduras" } }));

    expect(await screen.findByText(/Papa/i)).toBeInTheDocument();
    expect(screen.queryByText(/Manzana/i)).not.toBeInTheDocument();
  });

  it("6.Filtra por nombre (busqueda)", async () => {
    const productos = [
      { id: 1, name: "Lechuga", categoria: "Verduras", precio: 800, habilitado: true },
      { id: 2, name: "Manzana", categoria: "Frutas", precio: 1200, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));

    // Simula búsqueda en localStorage
    localStorage.setItem("busqueda", "lechuga");

    await act(async () => {
      render(
        <MemoryRouter>
          <Productos
            onAddToCart={mockAddToCart}
            mostrarToast={mockToast}
            usuario={null}
          />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/Lechuga/i)).toBeInTheDocument();
    expect(screen.queryByText(/Manzana/i)).not.toBeInTheDocument();
  });

  it("7.Ordena correctamente por precio ascendente y descendente", async () => {
    const productos = [
      { id: 1, name: "Pera", categoria: "Frutas", precio: 500, habilitado: true },
      { id: 2, name: "Sandía", categoria: "Frutas", precio: 3000, habilitado: true },
      { id: 3, name: "Durazno", categoria: "Frutas", precio: 1500, habilitado: true },
    ];
    localStorage.setItem("productos", JSON.stringify(productos));

    render(
      <MemoryRouter>
        <Productos
          onAddToCart={mockAddToCart}
          mostrarToast={mockToast}
          usuario={null}
        />
      </MemoryRouter>
    );

    // Orden ascendente
    const selectOrden = screen.getByDisplayValue(/ordenar por/i);
    await act(async () =>
      fireEvent.change(selectOrden, { target: { value: "precio-asc" } })
    );

    const listaAsc = screen.getAllByText(/\$/);
    expect(listaAsc[0].textContent).toContain("500");

    // Orden descendente
    await act(async () =>
      fireEvent.change(selectOrden, { target: { value: "precio-desc" } })
    );

    const listaDesc = screen.getAllByText(/\$/);
    expect(listaDesc[0].textContent).toContain("3.000");
  });
});
