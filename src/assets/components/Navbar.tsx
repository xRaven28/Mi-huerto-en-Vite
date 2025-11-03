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

  // Guarda la búsqueda y actualiza Productos
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("busqueda", busqueda);
    window.dispatchEvent(new Event("storage"));
    if (location.pathname !== "/productos") navigate("/productos");
  };

  // Mantener la búsqueda persistente
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
          <span className="brand-text">HuertoHogar</span>
        </Link>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recetas">Recetas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/quienes-somos">Quiénes Somos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
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

            {/* CARRITO */}
            <li className="nav-item ms-3 position-relative">
              <Link className="nav-link" to="/carrito">
                <i className="bi bi-cart4 fs-5"></i>
                {carritoCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {carritoCount}
                  </span>
                )}
              </Link>
            </li>

            {/* CUENTA */}
            <li className="nav-item ms-2">
              {usuario ? (
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-light dropdown-toggle"
                    type="button"
                    id="dropdownUser"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {usuario.nombre.split(" ")[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/mi-cuenta">
                        Mi Cuenta
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/historial">
                        Historial
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={onLogout}>
                        <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link className="nav-link" to="/mi-cuenta">
                  <i className="bi bi-person-circle me-1"></i> Mi Cuenta
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
