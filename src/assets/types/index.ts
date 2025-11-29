export interface Producto {
  id: number;
  name: string;
  precio: number;
  desc: string;
  categoria: string;
  compania: string;
  img: string;
  habilitado: boolean;
  valoraciones?: Valoracion[];
  oferta?: boolean;
  descuento?: number;
}

export interface ProductoCarrito extends Producto {
  cantidad: number;
}
export interface Valoracion {
  usuario: string;
  estrellas: number;
  comentario: string;
  fecha: string;
}


export interface Usuario {
  id?: number;
  nombre: string;
  apellido?: string;
  rut?: string;
  email: string;
  password: string;
  confirpassword: string,
  telefono?: string;
  direccion?: string;
  rol: string;
  token: string;
  estado?: "Activo" | "Inactivo";
  bloqueado?: boolean;
  historial?: string[];
  compras?: Compra[];
  fechaRegistro?: string;
}


export interface Compra {
  id: number;
  rutUsuario: string;
  fecha: string;
  total: number;
  productos: ProductoCarrito[];
  estado?: "PREPARANDO" | "EN_DESPACHO" | "ENTREGADO"; 
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
export interface HistorialAccion {
  fecha: string;
  accion: string;
  usuario: string;
}