# PASO 1: ESTRUCTURA DEL PROYECTO Y ESQUEMA SQL PARA SUPABASE

## 📋 Resumen Ejecutivo

Este documento describe la arquitectura completa de **SYNC DEEA GovTech**, una aplicación web de nivel empresarial e institucional para la **Secretaría de Desarrollo Económico, Empresarial y Agrícola de la Alcaldía Municipal de Montelíbano (Córdoba)**.

---

## 1️⃣ ESTRUCTURA DE CARPETAS DEL PROYECTO

### Arquitectura Next.js 14 con App Router

```
sync-deea-govtech/
├── .env.local                    # Variables de entorno (NO versionar)
├── .env.example                  # Template de variables
├── .gitignore
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
│
├── public/
│   ├── logo-alcaldia.svg
│   └── favicon.ico
│
├── src/
│   ├── app/                      # App Router de Next.js 14
│   │   ├── layout.tsx            # Layout raíz con identidad visual
│   │   ├── page.tsx              # Dashboard ejecutivo (inicio)
│   │   │
│   │   ├── (auth)/               # Rutas de autenticación (sin sidebar)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts
│   │   │
│   │   ├── (dashboard)/          # Rutas autenticadas (con sidebar)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   │
│   │   │   ├── peticiones/               # Módulo PQRSD y Derechos de Petición
│   │   │   │   ├── page.tsx              # Lista paginada
│   │   │   │   ├── crear/page.tsx        # Radicación (form)
│   │   │   │   ├── [id]/page.tsx         # Detalle + cambio de estado
│   │   │   │   ├── [id]/edit/page.tsx    # Editar
│   │   │   │   └── api/route.ts          # CRUD API
│   │   │   │
│   │   │   ├── correspondencia/          # Módulo Ventanilla E/S
│   │   │   │   ├── page.tsx              # Vista integrada Entrada + Salida
│   │   │   │   ├── entrada/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── crear/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── salida/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── crear/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── api/route.ts
│   │   │   │
│   │   │   ├── contratos/                # Módulo Contratación Pública
│   │   │   │   ├── page.tsx
│   │   │   │   ├── crear/page.tsx
│   │   │   │   ├── [id]/page.tsx         # Ficha completa
│   │   │   │   ├── [id]/ejecucion/page.tsx
│   │   │   │   ├── [id]/documentos/page.tsx
│   │   │   │   └── api/route.ts
│   │   │   │
│   │   │   ├── proyectos/                # Módulo Planeación
│   │   │   │   ├── page.tsx
│   │   │   │   ├── crear/page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   ├── [id]/gantt/page.tsx
│   │   │   │   └── api/route.ts
│   │   │   │
│   │   │   ├── desarrollo-economico/    # Módulo Misional
│   │   │   │   ├── agropecuario/
│   │   │   │   │   ├── productores/page.tsx
│   │   │   │   │   ├── asociaciones/page.tsx
│   │   │   │   │   ├── cmdr/page.tsx
│   │   │   │   │   └── mercado-campesino/page.tsx
│   │   │   │   ├── empresarial/
│   │   │   │   │   ├── unidades-productivas/page.tsx
│   │   │   │   │   ├── emprendedores/page.tsx
│   │   │   │   │   └── programas/page.tsx
│   │   │   │   └── api/route.ts
│   │   │   │
│   │   │   ├── agenda/                   # Módulo Calendario Unificado
│   │   │   │   ├── page.tsx              # Vista mensual
│   │   │   │   ├── crear-evento/page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── api/route.ts
│   │   │   │
│   │   │   └── configuracion/
│   │   │       ├── page.tsx
│   │   │       ├── usuarios/page.tsx
│   │   │       ├── plantillas/page.tsx
│   │   │       └── integraciones/page.tsx
│   │   │
│   │   └── api/
│   │       ├── cron/
│   │       │   └── verificar-vencimientos/route.ts  # Vercel Cron (7 AM)
│   │       ├── emails/
│   │       │   ├── asignacion/route.ts
│   │       │   ├── resumen-diario/route.ts
│   │       │   ├── citacion-reunion/route.ts
│   │       │   └── alerta-vencimiento/route.ts
│   │       ├── storage/
│   │       │   └── upload/route.ts
│   │       └── webhooks/
│   │           └── supabase/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PrintHeader.tsx         # Membrete oficial para impresión
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── ui/                         # shadcn/ui (componentos reutilizables)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   └── dropdown-menu.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Semaforo.tsx            # Badge Verde/Ámbar/Rojo
│   │   │   ├── DiasRestantes.tsx
│   │   │   ├── AsignacionForm.tsx
│   │   │   ├── UploadDocumento.tsx
│   │   │   ├── ExportarCSV.tsx
│   │   │   ├── CalendarioVistas.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── ToastNotification.tsx
│   │   │
│   │   ├── peticiones/
│   │   │   ├── ListaPeticiones.tsx
│   │   │   ├── FormularioRadicacion.tsx
│   │   │   ├── PreviewVencimiento.tsx   # Calcula vencimiento en tiempo real
│   │   │   ├── DetallePeticion.tsx
│   │   │   └── CambioEstado.tsx
│   │   │
│   │   ├── correspondencia/
│   │   │   ├── ListaCorrespondencia.tsx
│   │   │   ├── FormularioEntrada.tsx
│   │   │   ├── FormularioSalida.tsx
│   │   │   └── VinculacionPeticion.tsx
│   │   │
│   │   ├── contratos/
│   │   │   ├── ListaContratos.tsx
│   │   │   ├── DetalleContrato.tsx
│   │   │   ├── EjecucionContrato.tsx
│   │   │   ├── BarraProgreso.tsx
│   │   │   └── AlertasVencimiento.tsx
│   │   │
│   │   ├── proyectos/
│   │   │   ├── ListaProyectos.tsx
│   │   │   ├── GanttChart.tsx
│   │   │   ├── Indicadores.tsx
│   │   │   └── Cronograma.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── ResumenEjecutivo.tsx
│   │       ├── KPIsVencimiento.tsx
│   │       ├── BandejaTerminos.tsx
│   │       ├── AgendaDelDia.tsx
│   │       └── GraficosTendencias.tsx
│   │
│   ├── lib/
│   │   ├── fechas-colombia.ts           # Motor de días hábiles (CRÍTICO)
│   │   ├── supabase.ts                  # Cliente Supabase + helpers
│   │   ├── resend.ts                    # Configuración Resend
│   │   ├── auth.ts                      # Autenticación
│   │   ├── validations.ts               # Esquemas Zod
│   │   ├── constants.ts                 # Constantes
│   │   ├── tipos.ts                     # Types TypeScript
│   │   └── utils.ts                     # Utilidades
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePeticiones.ts
│   │   ├── useCorrespondencia.ts
│   │   ├── useContratos.ts
│   │   ├── useProyectos.ts
│   │   ├── useAgenda.ts
│   │   └── useFechas.ts                 # Hook para cálculos
│   │
│   ├── emails/                          # Templates React Email para Resend
│   │   ├── AsignacionTemplate.tsx
│   │   ├── ResumenDiarioTemplate.tsx
│   │   ├── CitacionReunionTemplate.tsx
│   │   ├── AlertaVencimientoTemplate.tsx
│   │   └── ConfirmacionRadicadoTemplate.tsx
│   │
│   ├── styles/
│   │   ├── globals.css                  # Estilos globales + variables CSS
│   │   ├── print.css                    # Estilos para impresión oficial
│   │   └── themes.css                   # Tema institucional
│   │
│   └── types/
│       ├── database.ts                  # Types autogenerados de Supabase
│       ├── api.ts
│       └── index.ts
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema_01_enums_y_tipos.sql
│   │   ├── 002_schema_02_agenda_pendientes_config.sql
│   │   └── 003_schema_03_rls_y_datos_iniciales.sql
│   └── seed.sql                         # Datos iniciales (festivos, términos)
│
├── tests/
│   ├── unit/
│   │   ├── fechas-colombia.test.ts      # Pruebas unitarias del motor
│   │   └── validations.test.ts
│   ├── integration/
│   │   └── peticiones.test.ts
│   └── e2e/
│       └── flujo-radicacion.spec.ts
│
└── docs/
    ├── PASO1_ESTRUCTURA_ESQUEMA.md      # Este archivo
    ├── PASO2_UTILIDADES_BASE.md
    ├── API.md
    ├── ESQUEMA.md                       # Documentación completa de BD
    ├── INSTALACION.md
    └── GLOSARIO.md
```

