declare module '*.tsx' {
    const content: any;
    export default content;
}

declare module '*.ts' {
    const content: any;
    export default content;
}

declare module './components/Layout';
declare module './components/Toast';
declare module './pages/Home';
declare module './pages/Productos';
declare module './pages/Carrito';
declare module './pages/Contacto';
declare module './pages/MiCuenta';
declare module './pages/Admin';
declare module './pages/CrearCuenta';
declare module './pages/QuienesSomos';
declare module './pages/Checkout';
declare module './pages/Terminos';
declare module './pages/Recuperar-contrasena';
declare module './pages/Restablecer_contrasena';
declare module './pages/Recetas';
declare module './types/index';
declare module './services/auth';
declare module './services/carrito';