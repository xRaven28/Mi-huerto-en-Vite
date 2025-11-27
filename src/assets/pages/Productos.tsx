import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import type { Producto } from "../types";
import StarRating from "../components/StarRating";


/*Tipos y helpers*/
interface ProductosProps {
  onAddToCart: () => void;
  mostrarToast: (message: string, color?: string) => void;
  usuario: any;
}

type ProductoCarrito = Producto & { cantidad: number };
const STORAGE_KEY = "carrito";

const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const buildImageVariants = (raw: string | undefined | null): string[] => {
  const fallback = ["/img/placeholder.jpg"];
  if (!raw) return fallback;

  let s = String(raw).replace(/\\/g, "/").trim();
  const dot = s.lastIndexOf(".");
  const base = dot >= 0 ? s.slice(0, dot) : s;
  const ext = dot >= 0 ? s.slice(dot) : ".jpg";
  const baseNoAcc = stripDiacritics(base);
  const baseLow = baseNoAcc.toLowerCase();

  return [
    `/${s}`,
    `/img/${base}${ext}`,
    `/img/${baseLow}${ext}`,
    `/img/${baseLow}.png`,
    `/img/${baseLow}.jpeg`,
    `/img/${baseLow}.webp`,
    "/img/placeholder.jpg",
  ];
};

/* Hook seguro para imágenes */
const useImageSrc = (img?: string) => {
  const safeImg = typeof img === "string" ? img : "";
  const variants = useMemo(() => buildImageVariants(safeImg), [safeImg]);
  const [idx, setIdx] = useState(0);
  const src = variants[idx] || "/img/placeholder.jpg";

  const onError = () => setIdx((i) => (i < variants.length - 1 ? i + 1 : i));
  return { src, onError };
};

/* Clasifica categoría */
const toCategoryKey = (c: string) => {
  const s = c.toLowerCase();
  if (s.includes("fruta")) return "frutas";
  if (s.includes("verdura")) return "verduras";
  if (s.includes("lact")) return "lacteos";
  if (s.includes("legumbre") || s.includes("cereal")) return "legumbres";
  return "otros";
};

/*Tarjeta individual de producto*/
const ProductoCard: React.FC<{
  producto: Producto;
  onAdd: (p: Producto) => void;
}> = ({ producto, onAdd }) => {
  const { src, onError } = useImageSrc(producto.img);
  const catKey = toCategoryKey(producto.categoria);

  const valoraciones = producto.valoraciones || [];
  const promedio =
    valoraciones.length > 0
      ? valoraciones.reduce((acc, v) => acc + (v.estrellas || 0), 0) /
        valoraciones.length
      : 0;

  const precioFinal = producto.oferta
    ? Math.round(producto.precio * (1 - (producto.descuento || 0) / 100))
    : producto.precio;

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 mb-4">
      <div className={`hh-card cat-${catKey}`}>
        <div className="hh-media position-relative">
          <img src={src} alt={producto.name} onError={onError} />
          {producto.oferta && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              {producto.descuento}% OFF
            </span>
          )}
        </div>

        <div className="hh-body text-center">
          <h5 className="hh-title">{producto.name}</h5>
          <div className="mb-2 d-flex justify-content-center align-items-center flex-column">
            <StarRating value={promedio} readOnly size={18} />
            <small className="text-muted">
              {valoraciones.length > 0
                ? `(${valoraciones.length} valoración${
                    valoraciones.length > 1 ? "es" : ""
                  })`
                : "Sin valoraciones aún"}
            </small>
          </div>

          <div className="hh-price mb-2">
            {producto.oferta ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  ${producto.precio.toLocaleString("es-CL")}
                </span>
                <span className="fw-bold text-danger">
                  ${precioFinal.toLocaleString("es-CL")}
                </span>
              </>
            ) : (
              <span>${producto.precio.toLocaleString("es-CL")}</span>
            )}
          </div>

          <div className="hh-buttons">
            <Link to={`/producto/${producto.id}`} className="btn btn-ver">
              <i className="bi bi-eye"></i> Ver
            </Link>
            <button className="btn btn-anadir" onClick={() => onAdd(producto)}>
              <i className="bi bi-cart-plus"></i> Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/*Componente principal Productos*/
