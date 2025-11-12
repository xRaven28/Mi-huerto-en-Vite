import React from "react";
import { describe, it, beforeEach, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../utils/renderWithRouter";
import { AuthProvider } from "../../assets/hooks/useAuth"; 
import RutaProtegida from "../../assets/routes/RutaProtegida";

function Dummy() {
  return <h3>Panel privado</h3>;
}

const renderProtected = (ui: React.ReactElement) => {
  return renderWithRouter(<AuthProvider>{ui}</AuthProvider>);
};

describe("RutaProtegida - comportamiento real con localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("1.Bloquea acceso sin usuario ni modo invitado", () => {
    renderProtected(<RutaProtegida element={<Dummy />} />);
    expect(screen.queryByText(/panel privado/i)).not.toBeInTheDocument();
  });

  it("2.Permite acceso si hay modoInvitado", () => {
    localStorage.setItem("modoInvitado", "true");
    renderProtected(<RutaProtegida element={<Dummy />} />);
    expect(screen.getByText(/panel privado/i)).toBeInTheDocument();
  });

  it("3.Permite acceso solo si usuario tiene rol admin cuando adminOnly=true", () => {
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({ nombre: "Admin", rol: "admin" })
    );
    renderProtected(<RutaProtegida element={<Dummy />} adminOnly />);
    expect(screen.getByText(/panel privado/i)).toBeInTheDocument();
  });
});
