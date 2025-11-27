import { Usuario } from '../types/index';

export const AuthService = {
    obtenerUsuarioActual(): Usuario | null {
        try {
            const usuario = localStorage.getItem('usuarioActual') || sessionStorage.getItem('usuarioActual');
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return null;
        }
    },

    iniciarSesion(usuario: Usuario, recordar: boolean = false): void {
        try {
            const storage = recordar ? localStorage : sessionStorage;
            storage.setItem('usuarioActual', JSON.stringify(usuario));
        } catch (error) {
            console.error('Error iniciando sesión:', error);
        }
    },

    cerrarSesion(): void {
        try {
            localStorage.removeItem('usuarioActual');
            sessionStorage.removeItem('usuarioActual');
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    },

    esAdmin(usuario: Usuario | null): boolean {
        return usuario?.correo === 'admin@huertohogar.cl';
    }
};