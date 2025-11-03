import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './assets/pages/Home';
import Productos from './assets/pages/Productos';
import ProductoDetalle from './assets/pages/ProductoDetalle';
import Navbar from './assets/components/Navbar';
import Admin from './assets/pages/Admin';
import Carrito from './assets/pages/Carrito';
import Checkout from './assets/pages/Checkout';
import Contacto from './assets/pages/Contacto';

import { useAuth } from './assets/hooks/useAuth';
import Toast from './assets/components/Toast';

const App: React.FC = () => {
  const { usuario } = useAuth();

  const [toast, setToast] = React.useState<{ msg: string; bg?: string } | null>(null);

  const carritoCount = (() => {
    try {
      const raw = localStorage.getItem('carrito') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  })();

  const handleToast = (msg: string, color?: string) => {
    setToast({ msg, bg: color });
  };

  return (
    <>
      <Navbar carritoCount={carritoCount} usuario={usuario} />
      {toast && (
        <Toast
          message={toast.msg}
          color={toast.bg}
          onClose={() => setToast(null)}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/productos"
          element={
            <Productos
              onAddToCart={() => console.log('Producto agregado')}
              mostrarToast={handleToast}
              usuario={usuario}
            />
          }
        />
        <Route path="/producto/:id" element={<ProductoDetalle />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route
          path="*"
          element={<div className="container py-5">Página no encontrada</div>}
        />
      </Routes>
    </>
  );
};

export default App;
