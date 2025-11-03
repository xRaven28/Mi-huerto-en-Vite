import React, { useState } from 'react';

const Contacto: React.FC = () => {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensajes = JSON.parse(localStorage.getItem('mensajes_contacto') || '[]');
    mensajes.push({ ...form, fecha: new Date().toISOString() });
    localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));

    alert('✅ Gracias por contactarnos, te responderemos pronto.');
    setForm({ nombre: '', correo: '', telefono: '', mensaje: '' });
  };

  return (
    <main className="container py-5 contacto-page">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center text-success mb-4">
                <i className="bi bi-envelope-paper"></i> Contáctanos
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="tucorreo@ejemplo.com"
                    value={form.correo}
                    onChange={e => setForm({ ...form, correo: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Teléfono (opcional)</label>
                  <input
                    className="form-control"
                    placeholder="+56 9 1234 5678"
                    value={form.telefono}
                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Mensaje</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Escribe tu mensaje aquí..."
                    value={form.mensaje}
                    onChange={e => setForm({ ...form, mensaje: e.target.value })}
                    required
                  />
                </div>

                <div className="text-center">
                  <button className="btn btn-success px-4" type="submit">
                    Enviar Mensaje
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

export default Contacto;
