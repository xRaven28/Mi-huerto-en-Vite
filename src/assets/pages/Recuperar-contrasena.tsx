import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RecuperarContrasenaProps {
    mostrarToast: (message: string, color?: string) => void;
}

const RecuperarContrasena: React.FC<RecuperarContrasenaProps> = ({ mostrarToast }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const validarEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('El correo electrónico es obligatorio');
            return;
        }

        if (!validarEmail(email)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        // Verificar si el correo existe en los usuarios registrados
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioExiste = usuarios.some((usuario: any) => usuario.correo === email);

        if (!usuarioExiste) {
            setError('No existe una cuenta asociada a este correo electrónico');
            return;
        }

        setCargando(true);

        // Simular envío de email (en una app real aquí iría la llamada a la API)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Guardar solicitud de recuperación en localStorage (simulación)
            const solicitudes = JSON.parse(localStorage.getItem('solicitudesRecuperacion') || '[]');
            const nuevaSolicitud = {
                email,
                token: Math.random().toString(36).substr(2, 9), // Token simple para demo
                fecha: new Date().toISOString(),
                expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
            };
            
            solicitudes.push(nuevaSolicitud);
            localStorage.setItem('solicitudesRecuperacion', JSON.stringify(solicitudes));
            
            setEnviado(true);
            mostrarToast('¡Enlace de recuperación enviado! Revisa tu correo electrónico.');
        } catch (error) {
            setError('Error al enviar el enlace. Por favor intenta nuevamente.');
            mostrarToast('Error al enviar el enlace', '#dc3545');
        } finally {
            setCargando(false);
        }
    };

    const handleVolverLogin = () => {
        navigate('/mi-cuenta');
    };

    if (enviado) {
        return (
            <div>
                <div className="container mt-5" style={{ marginTop: '100px' }}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow-lg rounded-3">
                                <div className="card-body p-4 text-center">
                                    <div className="mb-4">
                                        <i className="bi bi-envelope-check text-success fs-1"></i>
                                        <h3 className="mt-3 text-success">¡Correo Enviado!</h3>
                                    </div>
                                    
                                    <p className="text-muted mb-4">
                                        Hemos enviado un enlace de recuperación a:<br />
                                        <strong>{email}</strong>
                                    </p>
                                    
                                    <div className="alert alert-info">
                                        <small>
                                            <i className="bi bi-info-circle me-2"></i>
                                            El enlace expirará en 24 horas. Si no encuentras el correo, 
                                            revisa tu carpeta de spam.
                                        </small>
                                    </div>
                                    
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-success"
                                            onClick={handleVolverLogin}
                                        >
                                            Volver al Inicio de Sesión
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setEnviado(false)}
                                        >
                                            Enviar a otro correo
                                        </button>
                                    </div>
                                </div>
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
                                <h3 className="text-center mb-4">🔐 Recuperar Contraseña</h3>

                                <form onSubmit={handleSubmit}>
                                    <p className="text-muted mb-3">
                                        Ingresa tu correo electrónico y te enviaremos un enlace para 
                                        restablecer tu contraseña.
                                    </p>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">
                                            Correo electrónico
                                        </label>
                                        <input 
                                            type="email" 
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                            id="correo" 
                                            placeholder="ejemplo@correo.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            disabled={cargando}
                                        />
                                        {error && (
                                            <div className="invalid-feedback">{error}</div>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success"
                                            disabled={cargando}
                                        >
                                            {cargando ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar enlace de recuperación'
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-3">
                                    <p>
                                        <a 
                                            href="#" 
                                            className="text-decoration-none"
                                            onClick={handleVolverLogin}
                                        >
                                            ← Volver a Iniciar Sesión
                                        </a>
                                    </p>
                                </div>

                                {/* Información adicional */}
                                <div className="mt-4 p-3 bg-light rounded">
                                    <small className="text-muted">
                                        <i className="bi bi-shield-check me-1"></i>
                                        <strong>Seguridad:</strong> Tu información está protegida. 
                                        El enlace de recuperación expirará automáticamente en 24 horas.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContrasena;