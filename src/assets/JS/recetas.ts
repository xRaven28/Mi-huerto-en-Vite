import { Receta } from '@/types/index';

export function inicializarRecetas(): void {
  document.addEventListener("DOMContentLoaded", function () {
    const recetas: Receta[] = [
      {
        titulo: "Aros de cebolla",
        imagen: "img/ArosDeCebolla.webp",
        descripcion: "Crujientes y dorados, perfectos como aperitivo.",
        ingredientes: [
          "2 cebollas grandes",
          "150 g de harina",
          "2 huevos",
          "100 ml de leche",
          "100 g de pan rallado",
          "Aceite para freír",
          "Sal y pimienta"
        ],
        preparacion: `Corte las cebollas en rodajas y separe los aros.
Pase cada aro por harina, luego por huevo batido con la leche y finalmente por pan rallado.
Fría en aceite caliente hasta que estén dorados.
Escúrralos sobre papel absorbente y sirva de inmediato.`
      },
      {
        titulo: "Batido de frutilla",
        imagen: "img/BatidoFrutilla.webp",
        descripcion: "Fresco y dulce, ideal para el verano.",
        ingredientes: [
          "250 g de frutillas frescas",
          "300 ml de leche",
          "3 cucharadas de azúcar",
          "4 cubos de hielo"
        ],
        preparacion: `Lave bien las frutillas y quite el tallo.
Licúelas junto con la leche, azúcar y hielo.
Sirva frío en vasos altos.`
      }
      // Agrega aquí el resto de tus recetas...
    ];

    // Generar tarjetas 
    const contenedor = document.getElementById("recetas-container");
    if (!contenedor) return;

    recetas.forEach(receta => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="recipe-card">
          <div class="recipe-card-inner">
            <!-- Frente -->
            <div class="recipe-card-front card h-100 d-flex flex-column">
              <img src="${receta.imagen}" class="card-img-top" alt="${receta.titulo}">
              <div class="card-body flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                  <h5 class="card-title">${receta.titulo}</h5>
                  <p class="card-text small text-muted">${receta.descripcion}</p>
                </div>
                <button class="btn btn-success flip-btn mt-3">Ver receta</button>
              </div>
            </div>

            <!-- Reverso -->
            <div class="recipe-card-back card h-100">
              <div class="card-body">
                <h5 class="card-title">Ingredientes</h5>
                <ul class="small">
                  ${receta.ingredientes.map(i => `<li>${i}</li>`).join("")}
                </ul>
                <h5 class="card-title mt-3">Preparación</h5>
                <p class="small">${receta.preparacion}</p>
                <button class="btn btn-secondary flip-btn mt-2">Volver</button>
              </div>
            </div>
          </div>
        </div>
      `;

      contenedor.appendChild(col);
    });

    // Event listeners para los botones flip
    document.querySelectorAll('.flip-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = (this as HTMLElement).closest('.recipe-card');
        if (card) card.classList.toggle('flipped');
      });
    });
  });
}