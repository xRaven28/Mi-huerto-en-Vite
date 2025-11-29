import React, { useState } from "react";
import { useToast } from "../components/Toast";
import { cambiarPasswordEmail } from "../services/usuario.service";

const RestablecerPassword: React.FC = () => {
  const showToast = useToast();

  const [form, setForm] = useState({
    email: "",
    nueva: "",
    confirmar: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) {
      return showToast("Debes ingresar tu correo", "error");
    }

    if (!form.nueva || !form.confirmar) {
      return showToast("Completa todos los campos", "error");
    }

    if (form.nueva !== form.confirmar) {
      return showToast("Las contraseñas no coinciden", "error");
    }

    try {
      await cambiarPasswordEmail({
        email: form.email,
        nuevaPassword: form.nueva,  // ✔ lo que espera tu backend
      });

      showToast("Contraseña actualizada correctamente ✔");

      setForm({ email: "", nueva: "", confirmar: "" });

    } catch (err: any) {
      const msg = err.response?.data || "Error al actualizar contraseña ❌";
      showToast(msg.toString(), "error");
    }
  };

  return (
    <main className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "480px" }}>
      <div className="card shadow p-4">
        <h3 className="text-center text-success mb-3">Restablecer contraseña</h3>

        <form onSubmit={handleSubmit}>

          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control mb-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ejemplo@correo.com"
          />

          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control mb-3"
            value={form.nueva}
            onChange={(e) => setForm({ ...form, nueva: e.target.value })}
          />

          <label className="form-label">Confirmar nueva contraseña</label>
          <input
            type="password"
            className="form-control mb-4"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
          />

          <button className="btn btn-success w-100">
            Actualizar contraseña
          </button>
        </form>
      </div>
    </main>
  );
};

export default RestablecerPassword;
