import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./assets/hooks/useAuth";

// Estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/CSS/Estilo.css";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró #root en index.html");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
