import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProductos = () => axios.get(API_URL);

export const getProductoById = (id: number) =>
  axios.get(`${API_URL}/${id}`);

export const createProducto = (data: any) =>
  axios.post(API_URL, data, authHeaders());

export const updateProducto = (id: number, data: any) =>
  axios.put(`${API_URL}/${id}`, data, authHeaders());

export const deleteProducto = (id: number) =>
  axios.delete(`${API_URL}/${id}`, authHeaders());

export const ponerEnOferta = (id: number, descuento: number) =>
  axios.put(`${API_URL}/${id}/oferta/${descuento}`, {}, authHeaders());

export const quitarOfertaProducto = (id: number) =>
  axios.put(`${API_URL}/${id}/quitar-oferta`, {}, authHeaders());
