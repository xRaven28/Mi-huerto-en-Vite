import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { Producto } from '../types';

const getImagePath = (img: string): string => {
  if (!img) return '/img/placeholder.jpg';
  const clean = img.replace(/^\/?(img|Img)\//, '').trim();
  return `/img/${clean}`;
};

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { productos } = useProductos();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [similares, setSimilares] = useState<Producto[]>([]);

  useEffect(() => {
    if (productos.length > 0 && id) {
      const prod = productos.find((p) => String(p.id) === id);
      setProducto(prod || null);

      if (prod) {
        const relacionados = productos
          .filter(
            (p) =>
              p.categoria === prod.categoria &&
              p.id !== prod.id &&
              p.habilitado
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setSimilares(relacionados);
      }
    }
  }, [productos, id]);

  const agregarAlCarrito = (producto: Producto) => {
    const raw = localStorage.getItem('carrito') || '[]';
    const carrito = JSON.parse(raw);
    const idx = carrito.findIndex((p: any) => p.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('storage'));
  };

  if (!productos.length) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center py-5 detalle-producto-page">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Producto no encontrado
        </div>
        <Link to="/productos" className="btn btn-huerto mt-3">
          <i className="bi bi-arrow-left"></i> Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <main
      className="container py-5 detalle-producto-page"
      style={{ marginTop: '90px' }}
    >
      <div className="row align-items-center">
        {/* Imagen principal */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={getImagePath(producto.img)}
            alt={producto.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) =>
              ((e.target as HTMLImageElement).src = '/img/placeholder.jpg')
            }
          />
        </div>
        {/*  Detalles del producto */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-3 text-success">{producto.name}</h2>
          <p className="text-muted text-uppercase mb-2">{producto.categoria}</p>
          <h4 className="text-success mb-4">
            ${producto.precio.toLocaleString('es-CL')}
          </h4>
          <p className="mb-4">{producto.desc}</p>

          <div className="d-flex gap-3">
            <button
              className="btn btn-huerto"
              onClick={() => agregarAlCarrito(producto)}
            >
              <i className="bi bi-cart-plus me-2"></i> Agregar al carrito
            </button>
            <Link to="/productos" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i> Volver
            </Link>
          </div>
        </div>
      </div>

      {/*  Productos similares */}
      {similares.length > 0 && (
        <section className="mt-5">
          <h4 className="fw-bold text-center mb-4 text-success">
            Productos similares
          </h4>
          <div className="row">
            {similares.map((p) => (
              <div
                key={p.id}
                className="col-xl-3 col-lg-4 col-md-6 mb-4 text-center"
              >
                <div className="card producto-card shadow-sm border-0 h-100">
                  <img
                    src={getImagePath(p.img)}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        '/img/placeholder.jpg')
                    }
                  />
                  <div className="card-body">
                    <h6 className="card-title mb-1">{p.name}</h6>
                    <p className="text-success fw-bold mb-2">
                      ${p.precio.toLocaleString('es-CL')}
                    </p>
                    <Link to={`/producto/${p.id}`} className="btn btn-sm btn-huerto">
                      <i className="bi bi-eye me-1"></i> Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default DetalleProducto;
