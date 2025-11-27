import { useState, useEffect, useCallback } from "react";
import { Producto } from "../types";
import { cargarProductosDesdeLocal } from "../services/productos";

const KEY = "catalogo";

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const data = await cargarProductosDesdeLocal();
      setProductos(data);
      setLoading(false);
    };
    cargar();
  }, []);

  const agregarProducto = useCallback(async (producto: Omit<Producto, "id">) => {
    const nuevo: Producto = { ...producto, id: Date.now() };
    const actualizados = [...productos, nuevo];
    setProductos(actualizados);
    localStorage.setItem(KEY, JSON.stringify(actualizados));
    return nuevo;
  }, [productos]);

  const actualizarProducto = useCallback(async (productoActualizado: Producto) => {
    const actualizados = productos.map((p) =>
      p.id === productoActualizado.id ? productoActualizado : p
    );
    setProductos(actualizados);
    localStorage.setItem(KEY, JSON.stringify(actualizados));
  }, [productos]);

  const eliminarProducto = useCallback(async (id: number) => {
    const actualizados = productos.filter((p) => p.id !== id);
    setProductos(actualizados);
    localStorage.setItem(KEY, JSON.stringify(actualizados));
  }, [productos]);

  const getProductosCliente = useCallback((busqueda: string) => {
    const term = busqueda.toLowerCase();
    return productos.filter((p) => p.name.toLowerCase().includes(term));
  }, [productos]);

  return {
    productos,
    setProductos,
    loading,
    agregarProducto,
    eliminarProducto,
    getProductosCliente,
    actualizarProducto
  };
};
