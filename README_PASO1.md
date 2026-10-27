# SYNC DEEA GOVTECH - REFERENCIA RÁPIDA

## 🎯 OBJETIVO
Transformar prototipo HTML en aplicación empresarial GovTech para Alcaldía Municipal de Montelíbano (Córdoba).

---

## 📦 STACK TECNOLÓGICO

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui + Lucide Icons |
| **Backend** | Supabase (PostgreSQL) + Next.js API Routes |
| **Autenticación** | Supabase Auth (JWT + RLS) |
| **Storage** | Supabase Storage (PDFs radicados, contratos, etc.) |
| **Email** | Resend + React Email (transaccional) |
| **Cron Jobs** | Vercel Cron Jobs (7 AM Colombia) |
| **Deploy** | Vercel |

---

## 🏛️ DISEÑO VISUAL (Del HTML original)

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo | `#E9EBE6` | Página principal |
| Paneles | `#FFFFFF` | Contenedores |
| Tinta principal | `#131A24` | Texto |
| Acento | `#1F4E5F` | Botones, enlaces |
| Verde (Semáforo) | `#2E7D4F` | Estado OK |
| Ámbar (Semáforo) | `#B87708` | Estado alerta |
| Rojo (Semáforo) | `#B3261E` | Estado crítico |
| **Tipografía** | Sans + Monospace | Bodoni MT Pro, IBM Plex Mono |

**Especial:** Membrete oficial con logo para impresión (@media print).

---

## 📊 MÓDULOS DEL SISTEMA (8 Módulos)

### 1. **Dashboard Ejecutivo** 
KPIs en vivo: peticiones vencidas, pendientes, reuniones del día, contratos activos, ejecución presupuestal.

### 2. **PQRSD y Derechos de Petición** ⚖️
- Radicación con previsualización de vencimiento
- Cálculo automático de días hábiles (festivos descontados)
- 6 tipos de petición (Art. 14 Ley 1755/2015)
- Estados: Recibido → En trámite → Respondido → Archivo
- Asignación de responsable + notificación email
- Semáforo automático: Verde/Ámbar/Rojo/Vencido

### 3. **Correspondencia (Entrada/Salida)**
- Oficios, memorandos, circulares, informes
- Folios automáticos (E-YYYY-0001, S-YYYY-0001)
- Acuse de recibo generado
- Vinculación directa a Derechos de Petición
- Almacenamiento en Supabase Storage

### 4. **Contratación Pública y Supervisión** 📋
- Registro de procesos (Mínima cuantía, servicios, suministros, convenios)
- Ficha del contrato: número, SECOP, contratista, objeto, valor, plazo
- Seguimiento de ejecución: % financiero, % físico
- Documentos anexos: estudios previos, pólizas, actas, cuentas de cobro
- Alertas de prórroga/adición

### 5. **Planeación de Proyectos** 🎯
- Banco de proyectos con BPIN
- Vinculación a Plan de Desarrollo Municipal
- Cronograma con hitos y vista Gantt
- Indicadores de producto/resultado/proceso
- Evidencias fotográficas y documentales
- Presupuesto asignado vs. ejecutado

### 6. **Desarrollo Económico Misional** 🌾
**Eje Agropecuario:**
- Base de productores (certificaciones, vereda, cultivo)
- Asociaciones rurales (junta, asociación, cooperativa)
- CMDR: sesiones y actas
- Entregas de insumos / asistencia técnica
- Mercado Campesino: ediciones, participantes, ventas

**Eje Empresarial:**
- Directorio de unidades productivas
- Emprendedores capacitados
- Programas de fortalecimiento/acceso a capital

### 7. **Agenda y Reuniones Unificadas** 📅
Calendario cruzado que integra:
- Reuniones (Consejo de Gobierno, CMDR, mesas técnicas)
- Vencimientos de Derechos de Petición (con semáforo)
- Vencimientos de contratos
- Fechas límite de proyectos
- Pendientes del equipo

