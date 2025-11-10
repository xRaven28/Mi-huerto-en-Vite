import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface MiCuentaProps {
  mostrarToast: (message: string, color?: string) => void;
}

const MiCuenta: React.FC<MiCuentaProps> = ({ mostrarToast }) => {
  const navigate = useNavigate();
  const { usuario, login, logout, esAdmin } = useAuth();
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [recordarme, setRecordarme] = useState(false);
  const [errores, setErrores] = useState({ correo: "", password: "" });

  useEffect(() => {
    if (usuario) navigate("/");
  }, [usuario, navigate]);

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errores[id as keyof typeof errores]) setErrores((prev) => ({ ...prev, [id]: "" }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores = { correo: "", password: "" };
    let valido = true;

    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
      valido = false;
    } else if (!validarEmail(formData.correo)) {
      nuevosErrores.correo = "Correo electrónico inválido";
      valido = false;
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      mostrarToast("Corrige los errores del formulario", "#dc3545");
      return;
    }

    const success = login(formData.correo, formData.password, recordarme);
    if (success) {
      mostrarToast(`Bienvenido a HuertoHogar`);
      setTimeout(() => navigate("/"), 1000);
    } else {
      mostrarToast("Correo o contraseña incorrectos", "#dc3545");
    }
  };

  const handleCerrarSesion = () => {
    logout();
    mostrarToast("Sesión cerrada correctamente", "#6c757d");
    navigate("/");
  };

  const handleAdminClick = () => navigate("/admin");

  // ============================
  // 🌿 MODO USUARIO LOGUEADO
  // ============================
  if (usuario) {
    return (
      <main className="container py-5 micuenta-page">
        <h2 className="text-center text-success mb-4">👤 Mi Cuenta</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4 text-center">
                <i className="bi bi-person-circle fs-1 text-success"></i>
                <h3 className="mt-3">¡Hola, {usuario.nombre}!</h3>
                <p className="text-muted mb-4">Bienvenido a tu cuenta</p>

                <div className="text-start mb-4">
                  <h5>Información de la cuenta:</h5>
                  <p><strong>Nombre:</strong> {usuario.nombre}</p>
                  <p><strong>Correo:</strong> {usuario.correo}</p>
                  {usuario.rut && <p><strong>RUN:</strong> {usuario.rut}</p>}
                  {usuario.telefono && <p><strong>Teléfono:</strong> {usuario.telefono}</p>}
                  {usuario.direccion && <p><strong>Dirección:</strong> {usuario.direccion}</p>}
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-outline-success" onClick={() => navigate("/historial")}>
                    <i className="bi bi-clock-history me-2"></i> Ver Historial
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => navigate("/editar-cuenta")}>
                    <i className="bi bi-pencil-square me-2"></i> Editar Información
                  </button>
                  <button className="btn btn-danger" onClick={handleCerrarSesion}>
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de administrador visible solo si es admin */}
        {esAdmin && (
          <div className="text-center mt-4">
            <button className="btn btn-danger btn-lg" onClick={handleAdminClick}>
              <i className="bi bi-shield-lock"></i> Panel de Administrador
            </button>
          </div>
        )}
      </main>
    );
  }
  
  //MODO LOGIN
  return (
    <main className="container mi-cuenta-page" style={{ paddingTop: "120px" }}>
      <h2 className="text-center text-success mb-4">👤 Mi Cuenta</h2>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Iniciar Sesión</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label fw-bold">
                    Correo
                  </label>
                  <input
                    type="email"
                    id="correo"
                    className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                    placeholder="ejemplo@correo.com"
                    value={formData.correo}
                    onChange={handleInputChange}
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control ${errores.password ? "is-invalid" : ""}`}
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="recordarme"
                    className="form-check-input"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="recordarme">
                    Recordarme
                  </label>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success fw-bold">
                    Ingresar
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <a
                  href="/recuperar-contrasena"
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/recuperar-contrasena");
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
                <p className="mt-3">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/crear-cuenta"
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/crear-cuenta");
                    }}
                  >
                    Crear cuenta
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MiCuenta;
