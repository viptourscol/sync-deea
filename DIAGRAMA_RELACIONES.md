# 📊 DIAGRAMA DE RELACIONES - BASE DE DATOS SYNC DEEA GOVTECH

## 🔗 Mapa Conceptual de Tablas

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORE INSTITUCIONAL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  usuarios (7 roles)                    configuracion_secretaria   │
│    ├─ admin                            terminos_legales (6 base)  │
│    ├─ secretario                       festivos_colombia (38)     │
│    ├─ funcionario                      plantillas_respuesta (2)   │
│    ├─ profesional                      consecutivos               │
│    ├─ asistente                                                   │
│    ├─ supervisor_contrato                                        │
│    └─ visor                                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    PETICIONES Y PQRSD                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  peticiones (📌 CORE)                                             │
│    ├─ 6 tipos (Petición general, Documentos, Consulta, etc.)    │
│    ├─ Auto: Radicado (E-2024-0001)                              │
│    ├─ Auto: Semáforo (Verde/Ámbar/Rojo/Vencido)                │
│    ├─ Auto: Fecha vencimiento (días hábiles)                    │
│    ├─ Responsable asignado (usuario)                           │
│    └─ Estados: Recibido → En trámite → Respondido → Archivo    │
│                                                                   │
│  Relaciones:                                                      │
│    peticiones ← correspondencia_salida (respuesta)              │
│    peticiones ← agenda_eventos (vencimiento)                    │
│    peticiones ← pendientes (seguimiento)                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 CORRESPONDENCIA OFICIAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  correspondencia_entrada                correspondencia_salida   │
│    ├─ Auto: Folio (E-2024-0001)           ├─ Auto: Folio (S-2024-0001)
│    ├─ Tipos: Oficio, Memorando            ├─ Vincula petición respondida
│    ├─ Remitente externo                   ├─ Responsable elaboración
│    ├─ Medio: Presencial/Email/Físico      ├─ Medio: Email/Físico/Cert.
│    └─ Acuse de recibo                     └─ Documento adjunto (PDF)
│                                                                   │
│  Flujo: Entrada → Lectura → Asignación → Salida (Respuesta)   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            CONTRATACIÓN PÚBLICA Y SUPERVISIÓN                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  contratos (📋 Registro)                                          │
│    ├─ Número único + SECOP II                                   │
│    ├─ Contratista (NIT, datos)                                  │
│    ├─ Tipos: Mínima cuantía, Servicios, Suministros, Convenios │
│    ├─ Valor total + Valor ejecutado (%)                         │
│    ├─ Plazo ejecución + Fecha terminación                       │
│    ├─ Supervisor asignado                                       │
│    ├─ Estados: Planeación → Licitación → Ejecución → Terminado │
│    └─ Auto: Alerta si próximo a vencer                         │
│           │                                                       │
│           ├─ documentos_contrato (Estudios, Pólizas, Actas)    │
│           ├─ cuentas_cobro_pagos (Seguimiento de pagos)        │
│           │    ├─ Número cuenta, % aprobado, % pagado          │
│           │    └─ Estados: Presentado → Aprobado → Pagado      │
│           └─ agenda_eventos (Vencimiento contrato)             │
│                                                                   │
│  Supervisión:                                                    │
│    - Ejecución financiera: (pagado/valor_total) × 100          │
│    - Ejecución física: % introducido manualmente                │
│    - Alertas de prórroga/adición necesaria                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│           PLANEACIÓN Y PROYECTOS (PLAN DE DESARROLLO)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  proyectos_banco                                                 │
│    ├─ BPIN (si aplica)                                          │
│    ├─ Vinculación a línea estratégica del Plan Municipal        │
│    ├─ Objetivos general y específicos                           │
│    ├─ Presupuesto: Total + Contrapartida                        │
│    ├─ Población beneficiada                                     │
│    ├─ Responsable del proyecto                                  │
│    └─ Estados: Activo/Archivado                                │
│           │                                                       │
│           ├─ hitos_proyecto (Cronograma)                         │
│           │    ├─ Nombre del hito                               │
│           │    ├─ Fechas inicio/fin                             │
│           │    ├─ % de completado                               │
│           │    └─ Estados: No iniciado → Ejecución → Terminado │
│           │                                                      │
│           ├─ indicadores_proyecto (KPIs)                        │
│           │    ├─ Indicador de: Producto/Resultado/Proceso      │
│           │    ├─ Meta esperada vs Valor actual                 │
│           │    └─ Fuente de verificación                        │
│           │                                                      │
│           └─ evidencias_proyecto (Foto/Video/Documento)        │
│                ├─ Fecha de captura                              │
│                └─ Responsable de carga                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│         DESARROLLO ECONÓMICO MISIONAL (2 Ejes)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ EJE AGROPECUARIO 🌾                                              │
│                                                                   │
│  productores (Base de datos de pequeños productores)            │
│    ├─ Cédula (único)                                            │
│    ├─ Vereda y municipio                                        │
│    ├─ Cultivo/Actividad pecuaria                                │
│    ├─ Área en hectáreas                                         │
│    └─ Certificaciones                                           │
│           │                                                       │
│           └─ entregas_insumos (Asistencia técnica)             │
│                ├─ Tipo de insumo                                │
│                ├─ Cantidad/Unidad de medida                     │
│                ├─ Fecha de entrega                              │
│                ├─ Comprobante (PDF)                             │
│                └─ Responsable de entrega                        │
│                                                                   │
│  asociaciones_rurales (Juntas, Asociaciones, Cooperativas)      │
│    ├─ NIT (único)                                               │
│    ├─ Representante legal                                       │
│    ├─ Número de asociados                                       │
│    └─ Vereda principal                                          │
│           │                                                       │
│           └─ cmdr_sesiones (Consejo Municipal de Desarrollo)   │
│                ├─ Número de sesión                              │
│                ├─ Tema principal                                │
│                ├─ Asistentes                                    │
│                ├─ Acta (PDF)                                    │
│                └─ Decisiones tomadas                            │
│                                                                   │
│  mercado_campesino_ediciones (Evento comercial)                │
│    ├─ Número de edición                                         │
│    ├─ Fecha y ubicación                                         │
│    ├─ Número de participantes                                   │
│    ├─ Ventas totales                                            │
│    └─ Logística (notas)                                         │
│                                                                   │
│ EJE EMPRESARIAL 💼                                               │
│                                                                   │
│  unidades_productivas (Directorio de empresas y comercios)     │
│    ├─ NIT (único)                                               │
│    ├─ Sector económico                                          │
│    ├─ Tamaño: Microempresa/Pequeña/Mediana/Grande              │
│    ├─ Número de empleados                                       │
│    └─ Certificaciones                                           │
│                                                                   │
│  emprendedores (Programa de fortalecimiento)                   │
│    ├─ Cédula (único)                                            │
│    ├─ Idea de negocio                                           │
│    ├─ Estado: Idea → Prototipo → Ejecución → Operando         │
│    ├─ Capital requerido                                         │
│    ├─ Acceso a crédito (entidad)                                │
│    └─ Programa asignado                                         │
│           │                                                       │
│           └─ programas_fortalecimiento (Capacitación)          │
│                ├─ Nombre del programa                           │
│                ├─ Objetivo                                      │
│                ├─ Fechas inicio/fin                             │
│                ├─ Presupuesto                                   │
│                └─ Responsable                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               COORDINACIÓN Y SEGUIMIENTO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  agenda_eventos (📅 Calendario Unificado Cruzado)               │
│    ├─ Tipos: Reunión, Vencimiento petición, Vencimiento cont. │
│    │         Entrega proyecto, Otra                             │
│    ├─ Fecha/Hora                                                │
│    ├─ Responsable principal + Participantes                     │
│    ├─ Ubicación                                                 │
│    ├─ Estados: Programado → Realizado / Cancelado              │
│    ├─ Vinculación cruzada:                                      │
│    │    ├─ peticion_vinculada (si es vencimiento)              │
│    │    ├─ contrato_vinculado (si es vencimiento)              │
│    │    └─ proyecto_vinculado (si es entrega)                  │
│    ├─ Recordatorios (días antes)                                │
│    ├─ Acta (PDF) para reuniones                                 │
│    └─ Acuerdos y tareas asignadas                              │
│                                                                   │
│  pendientes (✓ Tareas del Equipo)                              │
│    ├─ Título y descripción                                      │
│    ├─ Prioridad: Alta/Media/Baja                                │
│    ├─ Estado: Pendiente → En progreso → Completado → Archivo  │
│    ├─ Responsable asignado                                      │
│    ├─ Fecha de vencimiento                                      │
│    ├─ % de completado                                           │
│    └─ Vinculación cruzada:                                      │
│         ├─ peticion_vinculada                                   │
│         ├─ contrato_vinculado                                   │
│         └─ proyecto_vinculado                                   │
│                                                                   │
│  notificaciones (🔔 Sistema de Alertas)                         │
│    ├─ Usuario destinatario                                      │
│    ├─ Tipo: Asignación/Vencimiento/Reunión/Tarea              │
│    ├─ Enlace directo a la entidad relacionada                   │
│    ├─ Leída/No leída                                            │
│    └─ Fecha de lectura                                          │
│                                                                   │
│  historial_emails (📧 Auditoría de Correos)                    │
│    ├─ Destinatario                                              │
│    ├─ Asunto y cuerpo HTML                                      │
│    ├─ Tipo: Asignación/Resumen/Alerta/Citación                │
│    ├─ Estado: Pendiente/Enviado/Fallido/Rebotado              │
│    ├─ Reintentos (contador)                                     │
│    └─ Vinculación cruzada:                                      │
│         ├─ usuario_id                                           │
│         ├─ peticion_id                                          │
│         ├─ contrato_id                                          │
│         └─ agenda_id                                            │
│                                                                   │
│  auditoria_logs (🔐 Registro de Cambios - RIPS Compliant)      │
│    ├─ Usuario que realizó el cambio                            │
│    ├─ Tabla afectada                                            │
│    ├─ Tipo de operación: INSERT/UPDATE/DELETE                  │
│    ├─ Valores anteriores (JSONB)                                │
│    ├─ Valores nuevos (JSONB)                                    │
│    ├─ IP y User-Agent                                           │
│    └─ Fecha y hora exacta                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos Principales

