import React, { useEffect, useState } from "react";
import { ProductoCarrito } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const KEY = "carrito";

const Carrito: React.FC = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // ===============================
  // 🔹 Cargar carrito desde localStorage
  // ===============================
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setCarrito(JSON.parse(raw));
    setLoading(false);
  }, []);

  const guardarCarrito = (nuevo: ProductoCarrito[]) => {
    setCarrito(nuevo);
    localStorage.setItem(KEY, JSON.stringify(nuevo));
  };

  // ===============================
  // 🔹 Funciones del carrito
  // ===============================
  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    const nuevo = carrito.map((p) => (p.id === id ? { ...p, cantidad } : p));
    guardarCarrito(nuevo);
  };

  const eliminarProducto = (id: number) => {
    const eliminado = carrito.find((p) => p.id === id);
    const nuevo = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevo);
    alert(`${eliminado?.name} fue eliminado del carrito`);
  };

  // ===============================
  // 💰 Calcular precio con descuento
  // ===============================
  const precioConDescuento = (p: ProductoCarrito) => {
    if (p.oferta && p.descuento) {
      return Math.round(p.precio * (1 - p.descuento / 100));
    }
    return p.precio;
  };

  // ===============================
  // 🔹 Calcular total general
  // ===============================
  const calcularTotal = () =>
    carrito.reduce(
      (s, p) => s + precioConDescuento(p) * (p.cantidad || 1),
      0
    );

  // ===============================
  // 🔹 Lógica de pago
  // ===============================
  const handlePagar = () => {
    if (usuario) {
      // ✅ Usuario logueado → pasa directo
      navigate("/checkout");
    } else {
      // ❌ No logueado → muestra opciones
      setMostrarModal(true);
    }
  };

  const continuarInvitado = () => {
    localStorage.setItem("modoInvitado", "true");
    window.dispatchEvent(new Event("storage"));
    setMostrarModal(false);
    setTimeout(() => {
      navigate("/checkout");
    }, 150);
  };

  // ===============================
  // 🔹 Render principal
  // ===============================
  if (loading)
    return (
      <div className="container text-center py-5 carrito-page">
        <div className="spinner-border text-success" role="status" />
      </div>
    );

  if (carrito.length === 0)
    return (
    <main
      className="container vacio-page d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        textAlign: "center",
        paddingTop: "60px",
      }}
    >
      <div
        className="alert alert-info p-4 rounded shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h4 className="fw-bold text-success mb-3">
          Tu carrito está vacío 🛒
        </h4>
        <a href="/productos" className="btn btn-success px-4">
          Ir a Productos
        </a>
      </div>
    </main>
  );

  return (
    <main className="container carrito-page" style={{ paddingTop: "120px" }}>
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
            {carrito.map((item) => {
              const precioFinal = precioConDescuento(item);
              const subtotal = precioFinal * (item.cantidad || 1);

              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <br />
                    <small className="text-muted">{item.categoria}</small>
                    {item.oferta && (
                      <span className="badge bg-danger ms-2">
                        {item.descuento}% OFF
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <img
                      src={item.img || "/img/placeholder.jpg"}
                      alt={item.name}
                      className="img-thumbnail"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          actualizarCantidad(item.id, (item.cantidad || 1) - 1)
                        }
                        disabled={(item.cantidad || 1) <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.cantidad || 1}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          actualizarCantidad(item.id, (item.cantidad || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    {item.oferta ? (
                      <>
                        <span className="text-muted text-decoration-line-through d-block">
                          ${item.precio.toLocaleString("es-CL")}
                        </span>
                        <span className="text-danger fw-bold">
                          ${precioFinal.toLocaleString("es-CL")}
                        </span>
                      </>
                    ) : (
                      <span>${item.precio.toLocaleString("es-CL")}</span>
                    )}
                  </td>
                  <td className="text-center fw-bold text-success">
                    ${subtotal.toLocaleString("es-CL")}
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-4">
        <h4>
          Total:{" "}
          <span className="text-success fw-bold">
            ${calcularTotal().toLocaleString("es-CL")}
          </span>
        </h4>
        <button className="btn btn-success mt-3" onClick={handlePagar}>
          <i className="bi bi-credit-card me-2"></i>Pagar ahora
        </button>
      </div>

      {/* ===========================
          🪟 Modal opciones de pago
      ============================ */}
      {mostrarModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded-4 shadow-lg text-center"
            style={{ maxWidth: 400 }}
          >
            <h4 className="mb-3">Antes de continuar</h4>
            <p className="text-muted mb-4">
              Elige cómo deseas finalizar tu compra:
            </p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success fw-bold"
                onClick={() => navigate("/mi-cuenta")}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar sesión
              </button>
              <button
                className="btn btn-outline-success fw-bold"
                onClick={() => navigate("/crear-cuenta")}
              >
                <i className="bi bi-person-plus me-2"></i> Crear cuenta
              </button>
              <button
                className="btn btn-secondary fw-bold"
                onClick={continuarInvitado}
              >
                <i className="bi bi-person-check me-2"></i> Continuar como invitado
              </button>
              <button
                className="btn btn-outline-danger mt-2"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Carrito;
