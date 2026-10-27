/**
 * COMPONENTE SEMAFORO - SYNC DEEA
 * ============================================================================
 * 
 * Indicador visual de estado: Verde, Ámbar, Rojo, Vencido, Gris
 * Se usa en peticiones, contratos, y cualquier entidad con vencimiento
 * 
 * Props:
 * - estado: 'Verde' | 'Ámbar' | 'Rojo' | 'Vencido' | 'Gris'
 * - tamaño: 'sm' | 'md' | 'lg' (default: 'md')
 * - etiqueta: boolean (mostrar texto del estado)
 * - interactivo: boolean (hover effect)
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React from "react";

type SemaforoEstado = "Verde" | "Ámbar" | "Rojo" | "Vencido" | "Gris";
type SemaforoTamaño = "sm" | "md" | "lg";

interface SemaforoProps {
  estado: SemaforoEstado;
  tamaño?: SemaforoTamaño;
  etiqueta?: boolean;
  interactivo?: boolean;
  titulo?: string;
  className?: string;
}

const estadoConfig: Record<
  SemaforoEstado,
  { color: string; colorLight: string; icon: string; descripcion: string }
> = {
  Verde: {
    color: "var(--color-semaforo-verde)",
    colorLight: "var(--color-semaforo-verde-light)",
    icon: "●",
    descripcion: "En tiempo",
  },
  Ámbar: {
    color: "var(--color-semaforo-ambar)",
    colorLight: "var(--color-semaforo-ambar-light)",
    icon: "●",
    descripcion: "Atención",
  },
  Rojo: {
    color: "var(--color-semaforo-rojo)",
    colorLight: "var(--color-semaforo-rojo-light)",
    icon: "●",
    descripcion: "Urgente",
  },
  Vencido: {
    color: "var(--color-semaforo-rojo)",
    colorLight: "var(--color-semaforo-rojo-light)",
    icon: "⚠",
    descripcion: "Vencido",
  },
  Gris: {
    color: "var(--color-semaforo-gris)",
    colorLight: "#f0f0f0",
    icon: "○",
    descripcion: "Sin acción",
  },
};

const tamaños: Record<SemaforoTamaño, { tamaño: string; fontSize: string }> = {
  sm: { tamaño: "16px", fontSize: "0.625rem" },
  md: { tamaño: "24px", fontSize: "0.75rem" },
  lg: { tamaño: "32px", fontSize: "0.875rem" },
};

export function Semaforo({
  estado,
  tamaño = "md",
  etiqueta = false,
  interactivo = false,
  titulo,
  className = "",
}: SemaforoProps) {
  const config = estadoConfig[estado];
  const medidas = tamaños[tamaño];

  const title = titulo || config.descripcion;

  return (
    <div
      className={`semaforo-wrapper ${tamaño} ${interactivo ? "interactivo" : ""} ${className}`}
      title={title}
    >
      <div className="semaforo-indicador" style={{} as React.CSSProperties}>
        <span className="semaforo-icon">{config.icon}</span>
      </div>

      {etiqueta && <span className="semaforo-etiqueta">{estado}</span>}

      <style jsx>{`
        .semaforo-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .semaforo-wrapper.sm {
          font-size: var(--font-size-sm);
        }

        .semaforo-wrapper.md {
          font-size: var(--font-size-base);
        }

        .semaforo-wrapper.lg {
          font-size: var(--font-size-lg);
        }

        .semaforo-indicador {
          width: ${medidas.tamaño};
          height: ${medidas.tamaño};
          border-radius: 50%;
          background-color: ${config.colorLight};
          border: 2px solid ${config.color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${medidas.fontSize};
          color: ${config.color};
          transition: all var(--transition-base);
          flex-shrink: 0;
        }

        .semaforo-wrapper.interactivo .semaforo-indicador:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 3px ${config.colorLight};
        }

        .semaforo-icon {
          line-height: 1;
        }

        .semaforo-etiqueta {
          font-weight: var(--font-weight-semibold);
          color: ${config.color};
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
