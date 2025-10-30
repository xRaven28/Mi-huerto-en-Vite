import React, { useState, useEffect } from 'react';
import { ProductoCarrito, Usuario } from '../types/index';
import { CarritoService } from '../services/carrito';
import { useNavigate } from 'react-router-dom';

interface CarritoProps {
  mostrarToast: (msg: string, color?: string) => void;
  onCartUpdate: () => void;
  usuario: Usuario | null;
}

const Carrito: React.FC<CarritoProps> = ({ mostrarToast, onCartUpdate, usuario }) => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = (): void => {
    const carritoData = CarritoService.obtenerCarrito();
    setCarrito(carritoData);
    calcularTotal(carritoData);
  };

  const calcularTotal = (carritoItems: ProductoCarrito[]): void => {
    const totalCalculado = carritoItems.reduce((sum, item) => {
      return sum + (item.precio * item.cantidad);
    }, 0);
    setTotal(totalCalculado);
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number): void => {
    if (nuevaCantidad < 1) return;

    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = nuevaCantidad;
    
    setCarrito(nuevoCarrito);
    CarritoService.guardarCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
    onCartUpdate();
  };

  const eliminarProducto = (index: number): void => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    
    setCarrito(nuevoCarrito);
    CarritoService.guardarCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);
    onCartUpdate();
    mostrarToast('Producto eliminado del carrito', '#dc3545');
  };

  const handlePagar = (): void => {
    if (carrito.length === 0) {
      mostrarToast("Tu carrito está vacío", "#dc3545");
      return;
    }

    if (!usuario) {
      mostrarToast("Debes iniciar sesión antes de comprar", "#dc3545");
      navigate('/mi-cuenta');
      return;
    }

    // Navegar a checkout
    navigate('/checkout');
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>
        <div className="text-center">
          <div className="alert alert-info">
            <i className="bi bi-cart-x me-2"></i>
            Tu carrito está vacío
          </div>
          <button 
            className="btn btn-success mt-3"
            onClick={() => navigate('/productos')}
          >
            Ir a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto, index) => (
              <CarritoItem
                key={`${producto.id}-${index}`}
                producto={producto}
                index={index}
                onActualizarCantidad={actualizarCantidad}
                onEliminar={eliminarProducto}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3">
        <h4>Total: <span className="text-success">${total.toLocaleString("es-CL")}</span></h4>
        <button 
          className="btn btn-success btn-lg mt-3" 
          onClick={handlePagar}
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  );
};

// Componente para cada item del carrito
interface CarritoItemProps {
  producto: ProductoCarrito;
  index: number;
  onActualizarCantidad: (index: number, cantidad: number) => void;
  onEliminar: (index: number) => void;
}

const CarritoItem: React.FC<CarritoItemProps> = ({ 
  producto, 
  index, 
  onActualizarCantidad, 
  onEliminar 
}) => {
  const subtotal = producto.precio * producto.cantidad;

  return (
    <tr>
      <td>{producto.name}</td>
      <td style={{ width: '120px' }}>
        <img 
          src={producto.img} 
          alt={producto.name}
          style={{ maxWidth: '100px', maxHeight: '60px', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/placeholder.jpg';
          }}
        />
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-center">
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onActualizarCantidad(index, producto.cantidad - 1)}
            disabled={producto.cantidad <= 1}
          >
            -
          </button>
          <span className="mx-2">{producto.cantidad}</span>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onActualizarCantidad(index, producto.cantidad + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td className="text-center">${producto.precio.toLocaleString("es-CL")}</td>
      <td className="text-center">${subtotal.toLocaleString("es-CL")}</td>
      <td className="text-center">
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => onEliminar(index)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default Carrito;