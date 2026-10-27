/**
 * COMPONENTE ESTADO PETICION - SYNC DEEA
 * ============================================================================
 * 
 * Badge visual para estados de peticiones y correspondencia
 * Estados: Recibido, En trámite, Respondido
 * 
 * Props:
 * - estado: 'Recibido' | 'En trámite' | 'Respondido' | 'Archivado'
 * - tamaño?: 'sm' | 'md' | 'lg'
 * - clickeable?: boolean
 * - onClick?: () => void
 * - className?: string
 * 
 * Ejemplo:
 * <EstadoPeticion estado="En trámite" tamaño="md" />
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React from "react";

type EstadoNombre = "Recibido" | "En trámite" | "Respondido" | "Archivado";
type Tamaño = "sm" | "md" | "lg";

interface EstadoPeticionProps {
  estado: EstadoNombre;
  tamaño?: Tamaño;
  clickeable?: boolean;
  onClick?: () => void;
  className?: string;
}

const estadoConfig: Record<
  EstadoNombre,
  {
    icono: string;
    color: string;
    backgroundColor: string;
    descripcion: string;
  }
> = {
  Recibido: {
    icono: "📥",
    color: "#0066CC",
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    descripcion: "Recibido y registrado",
  },
  "En trámite": {
    icono: "⏳",
    color: "#B87708",
    backgroundColor: "rgba(184, 119, 8, 0.1)",
    descripcion: "En proceso de análisis",
  },
  Respondido: {
    icono: "✓",
    color: "#2E7D4F",
    backgroundColor: "rgba(46, 125, 79, 0.1)",
    descripcion: "Respondido al solicitante",
  },
  Archivado: {
    icono: "📦",
    color: "#666666",
    backgroundColor: "rgba(102, 102, 102, 0.1)",
    descripcion: "Archivado",
  },
};

const tamaños: Record<Tamaño, { fontSize: string; padding: string }> = {
  sm: { fontSize: "0.75rem", padding: "4px 8px" },
  md: { fontSize: "0.875rem", padding: "6px 12px" },
  lg: { fontSize: "1rem", padding: "8px 16px" },
};

export function EstadoPeticion({
  estado,
  tamaño = "md",
  clickeable = false,
  onClick,
  className = "",
}: EstadoPeticionProps) {
  const config = estadoConfig[estado];
  const medidas = tamaños[tamaño];

  return (
    <div
      className={`estado-peticion ${tamaño} ${clickeable ? "clickeable" : ""} ${className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        padding: medidas.padding,
        fontSize: medidas.fontSize,
      } as React.CSSProperties}
      onClick={clickeable ? onClick : undefined}
      title={config.descripcion}
      role={clickeable ? "button" : undefined}
    >
      <span className="icono">{config.icono}</span>
      <span className="etiqueta">{estado}</span>

      <style jsx>{`
        .estado-peticion {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          white-space: nowrap;
          border: 1px solid ${config.color}33;
          transition: all var(--transition-base);
        }

        .estado-peticion.clickeable {
          cursor: pointer;
        }

        .estado-peticion.clickeable:hover {
          background-color: ${config.color}20;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .icono {
          line-height: 1;
          display: inline-block;
        }

        .etiqueta {
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

/**
 * Componente para mostrar selector de estados
 * Útil en formularios para cambiar estado
 */
interface SelectorEstadoProps {
  estadoActual: EstadoNombre;
  onCambio: (nuevoEstado: EstadoNombre) => void;
  estadosDisponibles?: EstadoNombre[];
  deshabilitado?: boolean;
  className?: string;
}

export function SelectorEstado({
  estadoActual,
  onCambio,
  estadosDisponibles = ["Recibido", "En trámite", "Respondido", "Archivado"],
  deshabilitado = false,
  className = "",
}: SelectorEstadoProps) {
  return (
    <select
      value={estadoActual}
      onChange={(e) => onCambio(e.target.value as EstadoNombre)}
      disabled={deshabilitado}
      className={`selector-estado ${className}`}
    >
      {estadosDisponibles.map((estado) => {
        const config = estadoConfig[estado];
        return (
          <option key={estado} value={estado} title={config.descripcion}>
            {config.icono} {estado}
          </option>
        );
      })}
    </select>
  );
}

/**
 * Grid de botones para cambiar estado (visual alternativo)
 */
interface BotonCambioEstadoProps {
  estadoActual: EstadoNombre;
  onCambio: (nuevoEstado: EstadoNombre) => void;
  estadosDisponibles?: EstadoNombre[];
  className?: string;
}

export function BotonCambioEstado({
  estadoActual,
  onCambio,
  estadosDisponibles = ["Recibido", "En trámite", "Respondido", "Archivado"],
  className = "",
}: BotonCambioEstadoProps) {
  return (
    <div className={`botones-cambio-estado ${className}`}>
      <p className="cambio-label">Cambiar estado:</p>
      <div className="botones">
        {estadosDisponibles.map((estado) => {
          const config = estadoConfig[estado];
          const esActual = estado === estadoActual;

          return (
            <button
              key={estado}
              onClick={() => onCambio(estado)}
              className={`boton-estado ${esActual ? "activo" : ""}`}
              style={
                esActual
                  ? ({
                      backgroundColor: config.color,
                      color: "white",
                      borderColor: config.color,
                    } as React.CSSProperties)
                  : ({
                      color: config.color,
                      borderColor: config.color,
                      backgroundColor: "white",
                    } as React.CSSProperties)
              }
              type="button"
            >
              <span>{config.icono}</span>
              <span>{estado}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .botones-cambio-estado {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .cambio-label {
          margin: 0;
          font-weight: var(--font-weight-semibold);
          color: var(--color-tinta-principal);
        }

        .botones {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .boton-estado {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid;
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .boton-estado:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .boton-estado.activo {
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 640px) {
          .botones {
            gap: 0.5rem;
          }

          .boton-estado {
            padding: 4px 8px;
            font-size: 0.75rem;
          }

          .boton-estado span:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
