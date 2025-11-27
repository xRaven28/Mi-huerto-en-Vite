import { ProductoCarrito } from '../types/index';

export const CarritoService = {
    obtenerCarrito(): ProductoCarrito[] {
        try {
            const carrito = localStorage.getItem('carrito');
            return carrito ? JSON.parse(carrito) : [];
        } catch (error) {
            console.error('Error obteniendo carrito:', error);
            return [];
        }
    },

    guardarCarrito(carrito: ProductoCarrito[]): void {
        try {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    },

    limpiarCarrito(): void {
        try {
            localStorage.removeItem('carrito');
        } catch (error) {
            console.error('Error limpiando carrito:', error);
        }
    },

    obtenerCantidadTotal(): number {
        const carrito = this.obtenerCarrito();
        return carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
    }
};