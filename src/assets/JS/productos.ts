import { Producto } from '@/types/index';
import { carrito, mostrarToast, escapeHtml, escapeAttr, guardarCarritoLocal, actualizarContadores } from './main';

const API_BASE_URL = 'http://localhost:8080/api';

// Declarar CATALOGO global
declare global {
  interface Window {
    CATALOGO: Producto[];
    catalogo_local: Producto[];
  }
}

// Función para cargar productos desde la API
export async function cargarProductosDesdeAPI(): Promise<Producto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const productos = await response.json();
    console.log('Productos cargados desde API:', productos.length);
    return productos;
  } catch (error) {
    console.error(' Error cargando productos desde API:', error);
    // Fallback a localStorage si la API falla
    const productosLocal = localStorage.getItem('catalogo');
    return productosLocal ? JSON.parse(productosLocal) : [];
  }
}

// Función para guardar productos en la API
export async function guardarProductoEnAPI(producto: Producto): Promise<Producto | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error guardando producto en API:', error);
    return null;
  }
}

// Función para actualizar producto en la API
export async function actualizarProductoEnAPI(id: string, producto: Partial<Producto>): Promise<Producto | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error actualizando producto en API:', error);
    return null;
  }
}

// Función para eliminar producto de la API
export async function eliminarProductoDeAPI(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error eliminando producto de API:', error);
    return false;
  }
}
function abrirEditar(id: string): void {
  const producto = window.catalogo_local.find(p => p.id == id);
  if (!producto) return;

  // Obtener elementos del modal
  const editarId = document.getElementById("editar-id") as HTMLInputElement;
  const editarNombre = document.getElementById("editar-nombre") as HTMLInputElement;
  const editarPrecio = document.getElementById("editar-precio") as HTMLInputElement;
  const editarDescripcion = document.getElementById("editar-descripcion") as HTMLTextAreaElement;
  const editarCompania = document.getElementById("editar-compania") as HTMLSelectElement;
  const editarCategoria = document.getElementById("editar-categoria") as HTMLSelectElement;

  // Llenar el formulario con los datos del producto
  if (editarId) editarId.value = producto.id;
  if (editarNombre) editarNombre.value = producto.name;
  if (editarPrecio) editarPrecio.value = producto.precio.toString();
  if (editarDescripcion) editarDescripcion.value = producto.desc;
  if (editarCompania) editarCompania.value = producto.compania || "";
  if (editarCategoria) editarCategoria.value = producto.categoria || "frutas";

  // Mostrar el modal
  const modalElement = document.getElementById("modalEditar");
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }
}
export async function guardarEdicion(): Promise<void> {
  const editarId = document.getElementById("editar-id") as HTMLInputElement;
  const editarNombre = document.getElementById("editar-nombre") as HTMLInputElement;
  const editarPrecio = document.getElementById("editar-precio") as HTMLInputElement;
  const editarDescripcion = document.getElementById("editar-descripcion") as HTMLTextAreaElement;
  const editarCompania = document.getElementById("editar-compania") as HTMLSelectElement;
  const editarCategoria = document.getElementById("editar-categoria") as HTMLSelectElement;

  if (!editarId || !editarNombre || !editarPrecio) return;

  const id = editarId.value;
  const producto = window.catalogo_local.find(p => p.id == id);
  if (!producto) return;

  // Preparar datos actualizados
  const datosActualizados = {
    name: editarNombre.value.trim(),
    precio: parseInt(editarPrecio.value),
    desc: editarDescripcion?.value.trim() || "",
    compania: editarCompania?.value || "",
    categoria: editarCategoria?.value || "frutas"
  };

  // Actualizar en la API
  const resultado = await actualizarProductoEnAPI(id, datosActualizados);

  if (resultado) {
    // Actualizar localmente
    Object.assign(producto, datosActualizados);
    localStorage.setItem('catalogo', JSON.stringify(window.catalogo_local));
    
    mostrarToast('Producto actualizado correctamente');
    
    // Cerrar modal
    const modalElement = document.getElementById("modalEditar");
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Actualizar vistas
    renderAdminProductos();
    renderProductosCliente();
  } else {
    mostrarToast('Error actualizando producto', '#dc3545');
  }
}
export async function guardarNuevoProducto(): Promise<void> {
  const agregarNombre = document.getElementById("agregar-nombre") as HTMLInputElement;
  const agregarPrecio = document.getElementById("agregar-precio") as HTMLInputElement;
  const agregarDescripcion = document.getElementById("agregar-descripcion") as HTMLTextAreaElement;
  const agregarCompania = document.getElementById("agregar-compania") as HTMLSelectElement;
  const agregarCategoria = document.getElementById("agregar-categoria") as HTMLSelectElement;
  const agregarHabilitado = document.getElementById("agregar-habilitado") as HTMLInputElement;

  if (!agregarNombre || !agregarPrecio) return;

  // Generar un ID único para el nuevo producto
  const nuevoId = Date.now().toString();

  const nuevoProducto: Producto = {
    id: nuevoId, // ← AGREGAR ESTA LÍNEA
    name: agregarNombre.value.trim(),
    precio: parseInt(agregarPrecio.value),
    desc: agregarDescripcion?.value.trim() || "",
    compania: agregarCompania?.value || "",
    categoria: agregarCategoria?.value || "frutas",
    img: "img/default.png",
    habilitado: agregarHabilitado?.checked ?? true
  };

  if (!nuevoProducto.name || isNaN(nuevoProducto.precio)) {
    mostrarToast('Nombre y precio son obligatorios', '#dc3545');
    return;
  }

  // Guardar en la API
  const resultado = await guardarProductoEnAPI(nuevoProducto);

  if (resultado) {
    // Agregar localmente
    window.catalogo_local.push(resultado);
    localStorage.setItem('catalogo', JSON.stringify(window.catalogo_local));
    
    mostrarToast('Producto agregado correctamente');
    
    // Cerrar modal
    const modalElement = document.getElementById("modalAgregar");
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Limpiar formulario
    agregarNombre.value = '';
    agregarPrecio.value = '';
    if (agregarDescripcion) agregarDescripcion.value = '';

    // Actualizar vistas
    renderAdminProductos();
    renderProductosCliente();
  } else {
    mostrarToast('Error agregando producto', '#dc3545');
  }
}

