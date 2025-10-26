import { Producto, Usuario, ProductoCarrito, Compra } from '@/types/index';

// Variables globales con tipos
export let carrito: ProductoCarrito[] = JSON.parse(localStorage.getItem("carrito") || "[]");
export let catalogo_local: Producto[] = JSON.parse(localStorage.getItem("catalogo") || "[]");
export let usuarios: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
export let USUARIOS: Usuario[] = JSON.parse(localStorage.getItem("USUARIOS") || "[]");
export let historial: string[] = JSON.parse(localStorage.getItem("historialUsuarios") || "[]");
export let compras: Compra[] = JSON.parse(localStorage.getItem("compras") || "[]");

// Helpers
export function escapeHtml(str: string = ""): string {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeAttr(str: string = ""): string {
  return String(str).replace(/"/g, "&quot;");
}

export function mostrarToast(msg: string, color: string = "#51af13ff"): void {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed;
      right: 20px;
      bottom: 20px;
      padding: 10px 14px;
      border-radius: 8px;
      color: #fff;
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
  clearTimeout((toast as any)._hideTimer);
  (toast as any)._hideTimer = setTimeout(() => {
    if (toast) toast.style.display = "none";
  }, 3000);
}

// RUT functions
export function normalizeRut(rut: string = ""): string {
  return String(rut || "").replace(/[^\dkK]/g, "").toUpperCase();
}

export function sameRut(a: string = "", b: string = ""): boolean {
  return normalizeRut(a) === normalizeRut(b);
}

export function formatearRUT(rut: string): string {
  rut = normalizeRut(rut);
  if (!rut) return "";
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);
  const cuerpoPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpoPuntos}-${dv}`;
}

// Local Storage Helpers
export function guardarCarritoLocal(): void {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function guardarUsuariosLocales(): void {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("USUARIOS", JSON.stringify(USUARIOS));
}

export function guardarHistorial(evento: string): void {
  historial.push(`${new Date().toLocaleString()}: ${evento}`);
  localStorage.setItem("historialUsuarios", JSON.stringify(historial));
}

export function guardarComprasGlobal(): void {
  localStorage.setItem("compras", JSON.stringify(compras));
}

// Modal de confirmación CORREGIDO
export function pedirConfirmacionAccion(callback: () => void): void {
  const modalEl = document.getElementById("modalConfirmacion");
  if (!modalEl) {
    if (confirm("Ingresa la contraseña del admin para confirmar (fallback)")) callback();
    return;
  }
  
  const inputPass = modalEl.querySelector("#confirm-pass") as HTMLInputElement;
  const alerta = modalEl.querySelector("#confirm-alert") as HTMLElement;
  const btnConfirmar = modalEl.querySelector("#btnConfirmarAccion") as HTMLButtonElement;

  if (!inputPass || !alerta || !btnConfirmar) return;

  inputPass.value = "";
  alerta.classList.add("d-none");
  
  const modal = new (window as any).bootstrap.Modal(modalEl);
  modal.show();

  const confirmar = (): void => {
    if (inputPass.value === "1234") {
      modal.hide();
      btnConfirmar.removeEventListener("click", confirmar);
      callback();
    } else {
      alerta.classList.remove("d-none");
    }
  };

  btnConfirmar.addEventListener("click", confirmar);
}

// Inicialización principal
export function inicializarMain(): void {
  document.addEventListener("DOMContentLoaded", () => {
    // Refrescar desde storage
    usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    USUARIOS = JSON.parse(localStorage.getItem("USUARIOS") || "[]");
    historial = JSON.parse(localStorage.getItem("historialUsuarios") || "[]");
    compras = JSON.parse(localStorage.getItem("compras") || "[]");
    carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    // UI - Login
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || sessionStorage.getItem("usuarioActual") || "null");
    if (usuarioActual && usuarioActual !== "null") {
      const formLogin = document.getElementById("form-login");
      const divBienvenida = document.getElementById("bienvenida");
      const spanNombre = document.getElementById("usuario-nombre");
      
      if (formLogin) formLogin.classList.add("d-none");
      if (divBienvenida) divBienvenida.classList.remove("d-none");
      if (spanNombre) spanNombre.textContent = usuarioActual.nombre || usuarioActual.name || "Usuario";
    }

    // Actualizar contadores del carrito
    actualizarContadores();

    console.log("Main inicializado con TypeScript");
  });
}

export function actualizarContadores(): void {
  const c = document.getElementById("carrito-count");
  if (c) {
    const total = carrito.reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);
    c.textContent = total.toString();
  }
}
export function inicializarAplicacion(): void {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("Aplicación HuertoHogar inicializada");
        actualizarContadores();
    });
}
export function simularAPIPuerto8080(): void {
  console.log('🔌 Conectando a API en http://localhost:8080/productos...');
  
  setTimeout(() => {
    const productos = JSON.parse(localStorage.getItem('catalogo') || '[]');
    console.log(`📦 ${productos.length} productos cargados desde "API"`);
  }, 500);
}
inicializarAplicacion();