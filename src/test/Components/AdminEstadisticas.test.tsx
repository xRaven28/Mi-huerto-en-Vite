import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import AdminEstadisticas from "../../assets/components/AdminEstadisticas";
import type { Producto, Valoracion } from "../../assets/types";

/*Factory de Producto y Valoracion*/
const makeProducto = (overrides: Partial<Producto> = {}): Producto => ({
  id: 0,
  name: "Producto demo",
  desc: "",
  categoria: "Otros",
  compania: "HuertoHogar",
  img: "/img/placeholder.jpg",
  precio: 0,
  habilitado: true,
  valoraciones: [],
  ...overrides,
});

const makeValoracion = (overrides: Partial<Valoracion> = {}): Valoracion => ({
  usuario: "Cliente Test",
  comentario: "",
  estrellas: 5,
  fecha: new Date().toISOString(),
  ...overrides,
});

/*Mock de Recharts*/
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="barchart">{children}</div>,
  Bar: () => <div data-testid="bar"></div>,
  XAxis: () => <div></div>,
  YAxis: () => <div></div>,
  Tooltip: () => <div></div>,
  Legend: () => <div></div>,
  CartesianGrid: () => <div></div>,
}));

/*Productos base*/
const productosBase: Producto[] = [
  makeProducto({ id: 1, name: "Manzana", categoria: "Frutas", precio: 1000 }),
  makeProducto({ id: 2, name: "Papa", categoria: "Verduras", precio: 700 }),
  makeProducto({ id: 3, name: "Zanahoria", categoria: "Verduras", precio: 500 }),
];

/*Tests*/
describe("Componente AdminEstadisticas", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("1.Renderiza correctamente los títulos principales", () => {
    render(<AdminEstadisticas productos={[]} />);

    expect(screen.getByText(/Estadísticas de Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Más vendidos del mes actual/i)).toBeInTheDocument();
    expect(screen.getByText(/Mejor valorados/i)).toBeInTheDocument();
    expect(screen.getByText(/Peor valorados/i)).toBeInTheDocument();
  });

  it("2.Muestra mensajes vacíos cuando no hay productos ni compras", () => {
    render(<AdminEstadisticas productos={[]} />);

    expect(screen.getByText(/No hay registros de ventas este mes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/No hay valoraciones aún/i)).toHaveLength(2);
  });

  it("3.Calcula y muestra los productos más vendidos del mes", async () => {
    const fecha = new Date();
    const compras = [
      {
        fecha: fecha.toISOString(),
        productos: [
          { id: 2, cantidad: 5 },
          { id: 3, cantidad: 3 },
        ],
      },
    ];
    localStorage.setItem("historialCompras", JSON.stringify(compras));

    await act(async () => {
      render(<AdminEstadisticas productos={productosBase} />);
    });

    expect(screen.getAllByTestId("barchart").length).toBeGreaterThan(0);
    expect(screen.queryByText(/No hay registros de ventas este mes/i)).toBeNull();
  });

  it("4.Calcula y muestra los productos mejor y peor valorados", async () => {
    const productosValorados: Producto[] = [
      makeProducto({
        id: 1,
        name: "Manzana",
        categoria: "Frutas",
        precio: 1000,
        valoraciones: [makeValoracion({ estrellas: 5 }), makeValoracion({ estrellas: 4 })],
      }),
      makeProducto({
        id: 2,
        name: "Papa",
        categoria: "Verduras",
        precio: 700,
        valoraciones: [makeValoracion({ estrellas: 2 })],
      }),
      makeProducto({
        id: 3,
        name: "Zanahoria",
        categoria: "Verduras",
        precio: 500,
        valoraciones: [makeValoracion({ estrellas: 1 })],
      }),
    ];

    await act(async () => {
      render(<AdminEstadisticas productos={productosValorados} />);
    });

    expect(screen.getAllByTestId("barchart").length).toBeGreaterThan(0);
    expect(screen.getByText(/Mejor valorados/i)).toBeInTheDocument();
    expect(screen.getByText(/Peor valorados/i)).toBeInTheDocument();
    expect(screen.queryByText(/No hay valoraciones aún/i)).toBeNull();
  });
});
