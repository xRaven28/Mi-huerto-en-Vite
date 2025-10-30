import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  carritoCount?: number;
  usuario?: any;
}

const Navbar: React.FC<Props> = ({ carritoCount = 0, usuario }) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-huerto fixed-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center text-white">
          <img src="/Img/LogoHuerto.png" alt="logo huerto" width={45} height={45} className="me-2" />
          <span className="brand-text">HuertoHogar</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link to="/" className="nav-link text-white">Inicio</Link></li>
            <li className="nav-item"><Link to="/productos" className="nav-link text-white">Productos</Link></li>
            <li className="nav-item"><Link to="/recetas" className="nav-link text-white">Recetas</Link></li>
            <li className="nav-item"><Link to="/contacto" className="nav-link text-white">Contacto</Link></li>
            <li className="nav-item"><Link to="/admin" className="nav-link text-white">Admin</Link></li>
          </ul>

          <form className="d-flex align-items-center">
            <input id="buscar-input" className="form-control me-2" type="text" placeholder="Buscar producto..." />
            <Link to="/carrito" className="icon-link me-3 position-relative text-white">
              <i className="bi bi-cart3 fs-4"></i>
              <span className="badge bg-success position-absolute" style={{ top: -8, right: -10 }}>{carritoCount}</span>
            </Link>
            {usuario ? (
              <div className="text-white ms-2">Hola, {usuario.nombre || usuario.correo}</div>
            ) : (
              <Link to="/login" className="text-white">Mi Cuenta</Link>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
