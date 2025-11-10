import React, { useEffect, useState, CSSProperties } from "react";
import { createPortal } from "react-dom";

type TipoToast = "exito" | "error" | "info";
type ToastItem = { id: string; message: string; tipo: TipoToast };

let showToastFn: (message: string, tipo?: TipoToast) => void = () => {};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    showToastFn = (message: string, tipo: TipoToast = "info") => {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, tipo }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
  }, []);

  // Animación declarada solo una vez
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes toastEnter {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastExit {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Posición fija arriba derecha (no afecta layout)
  const containerStyle: CSSProperties = {
    position: "fixed",
    top: 20,
    right: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end",
    zIndex: 999999,
    pointerEvents: "none",
  };

  const baseCard: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 260,
    maxWidth: 340,
    padding: "12px 16px",
    borderRadius: 10,
    color: "#fff",
    fontSize: ".95rem",
    fontWeight: 500,
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    animation: "toastEnter 0.3s ease forwards",
    backdropFilter: "blur(8px)",
    pointerEvents: "auto",
  };

  const bgByType = (tipo: TipoToast): string => {
    switch (tipo) {
      case "exito":
        return "rgba(40,167,69,0.95)";
      case "error":
        return "rgba(220,53,69,0.95)";
      default:
        return "rgba(23,162,184,0.95)";
    }
  };

  const iconByType = (tipo: TipoToast): string => {
    switch (tipo) {
      case "exito":
        return "bi bi-check-circle-fill";
      case "error":
        return "bi bi-x-circle-fill";
      default:
        return "bi bi-info-circle-fill";
    }
  };

  const render = (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...baseCard,
            background: bgByType(t.tipo),
          }}
        >
          <i className={iconByType(t.tipo)} style={{ fontSize: "1.2rem" }} />
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              opacity: 0.8,
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
    </div>
  );

  // Portal directo al body — sin causar ningún reflow
  return createPortal(render, document.body);
};

export const useToast = () => showToastFn;
