import React, { useEffect, useState } from "react";
import { ProductoCarrito } from "../types";
import { useToast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";

const KEY = "carrito";
const HIST = "historialCompras";

const Checkout: React.FC = () => {
  const { usuario } = useAuth(); // ✔ DETECTAR USUARIO LOGUEADO
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [boleta, setBoleta] = useState<any | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    metodoPago: "",
  });

  const showToast = useToast();

  // ================================
  // CARGAR CARRITO + DATOS DEL USUARIO
  // ================================
  useEffect(() => {
    // Cargar carrito
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as ProductoCarrito[];
      setCarrito(data);
      if (data.length === 0) alert("Tu carrito está vacío");
    }

    // Autorrellenar datos si hay sesión activa
    if (usuario) {
      setForm({
        nombre: usuario.nombre || "",
        direccion: usuario.direccion || "",
        telefono: usuario.telefono || "",
        metodoPago: "",
      });
    }
  }, [usuario]);

  // ================================
  // CALCULAR TOTAL
  // ================================
  const calcularTotal = () =>
    carrito.reduce((t, p) => {
      const precioFinal =
        p.oferta && p.descuento
          ? Math.round(p.precio * (1 - p.descuento / 100))
          : p.precio;

      return t + precioFinal * (p.cantidad || 1);
    }, 0);

  // ================================
  // FINALIZAR COMPRA
  // ================================
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.direccion || !form.metodoPago) {
      showToast("Por favor completa todos los campos antes de continuar", "error");
      return;
    }

    const fecha = new Date();
    const codigo = `HH-${fecha.getFullYear()}${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}${String(fecha.getDate()).padStart(2, "0")}-${fecha.getTime()}`;

    // Aplicar descuentos si existen
    const productosConDescuento = carrito.map((p) => {
      const precioFinal =
        p.oferta && p.descuento
          ? Math.round(p.precio * (p.descuento ? 1 - p.descuento / 100 : 1))
          : p.precio;
      return { ...p, precioFinal };
    });

    // Crear boleta
    const nuevaBoleta = {
      codigo,
      cliente: form.nombre,
      direccion: form.direccion,
      telefono: form.telefono,
      metodoPago: form.metodoPago,
      productos: productosConDescuento,
      total: calcularTotal(),
      fecha: fecha.toLocaleString("es-CL"),
      estado: "PREPARANDO",
    };

    // Guardar historial
    const historial = JSON.parse(localStorage.getItem(HIST) || "[]");
    historial.push(nuevaBoleta);
    localStorage.setItem(HIST, JSON.stringify(historial));

    // Limpiar carrito
    localStorage.removeItem(KEY);

    // Si NO hay usuario logueado, limpiar modo invitado
    if (!usuario) localStorage.removeItem("modoInvitado");

    setCarrito([]);
    setBoleta(nuevaBoleta);
  };

  // ================================
  // DESCARGAR PDF
  // ================================
  const descargarPDF = () => {
    if (!boleta) return;

    const contenido = `
      <h2>HuertoHogar - Boleta de Compra</h2>
      <p><strong>N° Boleta:</strong> ${boleta.codigo}</p>
      <p><strong>Cliente:</strong> ${boleta.cliente}</p>
      <p><strong>Dirección:</strong> ${boleta.direccion}</p>
      <p><strong>Teléfono:</strong> ${boleta.telefono}</p>
      <p><strong>Método de pago:</strong> ${boleta.metodoPago}</p>
      <p><strong>Fecha:</strong> ${boleta.fecha}</p>
      <hr>
      <h3>Detalle de compra:</h3>
      <ul>
        ${boleta.productos
          .map(
            (p: ProductoCarrito & { precioFinal?: number }) =>
              `<li>${p.name} x${p.cantidad || 1} - $${(
                (p.precioFinal ?? p.precio) * (p.cantidad || 1)
              ).toLocaleString("es-CL")}</li>`
          )
          .join("")}
      </ul>
      <h3>Total: $${boleta.total.toLocaleString("es-CL")}</h3>
    `;

    const ventana = window.open("", "_blank");
    if (ventana) {
      ventana.document.write(
        `<html><head><title>Boleta ${boleta.codigo}</title></head><body>${contenido}</body></html>`
      );
      ventana.document.close();
      ventana.print();
    }
  };

  // ================================
  // VISTA DE BOLETA FINAL
  // ================================
  if (boleta) {
    return (
      <main className="container py-5 mt-5 checkout-page">
        <div className="card p-4 shadow-sm border-success-subtle">
          <h3 className="text-center text-success mb-4">✅ Compra realizada</h3>

          <p><strong>N° Boleta:</strong> {boleta.codigo}</p>
          <p><strong>Cliente:</strong> {boleta.cliente}</p>
          <p><strong>Dirección:</strong> {boleta.direccion}</p>
          <p><strong>Teléfono:</strong> {boleta.telefono}</p>
          <p><strong>Método de pago:</strong> {boleta.metodoPago}</p>
          <p><strong>Fecha:</strong> {boleta.fecha}</p>

          <hr />

          <h5 className="text-center mb-4">🛒 Detalle de compra</h5>
          <ul className="list-group mb-4">
            {boleta.productos.map((p: any, i: number) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {p.name} <small className="text-muted">x{p.cantidad}</small>
                </span>
                <span className="fw-bold text-success">
                  ${((p.precioFinal ?? p.precio) * p.cantidad).toLocaleString("es-CL")}
                </span>
              </li>
            ))}
          </ul>

          <h4 className="text-end text-success mb-3">
            Total: ${boleta.total.toLocaleString("es-CL")}
          </h4>

          <div className="text-center mt-3">
            <button className="btn btn-outline-success me-2" onClick={descargarPDF}>
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

  // ================================
  // CARRITO VACÍO
  // ================================
  if (carrito.length === 0) {
    return (
      <main className="container py-5 checkout-page">
        <div className="alert alert-warning text-center">Tu carrito está vacío</div>
      </main>
    );
  }

  // ================================
  // FORMULARIO DE COMPRA
  // ================================
  return (
    <main className="container" style={{ paddingTop: "95px", paddingBottom: "60px" }}>
      <div className="row justify-content-center">

        {/* FORMULARIO DEL COMPRADOR */}
        <div className="col-md-6">
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
              <label className="form-label">Teléfono</label>
              <input
                className="form-control"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
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
              Finalizar compra
            </button>
          </form>
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4>Resumen del pedido</h4>

            <div className="border rounded p-3 bg-light">
              {carrito.map((p, i) => {
                const precioFinal =
                  p.oferta && p.descuento
                    ? Math.round(p.precio * (1 - p.descuento / 100))
                    : p.precio;
                const subtotal = precioFinal * (p.cantidad || 1);

                return (
                  <div key={i} className="d-flex justify-content-between border-bottom py-2">
                    <span>{p.name} x{p.cantidad}</span>
                    <span>${subtotal.toLocaleString("es-CL")}</span>
                  </div>
                );
              })}
            </div>

            <h4 className="mt-3 text-end text-success">
              Total: ${calcularTotal().toLocaleString("es-CL")}
            </h4>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Checkout;