Características:
- Citaciones automáticas por email
- Registro de asistencia
- Actas de reuniones

### 8. **Notificaciones y Correos** 📧
**Triggers automáticos:**
- **Al asignar responsable:** Email con detalles + enlace directo
- **Al agendar reunión:** Citación a participantes
- **Cron Job (7 AM):** Resumen diario con alertas Ámbar y Rojo

**Gestión de emails:**
- Historial completo de envíos
- Reintentos automáticos para fallos
- Plantillas con React Email

---

## 🗄️ ESQUEMA SQL (3 archivos)

### `schema_01_enums_y_tipos.sql` (20 KB)
- **Enums:** 10 tipos (estado_peticion, tipo_peticion, semaforo, rol_usuario, etc.)
- **Tablas:** 18 tablas (usuarios, peticiones, correspondencia, contratos, proyectos, productores, etc.)
- **Índices:** Optimización de queries frecuentes

### `schema_02_agenda_pendientes_config.sql` (18 KB)
- **Tablas:** 12 tablas (agenda_eventos, pendientes, terminos_legales, festivos_colombia, configuracion_secretaria, etc.)
- **Funciones PL/pgSQL:** 6 funciones (semáforo, auditoría, consecutivos, etc.)
- **Triggers:** Automatización de reglas de negocio
- **Vistas:** 4 vistas materializadas para reportes

### `schema_03_rls_y_datos_iniciales.sql` (17 KB)
- **RLS Policies:** 22 políticas escalonadas por rol
- **Datos iniciales:**
  - 6 términos legales (Art. 14 Ley 1755/2015)
  - 38 festivos Colombia 2024-2025 (Ley 51/1983)
  - Configuración de la Secretaría
  - 2 plantillas de respuesta

---

## 🔑 CARACTERÍSTICAS CLAVE

### ✅ Motor de Días Hábiles de Colombia
- Descuenta sábados, domingos y festivos oficiales
- Tabla `festivos_colombia` con calendario 2024-2025+
- Lógica en `lib/fechas-colombia.ts`
- Funciones:
  - `sumarHabiles(fecha, dias)` → fecha de vencimiento
  - `habilesEntre(fechaInicio, fechaFin)` → contar días
  - `habilesRestantes(fechaVencimiento)` → urgencia

### ✅ Términos Legales Parametrizables
- Tabla `terminos_legales` editable desde configuración
- Base: 6 términos del Art. 14 Ley 1755/2015
- Permite agregar términos personalizados

### ✅ Consecutivos Automáticos
- Tabla `consecutivos` para tracking
- Función `generar_proximo_radicado(tipo)` genera:
  - Entrada: `E-2024-0001`, `E-2024-0002`, ...
  - Salida: `S-2024-0001`, `S-2024-0002`, ...
  - Reinicia cada año automáticamente

### ✅ Semáforo Automático
- **Verde:** >5 días hábiles | Petición respondida
- **Ámbar:** ≤5 días hábiles (ALERTA)
- **Rojo:** ≤2 días hábiles (CRÍTICA)
- **Vencido:** Fecha pasada

Calcula automáticamente en cada INSERT/UPDATE.

### ✅ Row Level Security (RLS)
- 7 roles: admin, secretario, funcionario, profesional, asistente, supervisor_contrato, visor
- Cada usuario solo ve datos autorizados
- 22 políticas por tabla

### ✅ Auditoría Completa
- Tabla `auditoria_logs` registra TODOS los cambios
- Campos: usuario_id, tabla, tipo_operacion, valores_anteriores, valores_nuevos, fecha
- Compliant con RIPS/requerimientos de control

### ✅ Notificaciones Inteligentes
- `historial_emails` audita cada envío
- Reintentos automáticos si fallan
- Plantillas con React Email
- Soporte para Resend

### ✅ Integración Vercel Cron
- Endpoint: `/api/cron/verificar-vencimientos`
- Ejecuta a las 7:00 AM hora Colombia
- Envía resumen diario de peticiones/contratos próximos a vencer

---

