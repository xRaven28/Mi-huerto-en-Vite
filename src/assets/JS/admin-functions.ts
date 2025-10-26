import { guardarEdicion } from "./productos";

export function abrirAgregar(): void {
    const modalElement = document.getElementById('modalAgregar');
    if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
    }
}

export function guardarNuevoProducto(): void {
    const nombreInput = document.getElementById('agregar-nombre') as HTMLInputElement;
    const precioInput = document.getElementById('agregar-precio') as HTMLInputElement;
    const descInput = document.getElementById('agregar-descripcion') as HTMLTextAreaElement;
    const companiaInput = document.getElementById('agregar-compania') as HTMLSelectElement;
    const habilitadoInput = document.getElementById('agregar-habilitado') as HTMLInputElement;

    if (!nombreInput || !precioInput) return;

    const nombre = nombreInput.value.trim();
    const precio = parseInt(precioInput.value);
    const desc = descInput?.value.trim() || '';
    const compania = companiaInput?.value || '';
    const habilitado = habilitadoInput?.checked ?? true;

    if (!nombre || isNaN(precio)) {
        alert('Nombre y precio son obligatorios');
        return;
    }

    // Agregar producto al catálogo
    const nuevoProducto = {
        id: Date.now().toString(),
        name: nombre,
        precio: precio,
        desc: desc,
        compania: compania,
        categoria: 'otros',
        img: 'img/default.png',
        habilitado: habilitado
    };

    // Guardar en localStorage
    let catalogo = JSON.parse(localStorage.getItem('catalogo') || '[]');
    catalogo.push(nuevoProducto);
    localStorage.setItem('catalogo', JSON.stringify(catalogo));

    // Actualizar interfaz
    if (typeof (window as any).renderAdminProductos === 'function') {
        (window as any).renderAdminProductos();
    }

    // Cerrar modal
    const modalElement = document.getElementById('modalAgregar');
    if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }

    // Limpiar formulario
    nombreInput.value = '';
    precioInput.value = '';
    if (descInput) descInput.value = '';
}

export function renderCuentas(): void {
    const tbody = document.getElementById('admin-cuentas');
    if (!tbody) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    tbody.innerHTML = usuarios.map((usuario: any) => `
        <tr>
            <td>${usuario.nombre || ''} ${usuario.apellido || ''}</td>
            <td>${usuario.run || 'N/A'}</td>
            <td>Usuario</td>
            <td><span class="badge bg-success">Activo</span></td>
            <td>
                <button class="btn btn-info btn-sm" onclick="verComprasUsuario('${usuario.correo}')">
                    Ver Compras
                </button>
            </td>
        </tr>
    `).join('');
}

export function mostrarHistorial(): void {
    const historial = JSON.parse(localStorage.getItem('historialUsuarios') || '[]');
    const lista = document.getElementById('historial-lista');
    
    if (!lista) return;

    if (historial.length === 0) {
        lista.innerHTML = '<p>No hay acciones registradas.</p>';
    } else {
        lista.innerHTML = historial.map((item: string) => 
            `<div class="border-bottom py-2">${item}</div>`
        ).join('');
    }
    
    const modalElement = document.getElementById('modalHistorial');
    if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
    }
}

export function verComprasUsuario(correo: string): void {
    const compras = JSON.parse(localStorage.getItem('historialCompras') || '[]');
    const comprasUsuario = compras.filter((compra: any) => 
        compra.cliente.toLowerCase().includes(correo.toLowerCase())
    );
    
    const lista = document.getElementById('compras-lista');
    if (!lista) return;
    
    if (comprasUsuario.length === 0) {
        lista.innerHTML = '<p>No hay compras registradas para este usuario.</p>';
    } else {
        lista.innerHTML = comprasUsuario.map((compra: any) => `
            <div class="border-bottom py-3">
                <h6>Boleta: ${compra.codigo}</h6>
                <p><strong>Fecha:</strong> ${compra.fecha}</p>
                <p><strong>Total:</strong> $${compra.total.toLocaleString('es-CL')}</p>
                <p><strong>Productos:</strong> ${compra.productos.map((p: any) => `${p.name} x${p.cantidad}`).join(', ')}</p>
            </div>
        `).join('');
    }
    
    const modalElement = document.getElementById('modalComprasUsuario');
    if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Hacer funciones disponibles globalmente
// Hacer funciones disponibles globalmente
declare global {
  interface Window {
    abrirAgregar: () => void;
    guardarNuevoProducto: () => void;
    guardarEdicion: () => void;
    // ... otras funciones
  }
}
window.abrirAgregar = abrirAgregar;
window.guardarNuevoProducto = guardarNuevoProducto;
window.guardarEdicion = guardarEdicion;