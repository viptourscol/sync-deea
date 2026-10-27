# SYNC DEEA - Sistema de Control y Seguimiento Integral

**Secretaría de Desarrollo Económico, Empresarial y Agrícola**  
Alcaldía Municipal de Montelíbano, Córdoba, Colombia

---

## 📋 Descripción

SYNC DEEA es una aplicación web empresarial e institucional para la gestión integral del despacho de la Secretaría, que incluye:

- **Derechos de Petición y PQRSD** (Ley 1755/2015)
- **Correspondencia** (Entrada/Salida)
- **Contratación Pública** y supervisión
- **Planeación de Proyectos** (BPIN, cronogramas, presupuesto)
- **Agenda y Reuniones** unificadas
- **Módulo Misional** (Agropecuario y Empresarial)
- **KPIs Ejecutivos** y alertas automáticas

---

## 🚀 Stack tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) + React 18 + TypeScript |
| UI/UX | Tailwind CSS + shadcn/ui + Lucide Icons |
| Base de datos | Supabase (PostgreSQL) + Row Level Security (RLS) |
| Autenticación | Supabase Auth (Roles: admin, secretario, funcionario, etc.) |
| Almacenamiento | Supabase Storage (PDF radicados, contratos, etc.) |
| Correos | Resend + React Email |
| Automatización | Vercel Cron Jobs (Barridos diarios 7:00 a.m.) |
| Hospedaje | Vercel |

---

## 📂 Estructura de carpetas

```
sync-deea/
├── app/                          # App Router (Next.js 14)
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard Ejecutivo
│   ├── peticiones/              # Módulo Derechos de Petición
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── nuevo/page.tsx
│   ├── correspondencia/          # Módulo Correspondencia
│   ├── contratos/               # Módulo Contratación
│   ├── proyectos/               # Módulo Proyectos
│   ├── agenda/                  # Módulo Agenda
│   ├── desarrolloeconomico/     # Módulo Misional
│   ├── api/                     # API Routes
│   │   ├── auth/
│   │   ├── cron/                # Cron Jobs
│   │   └── ...
│   └── login/page.tsx           # Página login
│
├── lib/                         # Utilidades y helpers
│   ├── fechas-colombia.ts       # Motor de días hábiles (Ley 51/1983)
│   ├── supabase.ts              # Cliente Supabase + CRUD
│   ├── validations.ts           # Esquemas Zod
│   ├── resend.ts                # Notificaciones por correo
│   ├── types.ts                 # Tipos TypeScript
│   └── database.types.ts        # Auto-generado: npx supabase gen types
│
├── components/                  # Componentes React
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── PrintHeader.tsx      # Membrete para impresión
│   ├── base/
│   │   ├── Semaforo.tsx         # Verde/Ámbar/Rojo/Vencido
│   │   ├── DiasRestantes.tsx
│   │   ├── ExportarCSV.tsx
│   │   ├── CargaArchivos.tsx
│   │   └── BuscadorAvanzado.tsx
│   └── modulos/                 # Componentes específicos
│
├── styles/                      # Estilos globales
│   ├── globals.css             # Variables CSS identidad visual
│   ├── print.css               # Estilos para impresión
│   └── semaforo.css
│
├── public/                      # Assets estáticos
│   └── logo.svg
│
├── supabase/                    # Scripts SQL y configuración
│   ├── schema_01_enums.sql
│   ├── schema_02_tables.sql
│   ├── schema_03_rls.sql
│   └── seed.sql
│
├── .env.example                 # Variables de entorno (ejemplo)
├── .env.local                   # Variables de entorno (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔧 Instalación y setup

### 1. Clonar repositorio

```bash
git clone <repositorio>
cd sync-deea
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar template
cp .env.example .env.local

# Llenar valores:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - RESEND_API_KEY (opcional en dev)
```

### 4. Inicializar base de datos (Supabase)

```bash
# Conectarse a Supabase
npx supabase login

# Crear proyecto
npx supabase projects create sync-deea

# Ejecutar migraciones
npx supabase db push

# O ejecutar scripts manualmente desde supabase/
```

### 5. Generar tipos TypeScript

```bash
npx supabase gen types typescript --linked > lib/database.types.ts
```

### 6. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abirir en navegador: http://localhost:3000

---

## 📚 Documentación de módulos

### Paso 1: Estructura y Schema SQL ✅
Véase: [PASO1_ESTRUCTURA_ESQUEMA.md](./PASO1_ESTRUCTURA_ESQUEMA.md)
- 30 tablas, 13 ENUMs, 6 funciones PL/pgSQL, 22 políticas RLS

### Paso 2: Utilidades Base ✅
Véase: [PASO2_UTILIDADES_BASE.md](./PASO2_UTILIDADES_BASE.md)
- Motor de días hábiles (`lib/fechas-colombia.ts`)
- Cliente Supabase (`lib/supabase.ts`)
- Validaciones Zod (`lib/validations.ts`)
- Notificaciones (`lib/resend.ts`)
- Tipos TypeScript (`lib/types.ts`)

### Paso 3: Layout y componentes base
**En desarrollo** → Layout principal, componentes reutilizables, dashboard

### Paso 4+: Módulos completos
Derechos de Petición, Correspondencia, Contratos, Proyectos, Agenda, etc.

---

## 🧪 Testing

```bash
# Ejecutar pruebas
npm run test

