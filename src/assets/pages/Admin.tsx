// src/pages/Admin.tsx
import React, { useEffect, useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { ModalAgregarProducto } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Producto, Usuario, HistorialAccion } from "../types";
import AdminEstadisticas from "../components/AdminEstadisticas";
import StarRating from "../components/StarRating";

// COMPONENTE PRINCIPAL
const Admin: React.FC = () => {
  const {
    productos,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
  } = useProductos();

  const [seccionActual, setSeccionActual] = useState<
    "menu" | "productos" | "estadisticas" | "cuentas" | "historial" | "opiniones"
  >("menu");

  const [modalOpen, setModalOpen] = useState(false);
  const [filtroProductos, setFiltroProductos] = useState("");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);

  const [modalCrearCuentaOpen, setModalCrearCuentaOpen] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoRut, setNuevoRut] = useState("");
  const [nuevoRol, setNuevoRol] = useState("Cliente");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [modalOfertaOpen, setModalOfertaOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [porcentajeOferta, setPorcentajeOferta] = useState<number>(20);
  const [editData, setEditData] = useState<Partial<Producto>>({});

  const { usuario, esAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [historialProductos, setHistorialProductos] = useState<
    HistorialAccion[]
  >([]);
  const [historialCuentas, setHistorialCuentas] = useState<HistorialAccion[]>(
    []
  );

  const [modalDetalleCompra, setModalDetalleCompra] = useState<any | null>(
    null
  );

  // ================== PROTECCIÓN ==================
  useEffect(() => {
    if (!usuario) {
      navigate("/mi-cuenta");
    } else if (!esAdmin) {
      showToast("No tienes permisos para acceder al panel de administrador");
      navigate("/");
    }
  }, [usuario, esAdmin, navigate, showToast]);

  // ========= CARGAR USUARIOS E HISTORIAL =========
  useEffect(() => {
    const usuariosLS = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(usuariosLS);

    const accionesProductos = JSON.parse(
      localStorage.getItem("historialProductos") || "[]"
    );
    const accionesCuentas = JSON.parse(
      localStorage.getItem("historialCuentas") || "[]"
    );

    setHistorialProductos(accionesProductos.reverse());
    setHistorialCuentas(accionesCuentas.reverse());
  }, []);

  // ================== SIDEBAR =====================
  const Sidebar = () => (
    <aside className="admin-sidebar">
      {/* INFO ADMIN */}
      <div className="admin-user-box">
        <div className="admin-avatar">
          <span>👤</span>
        </div>
        <p className="admin-name">{usuario?.nombre || "Administrador"}</p>
      </div>

      <hr className="admin-separator" />

      {/* SECCIONES */}
      <button
        className={seccionActual === "menu" ? "active" : ""}
        onClick={() => setSeccionActual("menu")}
      >
        Inicio
      </button>

      <button
        className={seccionActual === "productos" ? "active" : ""}
        onClick={() => setSeccionActual("productos")}
      >
        Productos
      </button>

      <button
        className={seccionActual === "cuentas" ? "active" : ""}
        onClick={() => setSeccionActual("cuentas")}
      >
        Cuentas
      </button>

      <button
        className={seccionActual === "estadisticas" ? "active" : ""}
        onClick={() => setSeccionActual("estadisticas")}
      >
        Estadísticas
      </button>
      <button
        className={seccionActual === "opiniones" ? "active" : ""}
        onClick={() => setSeccionActual("opiniones")}
      >
        Opiniones
      </button>

      <button
        className={seccionActual === "historial" ? "active" : ""}
        onClick={() => setSeccionActual("historial")}
      >
        Historial
      </button>

      <hr className="admin-separator" />

      {/* IR A TIENDA */}
      <button className="btn-admin-secondary" onClick={() => navigate("/")}>
        🛒 Ir a la Tienda
      </button>

      {/* CERRAR SESIÓN */}
      <button
        className="btn-admin-danger"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Cerrar Sesión
      </button>
    </aside>
  );

  // ========= HELPERS DE USUARIOS / HISTORIAL =========

  const guardarUsuarios = (nuevos: Usuario[], accion?: string) => {
    setUsuarios(nuevos);
    localStorage.setItem("usuarios", JSON.stringify(nuevos));

    if (accion) {
      const registro: HistorialAccion = {
        fecha: new Date().toLocaleString(),
        accion,
        usuario: "Administrador de Cuentas",
      };
      const historialPrevio = JSON.parse(
        localStorage.getItem("historialCuentas") || "[]"
      );
      historialPrevio.push(registro);
      localStorage.setItem("historialCuentas", JSON.stringify(historialPrevio));
      setHistorialCuentas(historialPrevio.reverse());
    }
  };

  const registrarAccionProducto = (accion: string) => {
    const registro: HistorialAccion = {
      fecha: new Date().toLocaleString(),
      accion,
      usuario: "Administrador de Productos",
    };
    const historialPrevio = JSON.parse(
      localStorage.getItem("historialProductos") || "[]"
    );
    historialPrevio.push(registro);
    localStorage.setItem("historialProductos", JSON.stringify(historialPrevio));
    setHistorialProductos(historialPrevio.reverse());
  };

  // ============ PRODUCTOS: CRUD / OFERTAS ============
  const handleAgregar = async (p: Omit<Producto, "id">) => {
    await agregarProducto(p);
    registrarAccionProducto(`Agregó el producto "${p.name}"`);
    showToast("Producto agregado correctamente");
  };

  /* Habilitar / Deshabilitar producto */
  const handleToggleProducto = async (id: number) => {
    const p = productos.find((x) => x.id === id);
    if (!p) return;

    const actualizado = { ...p, habilitado: !p.habilitado };
    await actualizarProducto(actualizado);

    const nuevos = productos.map((prod) =>
      prod.id === id ? actualizado : prod
    );
    localStorage.setItem("productos", JSON.stringify(nuevos));

    registrarAccionProducto(
      `${actualizado.habilitado ? "Habilitó" : "Inhabilitó"} el producto "${p.name
      }"`
    );
    showToast(
      `Producto "${p.name}" ${p.habilitado ? "inhabilitado" : "habilitado"
      } correctamente.`
    );
  };

  const abrirModalOferta = (producto: Producto) => {
    if (!producto.habilitado) {
      showToast("No puedes poner en oferta un producto inhabilitado");
      return;
    }
    setProductoSeleccionado(producto);
    setPorcentajeOferta(producto.descuento || 20);
    setModalOfertaOpen(true);
  };

  const guardarOferta = async () => {
    if (!productoSeleccionado) return;

    const actualizado: Producto = {
      ...productoSeleccionado,
      oferta: true,
      descuento: porcentajeOferta,
    };

    await actualizarProducto(actualizado);

    const nuevos = productos.map((p) =>
      p.id === actualizado.id ? actualizado : p
    );
    localStorage.setItem("productos", JSON.stringify(nuevos));

    registrarAccionProducto(
      `Puso en oferta "${actualizado.name}" con ${porcentajeOferta}%`
    );
    showToast(
      `${actualizado.name} ahora tiene un ${porcentajeOferta}% de descuento.`
    );
    setModalOfertaOpen(false);
  };

  const quitarOferta = async (producto: Producto) => {
    const actualizado = { ...producto, oferta: false, descuento: 0 };
    await actualizarProducto(actualizado);

    const nuevos = productos.map((p) =>
      p.id === producto.id ? actualizado : p
    );
    localStorage.setItem("productos", JSON.stringify(nuevos));

    registrarAccionProducto(`Quitó la oferta de "${producto.name}"`);
    showToast(`${producto.name} ya no está en oferta.`);
  };

  const abrirModalEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setEditData({ ...producto });
    setModalEditarOpen(true);
  };

  const guardarEdicion = async () => {
    if (!productoSeleccionado) return;

    const actualizado: Producto = {
      ...productoSeleccionado,
      ...editData,
    };

    await actualizarProducto(actualizado);

    const nuevos = productos.map((p) =>
      p.id === actualizado.id ? actualizado : p
    );
    localStorage.setItem("productos", JSON.stringify(nuevos));

    registrarAccionProducto(`Editó el producto "${actualizado.name}"`);
    showToast(`Producto "${actualizado.name}" editado correctamente.`);
    setModalEditarOpen(false);
  };

  const handleEliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    const prod = productos.find((x) => x.id === id);
    await eliminarProducto(id);
    registrarAccionProducto(`Eliminó el producto "${prod?.name}"`);
  };

  // ========== COMPRAS: CAMBIAR ESTADO / DETALLE ==========
  const cambiarEstadoCompra = (
    codigo: string,
    estado: "PREPARANDO" | "EN_DESPACHO" | "ENTREGADO"
  ) => {
    const historial = JSON.parse(
      localStorage.getItem("historialCompras") || "[]"
    );
    const actualizadoHistorial = historial.map((p: any) =>
      p.codigo === codigo ? { ...p, estado } : p
    );
    localStorage.setItem(
      "historialCompras",
      JSON.stringify(actualizadoHistorial)
    );

    const usuariosLS = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const updUsuarios = usuariosLS.map((u: any) => ({
      ...u,
      compras: u.compras?.map((c: any) =>
        c.codigo === codigo ? { ...c, estado } : c
      ),
    }));
    localStorage.setItem("usuarios", JSON.stringify(updUsuarios));
    setUsuarios(updUsuarios);

    if (usuarioSeleccionado) {
      const actualizadoUsuario = {
        ...usuarioSeleccionado,
        compras: usuarioSeleccionado.compras?.map((c: any) =>
          c.codigo === codigo ? { ...c, estado } : c
        ),
      } as Usuario;
      setUsuarioSeleccionado(actualizadoUsuario);
    }

    showToast(`Estado actualizado a "${estado}"`);
  };

  const mostrarDetalleCompra = (compra: any) => {
    setModalDetalleCompra({
      ...compra,
      productos: compra.productos || [],
    });
  };
  const eliminarValoracion = (productoId: number, index: number) => {
    const nuevosProductos = productos.map(p => {
      if (p.id === productoId) {
        const nuevasValoraciones = [...(p.valoraciones || [])];
        nuevasValoraciones.splice(index, 1);
        return { ...p, valoraciones: nuevasValoraciones };
      }
      return p;
    });

    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    showToast("Comentario eliminado correctamente");
    registrarAccionProducto("Eliminó una valoración de un producto");
  };

  // ============= FILTRO DE PRODUCTOS =============
  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(filtroProductos.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(filtroProductos.toLowerCase())
  );

  // ================== RENDER ======================
  return (
    <div className="admin-container">
      <Sidebar />

      <main className="admin-content">
        {/* ========== DASHBOARD ========== */}
        {seccionActual === "menu" && (
          <section className="admin-cards">

            <div className="admin-card-box admin-card-small" style={{ borderLeftColor: "#4CAF50" }}>
              <h4>{usuarios.length}</h4>
              <p>Usuarios registrados</p>
            </div>

            <div className="admin-card-box admin-card-small" style={{ borderLeftColor: "#2E7D32" }}>
              <h4>{productos.length}</h4>
              <p>Productos activos</p>
            </div>

            <div
              className="admin-card-box admin-card-small admin-card-link"
              onClick={() => navigate("/")}
              style={{ borderLeftColor: "#FFD600", cursor: "pointer" }}
            >
              <h4>🛒</h4>
              <p>Ir a la Tienda</p>
            </div>

          </section>
        )}

        {/* ========== GESTIÓN DE PRODUCTOS ========== */}
        {seccionActual === "productos" && (
          <section>
            <h2 className="text-center mb-4">
              Gestión de Productos
            </h2>

            <div className="d-flex gap-2 mb-3">
              <input
                className="form-control w-50"
                placeholder="Buscar producto..."
                value={filtroProductos}
                onChange={(e) => setFiltroProductos(e.target.value)}
              />
              <button
                className="btn btn-success"
                onClick={() => setModalOpen(true)}
              >
                Agregar Producto
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSeccionActual("menu")}
              >
                Volver al inicio
              </button>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle shadow-sm">
                  <thead className="table-success">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Descuento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id}>
                        <td>
                          <strong>{producto.name}</strong>
                          <br />
                          <small className="text-muted">
                            {producto.categoria || "Sin categoría"}
                          </small>
                        </td>
                        <td>
                          $
                          {Number(producto.precio).toLocaleString("es-CL")}
                        </td>
                        <td>
                          <span
                            className={`badge ${producto.habilitado ? "bg-success" : "bg-danger"
                              }`}
                          >
                            {producto.habilitado
                              ? "Habilitado"
                              : "Inhabilitado"}
                          </span>
                        </td>
                        <td>
                          {producto.oferta ? `${producto.descuento}%` : "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm me-1"
                            onClick={() => handleToggleProducto(producto.id)}
                          >
                            {producto.habilitado
                              ? "Inhabilitar"
                              : "Habilitar"}
                          </button>

                          {!producto.oferta ? (
                            <button
                              className="btn btn-warning btn-sm me-1"
                              onClick={() => abrirModalOferta(producto)}
                            >
                              Oferta
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-sm me-1"
                              onClick={() => quitarOferta(producto)}
                            >
                              Quitar Oferta
                            </button>
                          )}

                          <button
                            className="btn btn-info btn-sm me-1"
                            onClick={() => abrirModalEditar(producto)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleEliminarProducto(producto.id)
                            }
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

        {/* ========== ESTADÍSTICAS ========== */}
        {seccionActual === "estadisticas" && (
          <section>
            <h2 className="text-center mb-4">Estadísticas de Productos</h2>

            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-secondary"
                onClick={() => setSeccionActual("menu")}
              >
                Volver al inicio
              </button>
            </div>

            <AdminEstadisticas productos={productos} />
          </section>
        )}
        {/* ========== OPINIONES DE CLIENTES ========== */}
        {seccionActual === "opiniones" && (
          <section>
            <h2 className="text-center mb-4">Opiniones de clientes</h2>

            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle shadow-sm">
                <thead className="table-warning">
                  <tr>
                    <th>Producto</th>
                    <th>Usuario</th>
                    <th>Estrellas</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.flatMap((p) =>
                    (p.valoraciones || []).map((v, index) => (
                      <tr key={`${p.id}-${index}`}>
                        <td>{p.name}</td>
                        <td>{v.usuario}</td>
                        <td>{v.estrellas} ⭐</td>
                        <td>{v.comentario}</td>
                        <td>{v.fecha}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarValoracion(p.id, index)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== GESTIÓN DE USUARIOS ========== */}
        {seccionActual === "cuentas" && (
          <section>
            <h2 className="text-center mb-4">
              Gestión de Cuentas
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSeccionActual("menu")}
              >
                ⬅ Volver al inicio
              </button>

              <button
                className="btn btn-success shadow-sm"
                onClick={() => setModalCrearCuentaOpen(true)}
              >
                Crear Cuenta
              </button>
            </div>

            {usuarios.length === 0 ? (
              <div className="card p-4 text-center shadow-sm bg-light">
                <h5 className="text-muted mb-2">No hay usuarios registrados</h5>
              </div>
            ) : (
              <div className="card shadow-sm p-3">
                <div className="table-responsive">
                  <table className="table table-hover align-middle text-center">
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
                          <td>{u.correo}</td>
                          <td>{u.rut || "—"}</td>
                          <td>{u.rol || "Cliente"}</td>
                          <td>
                            <span
                              className={`badge ${u.bloqueado ? "bg-danger" : "bg-success"
                                }`}
                            >
                              {u.bloqueado ? "Bloqueado" : "Activo"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-1">
                              <button
                                className={`btn btn-sm ${u.bloqueado ? "btn-success" : "btn-warning"
                                  }`}
                                onClick={() => {
                                  const nuevos = usuarios.map((usr) =>
                                    usr.id === u.id
                                      ? { ...usr, bloqueado: !usr.bloqueado }
                                      : usr
                                  );
                                  guardarUsuarios(
                                    nuevos,
                                    `${u.bloqueado ? "Desbloqueó" : "Bloqueó"
                                    } a ${u.nombre}`
                                  );
                                }}
                              >
                                {u.bloqueado ? "Desbloquear" : "Bloquear"}
                              </button>

                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => setUsuarioSeleccionado(u)}
                              >
                                Ver
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (confirm(`¿Eliminar a ${u.nombre}?`)) {
                                    const nuevos = usuarios.filter(
                                      (usr) => usr.id !== u.id
                                    );
                                    guardarUsuarios(
                                      nuevos,
                                      `Eliminó a ${u.nombre}`
                                    );
                                  }
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODAL CREAR CUENTA */}
            {modalCrearCuentaOpen && (
              <div
                className="modal fade show"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0,0,0,0.6)",
                }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg">
                    <div className="card border-0">
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Crear Nueva Cuenta</h5>
                      </div>
                      <div className="card-body">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const nuevoUsuario: Usuario = {
                              id: Date.now(),
                              nombre: nuevoNombre,
                              correo: nuevoCorreo,
                              rut: nuevoRut,
                              rol: nuevoRol,
                              bloqueado: false,
                              estado: "Activo",
                              historial: [],
                              password: nuevoPassword,
                              confirpassword: confirmarPassword,
                              compras: [],
                            };

                            const nuevos = [...usuarios, nuevoUsuario];
                            guardarUsuarios(
                              nuevos,
                              `Creó la cuenta de ${nuevoNombre}`
                            );
                            setModalCrearCuentaOpen(false);
                            setNuevoNombre("");
                            setNuevoCorreo("");
                            setNuevoRut("");
                            setNuevoRol("Cliente");
                            setNuevoPassword("");
                            setConfirmarPassword("");
                          }}
                        >
                          <div className="mb-3">
                            <label className="form-label">
                              Nombre completo
                            </label>
                            <input
                              className="form-control"
                              value={nuevoNombre}
                              onChange={(e) => setNuevoNombre(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              Correo electrónico
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              value={nuevoCorreo}
                              onChange={(e) =>
                                setNuevoCorreo(e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">RUT</label>
                            <input
                              className="form-control"
                              value={nuevoRut}
                              onChange={(e) => setNuevoRut(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                              type="password"
                              className="form-control"
                              value={nuevoPassword}
                              onChange={(e) =>
                                setNuevoPassword(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Confirmar contraseña
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              value={confirmarPassword}
                              onChange={(e) =>
                                setConfirmarPassword(e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <select
                              className="form-select"
                              value={nuevoRol}
                              onChange={(e) => setNuevoRol(e.target.value)}
                            >
                              <option value="Cliente">Cliente</option>
                              <option value="Administrador">
                                Administrador
                              </option>
                            </select>
                          </div>

                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-secondary me-2"
                              onClick={() =>
                                setModalCrearCuentaOpen(false)
                              }
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success"
                            >
                              Crear Cuenta
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========== HISTORIAL GENERAL ========== */}
        {seccionActual === "historial" && (
          <section>
            <h2 className="text-center mb-4">Historial de Actividades</h2>

            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-secondary"
                onClick={() => setSeccionActual("menu")}
              >
                Volver al inicio
              </button>
            </div>

            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#histProductos"
                >
                  Historial Productos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#histCuentas"
                >
                  Historial Cuentas
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Productos */}
              <div className="tab-pane fade show active" id="histProductos">
                {historialProductos.length === 0 ? (
                  <p className="text-center text-muted">
                    No hay acciones registradas en productos.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle shadow-sm">
                      <thead className="table-success">
                        <tr>
                          <th>Fecha</th>
                          <th>Acción</th>
                          <th>Usuario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialProductos.map((h, i) => (
                          <tr key={i}>
                            <td>{h.fecha}</td>
                            <td>{h.accion}</td>
                            <td>{h.usuario}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Cuentas */}
              <div className="tab-pane fade" id="histCuentas">
                {historialCuentas.length === 0 ? (
                  <p className="text-center text-muted">
                    No hay acciones registradas en cuentas.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle shadow-sm">
                      <thead className="table-primary">
                        <tr>
                          <th>Fecha</th>
                          <th>Acción</th>
                          <th>Usuario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialCuentas.map((h, i) => (
                          <tr key={i}>
                            <td>{h.fecha}</td>
                            <td>{h.accion}</td>
                            <td>{h.usuario}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========== MODAL DETALLE USUARIO ========== */}
        {usuarioSeleccionado && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content modal-admin-usuario shadow-lg border-0">

                {/* HEADER */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    Detalles del Usuario — {usuarioSeleccionado.nombre}
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setUsuarioSeleccionado(null)}
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#resumen"
                      >
                        Resumen
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#compras"
                      >
                        Compras
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#estadisticas"
                      >
                        Estadísticas
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">

                    {/* TAB RESUMEN */}
                    <div className="tab-pane fade show active" id="resumen">
                      <p><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
                      <p><strong>RUT:</strong> {usuarioSeleccionado.rut || "No especificado"}</p>
                      <p><strong>Dirección:</strong> {usuarioSeleccionado.direccion || "No especificada"}</p>
                      <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono || "No especificado"}</p>
                      <p><strong>Rol:</strong> {usuarioSeleccionado.rol}</p>

                      <p>
                        <strong>Estado:</strong>{" "}
                        <span
                          className={`badge ${usuarioSeleccionado.bloqueado ? "bg-danger" : "bg-success"}`}
                        >
                          {usuarioSeleccionado.bloqueado ? "Bloqueado" : "Activo"}
                        </span>
                      </p>

                      <hr />

                      <p><strong>Total de compras:</strong> {usuarioSeleccionado.compras?.length || 0}</p>
                      <p>
                        <strong>Total gastado:</strong> $
                        {usuarioSeleccionado.compras
                          ?.reduce((acc: number, c: any) => acc + c.total, 0)
                          .toLocaleString("es-CL") || 0}
                      </p>
                    </div>

                    {/* TAB COMPRAS */}
                    <div className="tab-pane fade" id="compras">
                      {usuarioSeleccionado.compras && usuarioSeleccionado.compras.length > 0 ? (
                        <table className="table table-hover text-center align-middle shadow-sm">
                          <thead className="table-success">
                            <tr>
                              <th>Boleta</th>
                              <th>Fecha</th>
                              <th>Método</th>
                              <th>Total</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuarioSeleccionado.compras.map((compra: any) => (
                              <tr key={compra.id}>
                                <td>{compra.codigo}</td>
                                <td>{compra.fecha}</td>
                                <td>{compra.metodoPago}</td>
                                <td>${compra.total.toLocaleString("es-CL")}</td>
                                <td>
                                  <span className={`badge estado-${(compra.estado || "PREPARANDO").toLowerCase()}`}>
                                    {(compra.estado || "PREPARANDO") === "PREPARANDO" && "Preparando"}
                                    {(compra.estado || "PREPARANDO") === "EN_DESPACHO" && "En despacho"}
                                    {(compra.estado || "PREPARANDO") === "ENTREGADO" && "Entregado"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-info me-1"
                                    onClick={() => mostrarDetalleCompra(compra)}
                                  >
                                    Ver Detalle
                                  </button>
                                  {compra.estado !== "EN_DESPACHO" && (
                                    <button
                                      className="btn btn-sm btn-outline-warning me-1"
                                      onClick={() => cambiarEstadoCompra(compra.codigo, "EN_DESPACHO")}
                                    >
                                      En despacho
                                    </button>
                                  )}
                                  {compra.estado !== "ENTREGADO" && (
                                    <button
                                      className="btn btn-sm btn-outline-success"
                                      onClick={() => cambiarEstadoCompra(compra.codigo, "ENTREGADO")}
                                    >
                                      ✔️ Entregado
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-muted mt-3">No hay compras registradas.</p>
                      )}
                    </div>

                    {/* TAB ESTADÍSTICAS */}
                    <div className="tab-pane fade" id="estadisticas">
                      <div className="card p-3 shadow-sm">
                        {usuarioSeleccionado.compras && usuarioSeleccionado.compras.length > 0 ? (
                          <>
                            <p>
                              <strong>Promedio de gasto:</strong> $
                              {Math.round(
                                usuarioSeleccionado.compras.reduce(
                                  (acc: number, c: any) => acc + c.total,
                                  0
                                ) / usuarioSeleccionado.compras.length
                              ).toLocaleString("es-CL")}
                            </p>
                            <p>
                              <strong>Productos comprados:</strong>{" "}
                              {usuarioSeleccionado.compras
                                .flatMap((c: any) => c.productos)
                                .reduce((acc: number, p: any) => acc + p.cantidad, 0)}
                            </p>
                            <p>
                              <strong>Última compra:</strong>{" "}
                              {usuarioSeleccionado.compras[usuarioSeleccionado.compras.length - 1].fecha}
                            </p>
                          </>
                        ) : (
                          <p className="text-center text-muted">No hay datos para mostrar estadísticas.</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setUsuarioSeleccionado(null)}>
                    Cerrar
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL OFERTA ===== */}
        {modalOfertaOpen && productoSeleccionado && (
          <div className="modal-overlay-fixed">
            <div className="modal-content modal-admin-usuario shadow-lg" style={{ maxWidth: "420px" }}>

              <div className="modal-header">
                <h5 className="modal-title">Agregar Oferta</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setModalOfertaOpen(false)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <p className="fw-semibold">{productoSeleccionado.name}</p>
                <label className="fw-semibold mb-2">Porcentaje:</label>
                <input
                  type="number"
                  className="form-control text-center w-50 mx-auto"
                  min={5}
                  max={90}
                  step={5}
                  value={porcentajeOferta}
                  onChange={(e) => setPorcentajeOferta(Number(e.target.value))}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOfertaOpen(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardarOferta}>
                  Guardar
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ===== MODAL EDITAR PRODUCTO ===== */}
        {modalEditarOpen && productoSeleccionado && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">Editar Producto</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setModalEditarOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label>Nombre</label>
                  <input
                    className="form-control mb-2"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <label>Precio</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editData.precio || 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        precio: Number(e.target.value),
                      })
                    }
                  />
                  <label>Descripción</label>
                  <textarea
                    className="form-control mb-2"
                    value={editData.desc || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, desc: e.target.value })
                    }
                  />
                  <label>Categoría</label>
                  <input
                    className="form-control mb-2"
                    value={editData.categoria || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, categoria: e.target.value })
                    }
                  />
                  <label>URL Imagen</label>
                  <input
                    className="form-control mb-2"
                    value={editData.img || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, img: e.target.value })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalEditarOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-info text-white"
                    onClick={guardarEdicion}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL DETALLE DE COMPRA ===== */}
        {modalDetalleCompra && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-primary text-white">
                  <h5 className="mb-0">🧾 Detalle de Compra</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setModalDetalleCompra(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="fw-semibold text-center mb-2">
                    #{modalDetalleCompra?.codigo}
                  </p>

                  <ul className="list-group mb-3">
                    {modalDetalleCompra.productos.map(
                      (p: any, i: number) => (
                        <li
                          key={i}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>{p.name}</span>{" "}
                          <strong>x{p.cantidad}</strong>
                        </li>
                      )
                    )}
                  </ul>

                  <div className="card p-3 shadow-sm bg-light">
                    <p className="mb-1">
                      <strong>Total:</strong>{" "}
                      $
                      {modalDetalleCompra.total?.toLocaleString(
                        "es-CL"
                      )}
                    </p>
                    <p className="mb-1">
                      <strong>Método de pago:</strong>{" "}
                      {modalDetalleCompra.metodoPago}
                    </p>
                    <p className="mb-0">
                      <strong>Estado:</strong>{" "}
                      <span className="badge bg-info text-dark">
                        {modalDetalleCompra.estado || "PREPARANDO"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalDetalleCompra(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL AGREGAR PRODUCTO */}
      <ModalAgregarProducto
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGuardar={handleAgregar}
      />
    </div>
  );
};

export default Admin;
