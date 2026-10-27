/**
 * HEADER COMPONENT - SYNC DEEA
 * ============================================================================
 * 
 * Encabezado responsivo con logo, título, menú usuario
 * Preserva identidad visual institucional
 * 
 * Secciones:
 * - Logo + Nombre Secretaría (izquierda)
 * - Búsqueda global (centro)
 * - Notificaciones + Usuario (derecha)
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo y título */}
        <Link href="/" className="header-logo">
          <div className="logo-icon">📋</div>
          <div className="logo-text">
            <h1 className="logo-title">SYNC DEEA</h1>
            <p className="logo-subtitle">Alcaldía Municipal de Montelíbano</p>
          </div>
        </Link>

        {/* Búsqueda global (oculto en mobile) */}
        <div className="header-search">
          <input
            type="search"
            placeholder="Buscar petición, radicado, contrato..."
            className="search-input"
            aria-label="Búsqueda global"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Menú derecha */}
        <div className="header-actions">
          {/* Notificaciones */}
          <button
            className="btn-icon"
            title="Notificaciones"
            aria-label="Notificaciones"
          >
            <span className="icon">🔔</span>
            <span className="badge-count">3</span>
          </button>

          {/* Menú usuario */}
          <div className="user-menu">
            <button
              className="btn-user"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú usuario"
            >
              <span className="user-avatar">JD</span>
              <span className="user-name">Juan D.</span>
              <span className="dropdown-icon">▼</span>
            </button>

            {menuAbierto && (
              <div className="dropdown-menu">
                <a href="/perfil" className="menu-item">
                  👤 Mi perfil
                </a>
                <a href="/configuracion" className="menu-item">
                  ⚙️ Configuración
                </a>
                <hr className="menu-divider" />
                <a href="/logout" className="menu-item danger">
                  🚪 Cerrar sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos Header */}
      <style jsx>{`
        .header {
          background-color: var(--color-acento-principal);
          color: white;
          padding: var(--spacing-md) var(--spacing-lg);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-lg);
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          text-decoration: none;
          color: white;
          min-width: 280px;
        }

        .logo-icon {
          font-size: 2rem;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          flex: 1;
        }

        .logo-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .logo-subtitle {
          margin: 0;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .header-search {
          flex: 1;
          max-width: 400px;
          position: relative;
          display: none;
        }

        @media (min-width: 1024px) {
          .header-search {
            display: block;
          }
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm)
            var(--spacing-lg);
          border: none;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 0.875rem;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .search-icon {
          position: absolute;
          right: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .btn-icon {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          position: relative;
          font-size: 1.25rem;
          transition: opacity var(--transition-base);
          padding: 0;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          opacity: 0.8;
        }

        .badge-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--color-semaforo-rojo);
          color: white;
          font-size: 0.625rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-acento-principal);
        }

        .user-menu {
          position: relative;
        }

        .btn-user {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-full);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color var(--transition-base);
        }

        .btn-user:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .dropdown-icon {
          font-size: 0.625rem;
          opacity: 0.7;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--color-panel);
          border: 1px solid var(--color-borde-claro);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          margin-top: var(--spacing-sm);
          z-index: var(--z-dropdown);
          overflow: hidden;
        }

        .menu-item {
          display: block;
          padding: var(--spacing-md) var(--spacing-lg);
          color: var(--color-tinta-principal);
          text-decoration: none;
          font-size: 0.875rem;
          transition: background-color var(--transition-base);
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .menu-item:hover {
          background-color: var(--color-fondo);
        }

        .menu-item.danger {
          color: var(--color-semaforo-rojo);
        }

        .menu-divider {
          margin: 0;
          border: none;
          border-top: 1px solid var(--color-borde-claro);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .header-content {
            gap: var(--spacing-md);
          }

          .header-logo {
            min-width: auto;
          }

          .logo-text {
            display: none;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
