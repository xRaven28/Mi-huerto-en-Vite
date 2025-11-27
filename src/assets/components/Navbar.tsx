import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  carritoCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ carritoCount = 0 }) => {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, esAdmin, logout } = useAuth();

  // Buscar productos
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("busqueda", busqueda);
    window.dispatchEvent(new Event("storage"));
    if (location.pathname !== "/productos") navigate("/productos");
  };

  // Mantener búsqueda al recargar
  useEffect(() => {
    const term = localStorage.getItem("busqueda") || "";
    setBusqueda(term);
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Efecto de navbar transparente al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      const nav = document.querySelector(".navbar-huerto");
      if (!nav) return;
      if (window.scrollY > 10) nav.classList.add("nav-scroll");
      else nav.classList.remove("nav-scroll");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-huerto fixed-top shadow-sm">
      <div className="container-fluid px-4">

        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Img/LogoHuerto.png"
            alt="Logo HuertoHogar"
            width="45"
            height="45"
            className="me-2 rounded-circle"
          />
          <span className="brand-text fw-bold">HuertoHogar</span>
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

        {/* CONTENIDO PRINCIPAL */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* LINKS */}
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/recetas">Recetas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/quienessomos">Quiénes Somos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>

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
              <Link className="nav-link d-flex align-items-center position-relative" to="/carrito">
                <i className="bi bi-cart3 fs-4"></i>
                {carritoCount > 0 && (
                  <span
                    className="badge rounded-pill bg-success position-absolute"
                    style={{
                      fontSize: "0.7rem",
                      top: "-3px",
                      right: "-8px",
                      padding: "0.3em 0.45em",
                      zIndex: 10,
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
                    className="btn btn-sm dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="dropdownUser"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ border: "none", background: "transparent", color: "#fff" }}
                  >
                    <i className="bi bi-person-circle fs-5 me-1"></i>
                    <span className="fw-semibold">
                      {usuario.nombre?.split(" ")[0] || "Cuenta"}
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    {esAdmin ? (
                      <>
                        <li><Link className="dropdown-item text-success fw-semibold" to="/admin"><i className="bi bi-gear me-2"></i>Panel Admin</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
                      </>
                    ) : (
                      <>
                        <li><Link className="dropdown-item" to="/mi-perfil"><i className="bi bi-person-lines-fill me-2"></i>Mi perfil</Link></li>
                        <li><Link className="dropdown-item" to="/mis-pedidos"><i className="bi bi-bag-check me-2"></i>Mis pedidos</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
                      </>
                    )}
                  </ul>
                </div>
              ) : (
                <Link className="nav-link d-flex align-items-center" to="/mi-cuenta">
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
