import { describe, it, beforeEach, expect, vi } from "vitest";
import { CarritoService } from "../../assets/services/carrito";
import type { ProductoCarrito } from "../../assets/types";

describe("CarritoService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("1.obtiene un carrito vacío cuando no hay nada en localStorage", () => {
    const resultado = CarritoService.obtenerCarrito();
    expect(resultado).toEqual([]);
  });

  it("2.guarda y obtiene correctamente el carrito", () => {
    const carrito: ProductoCarrito[] = [
      {
        id: 1,
        name: "Manzana",
        desc: "Fruta fresca",
        categoria: "Frutas",
        compania: "Huerto Hogar",
        img: "/img/manzana.jpg",
        precio: 1000,
        habilitado: true,
        cantidad: 2,
      },
      {
        id: 2,
        name: "Papa",
        desc: "Verdura fresca",
        categoria: "Verduras",
        compania: "Huerto Hogar",
        img: "/img/papa.jpg",
        precio: 500,
        habilitado: true,
        cantidad: 3,
      },
    ];

    CarritoService.guardarCarrito(carrito);
    const guardado = CarritoService.obtenerCarrito();

    expect(guardado.length).toBe(2);
    expect(guardado[0].name).toBe("Manzana");
    expect(guardado[1].cantidad).toBe(3);
  });

  it("3.limpia correctamente el carrito", () => {
    localStorage.setItem("carrito", JSON.stringify([{ id: 1, name: "Test" }]));
    CarritoService.limpiarCarrito();
    expect(localStorage.getItem("carrito")).toBeNull();
  });

  it("4.calcula correctamente la cantidad total de productos", () => {
    const carrito: ProductoCarrito[] = [
      { id: 1, name: "Manzana", desc: "", categoria: "", compania: "", img: "", precio: 0, habilitado: true, cantidad: 2 },
      { id: 2, name: "Papa", desc: "", categoria: "", compania: "", img: "", precio: 0, habilitado: true, cantidad: 3 },
    ];
    CarritoService.guardarCarrito(carrito);
    const total = CarritoService.obtenerCantidadTotal();
    expect(total).toBe(5);
  });

  it("5. maneja errores de JSON malformado sin romper la app", () => {
    localStorage.setItem("carrito", "{malformado:true}");
    const resultado = CarritoService.obtenerCarrito();
    expect(resultado).toEqual([]);
  });
});
