import React, { useEffect, useState } from 'react';
import { ProductoCarrito } from '../types';

const KEY = 'carrito';
const HIST = 'historialCompras';

const Checkout: React.FC = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [modo, setModo] = useState<'seleccion' | 'login' | 'checkout' | 'boleta'>('seleccion');
  const [form, setForm] = useState({ nombre: '', direccion: '', metodoPago: '' });
  const [boleta, setBoleta] = useState<any | null>(null);
  const [loginData, setLoginData] = useState({ correo: '', password: '' });

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as ProductoCarrito[];
      setCarrito(data);
      if (data.length === 0) alert('Tu carrito está vacío');
    }
  }, []);

  const calcularTotal = () =>
    carrito.reduce((t, p) => t + p.precio * (p.cantidad || 1), 0);

  const handleLogin = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const found = usuarios.find(
      (u: any) => u.correo === loginData.correo && u.password === loginData.password
    );

    if (found) {
      localStorage.setItem('usuarioActual', JSON.stringify(found));
      setForm((prev) => ({
        ...prev,
        nombre: found.nombre || '',
        direccion: found.direccion || '',
      }));
      setModo('checkout');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.direccion || !form.metodoPago) {
      alert('Por favor completa todos los campos');
      return;
    }

    const fecha = new Date();
    const codigo = `HH-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${fecha.getTime()}`;

    const nuevaBoleta = {
      codigo,
      cliente: form.nombre,
      direccion: form.direccion,
      metodoPago: form.metodoPago,
      productos: carrito,
      total: calcularTotal(),
      fecha: fecha.toLocaleString(),
    };

    const historial = JSON.parse(localStorage.getItem(HIST) || '[]');
    historial.push(nuevaBoleta);
    localStorage.setItem(HIST, JSON.stringify(historial));

    localStorage.removeItem(KEY);
    setCarrito([]);
    setBoleta(nuevaBoleta);
    setModo('boleta');
  };

  const descargarPDF = () => {
    if (!boleta) return;
    const contenido = `
      <h2>HuertoHogar - Boleta de Compra</h2>
      <p><strong>N° Boleta:</strong> ${boleta.codigo}</p>
      <p><strong>Cliente:</strong> ${boleta.cliente}</p>
      <p><strong>Dirección:</strong> ${boleta.direccion}</p>
      <p><strong>Método de pago:</strong> ${boleta.metodoPago}</p>
      <p><strong>Fecha:</strong> ${boleta.fecha}</p>
      <hr>
      <h3>Detalle de compra:</h3>
      <ul>
        ${boleta.productos
          .map(
            (p: ProductoCarrito) =>
              `<li>${p.name} x${p.cantidad || 1} - $${(
                p.precio * (p.cantidad || 1)
              ).toLocaleString('es-CL')}</li>`
          )
          .join('')}
      </ul>
      <h3>Total: $${boleta.total.toLocaleString('es-CL')}</h3>
    `;
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(
        `<html><head><title>Boleta ${boleta.codigo}</title></head><body>${contenido}</body></html>`
      );
      ventana.document.close();
      ventana.print();
    }
  };

  if (modo === 'boleta' && boleta) {
    return (
      <main className="container py-5 checkout-page">
        <div className="card p-4 shadow-sm">
          <h3 className="text-center text-success mb-3">✅ Compra realizada</h3>
          <p><strong>N° Boleta:</strong> {boleta.codigo}</p>
          <p><strong>Cliente:</strong> {boleta.cliente}</p>
          <p><strong>Total:</strong> ${boleta.total.toLocaleString('es-CL')}</p>
          <div className="text-center mt-3">
            <button className="btn btn-outline-primary me-2" onClick={descargarPDF}>
              Descargar Boleta (PDF)
            </button>
            <button className="btn btn-outline-secondary" onClick={() => window.print()}>
              Imprimir
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (carrito.length === 0) {
    return (
      <main className="container py-5 checkout-page">
        <div className="alert alert-warning text-center">Tu carrito está vacío</div>
      </main>
    );
  }

  return (
    <main className="container py-5 checkout-page">
      <h2 className="text-center mb-4">🧾 Finalizar Compra</h2>

      {modo === 'seleccion' && (
        <div className="text-center mb-4">
          <h5>¿Cómo deseas continuar?</h5>
          <button className="btn btn-outline-primary m-2" onClick={() => setModo('login')}>
            Iniciar sesión
          </button>
          <button className="btn btn-outline-success m-2" onClick={() => setModo('checkout')}>
            Continuar como invitado
          </button>
        </div>
      )}

      {modo === 'login' && (
        <div className="text-center mb-5">
          <h5 className="mb-3 text-success">Iniciar sesión</h5>
          <input
            className="form-control w-50 mx-auto mb-2"
            placeholder="Correo"
            value={loginData.correo}
            onChange={(e) => setLoginData({ ...loginData, correo: e.target.value })}
          />
          <input
            className="form-control w-50 mx-auto mb-3"
            type="password"
            placeholder="Contraseña"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleLogin}>
            Ingresar
          </button>
          <p className="mt-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setModo('seleccion'); }}>
              Volver
            </a>
          </p>
        </div>
      )}

      {modo === 'checkout' && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h4>Datos del comprador</h4>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    className="form-control"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección de envío</label>
                  <input
                    className="form-control"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    value={form.metodoPago}
                    onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
                <button className="btn btn-success w-100" type="submit">
                  Finalizar Compra
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h4>Resumen del pedido</h4>
              <div className="border rounded p-3 bg-light">
                {carrito.map((producto) => (
                  <div key={producto.id} className="d-flex justify-content-between border-bottom py-2">
                    <span>{producto.name} x{producto.cantidad || 1}</span>
                    <span>${(producto.precio * (producto.cantidad || 1)).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
              <h4 className="mt-3 text-end text-success">
                Total: ${calcularTotal().toLocaleString('es-CL')}
              </h4>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
