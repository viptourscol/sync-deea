/**
 * FOOTER COMPONENT - SYNC DEEA
 * ============================================================================
 * 
 * Pie de página con información institucional y enlaces
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

"use client";

import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Sección izquierda */}
        <div className="footer-section">
          <h4>SYNC DEEA</h4>
          <p>
            Sistema de Control y Seguimiento Integral para la Secretaría de
            Desarrollo Económico, Empresarial y Agrícola
          </p>
        </div>

        {/* Sección central */}
        <div className="footer-section">
          <h4>Enlaces rápidos</h4>
          <ul className="footer-links">
            <li>
              <a href="/peticiones">Peticiones</a>
            </li>
            <li>
              <a href="/correspondencia">Correspondencia</a>
            </li>
            <li>
              <a href="/contratos">Contratos</a>
            </li>
            <li>
              <a href="/agenda">Agenda</a>
            </li>
          </ul>
        </div>

        {/* Sección derecha */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <div className="contact-info">
            <p>
              <strong>Teléfono:</strong> +57 (XXX) XXX-XXXX
            </p>
            <p>
              <strong>Email:</strong>
              <a href="mailto:despacho@montelibano.gov.co">
                despacho@montelibano.gov.co
              </a>
            </p>
            <p>
              <strong>Dirección:</strong> Alcaldía Municipal de Montelíbano,
              Córdoba
            </p>
          </div>
        </div>
      </div>

      {/* Línea divisora */}
      <div className="footer-divider"></div>

      {/* Copyright y meta info */}
      <div className="footer-meta">
        <div className="meta-left">
          <p>
            © {currentYear} Alcaldía Municipal de Montelíbano. Todos los
            derechos reservados.
          </p>
        </div>
        <div className="meta-center">
          <p className="version">SYNC DEEA v0.1.0</p>
        </div>
        <div className="meta-right">
          <a href="/privacidad" className="meta-link">
            Privacidad
          </a>
          <span className="meta-separator">•</span>
          <a href="/terminos" className="meta-link">
            Términos
          </a>
          <span className="meta-separator">•</span>
          <a href="/accesibilidad" className="meta-link">
            Accesibilidad
          </a>
        </div>
      </div>

      {/* Estilos Footer */}
      <style jsx>{`
        .footer {
          background-color: var(--color-acento-principal);
          color: rgba(255, 255, 255, 0.9);
          margin-top: auto;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
          padding: var(--spacing-2xl) var(--spacing-lg);
        }

        .footer-section {
          padding: 0;
        }

        .footer-section h4 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: white;
        }

        .footer-section p {
          margin: 0 0 var(--spacing-sm) 0;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-base);
        }

        .footer-links a:hover {
          color: white;
          text-decoration: underline;
        }

        .contact-info {
          font-size: 0.875rem;
        }

        .contact-info p {
          margin-bottom: var(--spacing-sm);
        }

        .contact-info strong {
          display: inline-block;
          min-width: 80px;
        }

        .contact-info a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .contact-info a:hover {
          color: white;
        }

        .footer-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          margin: var(--spacing-lg) 0;
        }

        .footer-meta {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.7);
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .meta-left,
        .meta-center,
        .meta-right {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .meta-left p,
        .meta-center p,
        .meta-right p {
          margin: 0;
        }

        .version {
          background-color: rgba(0, 0, 0, 0.2);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          color: rgba(255, 255, 255, 0.8);
        }

        .meta-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .meta-link:hover {
          color: white;
          text-decoration: underline;
        }

        .meta-separator {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
            padding: var(--spacing-lg);
          }

          .footer-meta {
            flex-direction: column;
            text-align: center;
            padding: var(--spacing-md);
          }

          .meta-left,
          .meta-center,
          .meta-right {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </footer>
  );
}
