import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Páginas principales
import Home from "./assets/pages/Home";
import Productos from "./assets/pages/Productos";
import ProductoDetalle from "./assets/pages/ProductoDetalle";
import Contacto from "./assets/pages/Contacto";
import Recetas from "./assets/pages/Recetas";
import QuienesSomos from "./assets/pages/QuienesSomos";
import Terminos from "./assets/pages/Terminos";

//Cuentas y usuario
import MiCuenta from "./assets/pages/MiCuenta";
import CrearCuenta from "./assets/pages/CrearCuenta";
import MiPerfil from "./assets/pages/MiPerfil.tsx";
import MisPedidos from "./assets/pages/MisPedidos.tsx";

//Comercio y admin
import Carrito from "./assets/pages/Carrito";
import Checkout from "./assets/pages/Checkout";
import Admin from "./assets/pages/Admin";

//Componentes y hooks
import Navbar from "./assets/components/Navbar";
import RutaProtegida from "./assets/routes/RutaProtegida";
import { ToastContainer, useToast } from "./assets/components/Toast";
import { useAuth } from "./assets/hooks/useAuth";
import RestablecerPassword from "./assets/pages/RestablecerPassword";


const App: React.FC = () => {
  const { usuario } = useAuth();
  const [carritoCount, setCarritoCount] = React.useState<number>(0);

  // Nuevo: para ocultar el navbar en /admin
  const location = useLocation();
  const ocultarNavbar = location.pathname.startsWith("/admin");

  // Hook para mostrar mensajes flotantes
  const showToast = useToast();

  //Actualizar contador carrito
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

  //Render principal
  return (
    <>
      {!ocultarNavbar && <Navbar carritoCount={carritoCount} />}

      {/*RUTAS PRINCIPALES*/}
      <Routes>
        {/* Inicio */}
        <Route path="/" element={<Home />} />

        {/* Productos */}
        <Route
          path="/productos"
          element={
            <Productos
              onAddToCart={() =>
                showToast("🛒 Producto agregado al carrito", "exito")
              }
              mostrarToast={(msg: string) => showToast(msg, "info")}
              usuario={usuario}
            />
          }
        />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/restablecer-password" element={<RestablecerPassword />} />

        {/* Información */}
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/quienessomos" element={<QuienesSomos />} />
        <Route path="/terminos" element={<Terminos />} />

        {/* Cuenta */}
        <Route
          path="/mi-cuenta"
          element={<MiCuenta mostrarToast={(msg) => showToast(msg, "exito")} />}
        />
        <Route
          path="/crear-cuenta"
          element={<CrearCuenta mostrarToast={(msg) => showToast(msg, "exito")} />}
        />
        <Route path="/mi-perfil" element={<MiPerfil />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        {/* Comercio */}
        <Route path="/carrito" element={<Carrito />} />
        <Route
          path="/checkout"
          element={<RutaProtegida element={<Checkout />} />}
        />

        {/* Panel Admin */}
        <Route
          path="/admin"
          element={<RutaProtegida element={<Admin />} adminOnly />}
        />

        {/* 404 */}
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

      {/*TOASTS*/}
      <ToastContainer />
    </>
  );
};

export default App;
