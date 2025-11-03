import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [carouselItems] = useState([
    { src: "/img/Inicio_1.jpg", alt: "Huerto 1" },
    { src: "/img/Frutaindex2.png", alt: "Huerto 2" },
    { src: "/img/Frutaindex3.jpeg", alt: "Huerto 3" }
  ]);

  const [testimonios] = useState([
    { nombre: "María González", texto: "Los productos son frescos y de excelente calidad. Siempre llegan a tiempo y en perfectas condiciones.", imagen: "/img/maria.png" },
    { nombre: "Juan Pérez", texto: "Me encanta la variedad de productos que ofrecen. Todo se siente natural y fresco, justo como lo necesito.", imagen: "/img/el.png" },
    { nombre: "Ana Torres", texto: "Excelente servicio y atención al cliente. ¡Recomiendo HuertoHogar a todos mis amigos y familiares!", imagen: "/img/ana.PNG" }
  ]);

  const [ofertas, setOfertas] = useState<any[]>([]);

  useEffect(() => {
    const ofertasEjemplo = [
      { id: 1, nombre: "Manzanas Orgánicas", precio: 1990, precioOriginal: 2490 },
      { id: 2, nombre: "Lechuga Fresca", precio: 790, precioOriginal: 990 },
      { id: 3, nombre: "Tomates Cherry", precio: 1290, precioOriginal: 1590 }
    ];
    setOfertas(ofertasEjemplo);
  }, []);

  return (
    <main className="home-page">
      <div id="carouselHuerto" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="4000">
              <img
                src={item.src}
                className="d-block w-100"
                alt={item.alt}
                style={{ height: '90vh', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselHuerto" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselHuerto" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* 🌿 Contenido principal */}
      <div className="container py-5">
        <div className="row g-4 align-items-stretch">
          {/* Consejos del Día */}
          <div className="col-lg-4 d-flex flex-column">
            <h2 className="text-center mb-4 text-success">🌱 Consejos del Día</h2>
            <div className="card text-white shadow-sm border-0">
              <div className="img-cuadrada">
                <img src="/img/Fondo.jpg" className="card-img" alt="Consejo saludable" />
                <div className="card-img-overlay d-flex flex-column justify-content-center text-center"
                  style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '6px' }}>
                  <h5 className="card-title fw-bold">Come 5 frutas y verduras al día</h5>
                  <p className="card-text">Te aportan vitaminas, minerales y fibra para una vida más saludable.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ofertas */}
          <div className="col-lg-8">
            <h2 className="text-center mb-4 text-success">🔥 Ofertas de la Semana</h2>
            <div id="ofertas-semana" className="row g-4">
              {ofertas.map(oferta => (
                <div key={oferta.id} className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <h5 className="card-title">{oferta.nombre}</h5>
                      <p className="card-text">
                        <span className="text-danger fw-bold">${oferta.precio.toLocaleString()}</span>
                        <span className="text-muted text-decoration-line-through ms-2">
                          ${oferta.precioOriginal.toLocaleString()}
                        </span>
                      </p>
                      <button className="btn btn-huerto btn-sm">
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonios */}
        <section className="py-5 bg-light mt-5 rounded-3">
          <h2 className="text-center mb-4 text-success">💬 Qué dicen nuestros clientes</h2>
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
                    style={{ objectFit: 'cover' }}
                  />
                  <h5 className="fw-bold">{t.nombre}</h5>
                  <p className="text-muted">"{t.texto}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 🌾 Footer */}
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
                  <a href="https://github.com/xRaven28/HuertoHogar.git" className="text-white text-decoration-none">
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
          <p className="text-center mb-0">&copy; 2025 Huerto Hogar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
