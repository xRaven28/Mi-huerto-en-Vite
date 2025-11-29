import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { registrarUsuario } from "../services/usuario.service";

interface CrearCuentaProps {
  mostrarToast: (message: string, color?: string) => void;
}

const CrearCuenta: React.FC<CrearCuentaProps> = ({ mostrarToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    confirmarPassword: "",
  });

  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState<any>({});
  const showToast = useToast();

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validar = () => {
    const errs: any = {};

    if (!formData.nombre) errs.nombre = "El nombre es obligatorio";
    if (!formData.apellido) errs.apellido = "El apellido es obligatorio";
    if (!formData.rut) errs.rut = "El RUN es obligatorio";
    if (!formData.email) errs.email = "El correo es obligatorio";
    else if (!validarEmail(formData.email)) errs.email = "Correo inválido";
    if (!formData.telefono) errs.telefono = "El teléfono es obligatorio";
    if (!formData.direccion)
      errs.direccion = "La dirección de entrega es obligatoria";

    if (!formData.password) errs.password = "Contraseña requerida";
    else if (formData.password.length < 6)
      errs.password = "Debe tener al menos 6 caracteres";

    if (formData.password !== formData.confirmarPassword)
      errs.confirmarPassword = "Las contraseñas no coinciden";

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminos) return mostrarToast("Debes aceptar los términos", "#dc3545");
    if (!validar()) return mostrarToast("Corrige los errores", "#dc3545");

    try {
      await registrarUsuario({
        nombre: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        password: formData.password,
        rol: "CLIENTE",
        rut: formData.rut,
        telefono: formData.telefono,
        direccion: formData.direccion,
      });

      showToast("Cuenta creada con éxito");
      setTimeout(() => navigate("/mi-cuenta"), 1500);
    } catch (error) {
      mostrarToast("El correo ya está registrado o hubo un error", "#dc3545");
    }
  };

  return (
    <main className="container py-5 crearcuenta-page">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center text-success mb-4">
                <i className="bi bi-person-plus"></i> Crear Cuenta
              </h3>

              <form onSubmit={handleSubmit}>
                {[
                  "nombre",
                  "apellido",
                  "rut",
                  "email",
                  "telefono",
                  "direccion",
                ].map((key) => (
                  <div key={key} className="mb-3">
                    <label className="form-label fw-bold text-capitalize">
                      {key}
                    </label>
                    <input
                      id={key}
                      type={key === "email" ? "email" : "text"}
                      className={`form-control ${errores[key] ? "is-invalid" : ""}`}
                      value={(formData as any)[key]}
                      onChange={handleChange}
                    />
                    {errores[key] && (
                      <div className="invalid-feedback">{errores[key]}</div>
                    )}
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errores.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errores.password && (
                    <div className="invalid-feedback">{errores.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Confirmar contraseña</label>
                  <input
                    id="confirmarPassword"
                    type="password"
                    className={`form-control ${errores.confirmarPassword ? "is-invalid" : ""}`}
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                  />
                  {errores.confirmarPassword && (
                    <div className="invalid-feedback">{errores.confirmarPassword}</div>
                  )}
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terminos"
                    checked={terminos}
                    onChange={(e) => setTerminos(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los <a href="/terminos">términos y condiciones</a>
                  </label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-success fw-bold" type="submit">
                    Crear cuenta
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CrearCuenta;
