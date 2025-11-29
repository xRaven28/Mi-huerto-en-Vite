// src/pages/Admin.tsx
import React, { useEffect, useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { ModalAgregarProducto } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

import AdminEstadisticas from "../components/AdminEstadisticas";
import { Producto, Usuario } from "../types";

// Servicios API
import {
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuario.service";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { usuario, logout } = useAuth();

  const {
    productos,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto: eliminarProductoLocal,
  } = useProductos();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const [seccionActual, setSeccionActual] = useState<
    "menu" | "productos" | "estadisticas" | "cuentas" | "opiniones"
  >("menu");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCrearCuentaOpen, setModalCrearCuentaOpen] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    rut: "",
    password: "",
    rol: "CLIENTE",
  });

  const guardarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registrarUsuario(nuevoUsuario);

      showToast("Usuario creado correctamente");
      setModalCrearCuentaOpen(false);

      setNuevoUsuario({
        nombre: "",
        email: "",
        rut: "",
        password: "",
        rol: "CLIENTE",
      });

      cargarUsuarios();
    } catch (err) {
      console.error(err);
      showToast("Error creando usuario", "error");
    }
  };

  const cambiarEstadoUsuario = async (u: Usuario) => {
    try {
      await actualizarUsuario(u.id!, { ...u, bloqueado: !u.bloqueado });

      showToast(u.bloqueado ? "Usuario desbloqueado" : "Usuario bloqueado");

      cargarUsuarios();
    } catch {
      showToast("Error actualizando usuario", "error");
    }
  };

  const eliminarCuenta = async (u: Usuario) => {
    if (!confirm(`¿Eliminar a ${u.nombre}?`)) return;

    try {
      await eliminarUsuario(u.id!);
      showToast("Usuario eliminado");
      cargarUsuarios();
    } catch {
      showToast("Error eliminando usuario", "error");
    }
  };

  const Sidebar = () => (
    <aside className="admin-sidebar">
      <div className="admin-user-box">
        <div className="admin-avatar">👤</div>
        <p className="admin-name">{usuario?.nombre}</p>
      </div>

      <hr />

      <button onClick={() => setSeccionActual("menu")}>Inicio</button>
      <button onClick={() => setSeccionActual("productos")}>Productos</button>
      <button onClick={() => setSeccionActual("cuentas")}>Cuentas</button>
      <button onClick={() => setSeccionActual("estadisticas")}>Estadísticas</button>
      <button onClick={() => setSeccionActual("opiniones")}>Opiniones</button>

      <hr />

      <button className="btn-admin-secondary" onClick={() => navigate("/")}>
        🛒 Ir a la tienda
      </button>

      <button
        className="btn-admin-danger"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Cerrar sesión
      </button>
    </aside>
  );

  const [filtroProductos, setFiltroProductos] = useState("");

  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(filtroProductos.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(filtroProductos.toLowerCase())
  );

  return (
    <div className="admin-container">
      <Sidebar />

      <main className="admin-content">
        {seccionActual === "menu" && (
          <section className="admin-cards">
            <div className="admin-card-box admin-card-small">
              <h4>{usuarios.length}</h4>
              <p>Usuarios registrados</p>
            </div>

            <div className="admin-card-box admin-card-small">
              <h4>{productos.length}</h4>
              <p>Productos activos</p>
            </div>

            <div
              className="admin-card-box admin-card-small admin-card-link"
              onClick={() => navigate("/")}
            >
              <h4>🛒</h4>
              <p>Ir a tienda</p>
            </div>
          </section>
        )}

        {seccionActual === "productos" && (
          <section>
            <h2 className="text-center mb-4">Gestión de Productos</h2>

            <div className="d-flex gap-2 mb-3">
              <input
                className="form-control w-50"
                placeholder="Buscar..."
                value={filtroProductos}
                onChange={(e) => setFiltroProductos(e.target.value)}
              />

              <button className="btn btn-success" onClick={() => setModalOpen(true)}>
                Agregar Producto
              </button>
            </div>

            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productosFiltrados.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>${p.precio.toLocaleString("es-CL")}</td>
                        <td>
                          <span className={`badge ${p.habilitado ? "bg-success" : "bg-danger"}`}>
                            {p.habilitado ? "Habilitado" : "Inhabilitado"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() =>
                              actualizarProducto({ ...p, habilitado: !p.habilitado })
                            }
                          >
                            {p.habilitado ? "Inhabilitar" : "Habilitar"}
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarProductoLocal(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {seccionActual === "estadisticas" && (
          <section>
            <h2 className="text-center mb-4">Estadísticas</h2>
            <AdminEstadisticas productos={productos} />
          </section>
        )}

        {seccionActual === "cuentas" && (
          <section>
            <h2 className="text-center mb-4">Gestión de Usuarios</h2>

            <div className="mb-3 d-flex justify-content-end">
              <button className="btn btn-success" onClick={() => setModalCrearCuentaOpen(true)}>
                Crear Usuario
              </button>
            </div>

            <table className="table text-center align-middle shadow-sm">
              <thead className="table-success">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>RUT</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rut}</td>
                    <td>{u.rol}</td>
                    <td>
                      <span className={`badge ${u.bloqueado ? "bg-danger" : "bg-success"}`}>
                        {u.bloqueado ? "Bloqueado" : "Activo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          u.bloqueado ? "btn-success" : "btn-warning"
                        } me-1`}
                        onClick={() => cambiarEstadoUsuario(u)}
                      >
                        {u.bloqueado ? "Desbloquear" : "Bloquear"}
                      </button>

                      <button
                        className="btn btn-info btn-sm me-1"
                        onClick={() => setUsuarioSeleccionado(u)}
                      >
                        Ver
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarCuenta(u)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      <ModalAgregarProducto
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGuardar={agregarProducto}
      />

      {modalCrearCuentaOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-content shadow-lg" style={{ maxWidth: "420px" }}>
            <h5 className="modal-title">Crear Usuario</h5>

            <form onSubmit={guardarUsuario} className="p-3">
              <input
                className="form-control mb-2"
                placeholder="Nombre"
                required
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Correo"
                type="email"
                required
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="RUT"
                value={nuevoUsuario.rut}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rut: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Contraseña"
                type="password"
                required
                value={nuevoUsuario.password}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                }
              />

              <select
                className="form-select mb-2"
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setModalCrearCuentaOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