---

## 2️⃣ ESQUEMA SQL COMPLETO PARA SUPABASE

### Archivo: `schema_01_enums_y_tipos.sql`
**Contenido:** Tipos personalizados, tablas base (usuarios, roles), tablas misionales (productores, asociaciones, CMDR) y peticiones/correspondencia.

**Enums principales:**
- `estado_peticion`: Recibido, En trámite, Respondido, Archivo
- `tipo_peticion`: Petición general, Documentos e información, Consulta jurídica, Solicitud de congresista, Acción de tutela, PQRS
- `tipo_correspondencia`: Oficio, Memorando, Circular, Informe, Nota, Certificación
- `tipo_contrato`: Mínima cuantía, Prestación de servicios, Suministros, Convenio de asociación, Convenio solidario
- `rol_usuario`: admin, secretario, funcionario, profesional, asistente, supervisor_contrato, visor
- `semaforo`: Verde, Ámbar, Rojo, Vencido
- `prioridad`: Alta, Media, Baja

**Tablas principales:**
1. **usuarios** - Registro de usuarios con roles y permisos
2. **peticiones** - Derechos de Petición (PQRSD) con cálculo automático de semáforo
3. **correspondencia_entrada** - Oficios recibidos
4. **correspondencia_salida** - Oficios expedidos
5. **contratos** - Registro de contratación pública
6. **documentos_contrato** - Anexos de contratos (estudios previos, pólizas, actas)
7. **cuentas_cobro_pagos** - Seguimiento de pagos a contratistas
8. **proyectos_banco** - Banco de proyectos con indicadores
9. **hitos_proyecto** - Cronograma y milestones
10. **Tablas Misionales:**
    - `productores` - Pequeños productores agropecuarios
    - `asociaciones_rurales` - Asociaciones y juntas
    - `cmdr_sesiones` - Actas del Consejo Municipal de Desarrollo Rural
    - `entregas_insumos` - Asistencia técnica y entregas
    - `mercado_campesino_ediciones` - Eventos del Mercado Campesino
    - `unidades_productivas` - Base de empresas y comercios
    - `emprendedores` - Registro de emprendedores
    - `programas_fortalecimiento` - Programas de capacitación