# Watch mode
npm run test:watch
```

---

## 🔐 Seguridad

### Row Level Security (RLS)
- 22 políticas RLS implementadas
- Usuarios solo ven datos autorizados por su rol
- Auditoría completa de cambios

### Validación de datos
- 15 esquemas Zod (validación en cliente y servidor)
- Sanitización de inputs
- Protección contra SQL injection

### Autenticación
- Supabase Auth con roles (admin, secretario, funcionario, etc.)
- JWT tokens seguros
- Sesiones con expiración configurable

---

## 📧 Notificaciones por correo

### Automáticas
- Asignación de petición → Email al responsable
- Alerta diaria (7:00 a.m.) → Resumen ejecutivo
- Vencimiento próximo → Alerta Ámbar/Rojo

### Configuración
Actualizar emails en:
- `lib/resend.ts` → EMAIL_DESPACHO, EMAIL_SOPORTE
- `.env.local` → RESEND_API_KEY

---

## ⏰ Cron Jobs (Vercel)

### Barrido diario a las 7:00 a.m. (zona horaria Colombia)
```
GET /api/cron/resumen-diario?token=CRON_SECRET
```

Ejecuta:
1. Calcula peticiones críticas
2. Calcula contratos próximos a vencer
3. Recopila pendientes del día
4. Envía resumen al Secretario y responsables

---

## 🎨 Identidad visual

Preservada del prototipo original:

```css
--color-fondo: #E9EBE6       /* Papel y tinta */
--color-panel: #FFFFFF       /* Paneles claros */
--color-tinta: #131A24       /* Texto principal */
--color-acento: #1F4E5F      /* Azul institucional */
--semaforo-verde: #2E7D4F    /* Verde OK */
--semaforo-ambar: #B87708    /* Ámbar atención */
--semaforo-rojo: #B3261E     /* Rojo vencido */
```

Tipografía:
- Sans: Segoe UI, Tahoma, Geneva, Verdana
- Monospace: Courier New (para radicados, contadores)

### Impresión
- Membrete oficial con logo, dirección y datos de contacto
- Formato A4
- Márgenes institucionales
- @media print con estilos específicos

---

## 🚨 Leyes y normas implementadas

- **Ley 1755 de 2015** (Derecho de petición)
  - Términos legales: 15 días (petición general), 10 días (documentos), 30 días (consulta), etc.
  - Excepción: Acción de tutela (2 días / término judicial)

- **Ley 51 de 1983** (Días hábiles en Colombia)
  - Excluye sábados, domingos y festivos nacionales
  - Traslados a lunes para festivos en fin de semana

- **RES-DIAN** (Estructura de NIT)

---

## 🐛 Reporte de bugs

Crear issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Navegador y sistema operativo
- Screenshots si aplica

---

## 📞 Contacto y soporte

**Email:** despacho@montelibano.gov.co  
**Teléfono:** +57 XXX XXX XXXX  
**Dirección:** Alcaldía Municipal de Montelíbano, Córdoba

---

## 📄 Licencia

Uso exclusivo - Alcaldía Municipal de Montelíbano, Córdoba, Colombia

---

## 📝 Notas de desarrollo

### Convenciones de código

- **Nombres de variables:** snake_case (BD), camelCase (JS/TS)
- **Componentes React:** PascalCase
- **Funciones:** camelCase
- **Constantes:** SCREAMING_SNAKE_CASE
- **Tipos/Interfaces:** PascalCase con prefijo T (ej: TPeticion)

### Commits

```
formato: <tipo>: <descripción>

Tipos:
- feat: nueva funcionalidad
- fix: corrección de bug
- refactor: cambio de código sin cambiar funcionalidad
- docs: cambios de documentación
- style: cambios de formato (sin cambiar funcionalidad)
- test: agregar/actualizar pruebas
- chore: cambios de configuración

Ejemplo:
feat(peticiones): agregar filtro por estado
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

---

**Versión:** 0.1.0 (Paso 2 completado)  
**Última actualización:** Octubre 2024  
**Arquitecto:** Senior GovTech Developer
