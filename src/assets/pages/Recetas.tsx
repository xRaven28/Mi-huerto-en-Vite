import React, { useState, useEffect } from "react";

interface Receta {
    titulo: string;
    imagen: string;
    descripcion: string;
    ingredientes: string[];
    preparacion: string;
}

const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(
        null
    );
    useEffect(() => {
        const recetasEjemplo: Receta[] = [
            {
                titulo: "Aros de cebolla",
                imagen: "/Img/ArosDeCebolla.webp",
                descripcion: "Crujientes y dorados, perfectos como aperitivo.",
                ingredientes: [
                    "2 cebollas grandes",
                    "150 g de harina",
                    "2 huevos",
                    "100 ml de leche",
                    "100 g de pan rallado",
                    "Aceite para freír",
                    "Sal y pimienta",
                ],
                preparacion: `Corte las cebollas en rodajas y separe los aros.
Pase cada aro por harina, luego por huevo batido con la leche y finalmente por pan rallado.
Fría en aceite caliente hasta que estén dorados.
Escúrralos sobre papel absorbente y sirva de inmediato.`,
            },
            {
                titulo: "Batido de frutilla",
                imagen: "/Img/BatidoFrutilla.webp",
                descripcion: "Fresco y dulce, ideal para el verano.",
                ingredientes: [
                    "250 g de frutillas frescas",
                    "300 ml de leche",
                    "3 cucharadas de azúcar",
                    "4 cubos de hielo",
                ],
                preparacion: `Lave bien las frutillas y quite el tallo.
Licúelas junto con la leche, azúcar y hielo.
Sirva frío en vasos altos.`,
            },
            {
                titulo: "Calabaza rellena",
                imagen: "Img/CalabazaRellena.jpeg",
                descripcion: "Calabaza horneada con un delicioso relleno de carne, arroz y queso.",
                ingredientes: [
                    "1 calabaza mediana",
                    "200 g de carne molida",
                    "½ cebolla picada fina",
                    "½ pimiento rojo picado",
                    "100 g de arroz cocido",
                    "50 g de queso rallado",
                    "2 cucharadas de aceite",
                    "Sal y pimienta"
                ],
                preparacion: `Corte la parte superior de la calabaza y retire las semillas.
En un sartén, sofría la cebolla y el pimiento en aceite, luego agregue la carne y condimente.
Mezcle con el arroz cocido y rellene la calabaza.
Espolvoree con queso y hornee a 180 °C por 40 minutos.`
            },
            {
                titulo: "Jugo de beterraga",
                imagen: "Img/JugoBeterraga.PNG",
                descripcion: "Refrescante y saludable, perfecto para cualquier hora.",
                ingredientes: [
                    "2 beterragas medianas",
                    "2 zanahorias",
                    "1 manzana verde",
                    "250 ml de agua"
                ],
                preparacion: `Pele las beterragas y zanahorias.
Pique todo en trozos y licúe con el agua.
Cuele si lo prefiere más suave.
Sirva bien frío.`
            },
            {
                titulo: "Kuchen de manzana",
                imagen: "Img/kuchenManzana.JPG",
                descripcion: "Dulce y aromático, ideal para la merienda.",
                ingredientes: [
                    "200 g de harina",
                    "100 g de azúcar",
                    "125 g de mantequilla",
                    "2 huevos",
                    "3 manzanas",
                    "1 cucharadita de polvos de hornear",
                    "1 cucharadita de canela"
                ],
                preparacion: `Forme una masa mezclando harina, polvos de hornear, azúcar, mantequilla y huevos.
Extienda en un molde enmantequillado.
Disponga las manzanas en láminas sobre la masa.
Espolvoree con azúcar y canela.
Hornee a 180 °C durante 35 minutos.`
            },
            {
                titulo: "Palta reina",
                imagen: "Img/PaltaReina.jpg",
                descripcion: "Deliciosa ensalada servida dentro de la palta.",
                ingredientes: [
                    "2 paltas maduras",
                    "1 pechuga de pollo cocida y desmenuzada",
                    "3 cucharadas de mayonesa",
                    "1 huevo duro picado",
                    "Sal y pimienta"
                ],
                preparacion: `Corte las paltas por la mitad y retire el carozo.
En un bol, mezcle pollo, mayonesa y huevo duro.
Rellene las mitades de palta.
Sirva frío.`
            },
            {
                titulo: "Pie de limón",
                imagen: "Img/PieDeLimón.JPG",
                descripcion: "Clásico pie con base de galleta y merengue dorado.",
                ingredientes: [
                    "150 g de galletas molidas",
                    "80 g de mantequilla derretida",
                    "1 tarro de leche condensada (400 g aprox.)",
                    "3 yemas de huevo",
                    "100 ml de jugo de limón",
                    "3 claras de huevo",
                    "4 cucharadas de azúcar"
                ],
                preparacion: `Mezcle las galletas con la mantequilla y forme la base en un molde.
Combine las yemas con la leche condensada y el jugo de limón.
Vierta sobre la base.
Bata las claras a nieve con el azúcar y cubra con el merengue.
Hornee a 180 °C por 10 minutos hasta dorar.`
            },
            {
                titulo: "Puré de papas",
                imagen: "Img/PuréDePapas.jpg",
                descripcion: "Suave y cremoso, ideal como acompañamiento.",
                ingredientes: [
                    "1 kg de papas",
                    "50 g de mantequilla",
                    "150 ml de leche caliente",
                    "Sal a gusto"
                ],
                preparacion: `Pele y cueza las papas en agua con sal.
Escúrralas y muélalas calientes.
Agregue la mantequilla y la leche caliente.
Mezcle hasta obtener un puré cremoso.`
            },
            {
                titulo: "Queque de naranja",
                imagen: "Img/QuequeDeNaranja.jpg",
                descripcion: "Esponjoso y aromático, con un toque cítrico.",
                ingredientes: [
                    "250 g de harina",
                    "180 g de azúcar",
                    "3 huevos",
                    "100 ml de aceite",
                    "100 ml de jugo de naranja",
                    "Ralladura de 1 naranja",
                    "1 cucharadita de polvos de hornear"
                ],
                preparacion: `Bata los huevos con el azúcar hasta espumar.
Agregue el aceite, jugo y ralladura de naranja.
Incorpore la harina con los polvos de hornear.
Vierta en un molde enmantequillado.
Hornee a 180 °C por 35 minutos.`
            },
            {
                titulo: "Torta de cereza",
                imagen: "Img/TortaDeCereza.webp",
                descripcion: "Deliciosa torta con cerezas y opcional crema batida.",
                ingredientes: [
                    "250 g de harina",
                    "200 g de azucar",
                    "3 huevos",
                    "100 g de mantequilla",
                    "150 ml de leche",
                    "1 cucharadita de polvos de hornear",
                    "200 g de cerezas deshuesadas",
                    "Crema batida (opcional para decorar)"
                ],
                preparacion: `Bata la mantequilla con el azúcar hasta cremar.
Agregue los huevos de a uno, luego la leche.
Incorpore la harina con los polvos de hornear.
Añada las cerezas y mezcle suavemente.
Hornee a 180 °C por 40 minutos.
Decore con crema batida si lo desea.`
            },
            {
                titulo: "Postre árabe de granada",
                imagen: "Img/PostreÁrabe.JPG",
                descripcion: "Un postre árabe fresco y delicioso con crema blanca, granada y un toque de hierbabuena.",
                ingredientes: [
                    "500 ml de leche",
                    "2 cucharadas de maicena",
                    "1 cucharada de azúcar",
                    "100 g de chocolate blanco",
                    "1 sobre de azúcar vainillado",
                    "5 bizcochitos de huevo (o 2 cucharadas de semillas de granada por vaso)",
                    "5 granadas grandes",
                    "1 sobre de flan de fresa en polvo",
                    "Azúcar al gusto",
                    "Hojas de hierbabuena (para decorar)"
                ],
                preparacion: `En una cacerola, mezcle la leche, la maicena, el azúcar y el azúcar vainillado.
Cocine a fuego medio sin dejar de remover hasta obtener una crema espesa.
Retire del fuego, agregue el chocolate blanco y mezcle hasta que se derrita.
Coloque un bizcochito troceado en cada vaso y vierta encima la crema blanca.
Deje enfriar a temperatura ambiente y luego refrigere.`
            },
            {
                titulo: "Tomates rellenos",
                imagen: "Img/TomateRelleno.webp",
                descripcion: "Tomates frescos rellenos con atún, lechuga y mayonesa, ideales como entrada.",
                ingredientes: [
                    "4 tomates grandes",
                    "1 lata de atún escurrido",
                    "1 taza de lechuga picada fina",
                    "3 cucharadas de mayonesa",
                    "1 huevo duro picado (opcional)",
                    "Sal y pimienta a gusto"
                ],
                preparacion: `Lave los tomates, corte la parte superior y ahuéquelos con una cuchara.
Mezcle el atún con la lechuga, mayonesa y huevo duro. Sazone con sal y pimienta.
Rellene los tomates con la mezcla y refrigere 15 minutos antes de servir.`
            },
            {
                titulo: "Zapallo italiano relleno",
                imagen: "Img/ZapalloRelleno.PNG",
                descripcion: "Zapallos italianos horneados con un delicioso relleno de carne y verduras.",
                ingredientes: [
                    "3 zapallos italianos medianos",
                    "200 g de carne molida",
                    "1 cebolla picada fina",
                    "1 diente de ajo picado",
                    "1 zanahoria rallada",
                    "½ taza de pan rallado",
                    "2 cucharadas de queso rallado",
                    "1 huevo",
                    "Aceite, sal, pimienta y orégano"
                ],
                preparacion: `Corte los zapallos italianos a lo largo y ahuéquelos. Reserve la pulpa.
Sofría la cebolla, ajo, pulpa de zapallo y zanahoria. Agregue la carne molida y cocine 5 min.
Retire del fuego, mezcle con pan rallado, huevo, queso y condimentos.
Rellene los zapallos, dispóngalos en una bandeja y hornee a 180 °C por 20-25 min.`
            },
            {
                titulo: "Tortilla de coliflor",
                imagen: "Img/TortillaColiflor.jpg",
                descripcion: "Una tortilla ligera y saludable a base de coliflor.",
                ingredientes: [
                    "1 coliflor pequeña",
                    "4 huevos",
                    "1 cebolla pequeña",
                    "2 cucharadas de queso rallado",
                    "2 cucharadas de aceite de oliva",
                    "Sal y pimienta"
                ],
                preparacion: `Cueza la coliflor en agua con sal hasta que esté blanda. Escurra bien.
Pique la coliflor y la cebolla en trozos pequeños.
En un bol bata los huevos, agregue la coliflor, cebolla, queso y condimentos.
Caliente aceite en sartén, vierta la mezcla y cocine a fuego medio por ambos lados hasta dorar.`
            },
            {
                titulo: "Pastel de choclo",
                imagen: "Img/PastelChoclo.webp",
                descripcion: "Tradicional pastel de choclo chileno con carne, pollo y una capa de maíz.",
                ingredientes: [
                    "1 kg de choclo desgranado",
                    "1 taza de leche",
                    "2 cucharadas de mantequilla",
                    "1 cebolla grande picada",
                    "300 g de carne molida",
                    "2 presas de pollo cocido y desmenuzado",
                    "3 huevos duros",
                    "Aceitunas y pasas a gusto",
                    "Sal, pimienta, comino y albahaca"
                ],
                preparacion: `Muele el choclo y cocine con leche y mantequilla hasta formar una pasta espesa. Agregue sal y albahaca.
Sofría la cebolla y carne molida con comino, sal y pimienta.
En una fuente para horno coloque la carne, luego el pollo, aceitunas, pasas y huevo duro.
Cubra con la pasta de choclo y espolvoree azúcar por encima.
Hornee a 180 °C hasta dorar la superficie.`
            },
            {
                titulo: "Alcachofas al horno",
                imagen: "Img/AlcachofaAlHorno.webp",
                descripcion: "Alcachofas tiernas rellenas con pan rallado, ajo y queso al horno.",
                ingredientes: [
                    "4 alcachofas grandes",
                    "3 cucharadas de pan rallado",
                    "2 cucharadas de queso parmesano rallado",
                    "2 dientes de ajo picados",
                    "3 cucharadas de aceite de oliva",
                    "Sal, pimienta y perejil picado"
                ],
                preparacion: `Lave las alcachofas, quite las hojas duras exteriores y corte las puntas.
Mezcle pan rallado, queso, ajo, perejil, sal y pimienta.
Abra las hojas de las alcachofas y rellene con la mezcla.
Coloque en bandeja, rocíe con aceite y hornee a 180 °C por 35-40 min.`
            },
            {
                titulo: "Lasaña de berenjenas",
                imagen: "Img/LasanaBerenjena.webp",
                descripcion: "Lasaña ligera hecha con capas de berenjena, salsa de tomate y queso.",
                ingredientes: [
                    "3 berenjenas grandes",
                    "400 g de salsa de tomate",
                    "200 g de carne molida o pollo (opcional)",
                    "200 g de queso mozzarella",
                    "50 g de queso parmesano",
                    "1 cebolla picada",
                    "Aceite, sal, pimienta y orégano"
                ],
                preparacion: `Corte las berenjenas en láminas, sáquelas en agua con sal 15 min y luego séquelas.
Dórelas en sartén con un poco de aceite.
Prepare un sofrito con cebolla, salsa de tomate y carne (si desea).
En una fuente alterne capas de berenjena, salsa y queso.
Termine con queso mozzarella y parmesano. Hornee a 180 °C por 30 min.`
            },
            {
                titulo: "Desayuno saludable",
                imagen: "Img/YogurtAvenaFrutilla.jpg",
                descripcion: "Yogurt natural con avena y frutillas, nutritivo y fresco para empezar el día.",
                ingredientes: [
                    "1 taza de yogurt natural o griego",
                    "½ taza de avena",
                    "1 taza de frutillas frescas en trozos",
                    "1 cucharadita de miel (opcional)",
                    "Semillas de chía o frutos secos (opcional)"
                ],
                preparacion: `Coloque en un vaso o bowl una capa de yogurt.
Agregue encima una capa de avena y luego frutillas.
Repita hasta completar el recipiente.
Endulce con miel y decore con semillas o frutos secos.`
            }
        ];

        setRecetas(recetasEjemplo);
    }, []);

    const toggleReceta = (receta: Receta) => {
        setRecetaSeleccionada(receta);
    };

    const cerrarModal = () => setRecetaSeleccionada(null);

    return (
        <main style={{ marginTop: "80px" }}>
            {/* Encabezado */}
            <section className="container py-5 text-center">
                <h1 className="text-center mb-4 fw-bold display-5">Recetas Caseras</h1>
                <p className="text-muted fs-5">
                    Descubre deliciosas recetas saludables que puedes preparar con los productos frescos de HuertoHogar.
                    Desde ensaladas vibrantes hasta platos principales nutritivos, nuestras recetas están diseñadas para inspirarte a cocinar comidas sabrosas y equilibradas en casa.
                    ¡Explora, prueba y disfruta de la cocina saludable con nosotros!
                </p>
            </section>

            {/* Tarjetas de recetas */}
            <section className="container mb-5">
                <div className="recetas-grid">
                    {recetas.map((receta, i) => (
                        <div key={i} className="recipe-card card shadow-lg border-0">
                            <img
                                src={receta.imagen}
                                alt={receta.titulo}
                                className="card-img-top"
                                onError={(e) =>
                                    ((e.target as HTMLImageElement).src = "/img/placeholder.jpg")
                                }
                            />

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title fw-bold text-success text-center">
                                    {receta.titulo}
                                </h5>
                                <p className="text-muted flex-grow-1 text-center">
                                    {receta.descripcion}
                                </p>
                                <button
                                    className="btn btn-success mt-auto"
                                    onClick={() => toggleReceta(receta)}
                                >
                                    Ver Receta
                                </button>
                            </div>
                        </div>
                    ))}

                    {recetas.length === 0 && (
                        <div className="text-center py-5">
                            <div className="alert alert-info">
                                <i className="bi bi-hourglass-split fs-3"></i>
                                <h4 className="mt-2">Cargando recetas...</h4>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de receta */}
            {
                recetaSeleccionada && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    >
                        <div className="modal-dialog modal-md modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header  border-0">
                                    <h5 className="modal-title fw-bold text-success">
                                        {recetaSeleccionada.titulo}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={cerrarModal}
                                    ></button>
                                </div>
                                <div className="modal-body text-center px-4">
                                    <div className="img-container mb-3">
                                        <img
                                            src={recetaSeleccionada.imagen}
                                            alt={recetaSeleccionada.titulo}
                                            className="img-fluid rounded mb-3"
                                        />
                                    </div>
                                    <h6 className="fw-bold text-success mb-2">Ingredientes</h6>
                                    <ul className="text-start small">
                                        {recetaSeleccionada.ingredientes.map((ing, idx) => (
                                            <li key={idx}>{ing}</li>
                                        ))}
                                    </ul>

                                    <h6 className="fw-bold text-success mt-3">Preparación</h6>
                                    <p className="text-start small"
                                        style={{ whiteSpace: "pre-line" }}>
                                        {recetaSeleccionada.preparacion}
                                    </p>
                                </div>
                                <div className="modal-footer border-0 justify-content-between">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => window.print()}
                                    >
                                        <i className="bi bi-printer me-2"></i> Imprimir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

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
                            <a href="#" className="text-white d-block">
                                <i className="bi bi-facebook"></i> Facebook
                            </a>
                            <a href="#" className="text-white d-block">
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
        </main >
    );
};

export default Recetas;