### Flujo 1: Radicación de Petición (Derecho de Petición)
```
Usuario entra a /peticiones/crear
    ↓
Formulario con previsualización de vencimiento EN VIVO
    ↓
Selecciona tipo petición → Calcula automáticamente días hábiles
    ↓
Clic en "Radicar"
    ↓
Trigger: genera radicado automático (E-2024-0001)
Trigger: calcula fecha vencimiento (15 días hábiles)
Trigger: establece semáforo en "Verde"
    ↓
Petición creada
    ↓
Opcionalmente: Asignar responsable → Email de notificación
    ↓
Responsable entra a /peticiones/{id}
    ↓
Ve: radicado, fecha vencimiento, días restantes, semáforo, estado
    ↓
Carga documento de respuesta (PDF)
    ↓
Clic en "Marcar como Respondido"
    ↓
Trigger: semáforo cambia a "Verde"
Trigger: se genera automáticamente correspondencia_salida vinculada
    ↓
✅ Petición cerrada (auditada)
```

### Flujo 2: Supervisión de Contrato
```
Supervisor accede a /contratos/{id}/ejecucion
    ↓
Ve ficha con:
  - Valor total vs Pagado (%)
  - Ejecución financiera
  - Ejecución física
  - Documentos anexos (estudios, pólizas, actas)
  - Cuentas de cobro presentadas
    ↓
Sube acta parcial → Se registra en documentos_contrato
    ↓
Registra cuenta de cobro → Se agrega a cuentas_cobro_pagos
    ↓
Sistema calcula automáticamente % ejecución
    ↓
Si próximo a vencer: Alerta automática
    ↓
Si necesita prórroga: Actualiza "necesita_prorroga = true"
    ↓
Cron Job (7 AM): Envía resumen con alertas
```

