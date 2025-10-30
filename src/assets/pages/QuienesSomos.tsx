// src/pages/QuienesSomos.tsx
import React from 'react';

const QuienesSomos: React.FC = () => {
    return (
        <div>
            <section id="quienes-somos" className="py-5 bg-light text-center" style={{ marginTop: '80px' }}>
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
                    
                    <h2 className="mb-3">¿Quiénes somos?</h2>
                    <p className="lead">
                        En <strong>Huerto Hogar</strong> creemos que lo natural y fresco es lo mejor para la familia.
                        Desde hace más de 6 años llevamos frutas, verduras y productos del campo directamente
                        a tu mesa, conectando a las familias chilenas con lo mejor de nuestra tierra.
                    </p>
                    <p>
                        Comenzamos como un pequeño proyecto con mucho cariño y hoy ya estamos presentes
                        en varias ciudades del país, pero siempre manteniendo el mismo compromiso:
                        <em>entregar frescura, calidad y cercanía en cada pedido.</em>
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
                    <br />

                    {/* Valores de la empresa */}
                    <div className="row text-center my-4">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="text-success">🌱 Frescura</h5>
                                    <p className="card-text">Productos del campo directo a tu mesa, seleccionados cuidadosamente para garantizar su calidad y sabor.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="text-success">🤝 Cercanía</h5>
                                    <p className="card-text">Conectamos familias con agricultores locales, creando una comunidad alrededor de la alimentación saludable.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="text-success">🌍 Sostenibilidad</h5>
                                    <p className="card-text">Apoyamos prácticas agrícolas responsables y el comercio justo para cuidar nuestro planeta.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="row text-center my-5 py-4 bg-white rounded shadow-sm">
                        <div className="col-md-3">
                            <h3 className="text-success fw-bold">6+</h3>
                            <p className="text-muted">Años de experiencia</p>
                        </div>
                        <div className="col-md-3">
                            <h3 className="text-success fw-bold">5000+</h3>
                            <p className="text-muted">Familias satisfechas</p>
                        </div>
                        <div className="col-md-3">
                            <h3 className="text-success fw-bold">50+</h3>
                            <p className="text-muted">Productos naturales</p>
                        </div>
                        <div className="col-md-3">
                            <h3 className="text-success fw-bold">10+</h3>
                            <p className="text-muted">Ciudades en Chile</p>
                        </div>
                    </div>

                    {/* Mapa de tiendas */}
                    <h3 id="mapa-tiendas" className="mb-3 mt-5">📍 Nuestras Tiendas</h3>
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

                    {/* Equipo */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <h3 className="mb-4">Nuestro Compromiso</h3>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="card h-100 border-0">
                                        <div className="card-body text-center">
                                            <i className="bi bi-truck text-success fs-1 mb-3"></i>
                                            <h5>Entrega Rápida</h5>
                                            <p>Recibe tus productos frescos en menos de 24 horas en la mayoría de las ciudades.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="card h-100 border-0">
                                        <div className="card-body text-center">
                                            <i className="bi bi-shield-check text-success fs-1 mb-3"></i>
                                            <h5>Calidad Garantizada</h5>
                                            <p>Todos nuestros productos pasan por rigurosos controles de calidad antes de llegar a ti.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub de esta página
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-4 mb-3">
                            <h5>Síguenos</h5>
                            <a href="#" className="text-white me-2 text-decoration-none">
                                <i className="bi bi-facebook"></i> Facebook
                            </a>
                            <br />
                            <a href="#" className="text-white me-2 text-decoration-none">
                                <i className="bi bi-instagram"></i> Instagram
                            </a>
                            <br />
                            <a href="#" className="text-white me-2 text-decoration-none">
                                <i className="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                    <hr className="bg-white mx-5" />
                    <p className="text-center mb-0">&copy; 2025 Huerto Hogar. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default QuienesSomos;