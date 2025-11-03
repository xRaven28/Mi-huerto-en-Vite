import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CrearCuentaProps {
  mostrarToast: (message: string, color?: string) => void;
  onLogin?: (usuario: any) => void;
}

interface FormData {
  nombre: string;
  apellido: string;
  run: string;
  correo: string;
  telefono: string;
  direccion: string;
  password: string;
  confirmarPassword: string;
}

const CrearCuenta: React.FC<CrearCuentaProps> = ({ mostrarToast, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    run: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmarPassword: ''
  });
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [errores, setErrores] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (errores[id as keyof FormData]) {
      setErrores(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validarRUN = (run: string): boolean => /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(run);
  const validarEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<FormData> = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
    if (!formData.run.trim()) nuevosErrores.run = 'El RUN es obligatorio';
    else if (!validarRUN(formData.run)) nuevosErrores.run = 'Formato de RUN inválido';
    if (!formData.correo.trim()) nuevosErrores.correo = 'El correo es obligatorio';
    else if (!validarEmail(formData.correo)) nuevosErrores.correo = 'Correo electrónico inválido';
    if (!formData.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio';
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria';
    if (!formData.password) nuevosErrores.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6)
      nuevosErrores.password = 'Debe tener al menos 6 caracteres';
    if (!formData.confirmarPassword)
      nuevosErrores.confirmarPassword = 'Confirma tu contraseña';
    else if (formData.password !== formData.confirmarPassword)
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!terminosAceptados) {
      mostrarToast('Debes aceptar los términos y condiciones', '#dc3545');
      return;
    }

    if (!validarFormulario()) {
      mostrarToast('Corrige los errores del formulario', '#dc3545');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExistente = usuarios.find((u: any) => u.correo === formData.correo);

    if (usuarioExistente) {
      mostrarToast('Este correo ya está registrado', '#dc3545');
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: `${formData.nombre} ${formData.apellido}`,
      run: formData.run,
      correo: formData.correo,
      telefono: formData.telefono,
      direccion: formData.direccion,
      password: formData.password,
      fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));

    if (onLogin) onLogin(nuevoUsuario);

    mostrarToast('✅ ¡Cuenta creada con éxito!');
    setTimeout(() => navigate('/'), 1500);
  };

  const handleTerminosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/terminos');
  };

  return (
    <main className="container py-5 crearcuenta-page">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-3 border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 text-success">
                <i className="bi bi-person-plus"></i> Crear Cuenta
              </h3>

              <form onSubmit={handleSubmit}>
                {[
                  { id: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingresa tu nombre' },
                  { id: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Ingresa tu apellido' },
                  { id: 'run', label: 'RUN', type: 'text', placeholder: 'Ej: 12.345.678-9' },
                  { id: 'correo', label: 'Correo', type: 'email', placeholder: 'ejemplo@correo.com' },
                  { id: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+56 9 1234 5678' },
                  { id: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Calle, número, ciudad' },
                  { id: 'password', label: 'Contraseña', type: 'password', placeholder: '********' },
                  { id: 'confirmarPassword', label: 'Confirmar Contraseña', type: 'password', placeholder: '********' }
                ].map((campo) => (
                  <div key={campo.id} className="mb-3">
                    <label htmlFor={campo.id} className="form-label fw-bold">{campo.label}</label>
                    <input
                      type={campo.type}
                      className={`form-control ${errores[campo.id as keyof FormData] ? 'is-invalid' : ''}`}
                      id={campo.id}
                      placeholder={campo.placeholder}
                      value={formData[campo.id as keyof FormData]}
                      onChange={handleInputChange}
                    />
                    {errores[campo.id as keyof FormData] && (
                      <div className="invalid-feedback">{errores[campo.id as keyof FormData]}</div>
                    )}
                  </div>
                ))}

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terminos"
                    checked={terminosAceptados}
                    onChange={(e) => setTerminosAceptados(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los{' '}
                    <a href="/terminos" className="text-decoration-none" onClick={handleTerminosClick}>
                      términos y condiciones
                    </a>
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success fw-bold"
                    disabled={!terminosAceptados}
                  >
                    Crear cuenta
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p>
                  ¿Ya tienes una cuenta?{' '}
                  <a
                    href="/mi-cuenta"
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/mi-cuenta');
                    }}
                  >
                    Inicia sesión
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

export default CrearCuenta;
