import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RutaProtegidaProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ element, adminOnly }) => {
  const { usuario } = useAuth();


  const modoInvitado = localStorage.getItem("modoInvitado") === "true";

  if (!usuario && !modoInvitado) {
    return <Navigate to="/mi-cuenta" replace />;
  }

  if (adminOnly && usuario?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default RutaProtegida;
