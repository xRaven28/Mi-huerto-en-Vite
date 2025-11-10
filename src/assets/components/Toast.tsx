import React, { useEffect, useState, CSSProperties } from "react";
import { createPortal } from "react-dom";

type TipoToast = "exito" | "error" | "info";
type ToastItem = { id: string; message: string; tipo: TipoToast };

let showToastFn: (message: string, tipo?: TipoToast) => void = () => {};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    showToastFn = (message: string, tipo: TipoToast = "info") => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((prev) => [...prev, { id, message, tipo }]);

      // autocierre
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
  }, []);

  // Estilos inline para que NADA los pise
  const containerStyle: CSSProperties = {
    position: "fixed",
    right: 20,
    bottom: 20,                 
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 12,
    zIndex: 2147483647,        
    pointerEvents: "none",
  };

  const baseCard: CSSProperties = {
    pointerEvents: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 260,
    maxWidth: 360,
    padding: "12px 16px",
    borderRadius: 12,
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
    backdropFilter: "saturate(140%) blur(8px)",

    transition: "opacity .3s ease, transform .3s ease",
  };

  const bgByType = (tipo: TipoToast): string => {
    if (tipo === "exito") return "rgba(40,167,69,.95)";
    if (tipo === "error") return "rgba(220,53,69,.95)";
    return "rgba(23,162,184,.95)";
  };

  const iconByType = (tipo: TipoToast): string =>
    tipo === "exito"
      ? "bi bi-check-circle-fill"
      : tipo === "error"
      ? "bi bi-x-circle-fill"
      : "bi bi-info-circle-fill";

  const render = (
    <div style={containerStyle} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...baseCard,
            background: bgByType(t.tipo),
          }}
          onAnimationEnd={(e) => {
          }}
        >
          <i className={iconByType(t.tipo)} style={{ fontSize: "1.3rem" }} />
          <span style={{ flex: 1, fontSize: ".95rem" }}>{t.message}</span>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }
            aria-label="Cerrar"
            title="Cerrar"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              opacity: 0.9,
            }}
          >
            <i className="bi bi-x" />
          </button>
        </div>
      ))}
    </div>
  );

  return createPortal(render, document.body);
};

export const useToast = () => showToastFn;
