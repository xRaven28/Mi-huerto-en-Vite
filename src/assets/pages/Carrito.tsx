import React, { useEffect, useState } from 'react';
import { ProductoCarrito } from '../types';

const KEY = 'carrito';

const Carrito: React.FC = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setCarrito(JSON.parse(raw));
    setLoading(false);
  }, []);

  const guardarCarrito = (nuevo: ProductoCarrito[]) => {
    setCarrito(nuevo);
    localStorage.setItem(KEY, JSON.stringify(nuevo));
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    const nuevo = carrito.map(p =>
      p.id === id ? { ...p, cantidad } : p
    );
    guardarCarrito(nuevo);
  };

  const eliminarProducto = (id: number) => {
    const eliminado = carrito.find(p => p.id === id);
    const nuevo = carrito.filter(p => p.id !== id);
    guardarCarrito(nuevo);
    alert(`${eliminado?.name} fue eliminado del carrito`);
  };

  const calcularTotal = () =>
    carrito.reduce((s, p) => s + p.precio * (p.cantidad || 1), 0);

  if (loading)
    return (
      <div className="container text-center py-5 carrito-page">
        <div className="spinner-border text-success" role="status" />
      </div>
    );

  if (carrito.length === 0)
    return (
      <div className="container text-center py-5 carrito-page">
        <div className="alert alert-info p-4 rounded shadow-sm">
          <h4>Tu carrito está vacío 🛒</h4>
          <a href="/productos" className="btn btn-success mt-3">
            Ir a Productos
          </a>
        </div>
      </div>
    );

  return (
    <main className="container py-5 carrito-page">
      <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong><br />
                  <small className="text-muted">{item.categoria}</small>
                </td>
                <td className="text-center">
                  <img
                    src={item.img || '/img/placeholder.jpg'}
                    alt={item.name}
                    className="img-thumbnail"
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                </td>
                <td className="text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) - 1)}
                      disabled={(item.cantidad || 1) <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.cantidad || 1}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="text-center">
                  ${item.precio.toLocaleString('es-CL')}
                </td>
                <td className="text-center fw-bold">
                  ${(item.precio * (item.cantidad || 1)).toLocaleString('es-CL')}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-4">
        <h4>
          Total:{' '}
          <span className="text-success fw-bold">
            ${calcularTotal().toLocaleString('es-CL')}
          </span>
        </h4>
        <a href="/checkout" className="btn btn-success mt-3">
          Pagar ahora
        </a>
      </div>
    </main>
  );
};

export default Carrito;
