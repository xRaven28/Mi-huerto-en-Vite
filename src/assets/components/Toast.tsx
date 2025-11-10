import React, { useState, useEffect } from "react";

let showToastFn: (message: string, tipo?: "exito" | "error" | "info") => void;

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<
    { id: string; message: string; tipo?: "exito" | "error" | "info" }[]
  >([]);


  useEffect(() => {
    showToastFn = (message: string, tipo = "info") => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

      setToasts((prev) => [...prev, { id, message, tipo }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)),3500
      );
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-card ${t.tipo}`}>
          <i
            className={`toast-icon ${t.tipo === "exito"
              ? "bi bi-check-circle-fill"
              : t.tipo === "error"
                ? "bi bi-x-circle-fill"
                : "bi bi-info-circle-fill"
              }`}
          ></i>
          <span>{t.message}</span>
          <button
            className="toast-close"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => showToastFn;
