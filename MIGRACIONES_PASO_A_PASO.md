# 🚀 MIGRACIONES A SUPABASE - GUÍA RÁPIDA

## Opción 1: Dashboard Web (Recomendado - 5 min)

### Paso 1: Abrir SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: **syncdeea-montelibano**
3. Click en "SQL Editor" (menú izquierdo)

### Paso 2: Ejecutar Migración 1
1. Click en "+ New Query"
2. Abre este archivo en un editor: `schema_01_enums_y_tipos.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Click en botón "RUN" (verde)
6. Espera confirmación ✅

### Paso 3: Ejecutar Migración 2
1. Click en "+ New Query" (o limpiar la anterior)
2. Abre: `schema_02_agenda_pendientes_config.sql`
3. Copia y pega
4. Click "RUN"
5. Espera ✅

### Paso 4: Ejecutar Migración 3
1. Click en "+ New Query"
2. Abre: `schema_03_rls_y_datos_iniciales.sql`
3. Copia y pega
4. Click "RUN"
5. Espera ✅

## Opción 2: Supabase CLI (Si prefieres terminal)

```bash
cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

# Asegúrate de estar linkedado
supabase link --project-ref dnrvasgladqifoymovbt

# Ejecutar migraciones individuales
psql -h db.dnrvasgladqifoymovbt.supabase.co -U postgres -d postgres \
  -c "$(cat schema_01_enums_y_tipos.sql)"
```

## ✅ Verificación

Después de ejecutar todas las migraciones:

1. Ve a "Tables" en Supabase Dashboard
2. Deberías ver estas tablas:
   - usuarios
   - peticiones
   - correspondencia
   - contratos
   - proyectos
   - directorio_productores
   - directorio_comercios
   - entregas_asistencia
   - mercados_campesinos
   - reuniones
   - pendientes
   - config_sistema

3. Ve a "Enums" y verifica existan:
   - estado_peticion
   - tipo_peticion
   - tipo_correspondencia
   - tipo_contrato
   - estado_contrato
   - prioridad
   - rol_usuario

Si todo está ✅, la base de datos está lista para Vercel.

---

**Tiempo total:** 5-10 minutos
**Dificultad:** ⭐ Muy fácil
