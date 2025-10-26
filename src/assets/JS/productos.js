// productos.js - Versión JavaScript funcional
import { carrito, mostrarToast, escapeHtml, escapeAttr, guardarCarritoLocal, actualizarContadores } from './main.js';

// Declarar CATALOGO global
window.CATALOGO = [
    { id: "1", name: "Manzanas Rojas", precio: 990, categoria: "frutas", img: "/Img/Manzana/Manzana_1.png", desc: "Manzanas frescas, crocantes y dulces.", habilitado: true },
    { id: "2", name: "Naranjas", precio: 1500, categoria: "frutas", img: "/Img/Naranja/Naranja_1.png", desc: "Naranjas jugosas llenas de vitamina C.", habilitado: true },
    { id: "3", name: "Frutillas", precio: 1990, categoria: "frutas", img: "/Img/frutilla/Frutilla_4.png", desc: "Frutillas dulces, ideales para postres.", habilitado: true }
];

window.catalogo_local = JSON.parse(localStorage.getItem("catalogo") || "[]") || window.CATALOGO;

export function guardarCatalogo() {
    localStorage.setItem("catalogo", JSON.stringify(window.catalogo_local));
}

export function renderProductosCliente(filtro = "") {
    const contenedor = document.getElementById("productos-container");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const filtrados = window.catalogo_local
        .filter(p => p.habilitado)
        .filter(p =>
            p.name.toLowerCase().includes(filtro.toLowerCase()) ||
            p.categoria.toLowerCase().includes(filtro.toLowerCase())
        )
        .sort((a, b) => Number(a.id) - Number(b.id));

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p class="text-center">No se encontraron productos para "${filtro}"</p>`;
        return;
    }
    
    filtrados.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-xl-3 col-lg-4 col-md-6";
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${p.img}" class="card-img-top producto-img" alt="${p.name}" style="height: 200px; object-fit: cover;"/>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${escapeHtml(p.name)}</h5>
                    <div class="text-muted small mb-2">${p.categoria.toUpperCase()}</div>
                    <p class="card-text flex-grow-1">${escapeHtml(p.desc)}</p>
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <span class="fw-bold text-success">$${p.precio.toLocaleString("es-CL")}</span>
                        <button class="btn btn-success btn-sm btn-cart" 
                            data-id="${p.id}" data-name="${escapeAttr(p.name)}" 
                            data-precio="${p.precio}" data-img="${escapeAttr(p.img)}">
                            <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>`;
        contenedor.appendChild(col);
    });

    // Event listeners para botones de carrito
    contenedor.querySelectorAll(".btn-cart").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.dataset.id;
            const name = this.dataset.name || "";
            const precio = Number(this.dataset.precio || 0);
            const img = this.dataset.img || "";
            
            const existente = carrito.find(p => p.id === id);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ id: id, name, precio, img, cantidad: 1 });
            }
            
            guardarCarritoLocal();
            actualizarContadores();
            mostrarToast(`"${name}" añadido al carrito`);
        });
    });
}

export function inicializarProductos() {
    console.log('🛍️ Inicializando módulo de productos...');
    renderProductosCliente();
}