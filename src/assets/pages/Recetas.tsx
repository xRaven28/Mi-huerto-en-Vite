import React, { useState, useEffect } from 'react';

interface Receta {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    tiempoPreparacion: string;
    dificultad: 'Fácil' | 'Media' | 'Difícil';
    categoria: string;
    ingredientes: string[];
    instrucciones: string[];
    destacada?: boolean;
}

const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [busqueda, setBusqueda] = useState('');

    // Datos de ejemplo para recetas
    const recetasEjemplo: Receta[] = [
        {
            id: 1,
            titulo: "Ensalada César con Pollo a la Parrilla",
            descripcion: "Una clásica ensalada César con crujientes lechugas, pollo a la parrilla y nuestro aderezo casero.",
            imagen: "/img/recetas/ensalada-cesar.jpg",
            tiempoPreparacion: "25 min",
            dificultad: "Fácil",
            categoria: "ensaladas",
            destacada: true,
            ingredientes: [
                "1 pechuga de pollo",
                "2 lechugas romanas frescas",
                "1 taza de crutones",
                "50g de queso parmesano",
                "3 cucharadas de aceite de oliva",
                "Jugo de 1 limón",
                "2 anchoas",
                "1 diente de ajo"
            ],
            instrucciones: [
                "Cocinar el pollo a la parrilla hasta que esté dorado por ambos lados.",
                "Lavar y cortar las lechugas en trozos medianos.",
                "Preparar el aderezo mezclando aceite, limón, ajo y anchoas.",
                "Cortar el pollo en tiras y mezclar con la lechuga.",
                "Agregar crutones y queso parmesano rallado.",
                "Servir inmediatamente con el aderezo César."
            ]
        },
        {
            id: 2,
            titulo: "Sopa de Verduras de la Huerta",
            descripcion: "Sopa nutritiva cargada de verduras frescas de temporada, perfecta para días fríos.",
            imagen: "/img/recetas/sopa-verduras.jpg",
            tiempoPreparacion: "40 min",
            dificultad: "Fácil",
            categoria: "sopas",
            ingredientes: [
                "2 zanahorias medianas",
                "1 calabacín",
                "2 papas",
                "1 cebolla",
                "2 dientes de ajo",
                "1 litro de caldo de verduras",
                "Sal y pimienta al gusto",
                "Aceite de oliva"
            ],
            instrucciones: [
                "Picar todas las verduras en cubos pequeños.",
                "Sofreír la cebolla y el ajo en aceite de oliva.",
                "Agregar las zanahorias y papas, cocinar 5 minutos.",
                "Incorporar el caldo y cocinar 20 minutos.",
                "Añadir el calabacín y cocinar 10 minutos más.",
                "Sazonar con sal y pimienta al gusto.",
                "Servir caliente con perejil fresco."
            ]
        },
        {
            id: 3,
            titulo: "Wok de Verduras con Tofu",
            descripcion: "Salteado asiático lleno de color y nutrientes, perfecto para una cena ligera y saludable.",
            imagen: "/img/recetas/wok-verduras.jpg",
            tiempoPreparacion: "20 min",
            dificultad: "Media",
            categoria: "principales",
            ingredientes: [
                "200g de tofu firme",
                "1 pimiento rojo",
                "1 pimiento amarillo",
                "1 zanahoria",
                "100g de brotes de soja",
                "2 cucharadas de salsa de soja",
                "1 cucharada de jengibre rallado",
                "2 dientes de ajo"
            ],
            instrucciones: [
                "Cortar el tofu en cubos y dorar en un wok con aceite.",
                "Retirar el tofu y reservar.",
                "Saltear el ajo y jengibre por 1 minuto.",
                "Agregar las verduras cortadas en tiras.",
                "Cocinar a fuego alto por 5 minutos.",
                "Incorporar el tofu y la salsa de soja.",
                "Servir inmediatamente con arroz integral."
            ]
        },
        {
            id: 4,
            titulo: "Batido Energético Verde",
            descripcion: "Batido revitalizante lleno de vitaminas y antioxidantes para empezar el día con energía.",
            imagen: "/img/recetas/batido-verde.jpg",
            tiempoPreparacion: "5 min",
            dificultad: "Fácil",
            categoria: "bebidas",
            ingredientes: [
                "1 plátano maduro",
                "1 taza de espinacas frescas",
                "1/2 pepino",
                "1 cucharada de semillas de chía",
                "200ml de agua de coco",
                "Jugo de 1/2 limón",
                "1 cucharadita de miel"
            ],
            instrucciones: [
                "Lavar bien las espinacas y el pepino.",
                "Pelar el plátano y cortar el pepino en trozos.",
                "Colocar todos los ingredientes en la licuadora.",
                "Licuar hasta obtener una textura suave.",
                "Servir inmediatamente con hielo."
            ]
        },
        {
            id: 5,
            titulo: "Hummus de Remolacha",
            descripcion: "Una versión colorida y nutritiva del clásico hummus, perfecta como dip o untable.",
            imagen: "/img/recetas/hummus-remolacha.jpg",
            tiempoPreparacion: "15 min",
            dificultad: "Fácil",
            categoria: "aperitivos",
            ingredientes: [
                "1 remolacha cocida",
                "400g de garbanzos cocidos",
                "2 cucharadas de tahini",
                "Jugo de 1 limón",
                "1 diente de ajo",
                "3 cucharadas de aceite de oliva",
                "Comino y sal al gusto"
            ],
            instrucciones: [
                "Pelar y cortar la remolacha en trozos.",
                "En una procesadora, mezclar todos los ingredientes.",
                "Procesar hasta obtener una pasta suave.",
                "Ajustar condimentos al gusto.",
                "Servir con aceite de oliva y pan pita."
            ]
        },
        {
            id: 6,
            titulo: "Ensalada de Quinoa con Aguacate",
            descripcion: "Ensalada completa y nutritiva con quinoa, aguacate y verduras frescas.",
            imagen: "/img/recetas/ensalada-quinoa.jpg",
            tiempoPreparacion: "30 min",
            dificultad: "Fácil",
            categoria: "ensaladas",
            ingredientes: [
                "1 taza de quinoa",
                "1 aguacate maduro",
                "1 pepino",
                "1 tomate",
                "1/4 de cebolla morada",
                "Jugo de 2 limones",
                "Aceite de oliva",
                "Cilantro fresco"
            ],
            instrucciones: [
                "Cocinar la quinoa según instrucciones del paquete.",
                "Cortar todas las verduras en cubos pequeños.",
                "Mezclar la quinoa fría con las verduras.",
                "Preparar el aderezo con limón y aceite.",
                "Incorporar el aguacate en el momento de servir.",
                "Decorar con cilantro fresco."
            ]
        }
    ];

    useEffect(() => {
        // Simular carga de datos
        setRecetas(recetasEjemplo);
    }, []);

    const categorias = [
        { id: 'todas', nombre: 'Todas las Recetas' },
        { id: 'ensaladas', nombre: 'Ensaladas' },
        { id: 'sopas', nombre: 'Sopas' },
        { id: 'principales', nombre: 'Platos Principales' },
        { id: 'aperitivos', nombre: 'Aperitivos' },
        { id: 'bebidas', nombre: 'Bebidas' }
    ];

    const recetasFiltradas = recetas.filter(receta => {
        const coincideCategoria = filtroCategoria === 'todas' || receta.categoria === filtroCategoria;
        const coincideBusqueda = receta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                               receta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    const abrirModalReceta = (receta: Receta) => {
        setRecetaSeleccionada(receta);
    };

    const cerrarModalReceta = () => {
        setRecetaSeleccionada(null);
    };

    return (
        <div>
            <main style={{ marginTop: '80px' }}>
                {/* Header */}
                <div className="container py-5">
                    <h1 className="text-center display-4 fw-bold text-success">🍳 Recetas Saludables</h1>
                    <p className="text-center lead mt-3">
                        Descubre deliciosas recetas saludables que puedes preparar con los productos frescos de HuertoHogar.<br />
                        Desde ensaladas vibrantes hasta platos principales nutritivos, nuestras recetas están diseñadas para inspirarte a cocinar comidas sabrosas y equilibradas en casa.<br /> 
                        ¡Explora, prueba y disfruta de la cocina saludable con nosotros!
                    </p>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="container mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="🔍 Buscar recetas..."
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <select
                                                className="form-select"
                                                value={filtroCategoria}
                                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                            >
                                                {categorias.map(categoria => (
                                                    <option key={categoria.id} value={categoria.id}>
                                                        {categoria.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recetas Destacadas */}
                {recetasFiltradas.filter(r => r.destacada).length > 0 && (
                    <div className="container mb-5">
                        <h2 className="text-center mb-4">⭐ Recetas Destacadas</h2>
                        <div className="row">
                            {recetasFiltradas.filter(r => r.destacada).map(receta => (
                                <div key={receta.id} className="col-lg-6 mb-4">
                                    <div className="card h-100 shadow-lg border-0">
                                        <img 
                                            src={receta.imagen} 
                                            className="card-img-top" 
                                            alt={receta.titulo}
                                            style={{ height: '250px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
                                            }}
                                        />
                                        <div className="card-body">
                                            <span className={`badge ${receta.dificultad === 'Fácil' ? 'bg-success' : receta.dificultad === 'Media' ? 'bg-warning' : 'bg-danger'} mb-2`}>
                                                {receta.dificultad}
                                            </span>
                                            <span className="badge bg-secondary ms-2">
                                                ⏱️ {receta.tiempoPreparacion}
                                            </span>
                                            <h5 className="card-title mt-2">{receta.titulo}</h5>
                                            <p className="card-text">{receta.descripcion}</p>
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => abrirModalReceta(receta)}
                                            >
                                                Ver Receta Completa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Todas las Recetas */}
                <div className="container my-5">
                    <h2 className="text-center mb-4">📚 Todas Nuestras Recetas</h2>
                    <div className="row">
                        {recetasFiltradas.map(receta => (
                            <div key={receta.id} className="col-xl-4 col-lg-6 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={receta.imagen} 
                                        className="card-img-top" 
                                        alt={receta.titulo}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
                                        }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-2">
                                            <span className={`badge ${receta.dificultad === 'Fácil' ? 'bg-success' : receta.dificultad === 'Media' ? 'bg-warning' : 'bg-danger'}`}>
                                                {receta.dificultad}
                                            </span>
                                            <span className="badge bg-secondary ms-1">
                                                ⏱️ {receta.tiempoPreparacion}
                                            </span>
                                        </div>
                                        <h5 className="card-title">{receta.titulo}</h5>
                                        <p className="card-text flex-grow-1">{receta.descripcion}</p>
                                        <button 
                                            className="btn btn-outline-success mt-auto"
                                            onClick={() => abrirModalReceta(receta)}
                                        >
                                            Ver Receta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {recetasFiltradas.length === 0 && (
                        <div className="text-center py-5">
                            <div className="alert alert-info">
                                <i className="bi bi-search fs-1 d-block mb-3"></i>
                                <h4>No se encontraron recetas</h4>
                                <p>Intenta con otros términos de búsqueda o cambia la categoría</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Receta */}
            {recetaSeleccionada && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{recetaSeleccionada.titulo}</h5>
                                <button type="button" className="btn-close" onClick={cerrarModalReceta}></button>
                            </div>
                            <div className="modal-body">
                                <img 
                                    src={recetaSeleccionada.imagen} 
                                    className="img-fluid rounded mb-3" 
                                    alt={recetaSeleccionada.titulo}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
                                    }}
                                />
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>⏱️ Tiempo:</strong> {recetaSeleccionada.tiempoPreparacion}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>📊 Dificultad:</strong> {recetaSeleccionada.dificultad}
                                    </div>
                                </div>

                                <h6>🥕 Ingredientes:</h6>
                                <ul>
                                    {recetaSeleccionada.ingredientes.map((ingrediente, index) => (
                                        <li key={index}>{ingrediente}</li>
                                    ))}
                                </ul>

                                <h6>👩‍🍳 Instrucciones:</h6>
                                <ol>
                                    {recetaSeleccionada.instrucciones.map((instruccion, index) => (
                                        <li key={index}>{instruccion}</li>
                                    ))}
                                </ol>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cerrarModalReceta}>
                                    Cerrar
                                </button>
                                <button type="button" className="btn btn-success">
                                    <i className="bi bi-printer me-2"></i>
                                    Imprimir Receta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer-custom text-white pt-4 pb-2 mt-5">
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

export default Recetas;