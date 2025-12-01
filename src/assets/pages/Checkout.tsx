import React, { useEffect, useState } from "react";
import { ProductoCarrito } from "../types";
import { useToast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { crearCompra } from "../services/compras.service";
import { useNavigate } from "react-router-dom";
import { CarritoService } from "../services/carrito";

const Checkout: React.FC = () => {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [boleta, setBoleta] = useState<any | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    metodoPago: "",
  });

  const showToast = useToast();
  const navigate = useNavigate();

  // ============================
  // CARGAR CARRITO Y DATOS
  // ============================
  useEffect(() => {
    const data = CarritoService.obtener();
    setCarrito(data);

    if (usuario) {
      setForm({
        nombre: usuario.nombre || "",
        direccion: usuario.direccion || "",
        telefono: usuario.telefono || "",
        metodoPago: "",
      });
    }
  }, [usuario]);

  const calcularTotal = () =>
    carrito.reduce((t, p) => {
      const descuento = p.descuento ?? 0;
      const precioFinal = p.oferta
        ? Math.round(p.precio * (1 - descuento / 100))
        : p.precio;

      return t + precioFinal * (p.cantidad || 1);
    }, 0);

  // ============================
  // SUBMIT CHECKOUT
  // ============================
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);

    try {
      if (!usuario) {
        showToast("Debes iniciar sesión", "error");
        return;
      }

      if (carrito.length === 0) {
        showToast("El carrito está vacío", "error");
        return;
      }

      if (!form.metodoPago) {
        showToast("Selecciona un método de pago", "error");
        return;
      }

      const fecha = new Date();
      const codigo = `HH-${fecha.getFullYear()}${String(
        fecha.getMonth() + 1
      ).padStart(2, "0")}${String(fecha.getDate()).padStart(
        2,
        "0"
      )}-${fecha.getTime()}`;

      const compraPayload = {
        codigo,
        metodoPago: form.metodoPago,
        total: calcularTotal(),
        usuario: { id: usuario.id },
        items: carrito.map((p) => {
          const descuento = p.descuento ?? 0;
          const precioFinal = p.oferta
            ? Math.round(p.precio * (1 - descuento / 100))
            : p.precio;

          return {
            productoId: p.id,
            nombre: p.name,
            cantidad: p.cantidad || 1,
            precio: precioFinal,
          };
        }),
      };

      console.log("🛒 Carrito antes de enviar:", carrito);
      console.log("📦 Items generados:", compraPayload.items);

      const compraGuardada = await crearCompra(compraPayload);

      if (!compraGuardada) {
        showToast("Error al registrar la compra", "error");
        return;
      }

      const nuevaBoleta = {
        ...compraGuardada,
        fecha: fecha.toLocaleString("es-CL"),
      };

      CarritoService.limpiar();
      setCarrito([]);
      setBoleta(nuevaBoleta);
      showToast("Compra realizada", "exito");
    } catch (err: any) {
      console.error("Error registrando compra:", err);
      showToast(err.message || "Error al procesar compra", "error");
    } finally {
      setProcesando(false);
    }
  };

  // ============================
  // MOSTRAR BOLETA
  // ============================
  if (boleta) {
    return (
      <main className="container py-5 mt-5">
        <h3 className="text-success text-center mb-4">✔ Compra realizada</h3>

        <div className="card p-4 shadow-sm">
          <p><strong>Código:</strong> {boleta.codigo}</p>
          <p><strong>Fecha:</strong> {boleta.fecha}</p>

          <hr />

          <h5>Productos:</h5>
          <ul>
            {boleta.items.map((p: any, i: number) => (
              <li key={i}>
                {p.nombre} — {p.cantidad} x ${p.precio.toLocaleString("es-CL")}
              </li>
            ))}
          </ul>

          <h4 className="text-end mt-3 text-success">
            Total: ${boleta.total.toLocaleString("es-CL")}
          </h4>

          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={() => navigate("/productos")}>
              Seguir comprando
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============================
  // CARRITO VACÍO
  // ============================
  if (carrito.length === 0) {
    return (
      <main className="container py-5">
        <h4 className="text-center">Tu carrito está vacío</h4>
        <div className="text-center mt-3">
          <button className="btn btn-success" onClick={() => navigate("/productos")}>
            Ir a productos
          </button>
        </div>
      </main>
    );
  }

  // ============================
  // FORMULARIO NORMAL
  // ============================
  return (
    <main className="container py-5">
      <h2 className="text-center mb-4">Finalizar Compra</h2>

      <div className="row justify-content-center">
        {/* RESUMEN */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">🛒 Resumen</div>
            <div className="card-body">
              {carrito.map((p, i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                  <span>{p.name} x{p.cantidad}</span>
                  <span>
                    ${(p.precio * p.cantidad).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
              <hr />
              <h4 className="text-end text-success">
                Total: ${calcularTotal().toLocaleString("es-CL")}
              </h4>
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">👤 Tus datos</div>
            <div className="card-body">
              <form onSubmit={handleCheckoutSubmit}>
                <div className="mb-3">
                  <label>Nombre *</label>
                  <input
                    className="form-control"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Dirección *</label>
                  <input
                    className="form-control"
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Teléfono *</label>
                  <input
                    className="form-control"
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Método de pago *</label>
                  <select
                    className="form-select"
                    value={form.metodoPago}
                    onChange={(e) =>
                      setForm({ ...form, metodoPago: e.target.value })
                    }
                  >
                    <option value="">Seleccione método</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="DEBITO">Débito</option>
                    <option value="CREDITO">Crédito</option>
                  </select>
                </div>

                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={procesando}
                >
                  {procesando ? "Procesando..." : "Finalizar compra"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
