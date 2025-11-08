import React, { useState, useEffect } from "react";

let showToastFn: (message: string, color?: string) => void;

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<{ id: number; message: string; color?: string }[]>([]);

  useEffect(() => {
    showToastFn = (message: string, color = "#198754") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, color }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >

      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: toast.color,
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            fontWeight: 500,
            pointerEvents: "auto", 
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export const useToast = () => showToastFn;
