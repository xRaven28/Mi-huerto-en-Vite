import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        index: resolve(__dirname, 'src/pages/Index.html'),
        admin: resolve(__dirname, 'src/pages/Admin.html'),
        carrito: resolve(__dirname, 'src/pages/Carrito.html'),
        checkout: resolve(__dirname, 'src/pages/Checkout.html'),
        contacto: resolve(__dirname, 'src/pages/Contacto.html'),
        crearCuenta: resolve(__dirname, 'src/pages/Crear_Cuenta.html'),
        miCuenta: resolve(__dirname, 'src/pages/Mi_cuenta.html'),
        productos: resolve(__dirname, 'src/pages/Productos.html'),
        quienesSomos: resolve(__dirname, 'src/pages/Quienes_somos.html'),
        recetas: resolve(__dirname, 'src/pages/Recetas.html'),
        recuperarContrasena: resolve(__dirname, 'src/pages/Recuperar-contrasena.html'),
        restablecerContrasena: resolve(__dirname, 'src/pages/Restablecer_contrasena.html'),
        terminos: resolve(__dirname, 'src/pages/Terminos.html')
      }
    }
  }
});