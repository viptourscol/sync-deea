/**
 * COMPONENTE PAGINACION - SYNC DEEA
 * ============================================================================
 * 
 * Controles de paginación para tablas y listados
 * Soporta ir a página anterior/siguiente, saltar a página específica
 * 
 * Props:
 * - paginaActual: number
 * - totalPages: number
 * - onPaginaChange: (nuevaPagina: number) => void
 * - itemsPorPagina?: number
 * - totalItems?: number
 * - tamaño?: 'sm' | 'md' | 'lg'
 * 
 * Ejemplo:
 * <Paginacion
 *   paginaActual={1}
 *   totalPages={10}
 *   totalItems={456}
 *   itemsPorPagina={50}
 *   onPaginaChange={(p) => setPage(p)}
 * />
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React from "react";

type Tamaño = "sm" | "md" | "lg";

interface PaginacionProps {
  paginaActual: number;
  totalPages: number;
  onPaginaChange: (nuevaPagina: number) => void;
  itemsPorPagina?: number;
  totalItems?: number;
  tamaño?: Tamaño;
  mostrarInfo?: boolean;
  className?: string;
}

export function Paginacion({
  paginaActual,
  totalPages,
  onPaginaChange,
  itemsPorPagina,
  totalItems,
  tamaño = "md",
  mostrarInfo = true,
  className = "",
}: PaginacionProps) {
  // Validaciones
  const pagina = Math.max(1, Math.min(paginaActual, totalPages));
  const hayAnterior = pagina > 1;
  const haySiguiente = pagina < totalPages;

  // Rango de páginas a mostrar (máximo 5 números)
  const generarRangoPaginas = (): (number | string)[] => {
    const rango: (number | string)[] = [];
    const ventana = 2;

    for (let i = Math.max(1, pagina - ventana); i <= Math.min(totalPages, pagina + ventana); i++) {
      rango.push(i);
    }

    // Agregar primera página si no está en rango
    if (rango[0] !== 1) {
      if (rango[0] !== 2) {
        rango.unshift("...");
      }
      rango.unshift(1);
    }

    // Agregar última página si no está en rango
    if (rango[rango.length - 1] !== totalPages) {
      if (rango[rango.length - 1] !== totalPages - 1) {
        rango.push("...");
      }
      rango.push(totalPages);
    }

    return rango;
  };

  const rangoPaginas = generarRangoPaginas();

  // Cálculo del rango de items mostrado
  const itemInicio = (pagina - 1) * (itemsPorPagina || 10) + 1;
  const itemFin = Math.min(pagina * (itemsPorPagina || 10), totalItems || 0);

  const tamaños: Record<Tamaño, { gap: string; padding: string; fontSize: string }> = {
    sm: { gap: "0.25rem", padding: "4px 6px", fontSize: "0.75rem" },
    md: { gap: "0.5rem", padding: "6px 10px", fontSize: "0.875rem" },
    lg: { gap: "0.75rem", padding: "8px 14px", fontSize: "1rem" },
  };

  const medidas = tamaños[tamaño];

  return (
    <div className={`paginacion ${tamaño} ${className}`}>
      {mostrarInfo && totalItems && (
        <div className="paginacion-info">
          Mostrando <strong>{itemInicio}</strong> a <strong>{itemFin}</strong> de{" "}
          <strong>{totalItems}</strong> registros
        </div>
      )}

      <div className="paginacion-controles">
        {/* Botón anterior */}
        <button
          onClick={() => onPaginaChange(pagina - 1)}
          disabled={!hayAnterior}
          className="paginacion-btn anterior"
          title="Página anterior"
          type="button"
        >
          ←
        </button>

        {/* Números de página */}
        <div className="paginacion-numeros">
          {rangoPaginas.map((p, i) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${i}`} className="paginacion-ellipsis">
                  ...
                </span>
              );
            }

            const numPagina = p as number;
            const esActual = numPagina === pagina;

            return (
              <button
                key={numPagina}
                onClick={() => onPaginaChange(numPagina)}
                className={`paginacion-numero ${esActual ? "activo" : ""}`}
                aria-label={`Ir a página ${numPagina}`}
                aria-current={esActual ? "page" : undefined}
                type="button"
              >
                {numPagina}
              </button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPaginaChange(pagina + 1)}
          disabled={!haySiguiente}
          className="paginacion-btn siguiente"
          title="Página siguiente"
          type="button"
        >
          →
        </button>
      </div>

      <style jsx>{`
        .paginacion {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          align-items: center;
          justify-content: center;
        }

        .paginacion-info {
          font-size: ${medidas.fontSize};
          color: var(--color-tinta-secundaria);
        }

        .paginacion-info strong {
          color: var(--color-tinta-principal);
          font-weight: var(--font-weight-semibold);
        }

        .paginacion-controles {
          display: flex;
          align-items: center;
          gap: ${medidas.gap};
        }

        .paginacion-btn {
          padding: ${medidas.padding};
          background-color: var(--color-panel);
          border: 1px solid var(--color-borde);
          border-radius: var(--radius-md);
          font-size: ${medidas.fontSize};
          font-weight: var(--font-weight-semibold);
          color: var(--color-tinta-principal);
          cursor: pointer;
          transition: all var(--transition-base);
          min-width: 40px;
        }

        .paginacion-btn:hover:not(:disabled) {
          background-color: var(--color-acento-principal);
          color: white;
          border-color: var(--color-acento-principal);
        }

        .paginacion-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .paginacion-numeros {
          display: flex;
          gap: ${medidas.gap};
          align-items: center;
        }

        .paginacion-numero {
          padding: ${medidas.padding};
          min-width: 40px;
          background-color: var(--color-panel);
          border: 1px solid var(--color-borde);
          border-radius: var(--radius-md);
          font-size: ${medidas.fontSize};
          font-weight: var(--font-weight-medium);
          color: var(--color-tinta-principal);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .paginacion-numero:hover {
          background-color: var(--color-fondo);
          border-color: var(--color-acento-principal);
        }

        .paginacion-numero.activo {
          background-color: var(--color-acento-principal);
          color: white;
          border-color: var(--color-acento-principal);
          font-weight: var(--font-weight-bold);
        }

        .paginacion-ellipsis {
          padding: 0 ${medidas.gap};
          color: var(--color-tinta-secundaria);
          font-size: ${medidas.fontSize};
        }

        /* Responsive */
        @media (max-width: 640px) {
          .paginacion {
            gap: var(--spacing-md);
          }

          .paginacion-info {
            font-size: 0.75rem;
            text-align: center;
          }

          .paginacion-numero {
            min-width: 32px;
            padding: 4px 6px;
          }

          .paginacion-btn {
            min-width: 32px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Hook para manejar lógica de paginación
 */
export function usePaginacion(totalItems: number, itemsPorPagina: number = 10) {
  const [paginaActual, setPaginaActual] = React.useState(1);

  const totalPages = Math.ceil(totalItems / itemsPorPagina);

  const offset = (paginaActual - 1) * itemsPorPagina;
  const limit = itemsPorPagina;

  return {
    paginaActual,
    setPaginaActual,
    totalPages,
    offset,
    limit,
    goToPage: (pagina: number) => {
      const p = Math.max(1, Math.min(pagina, totalPages));
      setPaginaActual(p);
    },
    irAnterior: () =>
      setPaginaActual((p) => Math.max(1, p - 1)),
    irSiguiente: () =>
      setPaginaActual((p) => Math.min(totalPages, p + 1)),
    reset: () => setPaginaActual(1),
  };
}
