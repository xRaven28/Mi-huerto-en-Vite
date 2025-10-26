// main.js - Versión JavaScript
export let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

// Helpers
export function escapeHtml(str = "") {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeAttr(str = "") {
    return String(str).replace(/"/g, "&quot;");
}

export function mostrarToast(msg, color = "#28a745") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 600;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = color;
    toast.style.display = "block";
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

export function guardarCarritoLocal() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function actualizarContadores() {
    const contador = document.getElementById("carrito-count");
    if (contador) {
        const total = carrito.reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);
        contador.textContent = total.toString();
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
    console.log('✅ HuertoHogar inicializado');
    actualizarContadores();
});