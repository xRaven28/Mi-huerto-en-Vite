import React, { useState, useEffect } from 'react';
import { useProductos } from '../hooks/useProductos';

interface ProductosProps {
    onAddToCart: () => void;
    mostrarToast: (message: string, color?: string) => void;
    usuario: any;
}

const Productos: React.FC<ProductosProps> = ({ onAddToCart, mostrarToast }) => {
    const { 
        productos, 
        loading, 
        getProductosCliente
    } = useProductos();
    
    const [categoria, setCategoria] = useState('todos');
    const [orden, setOrden] = useState('relevancia');
    const [busqueda, setBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);

    // Aplicar filtros cuando cambien los productos o filtros
    useEffect(() => {
        let filtered = getProductosCliente(busqueda);
        
        // Filtrar por categoría
        if (categoria !== 'todos') {
            filtered = filtered.filter(p => p.categoria === categoria);
        }
        
        // Ordenar
        filtered = aplicarOrdenamiento(filtered, orden);
        
        setProductosFiltrados(filtered);
    }, [productos, busqueda, categoria, orden, getProductosCliente]);

    const aplicarOrdenamiento = (productos: any[], orden: string) => {
        switch (orden) {
            case 'precio-asc':
                return [...productos].sort((a, b) => a.precio - b.precio);
            case 'precio-desc':
                return [...productos].sort((a, b) => b.precio - a.precio);
            case 'nombre-asc':
                return [...productos].sort((a, b) => a.name.localeCompare(b.name));
            case 'nombre-desc':
                return [...productos].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return productos;
        }
    };

    const handleAddToCart = (producto: any) => {
        // Aquí integrarías con tu servicio de carrito existente
        console.log("Agregando al carrito:", producto);
        
        // Llama a la función de App.tsx para actualizar el contador
        onAddToCart();
        
        // Muestra notificación
        mostrarToast(`${producto.name} agregado al carrito`);
    };

    const handleBuscar = () => {
        // La búsqueda ya se maneja automáticamente con el estado busqueda
        console.log("Buscando:", busqueda);
    };

    if (loading) {
        return (
            <div className="container text-center py-5" style={{ marginTop: '100px' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando productos...</p>
            </div>
        );
    }

    return (
        <>
            <main className="container py-5" style={{ marginTop: '100px' }}>
                <h2 className="text-center mb-4">🛒 Todos los Productos</h2>

                {/* Filtros y búsqueda */}
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Buscar producto..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button 
                                className="btn btn-huerto" 
                                type="button"
                                onClick={handleBuscar}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <select 
                            className="form-select"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="todos">Todas las categorías</option>
                            <option value="frutas">Frutas</option>
                            <option value="verduras">Verduras</option>
                            <option value="Legumbres-Cereales">Legumbres-Cereales</option>
                            <option value="Lacteos">Lácteos</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select 
                            className="form-select form-select-sm"
                            value={orden}
                            onChange={(e) => setOrden(e.target.value)}
                        >
                            <option value="relevancia">Ordenar</option>
                            <option value="precio-asc">Precio: Menor</option>
                            <option value="precio-desc">Precio: Mayor</option>
                            <option value="nombre-asc">Nombre: A - Z</option>
                            <option value="nombre-desc">Nombre: Z - A</option>
                        </select>
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="container my-5">
                    <div className="row gy-4 mt-4">
                        {productosFiltrados.map(producto => (
                            <div key={producto.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                <div className="card h-100 shadow-sm producto-card">
                                    <img 
                                        src={producto.img} 
                                        className="card-img-top producto-img" 
                                        alt={producto.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
                                        }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{producto.name}</h5>
                                        <div className="text-muted small mb-2">
                                            {producto.categoria.toUpperCase()}
                                        </div>
                                        <p className="card-text flex-grow-1">{producto.desc}</p>
                                        <div className="d-flex align-items-center justify-content-between mt-2">
                                            <span className="fw-bold text-success">
                                                ${producto.precio.toLocaleString("es-CL")}
                                            </span>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAddToCart(producto)}
                                            >
                                                <i className="bi bi-cart-plus"></i> Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {productosFiltrados.length === 0 && !loading && (
                        <div className="text-center">
                            <div className="alert alert-warning">
                                <i className="bi bi-search me-2"></i>
                                No se encontraron productos que coincidan con tu búsqueda.
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Productos;