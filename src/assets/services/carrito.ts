import { Producto, ProductoCarrito } from "../types";

const STORAGE_KEY = "carrito";

export const CarritoService = {
  obtener(): ProductoCarrito[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const carrito = raw ? JSON.parse(raw) : [];

      return carrito.map((item: any) => ({
        ...item,
        cantidad: item.cantidad ?? 1,
      }));
    } catch (error) {
      console.error("Error leyendo carrito:", error);
      return [];
    }
  },

  guardar(carrito: ProductoCarrito[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  },

  agregar(producto: Producto) {
    const carrito = this.obtener();
    const idx = carrito.findIndex((p) => p.id === producto.id);

    if (idx >= 0) {
      carrito[idx].cantidad = (carrito[idx].cantidad ?? 0) + 1;
    } else {
      carrito.push({
        ...producto,
        cantidad: 1,
      });
    }

    this.guardar(carrito);
    window.dispatchEvent(new Event("storage"));
  },

  quitar(id: number) {
    const carrito = this.obtener().filter((p) => p.id !== id);
    this.guardar(carrito);
  },

  limpiar() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error limpiando carrito:", error);
    }
  },

  actualizarCantidad(id: number, cantidad: number) {
    const carrito = this.obtener();
    const idx = carrito.findIndex((p) => p.id === id);

    if (idx >= 0) {
      carrito[idx].cantidad = cantidad < 1 ? 1 : cantidad;
      this.guardar(carrito);
    }
  },

  cantidadTotal() {
    const carrito = this.obtener();
    return carrito.reduce((t, p) => t + (p.cantidad ?? 1), 0);
  },

  totalPrecio() {
    const carrito = this.obtener();
    return carrito.reduce((t, p) => t + p.precio * (p.cantidad ?? 1), 0);
  },
};