---

### Archivo: `schema_02_agenda_pendientes_config.sql`
**Contenido:** Agenda unificada, pendientes del equipo, configuración del sistema y funciones PL/pgSQL.

**Tablas:**
1. **agenda_eventos** - Calendario cruzado (reuniones, vencimientos, entregas)
2. **pendientes** - Tareas asignadas con prioridad y estado
3. **terminos_legales** - Términos parametrizables (Art. 14 Ley 1755/2015)
4. **festivos_colombia** - Calendario oficial de festivos (2024-2025+)
5. **configuracion_secretaria** - Parámetros globales (prefijos, emails, etc.)
6. **plantillas_respuesta** - Plantillas de oficios predefinidas
7. **consecutivos** - Control de radicados (E-YYYY-0001, S-YYYY-0001)
8. **auditoria_logs** - Registro de cambios
9. **notificaciones** - Notificaciones del sistema
10. **historial_emails** - Log de correos enviados

**Funciones PL/pgSQL:**
- `actualizar_semaforo_peticion()` - Calcula automáticamente Verde/Ámbar/Rojo
- `actualizar_semaforo_contrato()` - Monitorea vencimientos de contratos
- `registrar_auditoria()` - Registra cambios (INSERT, UPDATE, DELETE)
- `generar_proximo_radicado(p_tipo TEXT)` - Genera E-YYYY-0001, S-YYYY-0001
- `actualizar_fecha_actualizacion()` - Actualiza timestamp automáticamente

**Vistas materializadas:**
- `v_peticiones_criticas` - Peticiones Ámbar/Rojo/Vencidas ordenadas por urgencia
- `v_contratos_por_vencer` - Contratos a vencer en los próximos 30 días
- `v_proyectos_por_hito` - Proyectos ordenados por fecha de hito
- `v_kpi_resumen_ejecutivo` - KPIs en tiempo real para dashboard

---

### Archivo: `schema_03_rls_y_datos_iniciales.sql`
**Contenido:** Políticas RLS (Row Level Security) y datos iniciales.

**Políticas RLS (22 políticas):**
- `usuarios`: Ver propio perfil; admin ve todos
- `peticiones`: Todos ven; solo responsable + admin editan
- `correspondencia_entrada/salida`: Acceso escalonado por rol
- `contratos`: Solo supervisor + admin pueden editar
- `agenda_eventos`: Todos ven; responsable + admin editan
- `pendientes`: Ver asignadas/creadas; admin ve todas
- `notificaciones`: Solo ver las propias
- `auditoria`: Solo admin
- Tablas misionales: Acceso según rol

