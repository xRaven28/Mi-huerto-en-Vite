import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface MiCuentaProps {
  mostrarToast: (message: string, color?: string) => void;
}

const MiCuenta: React.FC<MiCuentaProps> = ({ mostrarToast }) => {
  const navigate = useNavigate();
  const { usuario, login, logout } = useAuth();

  // ✔ usar email (NO "correo")
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✔ errores también con email
  const [errores, setErrores] = useState({ email: "", password: "" });

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errores[id as keyof typeof errores]) {
      setErrores((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores = { email: "", password: "" };
    let valido = true;

    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio";
      valido = false;
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.email = "Correo electrónico inválido";
      valido = false;
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarToast("Corrige los errores del formulario", "#dc3545");
      return;
    }

    const success = await login(formData.email, formData.password);

    if (success) {
      mostrarToast("Bienvenido a HuertoHogar");
      navigate("/");
    } else {
      mostrarToast("Correo o contraseña incorrectos", "#dc3545");
    }
  };

  const handleCerrarSesion = () => {
    logout();
    mostrarToast("Sesión cerrada correctamente", "#6c757d");
    navigate("/mi-cuenta");
  };

  // ----------------------------------------
  //     SI YA ESTÁ LOGEADO → MOSTRAR PERFIL
  // ----------------------------------------
  if (usuario) {
    return (
      <main className="container mi-cuenta-page" style={{ paddingTop: "140px" }}>
        <h2 className="text-center text-success mb-4">👤 Mi Cuenta</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4 text-center">
                <i className="bi bi-person-circle fs-1 text-success"></i>
                <h3 className="mt-3">¡Hola, {usuario.nombre}!</h3>

                <div className="text-start mb-4 mt-3">
                  <h5>Información de la cuenta:</h5>
                  <p><strong>Nombre:</strong> {usuario.nombre}</p>
                  <p><strong>Correo:</strong> {usuario.email}</p>
                  {usuario.rut && <p><strong>RUN:</strong> {usuario.rut}</p>}
                  {usuario.telefono && <p><strong>Teléfono:</strong> {usuario.telefono}</p>}
                  {usuario.direccion && <p><strong>Dirección:</strong> {usuario.direccion}</p>}
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/editar-cuenta")}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Editar Información
                  </button>

                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/historial")}
                  >
                    <i className="bi bi-clock-history me-2"></i> Ver Historial
                  </button>

                  <button className="btn btn-danger" onClick={handleCerrarSesion}>
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>
    );
  }

  // ----------------------------------------
  //   SI NO ESTÁ LOGEADO → FORMULARIO LOGIN
  // ----------------------------------------
  return (
    <main className="container mi-cuenta-page" style={{ paddingTop: "120px" }}>
      <h2 className="text-center text-success mb-4">👤 Mi Cuenta</h2>

      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">

              <h3 className="text-center mb-4">Iniciar Sesión</h3>

              <form onSubmit={handleSubmit}>
                
                {/* CORREO */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Correo</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${errores.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ejemplo@correo.com"
                  />
                  {errores.email && (
                    <div className="invalid-feedback">{errores.email}</div>
                  )}
                </div>

                {/* CONTRASEÑA */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control ${errores.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                  />
                  {errores.password && (
                    <div className="invalid-feedback">{errores.password}</div>
                  )}
                </div>

                <button className="btn btn-success w-100 fw-bold" type="submit">
                  Ingresar
                </button>
              </form>

              <div className="text-center mt-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/restablecer-password");
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="text-center mt-3">
                <p>
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/crear-cuenta"
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
