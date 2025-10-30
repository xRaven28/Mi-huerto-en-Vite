import React from 'react';
import { Producto } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (producto: Omit<Producto, 'id'>) => Promise<void> | void;
}

export const ModalAgregarProducto: React.FC<Props> = ({ isOpen, onClose, onGuardar }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    precio: '',
    desc: '',
    compania: '',
    categoria: 'otros',
    habilitado: true,
  });

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', precio: '', desc: '', compania: '', categoria: 'otros', habilitado: true });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(formData.precio);
    if (!formData.name || isNaN(precio) || precio <= 0) {
      alert('Nombre y precio válidos son obligatorios');
      return;
    }
    await onGuardar({
      name: formData.name,
      precio,
      desc: formData.desc,
      compania: formData.compania,
      categoria: formData.categoria,
      img: '/img/placeholder.jpg',
      habilitado: formData.habilitado,
    });
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Agregar Producto</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Nombre" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              <input className="form-control mb-2" placeholder="Precio" value={formData.precio} onChange={e => setFormData(prev => ({ ...prev, precio: e.target.value }))} />
              <textarea className="form-control mb-2" placeholder="Descripción" value={formData.desc} onChange={e => setFormData(prev => ({ ...prev, desc: e.target.value }))} />
              <select className="form-select mb-2" value={formData.compania} onChange={e => setFormData(prev => ({ ...prev, compania: e.target.value }))}>
                <option value="">Seleccionar compañía</option>
                <option>Chilexpress</option>
                <option>Starken</option>
                <option>Bluexpress</option>
                <option>Correos de Chile</option>
              </select>
              <div className="form-check">
                <input id="habilitado" className="form-check-input" type="checkbox" checked={formData.habilitado} onChange={e => setFormData(prev => ({ ...prev, habilitado: e.target.checked }))} />
                <label htmlFor="habilitado" className="form-check-label">Habilitado</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-success">Agregar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
