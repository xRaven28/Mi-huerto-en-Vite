import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  carritoCount?: number;
  usuario?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ carritoCount = 0, usuario, onLogout }) => {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Maneja búsqueda
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("busqueda", busqueda);
    window.dispatchEvent(new Event("storage"));
    if (location.pathname !== "/productos") navigate("/productos");
  };

  // Mantener búsqueda persistente
  useEffect(() => {
    const term = localStorage.getItem("busqueda") || "";
    setBusqueda(term);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-huerto fixed-top shadow-sm">
      <div className="container-fluid px-4">
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/img/LogoHuerto.png"
            alt="Logo HuertoHogar"
            width="45"
            height="45"
            className="me-2 rounded-circle"
          />
          <span className="brand-text fw-bold text-white">HuertoHogar</span>
        </Link>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/recetas">Recetas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/quienessomos">Quiénes Somos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contacto">Contacto</Link>
            </li>

            {/* BUSCADOR */}
            <li className="nav-item ms-3">
              <form className="d-flex" onSubmit={handleBuscar}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ width: "200px" }}
                />
              </form>
            </li>

<li className="nav-item ms-3 position-relative">
  <Link className="nav-link text-white d-flex align-items-center position-relative" to="/carrito">
    <i className="bi bi-cart3 fs-4"></i>
    {carritoCount > 0 && (
      <span
        className="badge rounded-pill bg-success position-absolute"
        style={{
          fontSize: "0.7rem",
          top: "-3px",       
          right: "-8px",    
          padding: "0.3em 0.45em",
          zIndex: 10
        }}
      >
        {carritoCount}
      </span>
    )}
  </Link>
</li>


            {/* CUENTA */}
            <li className="nav-item ms-3">
              {usuario ? (
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="dropdownUser"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ border: "none", background: "transparent", color: "#fff" }}
                  >
                    <i className="bi bi-person-circle fs-5"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li>
                      <Link className="dropdown-item" to="/mi-cuenta">Mi Cuenta</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/historial">Historial</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={onLogout}>
                        <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link className="nav-link text-white d-flex align-items-center" to="/mi-cuenta">
                  <i className="bi bi-person-circle fs-5"></i>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
