/**
 * SIDEBAR COMPONENT - SYNC DEEA
 * ============================================================================
 * 
 * Menú lateral con navegación por módulos
 * Estructura por acordeón: cada módulo con submenu
 * Responsive: drawer en mobile, sidebar fijo en desktop
 * 
 * Módulos:
 * 1. Dashboard Ejecutivo
 * 2. Derechos de Petición y PQRSD
 * 3. Correspondencia
 * 4. Contratación Pública
 * 5. Proyectos y Planeación
 * 6. Agenda y Reuniones
 * 7. Desarrollo Económico (Agropecuario + Empresarial)
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  icon: string;
  href?: string;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "📊",
    href: "/",
  },
  {
    label: "Derechos de Petición",
    icon: "📝",
    items: [
      { label: "Todas las peticiones", icon: "📋", href: "/peticiones" },
      { label: "Nueva petición", icon: "➕", href: "/peticiones/nuevo" },
      { label: "En trámite", icon: "⏳", href: "/peticiones?estado=En%20tr%C3%A1mite" },
      { label: "Pendientes", icon: "🔔", href: "/peticiones?estado=Recibido" },
      { label: "Respondidas", icon: "✅", href: "/peticiones?estado=Respondido" },
    ],
  },
  {
    label: "Correspondencia",
    icon: "✉️",
    items: [
      { label: "Entrada y Salida", icon: "📬", href: "/correspondencia" },
      { label: "Nueva entrada", icon: "📥", href: "/correspondencia/entrada/nuevo" },
      { label: "Nueva salida", icon: "📤", href: "/correspondencia/salida/nuevo" },
      { label: "Archivo", icon: "🗂️", href: "/correspondencia/archivo" },
    ],
  },
  {
    label: "Contratación Pública",
    icon: "📋",
    items: [
      { label: "Todos los contratos", icon: "📑", href: "/contratos" },
      { label: "Nuevo contrato", icon: "➕", href: "/contratos/nuevo" },
      { label: "Supervisión", icon: "👁️", href: "/contratos/supervisi%C3%B3n" },
      { label: "Cuentas por cobrar", icon: "💰", href: "/contratos/cuentas-cobro" },
      { label: "Vencimientos próximos", icon: "⏰", href: "/contratos/vencimientos" },
    ],
  },
  {
    label: "Proyectos",
    icon: "🎯",
    items: [
      { label: "Banco de proyectos", icon: "🏦", href: "/proyectos" },
      { label: "Nuevo proyecto", icon: "➕", href: "/proyectos/nuevo" },
      { label: "Cronograma", icon: "📅", href: "/proyectos/cronograma" },
      { label: "Presupuesto", icon: "💵", href: "/proyectos/presupuesto" },
    ],
  },
  {
    label: "Agenda",
    icon: "📅",
    items: [
      { label: "Calendario", icon: "🗓️", href: "/agenda" },
      { label: "Nueva reunión", icon: "➕", href: "/agenda/nueva" },
      { label: "Reuniones del día", icon: "🕐", href: "/agenda/hoy" },
    ],
  },
  {
    label: "Desarrollo Económico",
    icon: "💼",
    items: [
      { label: "Agropecuario", icon: "🌾", href: "/desarrollo/agropecuario" },
      { label: "Productores", icon: "👨‍🌾", href: "/desarrollo/productores" },
      { label: "Asociaciones", icon: "🤝", href: "/desarrollo/asociaciones" },
      { label: "Empresarial", icon: "🏢", href: "/desarrollo/empresarial" },
      { label: "Directorio comercial", icon: "📖", href: "/desarrollo/directorio" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const toggleAccordion = (label: string) => {
    setExpandidos((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href?: string) => {
    return href ? pathname === href : false;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-group">
            {/* Elemento sin submenu */}
            {!item.items && (
              <Link
                href={item.href || "#"}
                className={`menu-link ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            )}

            {/* Elemento con submenu */}
            {item.items && (
              <>
                <button
                  className={`menu-toggle ${expandidos[item.label] ? "expanded" : ""}`}
                  onClick={() => toggleAccordion(item.label)}
                  aria-expanded={expandidos[item.label]}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  <span className="toggle-arrow">▶</span>
                </button>

                {expandidos[item.label] && (
                  <div className="submenu">
                    {item.items.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        href={subitem.href || "#"}
                        className={`submenu-link ${isActive(subitem.href) ? "active" : ""}`}
                      >
                        <span className="menu-icon">{subitem.icon}</span>
                        <span className="menu-label">{subitem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Estilos Sidebar */}
      <style jsx>{`
        .sidebar {
          width: 280px;
          background-color: var(--color-panel);
          border-right: 1px solid var(--color-borde-claro);
          overflow-y: auto;
          height: 100%;
          flex-shrink: 0;
        }

        .sidebar-nav {
          padding: var(--spacing-md) 0;
        }

        .menu-group {
          padding: 0;
          margin-bottom: 0;
        }

        .menu-link,
        .menu-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          color: var(--color-tinta-principal);
          text-decoration: none;
          font-size: 0.9375rem;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: background-color var(--transition-base);
        }

        .menu-link:hover,
        .menu-toggle:hover {
          background-color: var(--color-fondo);
        }

        .menu-link.active {
          background-color: rgba(31, 78, 95, 0.1);
          border-left: 3px solid var(--color-acento-principal);
          padding-left: calc(var(--spacing-lg) - 3px);
          font-weight: var(--font-weight-semibold);
          color: var(--color-acento-principal);
        }

        .menu-icon {
          font-size: 1.25rem;
          min-width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-toggle {
          position: relative;
        }

        .toggle-arrow {
          font-size: 0.625rem;
          opacity: 0.5;
          transition: transform var(--transition-base);
          margin-left: auto;
        }

        .menu-toggle.expanded .toggle-arrow {
          transform: rotate(90deg);
        }

        .submenu {
          background-color: rgba(31, 78, 95, 0.03);
          border-left: 3px solid rgba(31, 78, 95, 0.2);
          padding: var(--spacing-sm) 0;
        }

        .submenu-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm)
            calc(var(--spacing-lg) + 24px + var(--spacing-md));
          color: var(--color-tinta-secundaria);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-base);
        }

        .submenu-link:hover {
          color: var(--color-acento-principal);
        }

        .submenu-link.active {
          color: var(--color-acento-principal);
          font-weight: var(--font-weight-semibold);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: var(--z-fixed);
            transition: left var(--transition-base);
            box-shadow: var(--shadow-lg);
          }

          .sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </aside>
  );
}