// INICIALIZAR CATÁLOGO DESDE API
export async function inicializarCatalogo(): Promise<void> {
  try {
    const productos = await cargarProductosDesdeAPI();
    
    if (productos.length === 0) {
      console.log(' Inicializando catálogo vacío...');
    
    }
    
    window.catalogo_local = productos;
   
    localStorage.setItem('catalogo', JSON.stringify(productos));
    
  } catch (error) {
    console.error('Error inicializando catálogo:', error);
    // Fallback a localStorage
    const productosLocal = localStorage.getItem('catalogo');
    window.catalogo_local = productosLocal ? JSON.parse(productosLocal) : [];
  }
}

// RENDER CLIENTE 
export async function renderProductosCliente(filtro: string = ""): Promise<void> {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) return;

  // Mostrar loading
  contenedor.innerHTML = '<div class="text-center"><div class="spinner-border text-success" role="status"></div><p class="mt-2">Cargando productos...</p></div>';

  try {
    // Recargar productos desde API
    await inicializarCatalogo();

    const filtrados = window.catalogo_local
      .filter(p => p.habilitado)
      .filter(p =>
        p.name.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
        (p.compania || "").toLowerCase().includes(filtro.toLowerCase())
      )
      .sort((a, b) => Number(a.id) - Number(b.id));

    if (filtrados.length === 0) {
      contenedor.innerHTML = `<p class="text-center">No se encontraron productos para "${filtro}"</p>`;
      return;
    }
    
    contenedor.innerHTML = "";
    
    filtrados.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-xl-3 col-lg-4 col-md-6";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top producto-img" alt="${p.name}"/>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(p.name)}</h5>
            <div class="text-muted small mb-2">${p.categoria.toUpperCase()}</div>
            <p class="card-text flex-grow-1">${escapeHtml(p.desc)}</p>
            <div class="d-flex align-items-center justify-content-between mt-2">
              <span class="fw-bold">$${p.precio.toLocaleString("es-CL")}</span>
              <div class="btn-group">
                <button class="btn btn-success btn-sm btn-cart" 
                  data-id="${p.id}" data-name="${escapeAttr(p.name)}" 
                  data-precio="${p.precio}" data-img="${escapeAttr(p.img)}">
                  <i class="bi bi-cart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>`;
      contenedor.appendChild(col);
    });

    // Event listeners para botones de carrito
    contenedor.querySelectorAll(".btn-cart").forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        const name = button.dataset.name || "";
        const precio = Number(button.dataset.precio || 0);
        const img = button.dataset.img || "";
        
        const existente = carrito.find(p => p.id === id);
        if (existente) {
          existente.cantidad++;
        } else {
          carrito.push({ id: id || "", name, precio, img, cantidad: 1 });
        }
        
        guardarCarritoLocal();
        actualizarContadores();
        mostrarToast(`"${name}" añadido al carrito`);
      });
    });

  } catch (error) {
    contenedor.innerHTML = '<p class="text-center text-danger">Error cargando productos</p>';
    console.error('Error renderizando productos:', error);
  }
}

