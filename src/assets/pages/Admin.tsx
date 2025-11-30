// src/pages/Admin.tsx
import React, { useEffect, useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { ModalAgregarProducto } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Producto, Usuario, HistorialAccion } from "../types";
import AdminEstadisticas from "../components/AdminEstadisticas";

// Servicios API
import {
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuario.service";

import {
  ponerEnOferta,
  quitarOfertaProducto,
} from "../services/producto.service";

interface MensajeContacto {
  nombre: string;
  correo: string;
  telefono?: string;
  mensaje: string;
  fecha: string;
}

interface ValoracionAdminItem {
  productoId: number;
  productoNombre: string;
  usuario: string;
  estrellas: number;
  comentario: string;
  fecha: string;
  indice: number;
}

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

  const [productosEstadistica, setProductosEstadistica] = useState<Producto[]>([]);

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

  const onChangeDescuento = (value: number) => {
    if (value < 5) value = 5;
    if (value > 90) value = 90;
    setPorcentajeOferta(value);
  };


  useEffect(() => {
    cargarUsuarios();
  }, []);


  const [historialProductos, setHistorialProductos] = useState<HistorialAccion[]>([]);
  const [historialCuentas, setHistorialCuentas] = useState<HistorialAccion[]>([]);
  const [modalDetalleCompra, setModalDetalleCompra] = useState<any | null>(null);

  useEffect(() => {
    const accionesProductos = JSON.parse(localStorage.getItem("historialProductos") || "[]");
    const accionesCuentas = JSON.parse(localStorage.getItem("historialCuentas") || "[]");

    setHistorialProductos(accionesProductos.reverse());
    setHistorialCuentas(accionesCuentas.reverse());
  }, []);

  const registrarAccionProducto = (accion: string) => {
    const registro: HistorialAccion = {
      fecha: new Date().toLocaleString(),
      accion,
      usuario: "Administrador de Productos",
    };
    const historialPrevio = JSON.parse(localStorage.getItem("historialProductos") || "[]");
    historialPrevio.push(registro);
    localStorage.setItem("historialProductos", JSON.stringify(historialPrevio));
    setHistorialProductos(historialPrevio.reverse());
  };

  const registrarAccionCuenta = (accion: string) => {
    const registro: HistorialAccion = {
      fecha: new Date().toLocaleString(),
      accion,
      usuario: "Administrador de Cuentas",
    };
    const historialPrevio = JSON.parse(localStorage.getItem("historialCuentas") || "[]");
    historialPrevio.push(registro);
    localStorage.setItem("historialCuentas", JSON.stringify(historialPrevio));
    setHistorialCuentas(historialPrevio.reverse());
  };

  const [mensajesContacto, setMensajesContacto] = useState<MensajeContacto[]>([]);

  const cargarMensajesContacto = () => {
    try {
      const data = JSON.parse(localStorage.getItem("mensajes_contacto") || "[]");
      setMensajesContacto(data);
    } catch {
      setMensajesContacto([]);
    }
  };

  const eliminarMensajeContacto = (index: number) => {
    const copia = [...mensajesContacto];
    copia.splice(index, 1);
    localStorage.setItem("mensajes_contacto", JSON.stringify(copia));
    setMensajesContacto(copia);
    showToast("Mensaje eliminado");
  };

  const [valoracionesAdmin, setValoracionesAdmin] = useState<ValoracionAdminItem[]>([]);

  const sincronizarProductosYValoracionesDesdeLocalStorage = () => {
    let listaProductos: Producto[] = productos;

    const raw = localStorage.getItem("productos");
    if (raw) {
      try {
        listaProductos = JSON.parse(raw);
      } catch {
        listaProductos = productos;
      }
    }

    setProductosEstadistica(listaProductos);

    const listaValoraciones: ValoracionAdminItem[] = [];
    listaProductos.forEach((p) => {
      if (p.valoraciones && p.valoraciones.length && p.id != null) {
        p.valoraciones.forEach((v: any, idx: number) => {
          listaValoraciones.push({
            productoId: p.id as number,
            productoNombre: p.name,
            usuario: v.usuario,
            estrellas: v.estrellas,
            comentario: v.comentario,
            fecha: v.fecha,
            indice: idx,
          });
        });
      }
    });

    setValoracionesAdmin(listaValoraciones);
  };

  const eliminarValoracion = (item: ValoracionAdminItem) => {
    const lista = [...productosEstadistica];
    const actualizados = lista.map((p) => {
      if (p.id !== item.productoId) return p;
      const nuevasValoraciones = (p.valoraciones || []).filter(
        (_: any, idx: number) => idx !== item.indice
      );
      return { ...p, valoraciones: nuevasValoraciones };
    });

    localStorage.setItem("productos", JSON.stringify(actualizados));
    setProductosEstadistica(actualizados);

    const nuevaLista: ValoracionAdminItem[] = [];
    actualizados.forEach((p) => {
      if (p.valoraciones && p.valoraciones.length && p.id != null) {
        p.valoraciones.forEach((v: any, idx: number) => {
          nuevaLista.push({
            productoId: p.id as number,
            productoNombre: p.name,
            usuario: v.usuario,
            estrellas: v.estrellas,
            comentario: v.comentario,
            fecha: v.fecha,
            indice: idx,
          });
        });
      }
    });

    setValoracionesAdmin(nuevaLista);
    showToast("Valoración eliminada");
  };

  useEffect(() => {
    cargarMensajesContacto();
  }, []);

  useEffect(() => {
    sincronizarProductosYValoracionesDesdeLocalStorage();
  }, [productos]);

  const [modalOfertaOpen, setModalOfertaOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [porcentajeOferta, setPorcentajeOferta] = useState<number>(20);

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

    try {
      await ponerEnOferta(productoSeleccionado.id!, porcentajeOferta);
      registrarAccionProducto(
        `Puso en oferta "${productoSeleccionado.name}" con ${porcentajeOferta}% de descuento`
      );
      showToast(`${productoSeleccionado.name} ahora tiene ${porcentajeOferta}% de descuento`);
      setModalOfertaOpen(false);
    } catch (err) {
      showToast("Error aplicando oferta", "error");
    }
  };

  const quitarOferta = async (producto: Producto) => {
    try {
      await quitarOfertaProducto(producto.id!);
      registrarAccionProducto(`Quitó la oferta de "${producto.name}"`);
      showToast(`${producto.name} ya no está en oferta`);
    } catch (err) {
      showToast("Error quitando oferta", "error");
    }
  };

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
      registrarAccionCuenta(`Creó la cuenta de ${nuevoUsuario.nombre} (${nuevoUsuario.rol})`);
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
      registrarAccionCuenta(`${u.bloqueado ? "Desbloqueó" : "Bloqueó"} a ${u.nombre}`);
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
      registrarAccionCuenta(`Eliminó a ${u.nombre}`);
      showToast("Usuario eliminado");
      cargarUsuarios();
    } catch {
      showToast("Error eliminando usuario", "error");
    }
  };
  const handleAgregarProducto = async (producto: Omit<Producto, "id">) => {
    await agregarProducto(producto);
    registrarAccionProducto(`Agregó el producto "${producto.name}"`);
    showToast("Producto agregado correctamente");
  };

  const handleToggleProducto = async (producto: Producto) => {
    const actualizado = { ...producto, habilitado: !producto.habilitado };
    await actualizarProducto(actualizado);
    registrarAccionProducto(
      `${actualizado.habilitado ? "Habilitó" : "Inhabilitó"} el producto "${producto.name}"`
    );
    showToast(
      `Producto "${producto.name}" ${producto.habilitado ? "inhabilitado" : "habilitado"
      } correctamente.`
    );
  };

  const handleEliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    const prod = productos.find((x) => x.id === id);
    await eliminarProductoLocal(id);
    registrarAccionProducto(`Eliminó el producto "${prod?.name}"`);
    showToast("Producto eliminado correctamente");
  };
  const cambiarEstadoCompra = (
    codigo: string,
    estado: "PREPARANDO" | "EN_DESPACHO" | "ENTREGADO"
  ) => {
    const historial = JSON.parse(localStorage.getItem("historialCompras") || "[]");
    const actualizadoHistorial = historial.map((p: any) =>
      p.codigo === codigo ? { ...p, estado } : p
    );
    localStorage.setItem("historialCompras", JSON.stringify(actualizadoHistorial));

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

    registrarAccionCuenta(`Cambió estado de compra #${codigo} a "${estado}"`);
    showToast(`Estado actualizado a "${estado}"`);
  };

  const mostrarDetalleCompra = (compra: any) => {
    setModalDetalleCompra({
      ...compra,
      productos: compra.productos || [],
    });
  };

  const [seccionActual, setSeccionActual] = useState<
    "menu" | "productos" | "estadisticas" | "cuentas" | "historial" | "contacto" | "valoraciones"
  >("menu");

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
      <button onClick={() => setSeccionActual("historial")}>Historial</button>
      <button onClick={() => setSeccionActual("valoraciones")}>Valoraciones</button>
      <button onClick={() => setSeccionActual("contacto")}>Mensajes</button>

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

  const [modalOpen, setModalOpen] = useState(false);
  const [filtroProductos, setFiltroProductos] = useState("");

  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(filtroProductos.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(filtroProductos.toLowerCase())
  );

  // ==========================
  // RENDER PRINCIPAL
  // ==========================
  return (
    <div className="admin-container">
      <Sidebar />

      <main className="admin-content">
        {/* DASHBOARD */}
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

            <div className="admin-card-box admin-card-small">
              <h4>{historialProductos.length + historialCuentas.length}</h4>
              <p>Acciones registradas</p>
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

        {/* GESTIÓN DE PRODUCTOS */}
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
                    {productosFiltrados.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>${p.precio.toLocaleString("es-CL")}</td>
                        <td>
                          <span
                            className={`badge ${p.habilitado ? "bg-success" : "bg-danger"}`}
                          >
                            {p.habilitado ? "Habilitado" : "Inhabilitado"}
                          </span>
                        </td>
                        <td>{p.oferta ? `${p.descuento}%` : "-"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => handleToggleProducto(p)}
                          >
                            {p.habilitado ? "Inhabilitar" : "Habilitar"}
                          </button>

                          {!p.oferta ? (
                            <button
                              className="btn btn-warning btn-sm me-1"
                              onClick={() => abrirModalOferta(p)}
                            >
                              Oferta
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-sm me-1"
                              onClick={() => quitarOferta(p)}
                            >
                              Quitar Oferta
                            </button>
                          )}

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminarProducto(p.id!)}
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

        {/* ESTADÍSTICAS */}
        {seccionActual === "estadisticas" && (
          <section>
            <h2 className="text-center mb-4">Estadísticas</h2>
            {/* Usamos productosEstadistica para que incluya valoraciones de localStorage */}
            <AdminEstadisticas productos={productosEstadistica} />
          </section>
        )}

        {/* GESTIÓN DE USUARIOS */}
        {seccionActual === "cuentas" && (
          <section>
            <h2 className="text-center mb-4">Gestión de Usuarios</h2>

            <div className="mb-3 d-flex justify-content-end">
              <button
                className="btn btn-success"
                onClick={() => setModalCrearCuentaOpen(true)}
              >
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
                      <span
                        className={`badge ${u.bloqueado ? "bg-danger" : "bg-success"}`}
                      >
                        {u.bloqueado ? "Bloqueado" : "Activo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.bloqueado ? "btn-success" : "btn-warning"
                          } me-1`}
                        onClick={() => cambiarEstadoUsuario(u)}
                      >
                        {u.bloqueado ? "Desbloquear" : "Bloquear"}
                      </button>

                      <button
                        className="btn btn-info btn-sm me-1"
                        onClick={() => setUsuarioSeleccionado(u)}
                      >
                        Ver Detalles
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

        {/* HISTORIAL */}
        {seccionActual === "historial" && (
          <section>
            <h2 className="text-center mb-4">Historial de Actividades</h2>

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
              {/* Historial Productos */}
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

              {/* Historial Cuentas */}
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

        {/* VALORACIONES */}
        {seccionActual === "valoraciones" && (
          <section>
            <h2 className="text-center mb-4">Valoraciones de Productos</h2>

            {valoracionesAdmin.length === 0 ? (
              <p className="text-center text-muted">No hay valoraciones aún.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle shadow-sm">
                  <thead className="table-warning">
                    <tr>
                      <th>Producto</th>
                      <th>Usuario</th>
                      <th>Comentario</th>
                      <th>Estrellas</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valoracionesAdmin.map((v, idx) => (
                      <tr key={`${v.productoId}-${idx}-${v.indice}`}>
                        <td>{v.productoNombre}</td>
                        <td>{v.usuario}</td>
                        <td>{v.comentario}</td>
                        <td>{"★".repeat(v.estrellas)}</td>
                        <td>{v.fecha}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarValoracion(v)}
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

        {/* MENSAJES DE CONTACTO */}
        {seccionActual === "contacto" && (
          <section>
            <h2 className="text-center mb-4">Mensajes de Contacto</h2>

            {mensajesContacto.length === 0 ? (
              <p className="text-center text-muted">No hay mensajes aún.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle shadow-sm">
                  <thead className="table-success">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensajesContacto.map((m, i) => (
                      <tr key={i}>
                        <td>{m.nombre}</td>
                        <td>{m.correo}</td>
                        <td>{m.telefono || "-"}</td>
                        <td className="text-start">{m.mensaje}</td>
                        <td>{new Date(m.fecha).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarMensajeContacto(i)}
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
      </main>

      {/* MODAL AGREGAR PRODUCTO */}
      <ModalAgregarProducto
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGuardar={handleAgregarProducto}
      />

      {/* MODAL CREAR CUENTA */}
      {modalCrearCuentaOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Crear Usuario</h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setModalCrearCuentaOpen(false)}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={guardarUsuario}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    className="form-control"
                    placeholder="Ingresa el nombre"
                    required
                    value={nuevoUsuario.nombre}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    required
                    value={nuevoUsuario.email}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">RUT</label>
                  <input
                    className="form-control"
                    placeholder="12.345.678-9"
                    value={nuevoUsuario.rut}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, rut: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    value={nuevoUsuario.password}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={nuevoUsuario.rol}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                    }
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setModalCrearCuentaOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OFERTA */}
      {modalOfertaOpen && productoSeleccionado && (
        <div className="modal-overlay-fixed">
          <div className="modal-oferta-content">
            <h5 className="modal-oferta-title">🎯 Agregar Oferta</h5>

            <div className="oferta-product-name">{productoSeleccionado.name}</div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Porcentaje de descuento:</label>

              <input
                type="number"
                className="form-control"
                value={porcentajeOferta}
                min={5}
                max={90}
                placeholder="20"
                onChange={(e) => onChangeDescuento(Number(e.target.value))}
              />

              <small className="text-muted">Entre 5% y 90%</small>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-secondary"
                onClick={() => setModalOfertaOpen(false)}
              >
                Cancelar
              </button>

              <button className="btn btn-success px-4" onClick={guardarOferta}>
                ✅ Aplicar Oferta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE USUARIO */}
      {usuarioSeleccionado && (
        <div className="modal-overlay-fixed">
          <div className="modal-content" style={{ maxWidth: "800px", width: "95%" }}>
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                👤 Detalles del Usuario — {usuarioSeleccionado.nombre}
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setUsuarioSeleccionado(null)}
              ></button>
            </div>

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
                  <p>
                    <strong>Correo:</strong> {usuarioSeleccionado.email}
                  </p>
                  <p>
                    <strong>RUT:</strong> {usuarioSeleccionado.rut || "No especificado"}
                  </p>
                  <p>
                    <strong>Rol:</strong> {usuarioSeleccionado.rol}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`badge ${usuarioSeleccionado.bloqueado ? "bg-danger" : "bg-success"
                        }`}
                    >
                      {usuarioSeleccionado.bloqueado ? "Bloqueado" : "Activo"}
                    </span>
                  </p>
                  <hr />
                  <p>
                    <strong>Total de compras:</strong>{" "}
                    {usuarioSeleccionado.compras?.length || 0}
                  </p>
                  <p>
                    <strong>Total gastado:</strong> $
                    {(
                      usuarioSeleccionado.compras?.reduce(
                        (acc: number, c: any) => acc + c.total,
                        0
                      ) || 0
                    ).toLocaleString("es-CL")}
                  </p>
                </div>

                {/* TAB COMPRAS */}
                <div className="tab-pane fade" id="compras">
                  {usuarioSeleccionado.compras &&
                    usuarioSeleccionado.compras.length > 0 ? (
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
                              <span
                                className={`badge estado-${(
                                  compra.estado || "PREPARANDO"
                                ).toLowerCase()}`}
                              >
                                {(compra.estado || "PREPARANDO") === "PREPARANDO" &&
                                  "Preparando"}
                                {(compra.estado || "PREPARANDO") === "EN_DESPACHO" &&
                                  "En despacho"}
                                {(compra.estado || "PREPARANDO") === "ENTREGADO" &&
                                  "Entregado"}
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
                                  onClick={() =>
                                    cambiarEstadoCompra(compra.codigo, "EN_DESPACHO")
                                  }
                                >
                                  En despacho
                                </button>
                              )}
                              {compra.estado !== "ENTREGADO" && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() =>
                                    cambiarEstadoCompra(compra.codigo, "ENTREGADO")
                                  }
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
                    <p className="text-center text-muted mt-3">
                      No hay compras registradas.
                    </p>
                  )}
                </div>

                {/* TAB ESTADÍSTICAS */}
                <div className="tab-pane fade" id="estadisticas">
                  <div className="card p-3 shadow-sm">
                    {usuarioSeleccionado.compras &&
                      usuarioSeleccionado.compras.length > 0 ? (
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
                          {
                            usuarioSeleccionado.compras[
                              usuarioSeleccionado.compras.length - 1
                            ].fecha
                          }
                        </p>
                      </>
                    ) : (
                      <p className="text-center text-muted">
                        No hay datos para mostrar estadísticas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setUsuarioSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE COMPRA */}
      {modalDetalleCompra && (
        <div className="modal-overlay-fixed">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">🧾 Detalle de Compra</h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setModalDetalleCompra(null)}
              ></button>
            </div>

            <div className="modal-body">
              <p className="fw-semibold text-center mb-3">
                #{modalDetalleCompra?.codigo}
              </p>

              <ul className="list-group mb-3">
                {modalDetalleCompra.productos.map((p: any, i: number) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{p.name}</span>
                    <strong className="badge bg-success rounded-pill">
                      x{p.cantidad}
                    </strong>
                  </li>
                ))}
              </ul>

              <div className="card p-3 bg-light">
                <p className="mb-2">
                  <strong>Total:</strong> $
                  {modalDetalleCompra.total?.toLocaleString("es-CL")}
                </p>
                <p className="mb-2">
                  <strong>Método de pago:</strong> {modalDetalleCompra.metodoPago}
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
      )}
    </div>
  );
};

export default Admin;
