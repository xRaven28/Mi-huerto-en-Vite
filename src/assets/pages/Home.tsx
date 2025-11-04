import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);

  /* ================================
     🧠 Usuario activo (si existe)
  ================================ */
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioActivo");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  /* ================================
     🔥 Ofertas desde localStorage
  ================================ */
  useEffect(() => {
    const productosGuardados = localStorage.getItem("productos");
    if (productosGuardados) {
      try {
        const productos = JSON.parse(productosGuardados);

        const seleccion = productos
          .filter((p: any) => p.habilitado && p.enOferta)
          .map((p: any) => ({
            ...p,
            precio: Number(p.precio) || 0, // Asegura que el precio siempre sea numérico
            img: p.img || "/img/placeholder.jpg", // Imagen por defecto
          }))
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);

        setOfertas(seleccion);
      } catch (e) {
        console.error("Error leyendo productos:", e);
      }
    }
  }, []);

  /* ================================
     🎞️ Carrusel automático
  ================================ */
  const imagenes = [
    "/img/Inicio_1.jpg",
    "/img/Frutaindex2.png",
    "/img/Frutaindex3.jpeg",
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceCarrusel((prev) => (prev + 1) % imagenes.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  /* ================================
     🛒 Agregar producto al carrito
  ================================ */
  const agregarAlCarrito = (producto: any) => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const idx = carrito.findIndex((p: any) => p.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`🛒 ${producto.name || "Producto"} agregado al carrito`);
  };

  /* ================================
     💬 Testimonios fijos
  ================================ */
  const testimonios = [
    {
      nombre: "María González",
      texto:
        "Los productos son frescos y de excelente calidad. Siempre llegan a tiempo y en perfectas condiciones.",
      imagen: "/img/maria.png",
    },
    {
      nombre: "Juan Pérez",
      texto:
        "Me encanta la variedad de productos que ofrecen. Todo se siente natural y fresco, justo como lo necesito.",
      imagen: "/img/el.png",
    },
    {
      nombre: "Ana Torres",
      texto:
        "Excelente servicio y atención al cliente. ¡Recomiendo HuertoHogar a todos mis amigos y familiares!",
      imagen: "/img/ana.PNG",
    },
  ];

  /* ================================
     🏡 Render principal
  ================================ */
  return (
    <main className="home-page">
      {/* 🌿 Carrusel automático */}
      <div className="carousel-container">
        <img
          src={imagenes[indiceCarrusel]}
          alt="Imagen HuertoHogar"
          className="carousel-img"
        />
        <div className="carousel-overlay">
          <h1 className="text-white text-center fw-bold">
            Bienvenido a HuertoHogar
          </h1>
          <p className="text-white text-center">
            Frescura natural, directo del campo a tu mesa 🍎
          </p>
        </div>
      </div>

      {/* 🌱 Consejos del día + 🔥 Ofertas */}
      <div className="container py-5">
        <div className="row g-4 align-items-stretch">
          {/* 🌱 Consejos del día */}
          <div className="col-lg-4 d-flex flex-column">
            <h2 className="text-center mb-4 text-success">🌱 Consejos del Día</h2>
            <div className="card text-white shadow-sm border-0">
              <div className="img-cuadrada">
                <img
                  src="/img/Fondo.jpg"
                  className="card-img"
                  alt="Consejo saludable"
                />
                <div
                  className="card-img-overlay d-flex flex-column justify-content-center text-center"
                  style={{ background: "rgba(0,0,0,0.45)", borderRadius: "6px" }}
                >
                  <h5 className="card-title fw-bold">
                    Come 5 frutas y verduras al día
                  </h5>
                  <p className="card-text">
                    Te aportan vitaminas, minerales y fibra para una vida más saludable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Ofertas de la Semana */}
          <div className="col-lg-8">
            <h2 className="text-center mb-4 text-success">🔥 Ofertas de la Semana</h2>
            <div className="row g-4">
              {ofertas.length > 0 ? (
                ofertas.map((p) => (
                  <div key={p.id} className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 position-relative oferta-card">
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        Oferta
                      </span>

                      <div className="text-center p-3">
                        <img
                          src={p.img}
                          alt={p.name || "Producto sin nombre"}
                          className="img-fluid rounded"
                          style={{ maxHeight: "150px", objectFit: "contain" }}
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/img/placeholder.jpg")
                          }
                        />
                      </div>

                      <div className="card-body text-center">
                        <h5 className="card-title fw-semibold text-dark">
                          {p.name || "Producto sin nombre"}
                        </h5>
                        <p className="card-text mb-2">
                          <span className="text-danger fw-bold">
                            {p.precio > 0
                              ? `$${p.precio.toLocaleString("es-CL")}`
                              : "Consultar precio"}
                          </span>
                        </p>
                        <button
                          className="btn btn-huerto btn-sm"
                          onClick={() => agregarAlCarrito(p)}
                        >
                          Agregar al Carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No hay ofertas disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* 💬 Testimonios de Clientes */}
        <section className="py-5 bg-light mt-5 rounded-3">
          <h2 className="text-center mb-4 text-success">
            💬 Qué dicen nuestros clientes
          </h2>
          <div className="row text-center g-4">
            {testimonios.map((t, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 shadow-sm border-0 p-3">
                  <img
                    src={t.imagen}
                    className="rounded-circle mx-auto mb-3 border border-success"
                    alt={t.nombre}
                    width="120"
                    height="120"
                    style={{ objectFit: "cover" }}
                  />
                  <h5 className="fw-bold">{t.nombre}</h5>
                  <p className="text-muted">"{t.texto}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 🦶 Footer */}
      <footer className="footer-custom text-white pt-4 pb-2">
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
          <p className="text-center mb-0">
            &copy; 2025 Huerto Hogar. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
