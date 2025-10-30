import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface RestablecerContrasenaProps {
    mostrarToast: (message: string, color?: string) => void;
}

const RestablecerContrasena: React.FC<RestablecerContrasenaProps> = ({ mostrarToast }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [tokenValido, setTokenValido] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
            verificarToken(tokenParam);
        } else {
            setCargando(false);
            setError('Token de recuperación no válido');
        }
    }, [searchParams]);

    const verificarToken = (token: string) => {
        // Simular verificación del token
        setTimeout(() => {
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesRecuperacion') || '[]');
            const solicitud = solicitudes.find((s: any) => s.token === token);
            
            if (solicitud && new Date(solicitud.expiracion) > new Date()) {
                setTokenValido(true);
            } else {
                setError('El enlace de recuperación ha expirado o no es válido');
            }
            setCargando(false);
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        // Actualizar contraseña en localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const solicitudes = JSON.parse(localStorage.getItem('solicitudesRecuperacion') || '[]');
        const solicitud = solicitudes.find((s: any) => s.token === token);

        if (solicitud) {
            const usuarioIndex = usuarios.findIndex((u: any) => u.correo === solicitud.email);
            if (usuarioIndex !== -1) {
                usuarios[usuarioIndex].password = formData.password;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Eliminar solicitud usada
                const nuevasSolicitudes = solicitudes.filter((s: any) => s.token !== token);
                localStorage.setItem('solicitudesRecuperacion', JSON.stringify(nuevasSolicitudes));

                mostrarToast('¡Contraseña restablecida con éxito!');
                navigate('/mi-cuenta');
            }
        }
    };

    if (cargando) {
        return (
            <div className="container mt-5 text-center" style={{ marginTop: '100px' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Verificando enlace de recuperación...</p>
            </div>
        );
    }

    if (!tokenValido && error) {
        return (
            <div className="container mt-5" style={{ marginTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg rounded-3">
                            <div className="card-body p-4 text-center">
                                <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                                <h3 className="mt-3 text-danger">Enlace Inválido</h3>
                                <p className="text-muted">{error}</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/recuperar-contrasena')}
                                >
                                    Solicitar nuevo enlace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container mt-5" style={{ marginTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-lg rounded-3">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4">🔄 Restablecer Contraseña</h3>

                                <form onSubmit={handleSubmit}>
                                    <p className="text-muted mb-3">
                                        Ingresa tu nueva contraseña
                                    </p>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Nueva Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                            id="password" 
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                password: e.target.value
                                            }))}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirmar Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                            id="confirmPassword" 
                                            placeholder="Repite tu contraseña"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                confirmPassword: e.target.value
                                            }))}
                                        />
                                        {error && (
                                            <div className="invalid-feedback">{error}</div>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success"
                                        >
                                            Restablecer Contraseña
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestablecerContrasena;