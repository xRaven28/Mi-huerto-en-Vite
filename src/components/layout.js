export function createHeader() {
    return `
    <header class="main-header">
        <div class="logo">
            <h1>🌱 Mi Huerto</h1>
        </div>
        <nav class="header-nav">
            <a href="/index.html">🏠 Inicio</a>
            <a href="/src/pages/productos/index.html">🌿 Productos</a>
            <a href="/src/pages/recetas/index.html">📖 Recetas</a>
            <a href="/src/pages/quienes-somos/index.html">👥 Quiénes Somos</a>
            <a href="/src/pages/contacto/index.html">📞 Contacto</a>
            <a href="/src/pages/cuenta/mi-cuenta.html">👤 Mi Cuenta</a>
            <a href="/src/pages/carrito/index.html">🛒 Carrito</a>
        </nav>
    </header>
    `;
}

export function createFooter() {
    return `
    <footer class="main-footer">
        <div class="footer-content">
            <p>&copy; 2024 Mi Huerto. Todos los derechos reservados.</p>
            <nav class="footer-nav">
                <a href="/src/pages/terminos/index.html">📜 Términos y Condiciones</a>
                <a href="/src/pages/contacto/index.html">📞 Contacto</a>
            </nav>
        </div>
    </footer>
    `;
}

// Función para navegación común
export function setupNavigation() {
    // Navegación del header activa
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.fontWeight = 'bold';
            link.style.backgroundColor = '#3a6b34';
        }
    });
}