### Flujo 3: Calendario Unificado
```
Usuario entra a /agenda
    ↓
Ve calendario mensual con:
  ├─ Reuniones programadas (color azul)
  ├─ Vencimientos de peticiones (color rojo si es Ámbar/Rojo)
  ├─ Vencimientos de contratos (color naranja)
  ├─ Entregas de proyectos (color verde)
  └─ Pendientes del equipo (color gris)
    ↓
Haz clic en un evento
    ↓
Se abre detalle y puedes:
  - Editar (si es responsable o admin)
  - Ver participantes
  - Descargar acta (si existe)
  - Ver acuerdos y tareas
    ↓
✅ Visión 360° de la dependencia en una sola vista
```

---

## 📊 Tabla de Relaciones Principales

| Tabla A | Tabla B | Tipo Relación | Campo |
|---------|---------|-------|-------|
| usuarios | peticiones | 1:N | responsable_asignado |
| usuarios | contratos | 1:N | supervisor_asignado |
| usuarios | agenda_eventos | 1:N | responsable_principal |
| usuarios | pendientes | 1:N | responsable_asignado |
| peticiones | correspondencia_salida | 1:N | referencia_peticion |
| peticiones | agenda_eventos | 1:N | peticion_vinculada |
| peticiones | pendientes | 1:N | peticion_vinculada |
| contratos | documentos_contrato | 1:N | contrato_id |
| contratos | cuentas_cobro_pagos | 1:N | contrato_id |
| contratos | agenda_eventos | 1:N | contrato_vinculado |
| contratos | pendientes | 1:N | contrato_vinculado |
| proyectos_banco | hitos_proyecto | 1:N | proyecto_id |
| proyectos_banco | indicadores_proyecto | 1:N | proyecto_id |
| proyectos_banco | evidencias_proyecto | 1:N | proyecto_id |
| proyectos_banco | agenda_eventos | 1:N | proyecto_vinculado |
| proyectos_banco | pendientes | 1:N | proyecto_vinculado |
| asociaciones_rurales | cmdr_sesiones | 1:N | (implícita) |
| productores | entregas_insumos | 1:N | productor_id |
| asociaciones_rurales | entregas_insumos | 1:N | asociacion_id |

