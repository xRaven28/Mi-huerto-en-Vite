import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { Producto } from "../types";

/* ========================================
   📊 Componente de estadísticas de productos reales
========================================= */
interface Props {
  productos: Producto[];
}

const AdminEstadisticas: React.FC<Props> = ({ productos }) => {
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [mejorValorados, setMejorValorados] = useState<any[]>([]);
  const [peorValorados, setPeorValorados] = useState<any[]>([]);

  useEffect(() => {
    if (!productos || productos.length === 0) return;

    /* ============================================================
       1️⃣ LEER COMPRAS REALES DESDE LOCALSTORAGE
       ============================================================ */
    const rawCompras =
      localStorage.getItem("historialCompras") ||
      localStorage.getItem("compras") ||
      "[]";
    const compras = JSON.parse(rawCompras);

    // Crear un contador de ventas reales por ID
    const contador: Record<number, number> = {};

    compras.forEach((compra: any) => {
      if (Array.isArray(compra.productos)) {
        compra.productos.forEach((p: any) => {
          if (p.id) {
            contador[p.id] = (contador[p.id] || 0) + (p.cantidad || 1);
          }
        });
      }
    });

    // Combinar productos con ventas reales
    const vendidosConCantidad = productos.map((p) => ({
      ...p,
      ventas: contador[p.id] || 0,
    }));

    /* ============================================================
       2️⃣ FILTRAR POR MES ACTUAL
       ============================================================ */
    const ahora = new Date();
    const mesActual = ahora.getMonth(); // 0 = enero
    const añoActual = ahora.getFullYear();

    const comprasDelMes = compras.filter((c: any) => {
      if (!c.fecha) return false;
      const fecha = new Date(c.fecha);
      return (
        fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
      );
    });

    // Recalcular ventas del mes
    const contadorMes: Record<number, number> = {};
    comprasDelMes.forEach((compra: any) => {
      compra.productos?.forEach((p: any) => {
        contadorMes[p.id] = (contadorMes[p.id] || 0) + (p.cantidad || 1);
      });
    });

    const vendidosMes = productos.map((p) => ({
      ...p,
      ventas: contadorMes[p.id] || 0,
    }));

    const topVendidos = [...vendidosMes]
      .filter((p) => p.ventas > 0)
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 5);

    /*MEJORES / PEORES VALORADOS*/
    const valorados = productos.map((p) => {
      const valoraciones = p.valoraciones || [];
      const promedio =
        valoraciones.length > 0
          ? valoraciones.reduce((a, v) => a + (v.estrellas || 0), 0) /
            valoraciones.length
          : 0;
      return { ...p, promedio };
    });

    const topMejor = [...valorados]
      .filter((p) => p.promedio > 0)
      .sort((a, b) => b.promedio - a.promedio)
      .slice(0, 5);

    const topPeor = [...valorados]
      .filter((p) => p.promedio > 0)
      .sort((a, b) => a.promedio - b.promedio)
      .slice(0, 5);

    /*ACTUALIZAR ESTADOS */
    setMasVendidos(topVendidos);
    setMejorValorados(topMejor);
    setPeorValorados(topPeor);
  }, [productos]);

  return (
    <div className="container mt-4">
      <h3 className="text-success mb-4">
        <i className="bi bi-graph-up"></i> Estadísticas de Productos
      </h3>

      <div className="row">
        {/* 🛒 MÁS VENDIDOS */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <strong>Más vendidos del mes actual</strong>
            </div>
            <div className="card-body">
              {masVendidos.length === 0 ? (
                <p className="text-muted text-center mb-0">
                  No hay registros de ventas este mes.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={masVendidos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#28a745" name="Ventas del mes" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* ⭐ MEJOR VALORADOS */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <strong>Mejor valorados</strong>
            </div>
            <div className="card-body">
              {mejorValorados.length === 0 ? (
                <p className="text-muted text-center mb-0">
                  No hay valoraciones aún.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mejorValorados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar
                      dataKey="promedio"
                      fill="#ffc107"
                      name="Promedio de estrellas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* ⚠️ PEOR VALORADOS */}
        <div className="col-lg-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <strong>Peor valorados</strong>
            </div>
            <div className="card-body">
              {peorValorados.length === 0 ? (
                <p className="text-muted text-center mb-0">
                  No hay valoraciones aún.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={peorValorados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar
                      dataKey="promedio"
                      fill="#dc3545"
                      name="Promedio de estrellas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEstadisticas;
