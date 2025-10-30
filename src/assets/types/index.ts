export interface Producto {
  id: number;           
  name: string;
  precio: number;
  desc: string;
  categoria: string;
  compania: string;
  img: string;
  habilitado: boolean;
}

export interface ProductoCarrito extends Producto {
  cantidad: number;         
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
