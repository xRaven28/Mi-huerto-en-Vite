// src/assets/pages/MiPerfil.tsx
import React, { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import { actualizarUsuario } from "../services/usuario.service";

const MiPerfil: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const showToast = useToast();

  useEffect(() => {
    const raw = localStorage.getItem("usuarioActual");
    if (raw) {
      const user = JSON.parse(raw);
      setUsuario(user);
      setForm({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        telefono: user.telefono || "",
      });
    }
  }, []);

  const handleSave = async () => {
    if (!usuario) return;

    try {
      const actualizado = await actualizarUsuario(usuario.id, {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
        rut: usuario.rut,      // 👈 mantener RUN
        rol: usuario.rol,      // 👈 mantener rol (ADMIN/CLIENTE)
      });

      localStorage.setItem("usuarioActual", JSON.stringify(actualizado));
      setUsuario(actualizado);

      showToast("Tus datos fueron actualizados correctamente ✔");

    } catch (error) {
      showToast("Error al guardar los cambios ❌", "error");
    }
  };

  if (!usuario) {
    return (
      <main className="container py-5 text-center" style={{ paddingTop: "120px" }}>
        <div className="alert alert-danger shadow-sm">No hay sesión activa.</div>
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
          <input className="form-control" value={usuario.email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">RUN</label>
          <input className="form-control" value={usuario.rut || ""} disabled />
        </div>

        <button className="btn btn-success w-100" onClick={handleSave}>
          Guardar cambios
        </button>
      </div>
    </main>
  );
};

export default MiPerfil;
