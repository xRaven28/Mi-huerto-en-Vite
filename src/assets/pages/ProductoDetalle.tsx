import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import { Producto } from "../types";

/* =========================================================
   🖼️ FUNCIÓN PARA RUTA DE IMÁGENES
   ========================================================= */
const getImagePath = (img: string): string => {
  if (!img) return "/img/placeholder.jpg";
  const clean = img.replace(/^\/?(img|Img)\//, "").trim();
  return `/img/${clean}`;
};

/* =========================================================
   🌿 COMPONENTE PRINCIPAL
   ========================================================= */
const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { productos } = useProductos();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [similares, setSimilares] = useState<Producto[]>([]);

  /* =========================================================
     🎯 CARGAR PRODUCTO Y SIMILARES
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

  /* =========================================================
     🛒 AGREGAR AL CARRITO
     ========================================================= */
  const agregarAlCarrito = (producto: Producto) => {
    const raw = localStorage.getItem("carrito") || "[]";
    const carrito = JSON.parse(raw);
    const idx = carrito.findIndex((p: any) => p.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage"));
  };

  /* =========================================================
     🕓 ESTADOS DE CARGA / ERROR
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

  /* =========================================================
     🌿 RENDER PRINCIPAL
     ========================================================= */
  return (
    <>
      <main
        className="container py-5 detalle-producto-page"
        style={{ marginTop: "90px" }}
      >
        <div className="row align-items-center bg-white shadow-sm rounded-4 p-4">
          {/* Imagen principal */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
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
            <h2 className="fw-bold mb-2" style={{ color: "#3A4137" }}>
              {producto.name}
            </h2>
            <p className="text-uppercase text-muted mb-2">{producto.categoria}</p>
            <h4 className="fw-bold mb-3" style={{ color: "#7cca33" }}>
              ${producto.precio.toLocaleString("es-CL")}
            </h4>
            <p className="mb-4" style={{ color: "#555" }}>
              {producto.desc}
            </p>

            <div className="d-flex flex-wrap gap-3">
              <button
                className="btn btn-huerto px-4"
                onClick={() => agregarAlCarrito(producto)}
              >
                <i className="bi bi-cart-plus me-2"></i> Añadir al carrito
              </button>
              <Link to="/productos" className="btn btn-outline-secondary px-4">
                <i className="bi bi-arrow-left me-2"></i> Volver
              </Link>
            </div>
          </div>
        </div>

        {/* Productos similares */}
        {similares.length > 0 && (
          <section className="mt-5">
            <h4
              className="fw-bold text-center mb-4"
              style={{ color: "#3A4137" }}
            >
              Productos similares
            </h4>
            <div className="row justify-content-center">
              {similares.map((p) => (
                <div
                  key={p.id}
                  className="col-xl-3 col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
                >
                  <div className="hh-card">
                    <div className="hh-media">
                      <img
                        src={getImagePath(p.img)}
                        alt={p.name}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/img/placeholder.jpg")
                        }
                      />
                      <span className="hh-badge">{p.categoria}</span>
                    </div>
                    <div className="hh-body">
                      <h6 className="hh-title">{p.name}</h6>
                      <p className="hh-price">
                        ${p.precio.toLocaleString("es-CL")}
                      </p>
                      <Link
                        to={`/producto/${p.id}`}
                        className="btn btn-sm btn-huerto mt-2"
                      >
                        <i className="bi bi-eye me-1"></i> Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 🦶 FOOTER */}
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
                <li>
                  <a href="/" className="text-white text-decoration-none">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/productos" className="text-white text-decoration-none">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/recetas" className="text-white text-decoration-none">
                    Recetas
                  </a>
                </li>
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
              <a href="#" className="text-white d-block mb-1">
                <i className="bi bi-facebook"></i> Facebook
              </a>
              <a href="#" className="text-white d-block mb-1">
                <i className="bi bi-instagram"></i> Instagram
              </a>
              <a href="#" className="text-white d-block">
                <i className="bi bi-whatsapp"></i> WhatsApp
              </a>
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
