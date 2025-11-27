import React from 'react';

interface LayoutProps {
  usuario: any;
  carritoCount: number;
  onLogout: () => void;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ usuario, carritoCount, onLogout, children }) => {
  return (
    <div>
      {/* Tu navegación aquí */}
      <nav>
        <div>Carrito: {carritoCount}</div>
        {usuario ? (
          <button onClick={onLogout}>Cerrar Sesión</button>
        ) : (
          <a href="/mi-cuenta">Iniciar Sesión</a>
        )}
      </nav>
      {children}
    </div>
  );
};

export default Layout;