import React, { useEffect, useState } from "react";
import { ProductoCarrito } from "../types";

const KEY = "carrito";
const HIST = "historialCompras";

const Checkout: React.FC = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [form, setForm] = useState({ nombre: "", direccion: "", metodoPago: "" });
  const [boleta, setBoleta] = useState<any | null>(null);

  /* ================================
     🔹 Cargar carrito y usuario activo
  ================================ */
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as ProductoCarrito[];
      setCarrito(data);
      if (data.length === 0) alert("Tu carrito está vacío");
    }

    const usuarioActualRaw = localStorage.getItem("usuarioActual");
    if (usuarioActualRaw) {
      const user = JSON.parse(usuarioActualRaw);
      setForm({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        metodoPago: "",
      });
    }
  }, []);

  /* ================================
     💰 Calcular total del carrito
  ================================ */
  const calcularTotal = () =>
    carrito.reduce((t, p) => {
      const precioFinal =
        p.oferta && p.descuento
          ? Math.round(p.precio * (1 - p.descuento / 100))
          : p.precio;
      return t + precioFinal * (p.cantidad || 1);
    }, 0);

  /* ================================
     🧾 Finalizar compra
  ================================ */
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.direccion || !form.metodoPago) {
      alert("Por favor completa todos los campos antes de continuar.");
      return;
    }

    const fecha = new Date();
    const codigo = `HH-${fecha.getFullYear()}${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}${String(fecha.getDate()).padStart(2, "0")}-${fecha.getTime()}`;

    // Aplicar descuentos en productos si existen
    const productosConDescuento = carrito.map((p) => {
      const precioFinal =
        p.oferta && p.descuento
          ? Math.round(p.precio * (1 - p.descuento / 100))
          : p.precio;
      return { ...p, precioFinal };
    });

    // Crear boleta
    const nuevaBoleta = {
      codigo,
      cliente: form.nombre,
      direccion: form.direccion,
      metodoPago: form.metodoPago,
      productos: productosConDescuento,
      total: calcularTotal(),
      fecha: fecha.toLocaleString("es-CL"),
    };

    // Guardar boleta en historial global
    const historial = JSON.parse(localStorage.getItem(HIST) || "[]");
    historial.push(nuevaBoleta);
    localStorage.setItem(HIST, JSON.stringify(historial));

    /* ================================
       👤 Asociar compra al usuario actual
    ================================ */
    const usuarioActualRaw = localStorage.getItem("usuarioActual");
    const usuariosRaw = localStorage.getItem("usuarios");

    if (usuarioActualRaw && usuariosRaw) {
      const usuarioActual = JSON.parse(usuarioActualRaw);
      const usuarios = JSON.parse(usuariosRaw);

      // Buscar por correo exacto
      const idx = usuarios.findIndex(
        (u: any) =>
          u.correo?.trim().toLowerCase() === usuarioActual.correo?.trim().toLowerCase()
      );

      if (idx !== -1) {
        const nuevaCompra = {
          id: Date.now(),
          fecha: nuevaBoleta.fecha,
          total: nuevaBoleta.total,
          metodoPago: nuevaBoleta.metodoPago,
          codigo: nuevaBoleta.codigo,
          productos: nuevaBoleta.productos.map((p: any) => ({
            name: p.name,
            precio: p.precioFinal ?? p.precio,
            cantidad: p.cantidad,
            img: p.img,
          })),
        };

        // Asegurar que no se dupliquen boletas
        const yaExiste = usuarios[idx].compras?.some(
          (c: any) => c.codigo === nuevaCompra.codigo
        );
        if (!yaExiste) {
          usuarios[idx].compras = usuarios[idx].compras || [];
          usuarios[idx].compras.push(nuevaCompra);
        }

        // Guardar cambios
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioActual", JSON.stringify(usuarios[idx]));
      } else {
        console.warn("No se encontró el usuario para asociar la compra.");
      }
    } else {
      console.warn("Compra realizada sin sesión activa.");
    }

    /* ================================
       🧹 Limpiar carrito e invitado
    ================================ */
    localStorage.removeItem(KEY);
    localStorage.removeItem("modoInvitado");
    setCarrito([]);
    setBoleta(nuevaBoleta);
  };

  /* ================================
     📄 Descargar boleta como PDF
  ================================ */
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

  /* ================================
     🧾 Mostrar boleta final
  ================================ */
  if (boleta) {
    return (
      <main className="container py-5 mt-5 checkout-page">
        <div className="card p-4 shadow-sm border-success-subtle">
          <h3 className="text-center text-success mb-4">✅ Compra realizada</h3>
          <p><strong>N° Boleta:</strong> {boleta.codigo}</p>
          <p><strong>Cliente:</strong> {boleta.cliente}</p>
          <p><strong>Dirección:</strong> {boleta.direccion}</p>
          <p><strong>Método de pago:</strong> {boleta.metodoPago}</p>
          <p><strong>Fecha:</strong> {boleta.fecha}</p>
          <hr />
          <h5 className="mb-3">🛒 Detalle de compra</h5>
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

  /* ================================
     🛍️ Checkout principal
  ================================ */
  if (carrito.length === 0) {
    return (
      <main className="container py-5 checkout-page">
        <div className="alert alert-warning text-center">Tu carrito está vacío</div>
      </main>
    );
  }

  return (
    <main className="container py-5 checkout-page">
      <div className="row justify-content-center">
        {/* 🧾 Formulario comprador */}
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
                Finalizar compra
              </button>
            </form>
          </div>
        </div>

        {/* 💳 Resumen del pedido */}
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
                  <div
                    key={i}
                    className="d-flex justify-content-between border-bottom py-2"
                  >
                    <span>
                      {p.name} x{p.cantidad}
                    </span>
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