**Datos iniciales:**
1. **Términos legales** (6 registros) - Art. 14 Ley 1755/2015:
   - Petición general: 15 días hábiles
   - Documentos e información: 10 días
   - Consulta jurídica: 30 días
   - Solicitud de congresista: 5 días
   - Acción de tutela: 2 días
   - PQRS: 15 días

2. **Festivos Colombia 2024-2025** (38 registros):
   - Festivos fijos (Año Nuevo, Día del Trabajo, Navidad, etc.)
   - Festivos móviles (Semana Santa, Corpus Christi, etc.)
   - Ajustes por traslado según Ley 51/1983

3. **Configuración inicial:**
   - Prefijos: Entrada (E), Salida (S)
   - Umbrales de alerta: Ámbar ≤5 días, Rojo ≤2 días
   - Consecutivos inicializados para año actual

4. **Plantillas de respuesta** (2 registros):
   - Respuesta estándar para Petición General
   - Respuesta estándar para Documentos e Información
   - Incluyen variables dinámicas: {{solicitante}}, {{radicado}}, {{fecha_vencimiento}}, etc.

---

## 3️⃣ CARACTERÍSTICAS DEL ESQUEMA

### ✅ Características Implementadas

| Característica | Implementación |
|---|---|
| **Motor de días hábiles** | Tabla `festivos_colombia` + Función en `lib/fechas-colombia.ts` |
| **Términos legales** | Tabla `terminos_legales` con 6 términos base (Art. 14 Ley 1755) |
| **Consecutivos automáticos** | Función `generar_proximo_radicado()` + tabla `consecutivos` |
| **Cálculo de semáforo** | Trigger `actualizar_semaforo_peticion()` (Verde/Ámbar/Rojo/Vencido) |
| **Auditoría completa** | Tabla `auditoria_logs` + trigger en cada tabla principal |
| **RLS** | 22 políticas escalonadas por rol de usuario |
| **Vistas materializadas** | 4 vistas para reportes y dashboard |
| **Email transaccional** | Tabla `historial_emails` para auditar envíos via Resend |
| **Notificaciones** | Sistema de push con tabla `notificaciones` |
| **Desarrollo misional** | 8 tablas para productores, asociaciones, CMDR, mercado |

### 🔒 Seguridad

- **RLS**: Cada usuario solo ve sus datos + datos públicos según rol
- **Auditoría**: Todos los cambios quedan registrados (quién, cuándo, qué)
- **Roles**: 7 roles con permisos diferenciados
- **Storage**: Documentos en bucket separado con permisos RLS

### 📊 Índices para Rendimiento

- Índices en campos de búsqueda frecuente (radicado, estado, vencimiento)
- Índices compuestos para queries complejas (ej: responsable + estado)
- Índices en arrays para búsquedas en participantes

---

## 4️⃣ PRÓXIMOS PASOS

### Paso 2: Utilidades Base
- [ ] Implementar `lib/fechas-colombia.ts` (motor de días hábiles)
- [ ] Configurar `lib/supabase.ts` (cliente y helpers)
- [ ] Configurar `lib/resend.ts` (emails transaccionales)
- [ ] Validaciones con Zod

### Paso 3: Layout Principal
- [ ] Crear componentes de layout (Header, Sidebar, Footer)
- [ ] Implementar identidad visual (variables CSS)
- [ ] Membrete para impresión
- [ ] Sistema de notificaciones

### Paso 4+: Módulos Funcionales
- Módulo PQRSD con radicación interactiva
- Módulo de correspondencia
- Módulo de contratación
- Módulo de proyectos con Gantt
- Módulo misional
- Calendarios y agendas

---

## 5️⃣ VARIABLES DE ENTORNO REQUERIDAS

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# Resend
RESEND_API_KEY=[YOUR_RESEND_API_KEY]
NEXT_PUBLIC_APP_EMAIL_FROM=noreply@sync-deea.gov.co

# Configuración
NEXT_PUBLIC_APP_NAME="SYNC DEEA"
NEXT_PUBLIC_MUNICIPIO="Montelíbano"
NEXT_PUBLIC_DEPARTAMENTO="Córdoba"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6️⃣ COMANDOS DE SETUP

```bash
# Crear proyecto
npx create-next-app@latest sync-deea-govtech --typescript --tailwind --eslint --app

# Instalar dependencias
npm install @supabase/supabase-js zod react-hook-form shadcn-ui resend react-email

# Configurar shadcn/ui
npx shadcn-ui@latest init

# Desarrollar
npm run dev

# Build
npm run build

# Producción
npm start
```

---

## 📝 Documento Generado
Estructura completa y lista para implementación.
Fecha: 27 de octubre de 2026