// RENDER ADMIN (actualizado para usar API)
export async function renderAdminProductos(filtro: string = ""): Promise<void> {
  const tabla = document.getElementById("admin-productos");
  if (!tabla) return;

  try {
    // Recargar productos desde API
    await inicializarCatalogo();

    const filtrados = window.catalogo_local.filter(p =>
      p.name.toLowerCase().includes(filtro.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
      (p.compania || "").toLowerCase().includes(filtro.toLowerCase())
    );

    tabla.innerHTML = "";

    filtrados.forEach(p => {
      tabla.innerHTML += `
        <tr>
          <td>
            <strong>${escapeHtml(p.name)}</strong>
            <br>
            <small class="text-muted"><i class="bi bi-truck"></i> ${p.compania || "Sin asignar"}</small>
          </td>
          <td>$${Number(p.precio).toLocaleString("es-CL")}</td>
          <td>${escapeHtml(p.desc)}</td>
          <td>
            <span class="badge ${p.habilitado ? "bg-success" : "bg-danger"}">
              ${p.habilitado ? "Habilitado" : "Inhabilitado"}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm btn-toggle" data-id="${p.id}">
              ${p.habilitado ? "Inhabilitar" : "Habilitar"}
            </button>
            <button class="btn btn-primary btn-sm btn-edit" data-id="${p.id}">Editar</button>
            <button class="btn btn-danger btn-sm btn-delete" data-id="${p.id}">Eliminar</button>
          </td>
        </tr>`;
    });

    // Eventos dinámicos
    document.querySelectorAll(".btn-toggle").forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.addEventListener("click", () => toggleHabilitado(button.dataset.id || ""));
    });
    
    document.querySelectorAll(".btn-delete").forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.addEventListener("click", () => eliminarProducto(button.dataset.id || ""));
    });
    
    document.querySelectorAll(".btn-edit").forEach(btn => {
      const button = btn as HTMLButtonElement;
      button.addEventListener("click", () => abrirEditar(button.dataset.id || ""));
    });

  } catch (error) {
    tabla.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error cargando productos</td></tr>';
    console.error('Error renderizando admin productos:', error);
  }
}

// FUNCIONES ADMIN ACTUALIZADAS
async function toggleHabilitado(id: string): Promise<void> {
  const producto = window.catalogo_local.find(p => p.id == id);
  if (!producto) return;
  
  producto.habilitado = !producto.habilitado;
  
  const resultado = await actualizarProductoEnAPI(id, { habilitado: producto.habilitado });
  
  if (resultado) {
    // Actualizar localmente
    const index = window.catalogo_local.findIndex(p => p.id == id);
    if (index !== -1) {
      window.catalogo_local[index] = resultado;
    }
    localStorage.setItem('catalogo', JSON.stringify(window.catalogo_local));
    
    mostrarToast(`Producto ${producto.habilitado ? 'habilitado' : 'inhabilitado'}`);
    renderAdminProductos();
    renderProductosCliente();
  } else {
    mostrarToast('Error actualizando producto', '#dc3545');
    // Revertir cambio
    producto.habilitado = !producto.habilitado;
  }
}

async function eliminarProducto(id: string): Promise<void> {
  if (!confirm("¿Eliminar producto?")) return;
  
  const resultado = await eliminarProductoDeAPI(id);
  
  if (resultado) {
    window.catalogo_local = window.catalogo_local.filter(p => p.id != id);
    localStorage.setItem('catalogo', JSON.stringify(window.catalogo_local));
    
    mostrarToast('Producto eliminado');
    renderAdminProductos();
    renderProductosCliente();
  } else {
    mostrarToast('Error eliminando producto', '#dc3545');
  }
}

// BÚSQUEDA ACTUALIZADA
export function inicializarProductos(): void {
  document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar catálogo desde API
    await inicializarCatalogo();
    
    const inputAdminBuscar = document.querySelector("#admin-buscar") as HTMLInputElement;

    if (inputAdminBuscar) {
      inputAdminBuscar.addEventListener("input", () => {
        const filtro = inputAdminBuscar.value.trim().toLowerCase();
        renderAdminProductos(filtro);
      });
    }

    // Inicialización
    renderAdminProductos();
    renderProductosCliente();
  });
}