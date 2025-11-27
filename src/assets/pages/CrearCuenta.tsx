import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../types";
import { useToast } from "../components/Toast";


interface CrearCuentaProps {
  mostrarToast: (message: string, color?: string) => void;
}

const CrearCuenta: React.FC<CrearCuentaProps> = ({ mostrarToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    telefono: "",
    direccion: "",
    password: "",
    confirmarPassword: "",
  });
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState<any>({});
  const showToast = useToast();

  // VALIDACIONES
  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validar = () => {
    const errs: any = {};
    if (!formData.nombre) errs.nombre = "El nombre es obligatorio";
    if (!formData.apellido) errs.apellido = "El apellido es obligatorio";
    if (!formData.rut) errs.rut = "El RUN es obligatorio";
    if (!formData.correo) errs.correo = "El correo es obligatorio";
    else if (!validarEmail(formData.correo)) errs.correo = "Correo inválido";
    if (!formData.password) errs.password = "Contraseña requerida";
    else if (formData.password.length < 6) errs.password = "Debe tener al menos 6 caracteres";
    if (formData.password !== formData.confirmarPassword)
      errs.confirmarPassword = "Las contraseñas no coinciden";

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };


  //FUNCIONES DE REGISTRO
  const registrarUsuario = (nuevoUsuario: Usuario) => {
    const lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    lista.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(lista));
    localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
  };

  //SUBMIT PRINCIPAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminos) return mostrarToast("Debes aceptar los términos", "#dc3545");
    if (!validar()) return mostrarToast("Corrige los errores", "#dc3545");

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const existe = usuarios.find((u: any) => u.correo === formData.correo);
    if (existe) return mostrarToast("Correo ya registrado", "#dc3545");

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre: `${formData.nombre} ${formData.apellido}`,
      rut: formData.rut,
      correo: formData.correo,
      telefono: formData.telefono,
      direccion: formData.direccion,
      password: formData.password,
      confirpassword: formData.confirmarPassword,
      rol: "Cliente",
      compras: [],
      fechaRegistro: new Date().toLocaleString(),
    };

    registrarUsuario(nuevoUsuario);
    showToast(`Cuenta creada con éxito`);


    window.dispatchEvent(new Event("storage"));

    setTimeout(() => navigate("/"), 1500);
  };

  // RENDERIZADO DEL FORMULARIO
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
                {Object.keys(formData).map((key) =>
                  key !== "confirmarPassword" ? (
                    <div key={key} className="mb-3">
                      <label className="form-label fw-bold text-capitalize">
                        {key}
                      </label>
                      <input
                        id={key}
                        type={key.includes("password") ? "password" : "text"}
                        className={`form-control ${errores[key] ? "is-invalid" : ""}`}
                        value={(formData as any)[key]}
                        onChange={handleChange}
                      />
                      {errores[key] && (
                        <div className="invalid-feedback">{errores[key]}</div>
                      )}
                    </div>
                  ) : null
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Confirmar contraseña</label>
                  <input
                    id="confirmarPassword"
                    type="password"
                    className={`form-control ${errores.confirmarPassword ? "is-invalid" : ""
                      }`}
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
