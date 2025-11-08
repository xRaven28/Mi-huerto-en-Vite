import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./assets/pages/Home";
import Productos from "./assets/pages/Productos";
import ProductoDetalle from "./assets/pages/ProductoDetalle";
import Contacto from "./assets/pages/Contacto";
import Recetas from "./assets/pages/Recetas";
import QuienesSomos from "./assets/pages/QuienesSomos";
import Terminos from "./assets/pages/Terminos";

import MiCuenta from "./assets/pages/MiCuenta";
import CrearCuenta from "./assets/pages/CrearCuenta";
import RecuperarContrasena from "./assets/pages/Recuperar-contrasena";
import RestablecerContrasena from "./assets/pages/Restablecer_contrasena";

import Carrito from "./assets/pages/Carrito";
import Checkout from "./assets/pages/Checkout";
import Admin from "./assets/pages/Admin";

import Navbar from "./assets/components/Navbar";
import { ToastContainer } from "./assets/components/Toast";
import RutaProtegida from "./assets/routes/RutaProtegida";
import { useAuth } from "./assets/hooks/useAuth";
import MisPedidos from "./assets/pages/MisPedidos.tsx";
import MiPerfil from "./assets/pages/MiPerfil.tsx";

const App: React.FC = () => {
  const { usuario } = useAuth();
  const [toast, setToast] = React.useState<{ msg: string; bg?: string } | null>(null);
  const [carritoCount, setCarritoCount] = React.useState<number>(0);

  // Actualizar contador del carrito
  React.useEffect(() => {
    const actualizarCarrito = () => {
      try {
        const raw = localStorage.getItem("carrito") || "[]";
        const arr = JSON.parse(raw);
        setCarritoCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCarritoCount(0);
      }
    };

    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
    return () => window.removeEventListener("storage", actualizarCarrito);
  }, []);

  // ===============================
  // Sistema de toasts
  // ===============================
  const handleToast = (msg: string, color?: string) => {
    setToast({ msg, bg: color });
    setTimeout(() => setToast(null), 4000);
  };

  // ===============================
  // 🌍 Render principal
  // ===============================
  return (
    <>
      <Navbar carritoCount={carritoCount} />

      {/* Contenedor global de notificaciones */}
      <ToastContainer />

      {/* Rutas principales */}
      <Routes>
        {/* 🏠 Página principal */}
        <Route path="/" element={<Home />} />

        {/* 🛍️ Productos */}
        <Route
          path="/productos"
          element={
            <Productos
              onAddToCart={() =>
                handleToast("🛒 Producto agregado al carrito", "#7cca33")
              }
              mostrarToast={handleToast}
              usuario={usuario}
            />
          }
        />
        <Route path="/producto/:id" element={<ProductoDetalle />} />

        {/* 📄 Páginas informativas */}
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/quienessomos" element={<QuienesSomos />} />
        <Route path="/terminos" element={<Terminos />} />

        {/* 👤 Cuenta de usuario */}
        <Route path="/mi-cuenta" element={<MiCuenta mostrarToast={handleToast} />} />
        <Route path="/crear-cuenta" element={<CrearCuenta mostrarToast={handleToast} />} />
        <Route
          path="/recuperar-contrasena"
          element={<RecuperarContrasena mostrarToast={handleToast} />}
        />
        <Route
          path="/restablecer-contrasena"
          element={<RestablecerContrasena mostrarToast={handleToast} />}
        />

        {/* 🛒 Comercio */}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<RutaProtegida element={<Checkout />} />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        {/* 🔒 Panel de administración */}
        <Route
          path="/admin"
          element={<RutaProtegida element={<Admin />} adminOnly />}
        />

        {/* 🚫 404 */}
        <Route
          path="*"
          element={
            <div className="container text-center py-5">
              <h2 className="text-danger mb-3">404</h2>
              <p>Página no encontrada</p>
              <a href="/" className="btn btn-success mt-3">
                Volver al inicio
              </a>
            </div>
          }
        />
      </Routes>

      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            background: toast.bg || "#198754",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            zIndex: 3000,
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default App;