## 📋 MATRIZ DE TABLAS Y RELACIONES

```
usuarios (id) --┬--> peticiones (responsable_asignado)
                ├--> correspondencia_entrada (registrado_por)
                ├--> correspondencia_salida (responsable_elaboracion)
                ├--> contratos (supervisor_asignado)
                ├--> proyectos_banco (responsable_proyecto)
                ├--> agenda_eventos (responsable_principal)
                ├--> pendientes (responsable_asignado)
                ├--> productores (registrado_por)
                └--> ... (más tablas)

peticiones --┬--> correspondencia_salida (referencia_peticion)
             ├--> agenda_eventos (peticion_vinculada)
             └--> pendientes (peticion_vinculada)

contratos --┬--> documentos_contrato (contrato_id)
            ├--> cuentas_cobro_pagos (contrato_id)
            ├--> agenda_eventos (contrato_vinculado)
            └--> pendientes (contrato_vinculado)

proyectos_banco --┬--> hitos_proyecto (proyecto_id)
                  ├--> indicadores_proyecto (proyecto_id)
                  ├--> evidencias_proyecto (proyecto_id)
                  ├--> agenda_eventos (proyecto_vinculado)
                  └--> pendientes (proyecto_vinculado)

festivos_colombia (tabla de referencia para cálculos de vencimiento)
terminos_legales (tabla de referencia para parámetros de peticiones)
configuracion_secretaria (tabla de configuración única)
```

---

## 📁 ARCHIVOS GENERADOS

```
/Users/janyermartinez/Documents/Proyectos/SyncDEEA/
├── schema_01_enums_y_tipos.sql               ✅ 20 KB
├── schema_02_agenda_pendientes_config.sql    ✅ 18 KB
├── schema_03_rls_y_datos_iniciales.sql       ✅ 17 KB
├── SETUP.sh                                   ✅ Automatización
└── PASO1_ESTRUCTURA_ESQUEMA.md                ✅ Documentación
```

---

## 🚀 PRÓXIMOS PASOS

### ✅ PASO 1 (Completado)
- [x] Estructura de carpetas
- [x] Esquema SQL completo
- [x] Enums y tipos
- [x] RLS policies
- [x] Datos iniciales

### ⏳ PASO 2 (Siguiente)
- [ ] `lib/fechas-colombia.ts` - Motor de días hábiles
- [ ] `lib/supabase.ts` - Cliente y helpers
- [ ] `lib/resend.ts` - Configuración email
- [ ] `lib/validations.ts` - Esquemas Zod
- [ ] `lib/types.ts` - Types TypeScript
- [ ] Tests unitarios para fechas

### ⏳ PASO 3
- [ ] Layout principal (Header, Sidebar, Footer)
- [ ] Estilos CSS globales (variables, tema)
- [ ] Membrete para impresión
- [ ] Componentes base (Semáforo, DiasRestantes, etc.)

### ⏳ PASO 4+
- Módulos funcionales (PQRSD, Correspondencia, Contratos, etc.)
- APIs conectadas a Supabase
- Email transaccional con Resend
- Cron jobs

---

## ⚖️ CONFORMIDAD LEGAL

✅ **Art. 14 Ley 1755 de 2015:** Términos para Derechos de Petición
✅ **Ley 51 de 1983:** Calendario de festivos
✅ **Decreto 1083 de 2015:** PQRSD
✅ **RIPS:** Auditoría completa y rastreable
✅ **RGPD/Privacidad:** RLS por usuario

---

## 📞 SOPORTE Y CONFIGURACIÓN

Archivo `.env.local` requerido:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[KEY]
SUPABASE_SERVICE_ROLE_KEY=[KEY]
RESEND_API_KEY=[KEY]
NEXT_PUBLIC_APP_EMAIL_FROM=noreply@sync-deea.gov.co
```

---

**Generado:** 27 de octubre de 2026  
**Especialidad:** GovTech - Gobierno Digital Colombia  
**Estado:** Listo para Paso 2 (Utilidades Base)
