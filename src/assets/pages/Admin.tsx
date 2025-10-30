import React from 'react';
import { useProductos } from '../hooks/useProductos';
import { ModalAgregarProducto } from '../components/ProductCard';
import { Producto } from '../types';

const Admin: React.FC = () => {
  const { productos, loading, agregarProducto, actualizarProducto, eliminarProducto } = useProductos();
  const [seccionActual, setSeccionActual] = React.useState<'menu' | 'productos' | 'cuentas'>('menu');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [filtroProductos, setFiltroProductos] = React.useState('');
  const [usuarios] = React.useState([
    { id: 1, nombre: 'Admin Principal', rut: '12.345.678-9', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'María González', rut: '23.456.789-0', rol: 'Cliente', estado: 'Activo' },
  ]);
  const productosFiltrados = productos.filter(p => p.name.toLowerCase().includes(filtroProductos.toLowerCase()) || p.categoria.toLowerCase().includes(filtroProductos.toLowerCase()));

  const handleAgregar = async (p: Omit<Producto, 'id'>) => {
    await agregarProducto(p);
    alert('Producto agregado');
  };

  const handleToggle = async (id: number) => {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    await actualizarProducto(id, { habilitado: !p.habilitado });
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    await eliminarProducto(id);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-huerto fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">HuertoHogar - Admin</a>
        </div>
      </nav>

      <main className="container py-5" style={{ marginTop: 80 }}>
        {seccionActual === 'menu' && (
          <section className="text-center">
            <h2>Bienvenido, Administrador</h2>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-success" onClick={() => setSeccionActual('productos')}>Gestionar Productos</button>
              <button className="btn btn-primary" onClick={() => setSeccionActual('cuentas')}>Gestionar Cuentas</button>
            </div>
          </section>
        )}

        {seccionActual === 'productos' && (
          <section>
            <h2 className="text-center mb-4">Panel Administrador - Productos</h2>
            <div className="d-flex gap-2 mb-3">
              <input className="form-control w-50" placeholder="Buscar producto..." value={filtroProductos} onChange={e => setFiltroProductos(e.target.value)} />
              <button className="btn btn-success" onClick={() => setModalOpen(true)}>➕ Agregar Producto</button>
              <button className="btn btn-secondary" onClick={() => setSeccionActual('menu')}>⬅ Volver</button>
            </div>

            {loading ? (
              <div className="text-center"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Cargando...</span></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle shadow-sm">
                  <thead className="table-success">
                    <tr>
                      <th>Producto</th><th>Precio</th><th>Descripción</th><th>Estado</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map(producto => (
                      <tr key={producto.id}>
                        <td><strong>{producto.name}</strong><br/><small className="text-muted">{producto.compania || 'Sin asignar'}</small></td>
                        <td>${Number(producto.precio).toLocaleString('es-CL')}</td>
                        <td>{producto.desc}</td>
                        <td><span className={`badge ${producto.habilitado ? 'bg-success' : 'bg-danger'}`}>{producto.habilitado ? 'Habilitado' : 'Inhabilitado'}</span></td>
                        <td>
                          <button className="btn btn-secondary btn-sm me-1" onClick={() => handleToggle(producto.id)}>{producto.habilitado ? 'Inhabilitar' : 'Habilitar'}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(producto.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {seccionActual === 'cuentas' && (
          <section>
            <h2 className="text-center mb-4">Panel Administrador - Cuentas</h2>
            <button className="btn btn-secondary mb-3" onClick={() => setSeccionActual('menu')}>⬅ Volver al Menú</button>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-info">
                  <tr><th>Usuario</th><th>RUT</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.rut}</td>
                      <td>{u.rol}</td>
                      <td><span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>{u.estado}</span></td>
                      <td>
                        <button className="btn btn-info btn-sm me-1">Ver Compras</button>
                        <button className="btn btn-warning btn-sm">{u.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <ModalAgregarProducto isOpen={modalOpen} onClose={() => setModalOpen(false)} onGuardar={handleAgregar} />
    </div>
  );
};

export default Admin;
