export function inicializarValidacionesContacto(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContacto") as HTMLFormElement;
    if (!form) return;

    form.addEventListener("submit", function (event: Event) {
      let valido = true;

      // Validar Nombre
      const nombre = document.getElementById("contactoNombre") as HTMLInputElement;
      if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(nombre.value)) {
        mostrarError(nombre, "El nombre debe tener al menos 3 letras y solo contener caracteres alfabéticos.");
        valido = false;
      } else {
        limpiarError(nombre);
      }

      // Validar Correo
      const correo = document.getElementById("contactoCorreo") as HTMLInputElement;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value)) {
        mostrarError(correo, "Ingresa un correo válido.");
        valido = false;
      } else {
        limpiarError(correo);
      }

      // Validar Teléfono (solo si no está vacío)
      const telefono = document.getElementById("contactoTelefono") as HTMLInputElement;
      if (telefono.value.trim() !== "" && !/^\+56\s?9\s?\d{4}\s?\d{4}$/.test(telefono.value)) {
        mostrarError(telefono, "El teléfono debe tener el formato +56 9 1234 5678.");
        valido = false;
      } else {
        limpiarError(telefono);
      }

      // Validar Mensaje
      const mensaje = document.getElementById("contactoMensaje") as HTMLTextAreaElement;
      if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres.");
        valido = false;
      } else {
        limpiarError(mensaje);
      }

      if (!valido) {
        event.preventDefault();
      } else {
        alert("✅ Mensaje enviado correctamente.");
      }
    });

    // Funciones auxiliares
    function mostrarError(input: HTMLInputElement | HTMLTextAreaElement, mensaje: string): void {
      input.classList.add("is-invalid");
      const nextSibling = input.nextElementSibling as HTMLElement;
      
      if (!nextSibling || !nextSibling.classList.contains("invalid-feedback")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "invalid-feedback";
        errorDiv.innerText = mensaje;
        input.parentNode?.appendChild(errorDiv);
      } else {
        nextSibling.innerText = mensaje;
      }
    }

    function limpiarError(input: HTMLInputElement | HTMLTextAreaElement): void {
      input.classList.remove("is-invalid");
      const nextSibling = input.nextElementSibling as HTMLElement;
      
      if (nextSibling && nextSibling.classList.contains("invalid-feedback")) {
        nextSibling.remove();
      }
    }
  });
}