---

## 🎯 Acceso por Rol (Simplificado)

| Módulo | Admin | Secretario | Funcionario | Profesional | Supervisor Contrato | Asistente | Visor |
|--------|-------|-----------|-------------|------------|-------------------|-----------|-------|
| Peticiones | CRUD | CRUD | Ver | Crear/Ver | Ver | Crear/Ver | Ver |
| Correspondencia | CRUD | CRUD | Ver | Crear/Ver | Ver | CRUD | Ver |
| Contratos | CRUD | CRUD | Ver | Ver | CRUD | Ver | Ver |
| Proyectos | CRUD | CRUD | Ver | Crear/Ver | Ver | Ver | Ver |
| Desarrollo Económico | CRUD | Ver | Crear/Ver | Crear/Ver | - | Crear/Ver | Ver |
| Agenda | CRUD | CRUD | Ver | Crear/Ver | Ver | Crear/Ver | Ver |
| Usuarios | CRUD | Ver | - | - | - | - | - |
| Auditoría | Ver | - | - | - | - | - | - |

---

## 🔒 Seguridad: Layers de Protección

```
Nivel 1: Autenticación (Supabase Auth)
    ↓
Nivel 2: JWT Token (Session)
    ↓
Nivel 3: Row Level Security (RLS Policies)
    ↓
Nivel 4: Auditoría (Logging de cambios)
    ↓
✅ Datos completamente protegidos
```

---

**Generado:** 27 de octubre de 2026  
**Especialidad:** GovTech - Base de Datos Relacional Institucional
