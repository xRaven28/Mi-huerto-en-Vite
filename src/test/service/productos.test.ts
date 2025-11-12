import { describe, test, expect, beforeEach } from "vitest";
import {
  cargarProductosDesdeLocal,
  guardarProductoEnLocal,
  actualizarProductos,
} from "../../assets/services/productos";

describe("Servicio real de productos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("1.Carga inicial de productos desde localStorage o base local", async () => {
    const productos = await cargarProductosDesdeLocal();

    expect(Array.isArray(productos)).toBe(true);
    expect(productos.length).toBeGreaterThan(0);
    expect(productos[0]).toHaveProperty("id");
    expect(productos[0]).toHaveProperty("name");
    expect(productos[0]).toHaveProperty("categoria");
  });

  test("2.Guardar un producto nuevo realmente en localStorage", async () => {
    const nuevo = {
      id: 999,
      name: "Producto Test Real",
      precio: 2000,
      categoria: "otros",
      compania: "",
      img: "img/test.jpg",
      desc: "Producto de prueba real",
      habilitado: true,
    };

    await guardarProductoEnLocal(nuevo);
    const guardados = await cargarProductosDesdeLocal();

    const encontrado = guardados.find((p) => p.id === 999);
    expect(encontrado).toBeDefined();
    expect(encontrado?.name).toBe("Producto Test Real");
  });

  test("3.Actualizar productos realmente y verificar persistencia", async () => {
    const lista = await cargarProductosDesdeLocal();
    const modificados = lista.map((p, i) =>
      i === 0 ? { ...p, name: "Actualizado Real" } : p
    );

    await actualizarProductos(modificados);
    const resultado = await cargarProductosDesdeLocal();

    expect(resultado[0].name).toBe("Actualizado Real");
  });

  test("4.Verificar estructura después de actualización real", async () => {
    const lista = await cargarProductosDesdeLocal();
    expect(lista[0]).toHaveProperty("oferta");
    expect(lista[0]).toHaveProperty("descuento");
    expect(lista[0]).toHaveProperty("valoraciones");
  });
});
