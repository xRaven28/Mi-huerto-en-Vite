import axios from "axios";
import type { Compra } from "../types";

const API = "http://localhost:8080/api/compras";

// Manejo de errores mejorado
const handleRequestError = (error: any) => {
  if (error.response?.status === 400) {
    throw new Error("Datos de compra inválidos");
  }
  if (error.response?.status === 404) {
    throw new Error("Recurso no encontrado");
  }
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error("Error de conexión");
};

export const obtenerCompras = async (): Promise<Compra[]> => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const obtenerComprasPorUsuario = async (usuarioId: number): Promise<Compra[]> => {
  try {
    const res = await axios.get(`${API}/usuario/${usuarioId}`);
    return res.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const crearCompra = async (compra: any): Promise<Compra> => {
  try {
    const res = await axios.post(API, compra);
    return res.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};

export const actualizarEstadoCompra = async (id: number, estado: string): Promise<Compra> => {
  try {
    const res = await axios.put(`${API}/${id}/estado`, { estado });
    return res.data;
  } catch (error) {
    throw handleRequestError(error);
  }
};