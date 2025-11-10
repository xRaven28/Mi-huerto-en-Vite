// src/assets/pages/ProductoDetalle.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import type { Producto } from "../types";
import StarRating from "../components/StarRating";
import { useToast } from "../components/Toast";


/* =========================================================
   Función auxiliar para limpiar rutas de imagen
========================================================= */
const getImagePath = (img: string): string => {
  if (!img) return "/img/placeholder.jpg";
  const clean = img.replace(/^\/?(img|Img)\//, "").trim();
  return `/img/${clean}`;
};

/* =========================================================
  Componente principal
========================================================= */
const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { productos } = useProductos();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [similares, setSimilares] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState<number>(1);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const showToast = useToast();

  /* =========================================================
    Cargar producto y similares
  ========================================================= */
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

  /*Manejo de valoraciones*/
  const handleSubmitValoracion = () => {
    if (!rating) {
      showToast("⚠️ Selecciona una cantidad de estrellas.");
      console.log("Intento de comentar sin seleccionar estrellas.");
      return;
    }

    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
    if (!usuarioActual?.nombre) {
      showToast("🚫 Debes iniciar sesión para comentar.");
      console.log("Intento de comentar sin iniciar sesión.");
      return;
    }

    const nuevaValoracion = {
      usuario: usuarioActual.nombre,
      estrellas: rating,
      comentario,
      fecha: new Date().toLocaleString(),
    };

    const nuevasValoraciones = [...(producto?.valoraciones || []), nuevaValoracion];
    const nuevosProductos = productos.map((p) =>
      p.id === producto?.id ? { ...p, valoraciones: nuevasValoraciones } : p
    );

    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    setProducto({ ...producto!, valoraciones: nuevasValoraciones });
    setComentario("");
    setRating(0);

    showToast("✅ ¡Gracias por tu opinión!");
    console.log("Comentario agregado correctamente:", nuevaValoracion);
  };

  /*Agregar al carrito*/
  const agregarAlCarrito = (producto: Producto, cantidad: number) => {
    const raw = localStorage.getItem("carrito") || "[]";
    const carrito = JSON.parse(raw);
    const idx = carrito.findIndex((p: any) => p.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += cantidad;
    else carrito.push({ ...producto, cantidad });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage"));
    console.log(`${producto.name} agregado al carrito`);
  };

  /* =========================================================
    Render condicional 
  ========================================================= */
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

  const precioFinal = producto.oferta
    ? Math.round(producto.precio * (1 - (producto.descuento || 0) / 100))
    : producto.precio;

  /* =========================================================
    Render principal
  ========================================================= */
  return (
    <>
      <main className="container py-5 detalle-producto-page" style={{ marginTop: "90px" }}>
        <div className="row align-items-center bg-white shadow-sm rounded-4 p-4">
          <div className="col-md-6 text-center mb-4 mb-md-0 position-relative">
            {producto.oferta && (
              <span className="hh-badge position-absolute top-0 start-0 m-3 bg-danger text-white px-2 py-1 rounded">
                {producto.descuento}% OFF
              </span>
            )}
            <img
              src={getImagePath(producto.img)}
              alt={producto.name}
              className="img-fluid rounded-4 shadow-sm"
              style={{
                maxHeight: "360px",
                objectFit: "contain",
                backgroundColor: "#fff",
              }}
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/img/placeholder.jpg")
              }
            />
          </div>

          {/* Detalles */}
          <div className="col-md-6">
            <h2 className="fw-bold mb-2 text-dark">{producto.name}</h2>
            <p className="text-uppercase text-muted mb-2">{producto.categoria}</p>

            {producto.oferta ? (
              <>
                <h4 className="fw-bold text-danger mb-1">
                  ${precioFinal.toLocaleString("es-CL")}
                </h4>
                <p className="text-muted text-decoration-line-through">
                  Antes: ${producto.precio.toLocaleString("es-CL")}
                </p>
              </>
            ) : (
              <h4 className="fw-bold mb-3 text-success">
                ${producto.precio.toLocaleString("es-CL")}
              </h4>
            )}

            <p className="mb-4 text-secondary">{producto.desc}</p>

            {/* Cantidad */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-2 fw-semibold">Cantidad:</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                className="form-control"
                style={{ width: "100px" }}
              />
            </div>

            {/* Botones */}
            <div className="d-flex flex-wrap gap-3">
              <button
                className="btn btn-success px-4"
                onClick={() => agregarAlCarrito(producto, cantidad)}
              >
                <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
              </button>
              <Link to="/productos" className="btn btn-outline-success px-4">
                <i className="bi bi-arrow-left me-2"></i> Volver
              </Link>
            </div>
          </div>
        </div>

        {/* ================== PRODUCTOS SIMILARES ================== */}
        <section className="mt-5">
          <h4 className="fw-bold text-center mb-4" style={{ color: "#3A4137" }}>
            Productos similares
          </h4>

          <div className="row justify-content-center">
            {similares.map((p) => (
              <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                <div className="hh-card">
                  <div className="hh-media position-relative">
                    <img
                      src={getImagePath(p.img)}
                      alt={p.name}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/img/placeholder.jpg")
                      }
                    />
                    {p.oferta && (
                      <span className="hh-badge position-absolute top-0 start-0 m-2">
                        {p.descuento}% OFF
                      </span>
                    )}
                  </div>

                  <div className="hh-body text-center">
                    <h6 className="hh-title">{p.name}</h6>

                    {/* ⭐ Mostrar promedio de estrellas si hay valoraciones */}
                    {p.valoraciones?.length ? (
                      <StarRating
                        value={
                          p.valoraciones.reduce((acc, v) => acc + v.estrellas, 0) /
                          p.valoraciones.length
                        }
                        readOnly
                        size={18}
                      />
                    ) : (
                      <small className="text-muted d-block mb-2">Sin valoraciones</small>
                    )}

                    <p className="hh-price mb-3">
                      {p.oferta ? (
                        <>
                          <span className="text-muted text-decoration-line-through me-1">
                            ${p.precio.toLocaleString("es-CL")}
                          </span>
                          <span className="text-danger fw-bold">
                            $
                            {Math.round(
                              p.precio * (1 - (p.descuento || 0) / 100)
                            ).toLocaleString("es-CL")}
                          </span>
                        </>
                      ) : (
                        <>${p.precio.toLocaleString("es-CL")}</>
                      )}
                    </p>

                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/producto/${p.id}`} className="btn btn-ver">
                        <i className="bi bi-eye me-1"></i> Ver
                      </Link>
                      <button className="btn btn-anadir" onClick={() => agregarAlCarrito(p, 1)}>
                        <i className="bi bi-cart-plus me-1"></i> Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ================== OPINIONES DE CLIENTES ================== */}
        <section className="mt-5">
          <h4 className="fw-bold text-success mb-3">Opiniones de clientes</h4>

          {producto.valoraciones && producto.valoraciones.length > 0 ? (
            producto.valoraciones.map((v, i) => (
              <div key={i} className="card mb-3 shadow-sm border-0 p-3">
                <div className="d-flex justify-content-between">
                  <strong>{v.usuario}</strong>
                  <small className="text-muted">{v.fecha}</small>
                </div>
                <div>
                  <StarRating value={v.estrellas} readOnly />
                  <p className="mt-2 mb-0">{v.comentario}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Aún no hay valoraciones para este producto.</p>
          )}

          <div className="card mt-4 shadow-sm border-0 p-3">
            <h5 className="text-success">Deja tu opinión</h5>
            <StarRating value={rating} onChange={setRating} />
            <textarea
              className="form-control mt-3"
              rows={3}
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button
              className="btn btn-success mt-3"
              onClick={handleSubmitValoracion}
            >
              Enviar valoración
            </button>
          </div>
        </section>
      </main>

      {/* ================== FOOTER ================== */}
      <footer className="footer-custom text-white pt-4 pb-2 mt-5 w-100">
        <div className="container">
          <div className="row px-5">
            <div className="col-md-4 mb-3">
              <h5>Contacto</h5>
              <p>Email: contacto@huertohogar.cl</p>
              <p>Tel: +56 9 1234 5678</p>
              <p>Dirección: Calle Ejemplo 123, Concepción, Chile</p>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Enlaces útiles</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
                <li><a href="/productos" className="text-white text-decoration-none">Productos</a></li>
                <li><a href="/recetas" className="text-white text-decoration-none">Recetas</a></li>
                <li>
                  <a
                    href="https://github.com/xRaven28/HuertoHogar.git"
                    className="text-white text-decoration-none"
                    target="_blank"
                  >
                    GitHub de esta página
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Síguenos</h5>
              <a href="#" className="text-white d-block mb-1"><i className="bi bi-facebook"></i> Facebook</a>
              <a href="#" className="text-white d-block mb-1"><i className="bi bi-instagram"></i> Instagram</a>
              <a href="#" className="text-white d-block"><i className="bi bi-whatsapp"></i> WhatsApp</a>
            </div>
          </div>

          <hr className="bg-white mx-5" />
          <p className="text-center mb-0 small">
            &copy; 2025 Huerto Hogar. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
};

export default DetalleProducto;
