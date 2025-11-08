import React, { useState } from "react";
import type { Producto } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (p: Omit<Producto, "id">) => void;
}

export const ModalAgregarProducto: React.FC<Props> = ({ isOpen, onClose, onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [compania, setCompania] = useState("");
  const [imagen, setImagen] = useState<string>("");

  if (!isOpen) return null;

  // 🖼️ Convertir imagen a base64
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 💾 Guardar producto
  const handleGuardar = () => {
    if (!nombre || !precio || !categoria) {
      alert("⚠️ Completa los campos obligatorios: nombre, precio y categoría.");
      return;
    }

    const nuevo: Omit<Producto, "id"> = {
      name: nombre,
      precio,
      categoria,
      desc: descripcion,
      compania: compania || "Sin compañía",
      img: imagen || "img/placeholder.jpg",
      habilitado: true,
      oferta: false,
      descuento: 0,
    };

    onGuardar(nuevo);
    onClose();

    // Limpiar campos
    setNombre("");
    setPrecio(0);
    setCategoria("");
    setDescripcion("");
    setCompania("");
    setImagen("");
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Agregar Producto</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <label className="fw-semibold">Nombre</label>
            <input
              className="form-control mb-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label className="fw-semibold">Precio</label>
            <input
              type="number"
              className="form-control mb-2"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />

            <label className="fw-semibold">Categoría</label>
            <input
              className="form-control mb-2"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />

            <label className="fw-semibold">Descripción</label>
            <textarea
              className="form-control mb-2"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <label className="fw-semibold">Compañía / Proveedor</label>
            <input
              className="form-control mb-2"
              value={compania}
              onChange={(e) => setCompania(e.target.value)}
            />

            <label className="fw-semibold">Imagen del producto</label>
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={handleImagenChange}
            />

            {imagen && (
              <div className="text-center my-3">
                <img
                  src={imagen}
                  alt="Vista previa"
                  style={{
                    maxWidth: "150px",
                    borderRadius: "10px",
                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleGuardar}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
