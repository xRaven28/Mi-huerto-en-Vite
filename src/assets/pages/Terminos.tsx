// src/pages/Terminos.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terminos: React.FC = () => {
    const navigate = useNavigate();

    const handleVolver = () => {
        // Intentar volver a la página anterior, o a crear-cuenta por defecto
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/crear-cuenta');
        }
    };

    return (
        <div>
            <div className="container mt-5 mb-5" style={{ marginTop: '100px' }}>
                <div className="card shadow-lg rounded-3">
                    <div className="card-body p-4">
                        <h2 className="text-center mb-4">📄 Términos y Condiciones</h2>

                        <p className="lead">
                            Bienvenido a <strong className="text-success">Huerto Hogar</strong>. Al registrarte y utilizar nuestro sitio web, 
                            aceptas los siguientes términos y condiciones:
                        </p>

                        <div className="terms-content">
                            {/* Sección 1 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-1-circle me-2"></i>
                                    Uso del sitio
                                </h5>
                                <p className="ms-4">
                                    El sitio web está destinado exclusivamente para la compra de frutas, verduras y productos
                                    relacionados. El usuario se compromete a utilizarlo de forma responsable y a no realizar actividades
                                    fraudulentas.
                                </p>
                            </div>

                            {/* Sección 2 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-2-circle me-2"></i>
                                    Registro de usuarios
                                </h5>
                                <p className="ms-4">
                                    Para realizar compras es necesario registrarse proporcionando información verídica y actualizada.
                                    Cada usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.
                                </p>
                            </div>

                            {/* Sección 3 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-3-circle me-2"></i>
                                    Precios y pagos
                                </h5>
                                <p className="ms-4">
                                    Todos los precios publicados incluyen impuestos y están sujetos a cambios sin previo aviso. Los pagos
                                    deben realizarse a través de los medios habilitados en el sitio.
                                </p>
                            </div>

                            {/* Sección 4 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-4-circle me-2"></i>
                                    Entregas y envíos
                                </h5>
                                <p className="ms-4">
                                    Los pedidos serán entregados en la dirección indicada por el usuario. Nos comprometemos a despachar
                                    los productos en buen estado y en los plazos acordados.
                                </p>
                            </div>

                            {/* Sección 5 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-5-circle me-2"></i>
                                    Devoluciones y reclamos
                                </h5>
                                <p className="ms-4">
                                    En caso de recibir un producto en mal estado, el usuario deberá notificarlo dentro de las 24 horas
                                    posteriores a la entrega para gestionar el cambio o reembolso.
                                </p>
                            </div>

                            {/* Sección 6 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-6-circle me-2"></i>
                                    Privacidad de datos
                                </h5>
                                <p className="ms-4">
                                    La información personal proporcionada por los usuarios será tratada con confidencialidad y utilizada
                                    únicamente para fines relacionados con la compra y entrega de productos.
                                </p>
                            </div>

                            {/* Sección 7 */}
                            <div className="mb-4">
                                <h5 className="text-success">
                                    <i className="bi bi-7-circle me-2"></i>
                                    Modificaciones
                                </h5>
                                <p className="ms-4">
                                    <strong>Huerto Hogar</strong> se reserva el derecho de modificar estos términos y condiciones en
                                    cualquier momento. Los cambios entrarán en vigor desde su publicación en el sitio web.
                                </p>
                            </div>
                        </div>

                        {/* Información de actualización */}
                        <div className="alert alert-info mt-4">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-info-circle fs-5 me-2"></i>
                                <div>
                                    <strong>Última actualización:</strong> Agosto 2025
                                    <br />
                                    <small className="text-muted">
                                        Te recomendamos revisar periódicamente estos términos para estar al día con cualquier cambio.
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="text-center mt-4">
                            <button 
                                className="btn btn-success me-3"
                                onClick={handleVolver}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Volver al Registro
                            </button>
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => window.print()}
                            >
                                <i className="bi bi-printer me-2"></i>
                                Imprimir Términos
                            </button>
                        </div>

                        {/* Información de contacto para dudas */}
                        <div className="text-center mt-4 pt-3 border-top">
                            <small className="text-muted">
                                ¿Tienes dudas sobre nuestros términos?{' '}
                                <a 
                                    href="/contacto" 
                                    className="text-decoration-none"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/contacto');
                                    }}
                                >
                                    Contáctanos
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminos;