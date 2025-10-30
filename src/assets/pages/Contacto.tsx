import React, { useState } from 'react';

const Contacto: React.FC = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', mensaje: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensajes = JSON.parse(localStorage.getItem('mensajes_contacto') || '[]');
    mensajes.push({ ...form, fecha: new Date().toISOString() });
    localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));
    alert('Gracias por contactarnos');
    setForm({ nombre: '', correo: '', telefono: '', mensaje: '' });
  };

  return (
    <div className="container mt-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Contáctanos</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={form.nombre} onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" value={form.correo} onChange={e => setForm(prev => ({ ...prev, correo: e.target.value }))} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input className="form-control" value={form.telefono} onChange={e => setForm(prev => ({ ...prev, telefono: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows={4} value={form.mensaje} onChange={e => setForm(prev => ({ ...prev, mensaje: e.target.value }))} required />
                </div>
                <button className="btn btn-success">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
