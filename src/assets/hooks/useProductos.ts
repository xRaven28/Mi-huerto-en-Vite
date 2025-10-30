import { useEffect, useState } from 'react';
import { Producto } from '../types';
import * as svc from '../services/productos';

export const useProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        cargarProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const data = await svc.cargarProductosDesdeLocal();
            setProductos(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error cargando productos');
        } finally {
            setLoading(false);
        }
    };

    const agregarProducto = async (p: Omit<Producto, 'id'>) => {
        const nuevo = await svc.guardarProductoEnLocal(p);
        setProductos(prev => [...prev, nuevo]);
        return nuevo;
    };

    const actualizarProducto = async (id: number, updates: Partial<Producto>) => {
        const updated = await svc.actualizarProductoEnLocal(id, updates);
        if (updated) setProductos(prev => prev.map(x => (x.id === id ? updated : x)));
        return updated;
    };

    const eliminarProducto = async (id: number) => {
        const ok = await svc.eliminarProductoDeLocal(id);
        if (ok) setProductos(prev => prev.filter(p => p.id !== id));
        return ok;
    };
    const getProductosCliente = (busqueda: string): Producto[] => {
        if (!busqueda.trim()) return productos;
        return productos.filter(p =>
            p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.categoria.toLowerCase().includes(busqueda.toLowerCase())
        );
    };


    return {
        productos,
        loading,
        error,
        cargarProductos,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
        getProductosCliente
    };
};