const Productos: React.FC<ProductosProps> = ({ onAddToCart, mostrarToast }) => {
  const { productos, loading, getProductosCliente } = useProductos();
  const [categoria, setCategoria] = useState("todos");
  const [orden, setOrden] = useState("relevancia");
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  /*Sincroniza búsqueda */
  useEffect(() => {
    const actualizarBusqueda = () => {
      const term = (localStorage.getItem("busqueda") || "").toLowerCase();
      setBusqueda(term);
    };
    actualizarBusqueda();
    window.addEventListener("storage", actualizarBusqueda);
    return () => window.removeEventListener("storage", actualizarBusqueda);
  }, []);

  /* Filtrado y orden */
  useEffect(() => {
    try {
      let filtered = getProductosCliente(busqueda).filter((p) => p.habilitado);

      if (categoria !== "todos") {
        filtered = filtered.filter(
          (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
        );
      }

      switch (orden) {
        case "precio-asc":
          filtered = [...filtered].sort((a, b) => a.precio - b.precio);
          break;
        case "precio-desc":
          filtered = [...filtered].sort((a, b) => b.precio - a.precio);
          break;
        case "nombre-asc":
          filtered = [...filtered].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        case "nombre-desc":
          filtered = [...filtered].sort((a, b) =>
            b.name.localeCompare(a.name)
          );
          break;
        default:
          filtered = [...filtered].sort(() => Math.random() - 0.5);
      }

      setProductosFiltrados(filtered);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error filtrando productos:", error);
    }
  }, [productos, busqueda, categoria, orden, getProductosCliente]);

  /* Agregar al carrito */
  const handleAddToCart = useCallback(
    (producto: Producto) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || "[]";
        const carrito: ProductoCarrito[] = JSON.parse(raw);
        const idx = carrito.findIndex((p) => p.id === producto.id);
        if (idx >= 0) carrito[idx].cantidad += 1;
        else carrito.push({ ...producto, cantidad: 1 });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));

        onAddToCart();
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        mostrarToast("Error al agregar producto", "#dc3545");
      }
    },
    [onAddToCart, mostrarToast]
  );

  /* Paginación */
  const indexOfLast = paginaActual * productosPorPagina;
  const indexOfFirst = indexOfLast - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  /* Cargando */
  if (loading) {
    return (
      <div
        className="container text-center py-5 productos-page"
        style={{ marginTop: "100px" }}
      >
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }

  /*Render principal*/
  return (
    <>
      <main className="container py-5 productos-page" style={{ marginTop: "100px" }}>
        <h2 className="text-center mb-4">
          <i className="bi bi-cart3 me-2"></i> Todos los Productos
        </h2>

        <div className="row mb-4 align-items-center text-center">
          <div className="col-md-6 mb-2">
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              <option value="frutas">Frutas</option>
              <option value="verduras">Verduras</option>
              <option value="Legumbres-Cereales">Legumbres y Cereales</option>
              <option value="Lacteos">Lácteos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div className="col-md-6 mb-2">
            <select
              className="form-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="relevancia">Ordenar por...</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre-asc">Nombre: A - Z</option>
              <option value="nombre-desc">Nombre: Z - A</option>
            </select>
          </div>
        </div>

        {/*Lista de productos */}
        <div className="row gy-4 mt-4">
          {productosPagina
            .filter((p) => p && p.id && p.img)
            .map((p) => (
              <ProductoCard key={p.id} producto={p} onAdd={handleAddToCart} />
            ))}
        </div>

        {/*Paginación */}
        {totalPaginas > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/*Sin resultados */}
        {productosFiltrados.length === 0 && !loading && (
          <div className="text-center mt-4">
            <div className="alert alert-warning">
              <i className="bi bi-search me-2"></i>No se encontraron productos.
            </div>
          </div>
        )}
      </main>

      {/*FOOTER */}
      <footer className="footer-custom text-white pt-5 pb-3 mt-5 w-100">
        <div className="container">
          <div className="row px-5">
            <div className="col-md-4 mb-3">
              <h5>Contacto</h5>
              <p>Email: contacto@huertohogar.cl</p>
              <p>Tel: +56 9 1234 5678</p>
              <p>Dirección: Calle Ejemplo 123, Concepción, Chile</p>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Enlaces útiles</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
                <li><a href="/productos" className="text-white text-decoration-none">Productos</a></li>
                <li><a href="/recetas" className="text-white text-decoration-none">Recetas</a></li>
                <li>
                  <a
                    href="https://github.com/xRaven28/HuertoHogar.git"
                    className="text-white text-decoration-none"
                    target="_blank"
                  >
                    GitHub de esta página
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Síguenos</h5>
              <a href="#" className="text-white d-block mb-1">
                <i className="bi bi-facebook"></i> Facebook
              </a>
              <a href="#" className="text-white d-block mb-1">
                <i className="bi bi-instagram"></i> Instagram
              </a>
              <a href="#" className="text-white d-block">
                <i className="bi bi-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>

          <hr className="bg-white mx-5" />
          <p className="text-center mb-0 small">
            &copy; 2025 Huerto Hogar. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
};

export default React.memo(Productos);
