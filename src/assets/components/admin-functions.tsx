import React from 'react';
import type { Producto, Usuario } from '../types';

// Interfaces para los props
interface ModalAgregarProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (producto: Omit<Producto, 'id'>) => void;
}
// Componente Modal para agregar producto
export const ModalAgregarProducto: React.FC<ModalAgregarProps> = ({ 
  isOpen, 
  onClose, 
  onGuardar 
}) => {
  const [formData, setFormData] = React.useState({
    nombre: '',
    precio: '',
    descripcion: '',
    compania: '',
    habilitado: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const precio = parseInt(formData.precio);
    if (!formData.nombre || isNaN(precio)) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    const nuevoProducto: Omit<Producto, 'id'> = {
      name: formData.nombre,
      precio: precio,
      desc: formData.descripcion,
      compania: formData.compania,
      categoria: 'otros',
      img: 'img/default.png',
      habilitado: formData.habilitado
    };

    onGuardar(nuevoProducto);
    
    setFormData({
      nombre: '',
      precio: '',
      descripcion: '',
      compania: '',
      habilitado: true
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Producto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input 
                  type="text" 
                  name="nombre"
                  className="form-control" 
                  value={formData.nombre}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input 
                  type="number" 
                  name="precio"
                  className="form-control" 
                  value={formData.precio}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea 
                  name="descripcion"
                  className="form-control" 
                  rows={3}
                  value={formData.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Compañía</label>
                <select 
                  name="compania"
                  className="form-select"
                  value={formData.compania}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Chilexpress">Chilexpress</option>
                  <option value="Starken">Starken</option>
                  <option value="Bluexpress">Bluexpress</option>
                  <option value="Correos de Chile">Correos de Chile</option>
                </select>
              </div>
              <div className="form-check mb-3">
                <input 
                  type="checkbox" 
                  name="habilitado"
                  className="form-check-input" 
                  checked={formData.habilitado}
                  onChange={handleChange}
                />
                <label className="form-check-label">Habilitado</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar usuarios
export const TablaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);

  React.useEffect(() => {
    const usuariosData = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(usuariosData);
  }, []);

  const verComprasUsuario = (correo: string) => {
    // Esta función se manejaría en el componente padre
    console.log('Ver compras de:', correo);
  };

  return (
    <table className="table table-bordered">
      <thead className="table-info">
        <tr>
          <th>Usuario</th>
          <th>RUT</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario, index) => (
          <tr key={index}>
            <td>{usuario.nombre || ''} {usuario.apellido || ''}</td>
            <td>{usuario.rut || 'N/A'}</td>
            <td>Usuario</td>
            <td><span className="badge bg-success">Activo</span></td>
            <td>
              <button 
                className="btn btn-info btn-sm" 
                onClick={() => verComprasUsuario(usuario.correo || '')}
              >
                Ver Compras
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Componente para mostrar historial
export const ModalHistorial: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const [historial, setHistorial] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const historialData = JSON.parse(localStorage.getItem('historialUsuarios') || '[]');
      setHistorial(historialData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Historial de acciones de usuarios</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {historial.length === 0 ? (
              <p>No hay acciones registradas.</p>
            ) : (
              historial.map((item, index) => (
                <div key={index} className="border-bottom py-2">{item}</div>
              ))
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para administración
export const useAdminFunctions = () => {
  const guardarNuevoProducto = (productoData: Omit<Producto, 'id'>) => {
    const nuevoProducto: Producto = {
      ...productoData,
      id: Date.now()
    };

    // Guardar en localStorage
    let catalogo = JSON.parse(localStorage.getItem('catalogo') || '[]');
    catalogo.push(nuevoProducto);
    localStorage.setItem('catalogo', JSON.stringify(catalogo));

    return nuevoProducto;
  };

  return {
    guardarNuevoProducto
  };
};
