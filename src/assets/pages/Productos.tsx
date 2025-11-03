import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../types';

interface ProductosProps {
  onAddToCart: () => void;
  mostrarToast: (message: string, color?: string) => void;
  usuario: any;
}

type ProductoCarrito = Producto & { cantidad: number };

const STORAGE_KEY = 'carrito';

const getImagePath = (img: string): string => {
  if (!img) return '/img/placeholder.jpg';
  const clean = img.replace(/^\/?(img\/)?/, '').trim();
  const basePath = `/img/${clean}`;
  const altPath = `/img/${clean.split('.')[0]}/${clean}`;
  return basePath || altPath || '/img/placeholder.jpg';
};

const Productos: React.FC<ProductosProps> = ({ onAddToCart, mostrarToast }) => {
  const { productos, loading, getProductosCliente } = useProductos();
  const [categoria, setCategoria] = useState('todos');
  const [orden, setOrden] = useState('relevancia');
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;


  useEffect(() => {
    const actualizarBusqueda = () => {
      const term = (localStorage.getItem('busqueda') || '').toLowerCase();
      setBusqueda(term);
    };
    actualizarBusqueda();
    window.addEventListener('storage', actualizarBusqueda);
    return () => window.removeEventListener('storage', actualizarBusqueda);
  }, []);

 useEffect(() => {
  try {
    let filtered = getProductosCliente(busqueda);

    if (categoria !== 'todos') {
      filtered = filtered.filter((p) => p.categoria === categoria);
    }

    switch (orden) {
      case 'precio-asc':
        filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nombre-desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setProductosFiltrados(filtered);
    setPaginaActual(1);
  } catch (error) {
    console.error('Error filtrando productos:', error);
  }
}, [productos, busqueda, categoria, orden]);

  const handleAddToCart = (producto: Producto) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '[]';
      const carrito: ProductoCarrito[] = JSON.parse(raw);

      const idx = carrito.findIndex((p) => p.id === producto.id);
      if (idx >= 0) carrito[idx].cantidad += 1;
      else carrito.push({ ...producto, cantidad: 1 });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
      onAddToCart();
      window.dispatchEvent(new Event('storage'));
      mostrarToast(`${producto.name} agregado al carrito`, '#198754');
    } catch (e) {
      console.error('Error al agregar al carrito', e);
      mostrarToast('Error al agregar producto', '#dc3545');
    }
  };

  const indexOfLast = paginaActual * productosPorPagina;
  const indexOfFirst = indexOfLast - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  if (loading) {
    return (
      <div className="container text-center py-5 productos-page" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }

  return (
    <main className="container py-5 productos-page" style={{ marginTop: '100px' }}>
      <h2 className="text-center text-success mb-4">
        <i className="bi bi-cart3 me-2"></i> Todos los Productos
      </h2>

      {/* Filtros */}
      <div className="row mb-4 align-items-center text-center">
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            <option value="frutas">Frutas</option>
            <option value="verduras">Verduras</option>
            <option value="Legumbres-Cereales">Legumbres y Cereales</option>
            <option value="Lacteos">Lácteos</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="relevancia">Ordenar por...</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A - Z</option>
            <option value="nombre-desc">Nombre: Z - A</option>
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="row gy-4 mt-4">
        {productosPagina.map((producto) => (
          <div key={producto.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
            <div className="card producto-card shadow-sm border-0 position-relative">
              <img
                src={getImagePath(producto.img)}
                alt={producto.name}
                className="card-img-top producto-img"
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
                }}
              />
              <div className="overlay">
                <Link to={`/producto/${producto.id}`} className="btn btn-warning text-white mb-2">
                  <i className="bi bi-eye"></i> Ver detalle
                </Link>
                <button
                  className="btn btn-warning text-white"
                  onClick={() => handleAddToCart(producto)}
                >
                  <i className="bi bi-cart-plus"></i> Añadir
                </button>
              </div>
              <div className="card-body text-center">
                <h5 className="card-title mb-1">{producto.name}</h5>
                <p className="text-muted mb-2">{producto.categoria.toUpperCase()}</p>
                <h6 className="text-success fw-bold">
                  ${producto.precio.toLocaleString('es-CL')}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sin resultados */}
      {productosFiltrados.length === 0 && !loading && (
        <div className="text-center mt-4">
          <div className="alert alert-warning">
            <i className="bi bi-search me-2"></i>No se encontraron productos.
          </div>
        </div>
      )}
    </main>
  );
};

export default React.memo(Productos);
