import { useState, useEffect, useCallback } from "react";
import { Producto } from "../types";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/producto.service";

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProductos(); 
      setProductos(res.data);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const agregarProducto = useCallback(
    async (producto: Omit<Producto, "id">) => {
      try {
        await createProducto(producto); 
        await cargarProductos();
      } catch (err) {
        console.error("❌ Error al agregar producto:", err);
      }
    },
    [cargarProductos]
  );

  const actualizarProducto = useCallback(
    async (producto: Producto) => {
      try {
        await updateProducto(producto.id, producto); 
        await cargarProductos();
      } catch (err) {
        console.error("❌ Error al actualizar producto:", err);
      }
    },
    [cargarProductos]
  );

  const eliminarProducto = useCallback(
    async (id: number) => {
      try {
        await deleteProducto(id);
        await cargarProductos();
      } catch (err) {
        console.error("❌ Error al eliminar producto:", err);
      }
    },
    [cargarProductos]
  );

  const getProductosCliente = useCallback(
    (busqueda: string) => {
      const term = busqueda.toLowerCase();
      return productos.filter((p) =>
        p.name.toLowerCase().includes(term)
      );
    },
    [productos]
  );

  return {
    productos,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    getProductosCliente,
  };
};
