import React, { useState, useEffect } from "react";

const MiPerfil: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });

  useEffect(() => {
    const userData = localStorage.getItem("usuarioActual");
    if (userData) {
      const user = JSON.parse(userData);
      setUsuario(user);
      setForm({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        telefono: user.telefono || "",
      });
    }
  }, []);

  const handleSave = () => {
    if (!usuario) return;
    const updatedUser = { ...usuario, ...form };
    setUsuario(updatedUser);
    localStorage.setItem("usuarioActual", JSON.stringify(updatedUser));

    // Actualiza también la lista general de usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const idx = usuarios.findIndex((u: any) => u.correo === usuario.correo);
    if (idx >= 0) usuarios[idx] = updatedUser;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Tus datos fueron actualizados correctamente");
  };

  if (!usuario) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm">
          No hay sesión activa.
        </div>
      </main>
    );
  }

  return (
    <main className="container mis-pedidos-page" style={{ paddingTop: "120px" }}>
      <h3 className="text-success mb-4 text-center">👤 Mi perfil</h3>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            className="form-control"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            className="form-control"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            className="form-control"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input className="form-control" value={usuario.correo} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">RUN</label>
          <input className="form-control" value={usuario.run || ""} disabled />
        </div>

        <button className="btn btn-success w-100" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </main>
  );
};

export default MiPerfil;
