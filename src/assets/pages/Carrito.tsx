import React, { useEffect, useState } from "react";
import { ProductoCarrito } from "../types";
import { CarritoService } from "../services/carrito";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import { useNavigate} from "react-router-dom";

const Carrito: React.FC = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  const { usuario } = useAuth();
  const showToast = useToast();

  //Protección para tests: evita error si no hay Router
  let navigate: ReturnType<typeof useNavigate>;
  try {
    navigate = useNavigate();
  } catch {
    navigate = (() => {}) as any;
  }

  //Cargar carrito inicial
  useEffect(() => {
    const data = CarritoService.obtenerCarrito();
    setCarrito(data);
    calcularTotal(data);
    setLoading(false);
  }, []);

  //Guardar carrito actualizado
  const guardarCarrito = (nuevo: ProductoCarrito[]) => {
    setCarrito(nuevo);
    CarritoService.guardarCarrito(nuevo);
    calcularTotal(nuevo);
  };

  //Calcular total general
  const calcularTotal = (items: ProductoCarrito[]) => {
    const totalCalc = items.reduce((sum, p) => {
      const precioFinal =
        p.oferta && p.descuento
          ? Math.round(p.precio * (1 - p.descuento / 100))
          : p.precio;
      return sum + precioFinal * (p.cantidad || 1);
    }, 0);
    setTotal(totalCalc);
  };

  //Actualizar cantidad
  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map((p) =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    );
    guardarCarrito(nuevoCarrito);
  };

  //Eliminar producto
  const eliminarProducto = (id: number) => {
    const eliminado = carrito.find((p) => p.id === id);
    const nuevoCarrito = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevoCarrito);
    showToast(`🗑️ ${eliminado?.name} fue eliminado del carrito`, "error");
  };

  //Lógica de pago
  const handlePagar = () => {
    if (carrito.length === 0) {
      showToast("Tu carrito está vacío", "error");
      return;
    }

    if (!usuario) {
      setMostrarModal(true);
      return;
    }

    navigate("/checkout");
  };

  //Continuar como invitado
  const continuarInvitado = () => {
    localStorage.setItem("modoInvitado", "true");
    setMostrarModal(false);
    showToast("Continuando como invitado...", "info");
    setTimeout(() => navigate("/checkout"), 300);
  };

  //Loading
  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );

  //Carrito vacío
  if (carrito.length === 0)
    return (
      <main
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh", textAlign: "center" }}
      >
        <div className="alert alert-info p-4 rounded shadow-sm">
          <h4 className="fw-bold text-success mb-3">
            Tu carrito está vacío 😢
          </h4>
          <a href="/productos" className="btn btn-success px-4">
            Ir a Productos
          </a>
        </div>
      </main>
    );

  //Render principal
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
            {carrito.map((p) => {
              const precioFinal =
                p.oferta && p.descuento
                  ? Math.round(p.precio * (1 - p.descuento / 100))
                  : p.precio;
              const subtotal = precioFinal * (p.cantidad || 1);

              return (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <br />
                    <small className="text-muted">{p.categoria}</small>
                    {p.oferta && (
                      <span className="badge bg-danger ms-2">
                        {p.descuento}% OFF
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <img
                      src={p.img || "/img/placeholder.jpg"}
                      alt={p.name}
                      className="img-thumbnail"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/img/placeholder.jpg")
                      }
                    />
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          actualizarCantidad(p.id, (p.cantidad || 1) - 1)
                        }
                        disabled={(p.cantidad || 1) <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{p.cantidad || 1}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          actualizarCantidad(p.id, (p.cantidad || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    {p.oferta ? (
                      <>
                        <span className="text-muted text-decoration-line-through d-block">
                          ${p.precio.toLocaleString("es-CL")}
                        </span>
                        <span className="text-danger fw-bold">
                          ${precioFinal.toLocaleString("es-CL")}
                        </span>
                      </>
                    ) : (
                      <span>${p.precio.toLocaleString("es-CL")}</span>
                    )}
                  </td>
                  <td className="text-center fw-bold text-success">
                    ${subtotal.toLocaleString("es-CL")}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      <i className="bi bi-trash"></i>
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
            ${total.toLocaleString("es-CL")}
          </span>
        </h4>
        <button className="btn btn-success mt-3" onClick={handlePagar}>
          <i className="bi bi-credit-card me-2"></i>Pagar ahora
        </button>
      </div>

      {/*Modal para opciones de pago */}
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
