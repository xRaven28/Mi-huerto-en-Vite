import React from 'react';

const QuienesSomos: React.FC = () => {
  return (
    <div className="quienes-somos-page">
      <section className="py-5 bg-light text-center" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="mb-4">
            <img
              src="/img/frutas-y-verduras.jpg"
              alt="Quiénes somos Huerto Hogar"
              className="img-fluid rounded shadow w-100"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
              }}
            />
          </div>

          <h2 className="text-center mb-4">¿Quiénes somos?</h2>
          <p className="lead">
            En <strong>Huerto Hogar</strong> creemos que lo natural y fresco es lo mejor para la familia.
            Desde hace más de 6 años llevamos frutas, verduras y productos del campo directamente
            a tu mesa, conectando a las familias chilenas con lo mejor de nuestra tierra.
          </p>
          <p>
            Comenzamos como un pequeño proyecto con mucho cariño y hoy ya estamos presentes
            en varias ciudades del país, pero siempre manteniendo el mismo compromiso:
            <em> entregar frescura, calidad y cercanía en cada pedido.</em>
          </p>
          <p>
            Nuestra motivación es simple: que cada hogar disfrute de productos saludables,
            apoyando a los agricultores locales y promoviendo un estilo de vida más consciente
            y sostenible.
          </p>
          <p>
            Porque sabemos que lo más rico es compartir en familia, y nada mejor que hacerlo
            con lo que la naturaleza nos regala 🌱🍎.
          </p>

          {/* Valores */}
          <div className="row text-center my-5">
            {[
              { icon: '🌱', title: 'Frescura', text: 'Productos del campo directo a tu mesa, seleccionados cuidadosamente para garantizar su calidad y sabor.' },
              { icon: '🤝', title: 'Cercanía', text: 'Conectamos familias con agricultores locales, creando una comunidad alrededor de la alimentación saludable.' },
              { icon: '🌍', title: 'Sostenibilidad', text: 'Apoyamos prácticas agrícolas responsables y el comercio justo para cuidar nuestro planeta.' }
            ].map((val, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card h-100 border-0 shadow-sm valor-card">
                  <div className="card-body">
                    <h5 className="text-success">{val.icon} {val.title}</h5>
                    <p>{val.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas */}
          <div className="row text-center my-5 py-4 bg-white rounded shadow-sm">
            <div className="col-md-3"><h3 className="text-success fw-bold">6+</h3><p>Años de experiencia</p></div>
            <div className="col-md-3"><h3 className="text-success fw-bold">5000+</h3><p>Familias satisfechas</p></div>
            <div className="col-md-3"><h3 className="text-success fw-bold">50+</h3><p>Productos naturales</p></div>
            <div className="col-md-3"><h3 className="text-success fw-bold">10+</h3><p>Ciudades en Chile</p></div>
          </div>

          {/* Mapa */}
          <h3 className="mb-3 mt-5 text-success">📍 Nuestras Tiendas</h3>
          <p className="mb-4">Encuéntranos en distintas ciudades de Chile 🌎</p>
          <div className="ratio ratio-16x9 mb-5">
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1Ascvx1jAA9aje0xJ-RmLLoQNJtbazBw&ehbc=2E312F&noprof=1"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Mapa de tiendas Huerto Hogar"
            ></iframe>
          </div>

          {/* Compromiso */}
          <h3 className="mb-4 text-success">Nuestro Compromiso</h3>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-truck text-success fs-1 mb-3"></i>
                  <h5>Entrega Rápida</h5>
                  <p>Recibe tus productos frescos en menos de 24 horas en la mayoría de las ciudades.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check text-success fs-1 mb-3"></i>
                  <h5>Calidad Garantizada</h5>
                  <p>Todos nuestros productos pasan por rigurosos controles de calidad antes de llegar a ti.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
    </div>
  );
};

export default QuienesSomos;
