export function inicializarDatos(): void {
    // Inicializar catálogo si no existe
    if (!localStorage.getItem('catalogo')) {
        const catalogoEjemplo = [
            {
                id: "1",
                name: "Manzanas Rojas",
                precio: 990,
                categoria: "frutas",
                img: "img/Manzana/Manzana_1.png",
                desc: "Manzanas frescas, crocantes y dulces.",
                compania: "Chilexpress",
                habilitado: true
            },
            {
                id: "2", 
                name: "Naranjas",
                precio: 1500,
                categoria: "frutas", 
                img: "img/Naranja/Naranja_1.png",
                desc: "Naranjas jugosas llenas de vitamina C.",
                compania: "Starken",
                habilitado: true
            }
        ];
        localStorage.setItem('catalogo', JSON.stringify(catalogoEjemplo));
    }

    // Inicializar otros datos si no existen
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', '[]');
    }
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', '[]');
    }
    if (!localStorage.getItem('historialCompras')) {
        localStorage.setItem('historialCompras', '[]');
    }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', inicializarDatos);