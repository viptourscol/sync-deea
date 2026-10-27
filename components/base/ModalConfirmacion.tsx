/**
 * COMPONENTE MODAL CONFIRMACION - SYNC DEEA
 * ============================================================================
 * 
 * Dialog de confirmación para acciones críticas
 * (eliminar, cambiar estado, rechazar petición, etc.)
 * 
 * Props:
 * - abierto: boolean
 * - titulo: string
 * - mensaje: string | React.ReactNode
 * - botones?: {
 *     confirmar: { etiqueta: string, onClick: () => void, variant?: 'rojo' | 'verde' }
 *     cancelar?: { etiqueta: string, onClick: () => void }
 *   }
 * - advertencia?: string (texto en rojo para acción destructiva)
 * - children?: React.ReactNode (contenido adicional)
 * 
 * Ejemplo:
 * <ModalConfirmacion
 *   abierto={abrirEliminar}
 *   titulo="Eliminar petición"
 *   mensaje="¿Está seguro de que desea eliminar esta petición? Esta acción no se puede deshacer."
 *   advertencia="Esta acción es irreversible"
 *   botones={{
 *     confirmar: {
 *       etiqueta: "Eliminar",
 *       onClick: () => handleEliminar(),
 *       variant: "rojo"
 *     },
 *     cancelar: {
 *       etiqueta: "Cancelar",
 *       onClick: () => setAbrirEliminar(false)
 *     }
 *   }}
 * />
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React, { useEffect } from "react";

interface BotonesConfig {
  confirmar: {
    etiqueta: string;
    onClick: () => void;
    variant?: "rojo" | "verde" | "azul";
    cargando?: boolean;
  };
  cancelar?: {
    etiqueta: string;
    onClick: () => void;
  };
}

interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string | React.ReactNode;
  botones?: BotonesConfig;
  advertencia?: string;
  children?: React.ReactNode;
  onCerrar?: () => void;
  icono?: string;
  className?: string;
}

export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  botones = {
    confirmar: {
      etiqueta: "Confirmar",
      onClick: () => {},
    },
    cancelar: {
      etiqueta: "Cancelar",
      onClick: () => {},
    },
  },
  advertencia,
  children,
  onCerrar,
  icono = "❓",
  className = "",
}: ModalConfirmacionProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && abierto) {
        onCerrar?.();
      }
    };

    if (abierto) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  const colorVariant = {
    rojo: "var(--color-semaforo-rojo)",
    verde: "var(--color-semaforo-verde)",
    azul: "var(--color-acento-principal)",
  };

  const colorBoton = botones.confirmar.variant
    ? colorVariant[botones.confirmar.variant]
    : colorVariant.azul;

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay"
        onClick={() => onCerrar?.()}
        role="presentation"
      />

      {/* Modal */}
      <div className={`modal-confirmacion ${className}`} role="dialog" aria-modal="true">
        <div className="modal-contenido">
          {/* Encabezado */}
          <div className="modal-header">
            <div className="modal-icono">{icono}</div>
            <h2 className="modal-titulo">{titulo}</h2>
            <button
              className="modal-cerrar"
              onClick={() => onCerrar?.()}
              title="Cerrar"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Cuerpo */}
          <div className="modal-body">
            <div className="modal-mensaje">{mensaje}</div>

            {advertencia && (
              <div className="modal-advertencia">
                <span className="advertencia-icono">⚠️</span>
                <p>{advertencia}</p>
              </div>
            )}

            {children && <div className="modal-extra">{children}</div>}
          </div>

          {/* Pie */}
          <div className="modal-footer">
            {botones.cancelar && (
              <button
                className="modal-btn modal-btn-cancelar"
                onClick={botones.cancelar.onClick}
                type="button"
              >
                {botones.cancelar.etiqueta}
              </button>
            )}

            <button
              className="modal-btn modal-btn-confirmar"
              onClick={botones.confirmar.onClick}
              disabled={botones.confirmar.cargando}
              style={{ backgroundColor: colorBoton } as React.CSSProperties}
              type="button"
            >
              {botones.confirmar.cargando ? (
                <>
                  <span className="spinner"></span>
                  {botones.confirmar.etiqueta}
                </>
              ) : (
                botones.confirmar.etiqueta
              )}
            </button>
          </div>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            animation: fadeIn 0.2s ease-out;
          }

          .modal-confirmacion {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--color-panel);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-2xl);
            max-width: 500px;
            width: 90%;
            z-index: 1000;
            animation: slideUp 0.3s ease-out;
            max-height: 90vh;
            overflow-y: auto;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              transform: translate(-50%, -40%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%);
              opacity: 1;
            }
          }

          .modal-contenido {
            display: flex;
            flex-direction: column;
          }

          /* Header */
          .modal-header {
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-md);
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--color-borde-claro);
            position: relative;
          }

          .modal-icono {
            font-size: 1.75rem;
            flex-shrink: 0;
            line-height: 1;
          }

          .modal-titulo {
            margin: 0;
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-tinta-principal);
            flex: 1;
          }

          .modal-cerrar {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            padding: 4px;
            background-color: transparent;
            border: none;
            font-size: 1.25rem;
            color: var(--color-tinta-secundaria);
            cursor: pointer;
            transition: all var(--transition-base);
            line-height: 1;
          }

          .modal-cerrar:hover {
            color: var(--color-tinta-principal);
            transform: scale(1.2);
          }

          /* Body */
          .modal-body {
            padding: var(--spacing-lg);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .modal-mensaje {
            color: var(--color-tinta-principal);
            line-height: 1.6;
            font-size: var(--font-size-base);
          }

          .modal-advertencia {
            display: flex;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: rgba(179, 38, 30, 0.1);
            border-left: 4px solid var(--color-semaforo-rojo);
            border-radius: var(--radius-md);
          }

          .advertencia-icono {
            font-size: 1.25rem;
            flex-shrink: 0;
            line-height: 1;
          }

          .modal-advertencia p {
            margin: 0;
            color: var(--color-semaforo-rojo);
            font-weight: var(--font-weight-semibold);
            font-size: 0.875rem;
          }

          .modal-extra {
            padding-top: var(--spacing-sm);
          }

          /* Footer */
          .modal-footer {
            display: flex;
            gap: var(--spacing-md);
            justify-content: flex-end;
            padding: var(--spacing-lg);
            border-top: 1px solid var(--color-borde-claro);
            background-color: var(--color-fondo);
            border-radius: 0 0 var(--radius-xl) var(--radius-xl);
          }

          .modal-btn {
            padding: var(--spacing-sm) var(--spacing-lg);
            border: 1px solid;
            border-radius: var(--radius-md);
            font-weight: var(--font-weight-semibold);
            font-size: var(--font-size-sm);
            cursor: pointer;
            transition: all var(--transition-base);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
          }

          .modal-btn-cancelar {
            background-color: var(--color-panel);
            color: var(--color-tinta-principal);
            border-color: var(--color-borde);
          }

          .modal-btn-cancelar:hover {
            background-color: var(--color-fondo);
            border-color: var(--color-tinta-principal);
          }

          .modal-btn-confirmar {
            background-color: var(--color-acento-principal);
            color: white;
            border-color: var(--color-acento-principal);
          }

          .modal-btn-confirmar:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }

          .modal-btn-confirmar:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner {
            display: inline-block;
            width: 0.875rem;
            height: 0.875rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          /* Responsive */
          @media (max-width: 640px) {
            .modal-confirmacion {
              width: 95%;
              max-width: 100%;
            }

            .modal-footer {
              flex-direction: column-reverse;
            }

            .modal-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </>
  );
}

/**
 * Hook para manejar estado del modal
 */
export function useModalConfirmacion() {
  const [abierto, setAbierto] = React.useState(false);

  return {
    abierto,
    abrir: () => setAbierto(true),
    cerrar: () => setAbierto(false),
    toggle: () => setAbierto((prev) => !prev),
  };
}
