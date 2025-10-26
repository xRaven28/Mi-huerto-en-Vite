export interface Producto {
    id: string;
    name: string;
    precio: number;
    categoria: string;
    img: string;
    desc: string;
    habilitado: boolean;
    compania?: string;
}
export interface Usuario {
    id: number;
    nombre: string;
    name?: string;
    apellido?: string;
    rut?: string;
    run?: string;
    correo?: string;
    email?: string;
    password: string;
    telefono?: string;
    direccion?: string;
    rol: string;
    estado: string;
    bloqueado: boolean;
    historial: string[];
    compras?: Compra[];
}

export interface ProductoCarrito {
    id: string;
    name: string;
    precio: number;
    img: string;
    cantidad: number;
}

export interface Compra {
    id: number;
    rutUsuario: string;
    fecha: string;
    total: number;
    productos: ProductoCarrito[];
}

export interface Receta {
    titulo: string;
    imagen: string;
    descripcion: string;
    ingredientes: string[];
    preparacion: string;
}

export interface FormularioContacto {
    nombre: string;
    correo: string;
    telefono: string;
    mensaje: string;
}

export interface FormularioRegistro {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    password: string;
    confirmarPassword: string;
}