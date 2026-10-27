/**
 * COMPONENTE EXPORTAR CSV - SYNC DEEA
 * ============================================================================
 * 
 * Exporta datos tabulares a CSV/Excel
 * Compatible con peticiones, correspondencia, contratos, proyectos, agenda
 * 
 * Props:
 * - datos: Record<string, any>[] (array de objetos a exportar)
 * - nombreArchivo: string (ej: "peticiones-2024-11.csv")
 * - columnas?: string[] (si no se proporciona, usa todas las claves del primer objeto)
 * - etiquetasColumnas?: Record<string, string> (mapeo de nombres de columnas a etiquetas legibles)
 * - formato?: 'csv' | 'excel' (por ahora solo CSV)
 * - variant?: 'button' | 'icon'
 * 
 * Ejemplo:
 * <ExportarCSV
 *   datos={peticiones}
 *   nombreArchivo="peticiones-vencidas.csv"
 *   etiquetasColumnas={{
 *     radicado: "Radicado",
 *     asunto: "Asunto",
 *     diasRestantes: "Días Restantes"
 *   }}
 * />
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React from "react";

type Formato = "csv" | "excel";
type Variant = "button" | "icon";

interface ExportarCSVProps {
  datos: Record<string, any>[];
  nombreArchivo: string;
  columnas?: string[];
  etiquetasColumnas?: Record<string, string>;
  formato?: Formato;
  variant?: Variant;
  className?: string;
}

/**
 * Escapa caracteres especiales en CSV
 */
function escaparCSV(valor: any): string {
  if (valor === null || valor === undefined) return '""';

  let str = String(valor);

  // Si contiene comas, comillas o saltos de línea, envolver en comillas
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}

/**
 * Convierte fecha a formato YYYY-MM-DD HH:MM:SS
 */
function formatearValor(valor: any): string {
  if (valor instanceof Date) {
    return valor.toLocaleString("es-CO");
  }
  if (typeof valor === "boolean") {
    return valor ? "Sí" : "No";
  }
  if (Array.isArray(valor)) {
    return valor.join("; ");
  }
  return String(valor);
}

export function ExportarCSV({
  datos,
  nombreArchivo,
  columnas,
  etiquetasColumnas = {},
  formato = "csv",
  variant = "button",
  className = "",
}: ExportarCSVProps) {
  if (datos.length === 0) {
    return null;
  }

  // Determinar columnas a usar
  const columnasUsar =
    columnas || (Object.keys(datos[0]) as string[]);

  // Generar CSV
  const generarCSV = (): string => {
    const lineas: string[] = [];

    // Encabezados
    const encabezados = columnasUsar.map(
      (col) => etiquetasColumnas[col] || col
    );
    lineas.push(encabezados.map(escaparCSV).join(","));

    // Datos
    for (const fila of datos) {
      const valores = columnasUsar.map((col) => {
        const valor = fila[col];
        return escaparCSV(formatearValor(valor));
      });
      lineas.push(valores.join(","));
    }

    return lineas.join("\n");
  };

  // Descargar archivo
  const descargar = () => {
    try {
      const contenido = generarCSV();
      const blob = new Blob([contenido], {
        type: "text/csv;charset=utf-8;",
      });
      const enlace = document.createElement("a");
      const url = URL.createObjectURL(blob);

      // Agregar fecha al nombre si no la tiene
      let nombreFinal = nombreArchivo;
      if (!nombreFinal.includes(".csv")) {
        nombreFinal += ".csv";
      }

      enlace.href = url;
      enlace.setAttribute("download", nombreFinal);
      document.body.appendChild(enlace);

      enlace.click();

      document.body.removeChild(enlace);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("No se pudo exportar el archivo. Intenta de nuevo.");
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={descargar}
        className={`exportar-csv-icon ${className}`}
        title="Descargar como CSV"
        type="button"
      >
        📥
        <style jsx>{`
          .exportar-csv-icon {
            padding: 6px 8px;
            background-color: transparent;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all var(--transition-base);
            border-radius: var(--radius-md);
          }

          .exportar-csv-icon:hover {
            background-color: var(--color-fondo);
            transform: scale(1.1);
          }

          .exportar-csv-icon:active {
            transform: scale(0.95);
          }
        `}</style>
      </button>
    );
  }

  // Variant: button
  return (
    <button
      onClick={descargar}
      className={`exportar-csv-button ${className}`}
      type="button"
    >
      <span className="icon">📥</span>
      <span className="texto">Exportar CSV</span>
      <style jsx>{`
        .exportar-csv-button {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--color-fondo);
          border: 1px solid var(--color-borde);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--color-tinta-principal);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .exportar-csv-button:hover {
          background-color: var(--color-acento-principal);
          border-color: var(--color-acento-principal);
          color: white;
        }

        .exportar-csv-button:active {
          transform: scale(0.98);
        }

        .exportar-csv-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .icon {
          font-size: 1.125rem;
        }

        @media (max-width: 640px) {
          .texto {
            display: none;
          }

          .exportar-csv-button {
            padding: 6px 8px;
            gap: 0;
          }
        }
      `}</style>
    </button>
  );
}

/**
 * Hook para generar CSV programáticamente sin mostrar botón
 */
export function useExportarCSV() {
  return {
    generarCSV: (
      datos: Record<string, any>[],
      columnas?: string[],
      etiquetasColumnas?: Record<string, string>
    ): string => {
      if (datos.length === 0) return "";

      const columnasUsar = columnas || Object.keys(datos[0]);
      const lineas: string[] = [];

      // Encabezados
      const encabezados = columnasUsar.map(
        (col) => etiquetasColumnas?.[col] || col
      );
      lineas.push(encabezados.map(escaparCSV).join(","));

      // Datos
      for (const fila of datos) {
        const valores = columnasUsar.map((col) => {
          const valor = fila[col];
          return escaparCSV(formatearValor(valor));
        });
        lineas.push(valores.join(","));
      }

      return lineas.join("\n");
    },

    descargarCSV: (
      contenido: string,
      nombreArchivo: string
    ): void => {
      try {
        const blob = new Blob([contenido], {
          type: "text/csv;charset=utf-8;",
        });
        const enlace = document.createElement("a");
        const url = URL.createObjectURL(blob);

        let nombreFinal = nombreArchivo;
        if (!nombreFinal.includes(".csv")) {
          nombreFinal += ".csv";
        }

        enlace.href = url;
        enlace.setAttribute("download", nombreFinal);
        document.body.appendChild(enlace);

        enlace.click();

        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar CSV:", error);
        throw error;
      }
    },
  };
}
