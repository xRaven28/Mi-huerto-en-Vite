export function inicializarValidacionesCuenta(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCrearCuenta") as HTMLFormElement;
    if (!form) return;

    form.addEventListener("submit", function (event: Event) {
      let valido = true;

      // Validar Nombre
      const nombre = document.getElementById("nombre") as HTMLInputElement;
      if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(nombre.value)) {
        mostrarError(nombre, "El nombre debe tener al menos 3 letras y solo contener caracteres alfabéticos.");
        valido = false;
      } else {
        limpiarError(nombre);
      }

      // Validar Apellido
      const apellido = document.getElementById("apellido") as HTMLInputElement;
      if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(apellido.value)) {
        mostrarError(apellido, "El apellido debe tener al menos 3 letras y solo contener caracteres alfabéticos.");
        valido = false;
      } else {
        limpiarError(apellido);
      }

      // Validación RUN
      const runInput = document.getElementById("run") as HTMLInputElement;
      if (runInput && !validarRUN(runInput.value)) {
        mostrarError(runInput, "El RUN no es válido.");
        valido = false;
      } else if (runInput) {
        limpiarError(runInput);
      }

      // Validar Correo
      const correo = document.getElementById("correo") as HTMLInputElement;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value)) {
        mostrarError(correo, "Ingresa un correo válido (ejemplo@correo.com).");
        valido = false;
      } else {
        limpiarError(correo);
      }

      // Validar Teléfono
      const telefono = document.getElementById("telefono") as HTMLInputElement;
      if (!/^\+56\s?9\s?\d{4}\s?\d{4}$/.test(telefono.value)) {
        mostrarError(telefono, "Ingresa un número válido. Ejemplo: +56 9 1234 5678");
        valido = false;
      } else {
        limpiarError(telefono);
      }

      // Validar Dirección
      const direccion = document.getElementById("direccion") as HTMLInputElement;
      if (direccion.value.trim().length < 5) {
        mostrarError(direccion, "La dirección debe tener al menos 5 caracteres.");
        valido = false;
      } else {
        limpiarError(direccion);
      }

      // Validar Contraseñas iguales
      const pass = document.getElementById("password") as HTMLInputElement;
      const confirm = document.getElementById("confirmarPassword") as HTMLInputElement;
      if (pass.value !== confirm.value) {
        mostrarError(confirm, "Las contraseñas no coinciden.");
        valido = false;
      } else {
        limpiarError(confirm);
      }

      if (!valido) {
        event.preventDefault();
      }
    });

    // Funciones para mostrar y limpiar errores con Bootstrap
    function mostrarError(input: HTMLInputElement, mensaje: string): void {
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

    function limpiarError(input: HTMLInputElement): void {
      input.classList.remove("is-invalid");
      const nextSibling = input.nextElementSibling as HTMLElement;
      
      if (nextSibling && nextSibling.classList.contains("invalid-feedback")) {
        nextSibling.remove();
      }
    }

    // Función para calcular dígito verificador
    function calcularDV(run: string): string {
      let suma = 0;
      let multiplicador = 2;

      for (let i = run.length - 1; i >= 0; i--) {
        suma += parseInt(run.charAt(i)) * multiplicador;
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
      }

      let resto = 11 - (suma % 11);

      if (resto === 11) return "0";
      if (resto === 10) return "K";
      return String(resto);
    }

    // Función para validar un RUN completo
    function validarRUN(runCompleto: string): boolean {
      runCompleto = runCompleto.replace(/\./g, "").toUpperCase();
      const partes = runCompleto.split("-");
      
      if (partes.length !== 2) return false;
      
      const [numero, dv] = partes;

      if (!/^\d+$/.test(numero)) return false;

      const dvEsperado = calcularDV(numero);
      return dv === dvEsperado;
    }
  });
}