import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
    const [carouselItems] = useState([
        { src: "/Img/Inicio_1.jpg", alt: "Huerto 1" },
        { src: "/Img/Frutaindex2.png", alt: "Huerto 2" },
        { src: "/Img/Frutaindex3.jpeg", alt: "Huerto 3" }
    ]);

    const [testimonios] = useState([
        { 
            nombre: "María González", 
            texto: "Los productos son frescos y de excelente calidad. Siempre llegan a tiempo y en perfectas condiciones.", 
            imagen: "/Img/maria.png" 
        },
        { 
            nombre: "Juan Pérez", 
            texto: "Me encanta la variedad de productos que ofrecen. Todo se siente natural y fresco, justo como lo necesito.", 
            imagen: "/Img/el.png" 
        },
        { 
            nombre: "Ana Torres", 
            texto: "Excelente servicio y atención al cliente. ¡Recomiendo HuertoHogar a todos mis amigos y familiares!", 
            imagen: "/Img/ana.PNG" 
        }
    ]);

    const [ofertas, setOfertas] = useState<any[]>([]);

    // Cargar ofertas 
    useEffect(() => {
        // Esto lo conectaremos después con tu productos.ts
        const ofertasEjemplo = [
            { id: 1, nombre: "Manzanas Orgánicas", precio: 1990, precioOriginal: 2490 },
            { id: 2, nombre: "Lechuga Fresca", precio: 790, precioOriginal: 990 },
            { id: 3, nombre: "Tomates Cherry", precio: 1290, precioOriginal: 1590 }
        ];
        setOfertas(ofertasEjemplo);
    }, []);

    return (
        <div>
            {/* Carrusel */}
            <div id="carouselHuerto" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {carouselItems.map((item, index) => (
                        <div 
                            key={index} 
                            className={`carousel-item ${index === 0 ? 'active' : ''}`} 
                            data-bs-interval="3000"
                        >
                            <img 
                                src={item.src} 
                                className="d-block w-100 vh-100" 
                                alt={item.alt} 
                                style={{ objectFit: 'cover' }}
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

            {/* Contenido Principal */}
            <div className="container py-5">
                <div className="row g-4 align-items-stretch">
                    {/* Consejos del Día */}
                    <div className="col-lg-4 d-flex flex-column">
                        <h2 className="text-center mb-4">🌱 Consejos del Día</h2>
                        <div className="card text-white shadow-sm">
                            <div className="img-cuadrada">
                                <img src="/img/Fondo.jpg" className="card-img" alt="Consejo saludable" />
                                <div className="card-img-overlay d-flex flex-column justify-content-center text-center" 
                                     style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '2px' }}>
                                    <h5 className="card-title fw-bold">Come 5 frutas y verduras al día</h5>
                                    <p className="card-text">
                                        Te aportan vitaminas, minerales y fibra para una vida más saludable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ofertas de la Semana */}
                    <div className="col-lg-8">
                        <h2 className="text-center mb-4">🔥 Ofertas de la Semana</h2>
                        <div id="ofertas-semana" className="row g-4">
                            {ofertas.map(oferta => (
                                <div key={oferta.id} className="col-md-4">
                                    <div className="card h-100 shadow-sm">
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

                {/* Testimonios de Clientes */}
                <div className="container py-5 bg-light mt-5">
                    <h2 className="text-center mb-4">💬 Qué dicen nuestros clientes</h2>
                    <div className="row text-center g-4">
                        {testimonios.map((testimonio, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card h-100 shadow-sm p-3 border-0">
                                    <img 
                                        src={testimonio.imagen} 
                                        className="rounded-circle mx-auto mb-3" 
                                        alt={testimonio.nombre} 
                                        width="120" 
                                        height="120" 
                                        style={{ objectFit: 'cover' }} 
                                    />
                                    <h5 className="fw-bold">{testimonio.nombre}</h5>
                                    <p className="text-muted">"{testimonio.texto}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
                                    <a href="https://github.com/xRaven28/HuertoHogar.git" 
                                       className="text-white text-decoration-none">
                                        GitHub de esta página
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h5>Síguenos</h5>
                            <a href="#" className="text-white me-2">
                                <i className="bi bi-facebook"></i> Facebook
                            </a><br/>
                            <a href="#" className="text-white me-2">
                                <i className="bi bi-instagram"></i> Instagram
                            </a><br/>
                            <a href="#" className="text-white me-2">
                                <i className="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                    <hr className="bg-white mx-5"/>
                    <p className="text-center mb-0">&copy; 2025 Huerto Hogar. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;