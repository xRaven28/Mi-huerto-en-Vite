import { Producto, Usuario, ProductoCarrito, Compra } from '@/types/index';
import { carrito, mostrarToast, escapeHtml, escapeAttr, guardarCarritoLocal, actualizarContadores } from './main';

export function guardarCarrito(): void {
  guardarCarritoLocal();
  actualizarContadores();
  renderCarrito();
}

export function renderCarrito(): void {
  const tabla = document.getElementById("carrito-tabla");
  if (!tabla) return;
  
  tabla.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    const cantidad = Number(p.cantidad || 1);
    const precio = Number(p.precio || 0);
    const subtotal = cantidad * precio;
    total += subtotal;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${escapeHtml(p.name)}</td>
      <td style="width:120px;">
        <img src="${escapeAttr(p.img)}" alt="${escapeHtml(p.name)}" 
             style="max-width:100px; max-height:60px; object-fit:contain;">
      </td>
      <td>
        <button class="btn btn-sm btn-outline-secondary menos" data-index="${i}">-</button>
        <span class="mx-2">${cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary mas" data-index="${i}">+</button>
      </td>
      <td>$${precio.toLocaleString("es-CL")}</td>
      <td>$${subtotal.toLocaleString("es-CL")}</td>
      <td><button class="btn btn-danger btn-sm eliminar" data-index="${i}">X</button></td>
    `;
    tabla.appendChild(fila);
  });

  const totalEl = document.getElementById("carrito-total");
  if (totalEl) totalEl.textContent = "$" + total.toLocaleString("es-CL");

  // Event listeners
  tabla.querySelectorAll(".menos").forEach(b => {
    const button = b as HTMLButtonElement;
    button.addEventListener("click", () => {
      const i = Number(button.dataset.index);
      if (Number.isInteger(i) && i >= 0 && i < carrito.length) {
        if (carrito[i].cantidad > 1) {
          carrito[i].cantidad--;
        } else {
          carrito.splice(i, 1);
        }
        guardarCarrito();
      }
    });
  });

  tabla.querySelectorAll(".mas").forEach(b => {
    const button = b as HTMLButtonElement;
    button.addEventListener("click", () => {
      const i = Number(button.dataset.index);
      if (Number.isInteger(i) && i >= 0 && i < carrito.length) {
        carrito[i].cantidad++;
        guardarCarrito();
      }
    });
  });

  tabla.querySelectorAll(".eliminar").forEach(b => {
    const button = b as HTMLButtonElement;
    button.addEventListener("click", () => {
      const i = Number(button.dataset.index);
      if (Number.isInteger(i) && i >= 0 && i < carrito.length) {
        carrito.splice(i, 1);
        guardarCarrito();
      }
    });
  });
}

export function inicializarCarrito(): void {
  document.addEventListener("DOMContentLoaded", () => {
    actualizarContadores();
    renderCarrito();
    
    // Botón de pagar
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
      btnPagar.addEventListener("click", () => {
        if (carrito.length === 0) {
          mostrarToast("Tu carrito está vacío", "#dc3545");
          return;
        }
        
        const usuarioActual = JSON.parse(
          localStorage.getItem("usuarioActual") || 
          sessionStorage.getItem("usuarioActual") || 
          "null"
        );
        
        if (!usuarioActual || usuarioActual === "null") {
          mostrarToast("Debes iniciar sesión antes de comprar", "#dc3545");
          return;
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        window.location.href = "Checkout.html";
      });
    }
  });
}