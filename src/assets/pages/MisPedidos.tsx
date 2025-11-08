import React, { useEffect, useState } from "react";

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    const historial = JSON.parse(localStorage.getItem("historialCompras") || "[]");
    setPedidos(historial.reverse()); // Mostrar el pedido más reciente primero
  }, []);

  if (pedidos.length === 0) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-warning shadow-sm">
          Aún no tienes pedidos registrados 🛒
        </div>
      </main>
    );
  }

  const descargarPDF = (pedido: any) => {
    const contenido = `
      <h2>HuertoHogar - Boleta de Compra</h2>
      <p><strong>N° Boleta:</strong> ${pedido.codigo}</p>
      <p><strong>Cliente:</strong> ${pedido.cliente}</p>
      <p><strong>Dirección:</strong> ${pedido.direccion}</p>
      <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <hr>
      <h3>Detalle de compra:</h3>
      <ul>
        ${pedido.productos
          .map(
            (p: any) =>
              `<li>${p.name} x${p.cantidad || 1} - $${(
                p.precio * (p.cantidad || 1)
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

  return (
    <main className="container mis-pedidos-page" style={{ paddingTop: "120px" }}>
      <h3 className="text-success mb-4 text-center">🧾 Mis pedidos</h3>

      {pedidos.map((pedido) => (
        <div key={pedido.codigo} className="card mb-3 shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title text-success mb-0">
                {pedido.codigo}
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => descargarPDF(pedido)}
              >
                Descargar boleta
              </button>
            </div>

            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            <p><strong>Total:</strong> ${pedido.total.toLocaleString("es-CL")}</p>
            <p><strong>Método de pago:</strong> {pedido.metodoPago}</p>

            <details className="mt-2">
              <summary className="text-primary mb-2">Ver detalle</summary>
              <ul className="list-group list-group-flush">
                {pedido.productos.map((p: any, i: number) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{p.name} x{p.cantidad || 1}</span>
                    <span>
                      ${(
                        p.precio * (p.cantidad || 1)
                      ).toLocaleString("es-CL")}
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
