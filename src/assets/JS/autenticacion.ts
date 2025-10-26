import { Usuario } from '@/types/index';
import { mostrarToast } from './main';

export function inicializarAutenticacion(): void {
    document.addEventListener("DOMContentLoaded", () => {
        const formLogin = document.getElementById("form-login") as HTMLFormElement;
        const inputCorreo = document.getElementById("correo") as HTMLInputElement;
        const inputPassword = document.getElementById("password") as HTMLInputElement;
        const inputRecordarme = document.getElementById("recordarme") as HTMLInputElement;
        const divBienvenida = document.getElementById("bienvenida");
        const spanNombre = document.getElementById("usuario-nombre");
        const btnCerrar = document.getElementById("btn-cerrar-sesion");

        function mostrarBienvenida(usuario: Usuario): void {
            if (formLogin) formLogin.classList.add("d-none");
            if (divBienvenida) divBienvenida.classList.remove("d-none");
            if (spanNombre) spanNombre.textContent = usuario.nombre || "Usuario";
        }

        // Cerrar sesión
        if (btnCerrar) {
            btnCerrar.onclick = (): void => {
                localStorage.removeItem("usuarioActual");
                sessionStorage.removeItem("usuarioActual");
                if (divBienvenida) divBienvenida.classList.add("d-none");
                if (formLogin) formLogin.classList.remove("d-none");
                if (inputCorreo) inputCorreo.value = "";
                if (inputPassword) inputPassword.value = "";
                if (inputRecordarme) inputRecordarme.checked = false;

                const cuentaIcon = document.querySelector('a[title="Mi Cuenta"]');
                if (cuentaIcon) cuentaIcon.innerHTML = `<i class="bi bi-person-circle fs-4"></i>`;
            };
        }

        // Login
        if (formLogin) {
            formLogin.onsubmit = function (e: Event): void {
                e.preventDefault();
                const correo = (inputCorreo?.value || "").trim();
                const password = (inputPassword?.value || "").trim();

                const usuariosLocal: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
                const usuariosAdmin: Usuario[] = JSON.parse(localStorage.getItem("USUARIOS") || "[]");
                const allUsers: Usuario[] = [...usuariosLocal, ...usuariosAdmin];

                const usuario = allUsers.find(u =>
                    (u.correo === correo || u.email === correo) && u.password === password
                );

                if (usuario) {
                    if (inputRecordarme?.checked) {
                        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
                    } else {
                        sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
                    }
                    mostrarBienvenida(usuario);
                    mostrarToast(`Bienvenido ${usuario.nombre || usuario.name || ""}`);

                    const cuentaIcon = document.querySelector('a[title="Mi Cuenta"]');
                    if (cuentaIcon) {
                        cuentaIcon.innerHTML = `<i class="bi bi-person-check-fill fs-4 text-success"></i>`;
                    }
                } else {
                    alert("Correo o contraseña incorrectos");
                }
            };
        }

        // Verificar si ya hay usuario logueado
        const usuarioActualStr = localStorage.getItem("usuarioActual") || sessionStorage.getItem("usuarioActual");
        if (usuarioActualStr && usuarioActualStr !== "null") {
            try {
                const usuarioActual: Usuario = JSON.parse(usuarioActualStr);
                mostrarBienvenida(usuarioActual);

                const cuentaIcon = document.querySelector('a[title="Mi Cuenta"]');
                if (cuentaIcon) {
                    cuentaIcon.innerHTML = `<i class="bi bi-person-check-fill fs-4 text-success"></i>`;
                }
            } catch (error) {
                console.error("Error al parsear usuario actual:", error);
            }
        }
    });
}

export function verificarAutenticacion(): Usuario | null {
    const usuarioActualStr = localStorage.getItem("usuarioActual") || sessionStorage.getItem("usuarioActual");
    if (usuarioActualStr && usuarioActualStr !== "null") {
        try {
            return JSON.parse(usuarioActualStr);
        } catch (error) {
            console.error("Error al parsear usuario:", error);
            return null;
        }
    }
    return null;
}

export function cerrarSesion(): void {
    localStorage.removeItem("usuarioActual");
    sessionStorage.removeItem("usuarioActual");
    window.location.reload();
}