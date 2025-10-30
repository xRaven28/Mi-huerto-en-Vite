// src/pages/CrearCuenta.tsx
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
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errores[id as keyof FormData]) {
            setErrores(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: Partial<FormData> = {};

        // Validaciones básicas
        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        }

        if (!formData.apellido.trim()) {
            nuevosErrores.apellido = 'El apellido es obligatorio';
        }

        if (!formData.run.trim()) {
            nuevosErrores.run = 'El RUN es obligatorio';
        } else if (!validarRUN(formData.run)) {
            nuevosErrores.run = 'Formato de RUN inválido';
        }

        if (!formData.correo.trim()) {
            nuevosErrores.correo = 'El correo es obligatorio';
        } else if (!validarEmail(formData.correo)) {
            nuevosErrores.correo = 'Correo electrónico inválido';
        }

        if (!formData.telefono.trim()) {
            nuevosErrores.telefono = 'El teléfono es obligatorio';
        }

        if (!formData.direccion.trim()) {
            nuevosErrores.direccion = 'La dirección es obligatoria';
        }

        if (!formData.password) {
            nuevosErrores.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmarPassword) {
            nuevosErrores.confirmarPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmarPassword) {
            nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const validarRUN = (run: string): boolean => {
        // Validación básica de RUN chileno
        const runRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
        return runRegex.test(run);
    };

    const validarEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!terminosAceptados) {
            mostrarToast('Debes aceptar los términos y condiciones', '#dc3545');
            return;
        }

        if (!validarFormulario()) {
            mostrarToast('Por favor corrige los errores del formulario', '#dc3545');
            return;
        }

        // Verificar si el correo ya está registrado
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioExistente = usuarios.find((u: any) => u.correo === formData.correo);

        if (usuarioExistente) {
            mostrarToast('Este correo ya está registrado', '#dc3545');
            return;
        }

        // Crear nuevo usuario
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

        // Guardar usuario
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Iniciar sesión automáticamente
        localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
        
        if (onLogin) {
            onLogin(nuevoUsuario);
        }

        mostrarToast('¡Cuenta creada con éxito!');
        
        // Redirigir al home
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    const handleTerminosClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/terminos');
    };

    return (
        <div>
            <div className="container mt-5" style={{ marginTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg rounded-3">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4">Crear Cuenta</h3>

                                <form id="formCrearCuenta" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            placeholder="Ingresa tu nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                        />
                                        {errores.nombre && (
                                            <div className="invalid-feedback">{errores.nombre}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="apellido" className="form-label">Apellido</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
                                            id="apellido"
                                            placeholder="Ingresa tu apellido"
                                            value={formData.apellido}
                                            onChange={handleInputChange}
                                        />
                                        {errores.apellido && (
                                            <div className="invalid-feedback">{errores.apellido}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="run" className="form-label">RUN</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errores.run ? 'is-invalid' : ''}`}
                                            id="run"
                                            placeholder="Ej: 12.345.678-9"
                                            value={formData.run}
                                            onChange={handleInputChange}
                                        />
                                        {errores.run && (
                                            <div className="invalid-feedback">{errores.run}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">Correo</label>
                                        <input 
                                            type="email" 
                                            className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                            id="correo"
                                            placeholder="ejemplo@correo.com"
                                            value={formData.correo}
                                            onChange={handleInputChange}
                                        />
                                        {errores.correo && (
                                            <div className="invalid-feedback">{errores.correo}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                                            id="telefono"
                                            placeholder="+56 9 1234 5678"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                        />
                                        {errores.telefono && (
                                            <div className="invalid-feedback">{errores.telefono}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="direccion" className="form-label">Dirección</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                                            id="direccion"
                                            placeholder="Calle, número, ciudad"
                                            value={formData.direccion}
                                            onChange={handleInputChange}
                                        />
                                        {errores.direccion && (
                                            <div className="invalid-feedback">{errores.direccion}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder="********"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        {errores.password && (
                                            <div className="invalid-feedback">{errores.password}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmarPassword" className="form-label">Confirmar Contraseña</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errores.confirmarPassword ? 'is-invalid' : ''}`}
                                            id="confirmarPassword"
                                            placeholder="********"
                                            value={formData.confirmarPassword}
                                            onChange={handleInputChange}
                                        />
                                        {errores.confirmarPassword && (
                                            <div className="invalid-feedback">{errores.confirmarPassword}</div>
                                        )}
                                    </div>

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
                                            <a 
                                                href="/terminos" 
                                                className="text-decoration-none"
                                                onClick={handleTerminosClick}
                                            >
                                                términos y condiciones
                                            </a>
                                        </label>
                                    </div>

                                    <div className="d-grid">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success"
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
            </div>
        </div>
    );
};

export default CrearCuenta;