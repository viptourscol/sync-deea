/**
 * LAYOUT PRINCIPAL - SYNC DEEA
 * ============================================================================
 * 
 * Layout raíz de Next.js 14 (App Router)
 * Estructura: Header + Sidebar + Main Content + Footer
 * Responsive: Mobile-first, drawer en mobile
 * 
 * Autor: Arquitecto de Software Senior (GovTech)
 */

import type { Metadata } from "next";
import React from "react";

// Estilos
import "@/styles/globals.css";

// Componentes Layout
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

// Proveedores (si necesarios)
// import { AuthProvider } from "@/providers/AuthProvider";
// import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "SYNC DEEA - Secretaría de Desarrollo Económico",
  description:
    "Sistema de Control y Seguimiento Integral para la Secretaría de Desarrollo Económico, Empresarial y Agrícola de la Alcaldía Municipal de Montelíbano, Córdoba",
  keywords: [
    "Derechos de petición",
    "PQRSD",
    "Correspondencia",
    "Contratos",
    "Proyectos",
    "Gobierno digital",
    "GovTech",
  ],
  authors: [{ name: "Alcaldía Municipal de Montelíbano" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1f4e5f" />
      </head>
      <body>
        <div className="layout-wrapper">
          {/* Encabezado */}
          <Header />

          <div className="layout-container">
            {/* Barra lateral */}
            <Sidebar />

            {/* Contenido principal */}
            <main className="layout-main">
              <div className="layout-content">{children}</div>
            </main>
          </div>

          {/* Pie de página */}
          <Footer />
        </div>

        {/* Estilos inyectados para layout */}
        <style jsx>{`
          .layout-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--color-fondo);
          }

          .layout-container {
            display: flex;
            flex: 1;
            width: 100%;
          }

          .layout-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            overflow-y: auto;
            background-color: var(--color-fondo);
          }

          .layout-content {
            padding: var(--spacing-lg);
            flex: 1;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }

          /* Responsive: Mobile */
          @media (max-width: 768px) {
            .layout-content {
              padding: var(--spacing-md);
            }
          }
        `}</style>
      </body>
    </html>
  );
}
