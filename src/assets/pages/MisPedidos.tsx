import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import {
  obtenerCompras,
  obtenerComprasPorUsuario,
} from "../services/compras.service";

const MisPedidos: React.FC = () => {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<any[]>([]);

  const cargarPedidos = async () => {
    if (!usuario) return;

    try {
      let data = [];

      if (usuario.rol === "ADMIN") {
        const res = await obtenerCompras();
        data = res;
      } else {
        const res = await obtenerComprasPorUsuario(usuario.id!);
        data = res;
      }

      setPedidos([...data].reverse());
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [usuario]);

  const descargarPDF = (pedido: any) => {
    const contenido = `
      <h2>HuertoHogar - Boleta de Compra</h2>
      <p><strong>N° Boleta:</strong> ${pedido.codigo}</p>
      <p><strong>Cliente:</strong> ${pedido.usuario?.nombre}</p>
      <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <hr>
      <h3>Detalle de compra:</h3>
      <ul>
        ${pedido.items
          .map(
            (p: any) =>
              `<li>${p.nombre} x${p.cantidad} — $${(
                p.precio * p.cantidad
              ).toLocaleString("es-CL")}</li>`
          )
          .join("")}
      </ul>
      <h3>Total: $${pedido.total.toLocaleString("es-CL")}</h3>
    `;

    const ventana = window.open("", "_blank");
    if (ventana) {
      ventana.document.write(
        `<html><head><title>Boleta ${pedido.codigo}</title></head><body>${contenido}</body></html>`
      );
      ventana.document.close();
      ventana.print();
    }
  };

  // Etiquetas correctas según estado
  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "PREPARANDO": return "Preparando";
      case "EN_CAMINO": return "En camino";
      case "EN_DESPACHO": return "En despacho";
      case "ENTREGADO": return "Entregado";
      case "CANCELADO": return "Cancelado";
      default: return estado;
    }
  };

  return (
    <main className="container mis-pedidos-page" style={{ paddingTop: "120px" }}>
      <h3 className="text-success mb-4 text-center">Mis pedidos</h3>

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="card mb-3 shadow-sm border-0 card-compra">
          <div className="card-body">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title text-success mb-0">{pedido.codigo}</h5>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => descargarPDF(pedido)}
              >
                Descargar boleta
              </button>
            </div>

            {/* Datos básicos */}
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            <p><strong>Total:</strong> ${pedido.total.toLocaleString("es-CL")}</p>
            <p><strong>Método de pago:</strong> {pedido.metodoPago}</p>

            {/* ESTADO con colores personalizados */}
            <p>
              <strong>Estado:</strong>{" "}
              <span className={`mis-pedidos-estado estado-${pedido.estado?.toLowerCase()}`}>
                {getEstadoLabel(pedido.estado)}
              </span>
            </p>

            {/* Detalle */}
            <details className="mt-2">
              <summary className="text-primary mb-2">Ver detalle</summary>

              <ul className="list-group list-group-flush">
                {pedido.items.map((p: any, i: number) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{p.nombre} x{p.cantidad}</span>
                    <span>
                      ${((p.precio * p.cantidad)).toLocaleString("es-CL")}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      ))}
    </main>
  );
};

export default MisPedidos;
