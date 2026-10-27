# 🔐 SEGURIDAD EN PRODUCCIÓN - SYNC DEEA

## ⚠️ CRÍTICO: Antes de ir a producción

### 1. SECRETOS Y CREDENCIALES

```bash
# ❌ NUNCA hacer esto:
git add .env.production
git commit -m "Add production keys"

# ✅ SIEMPRE hacer esto:
echo ".env.production.local" >> .gitignore
# Verificar que está en .gitignore
grep ".env.production" .gitignore

# Luego en Vercel Dashboard:
# Settings → Environment Variables
# Agregar manual (Vercel maneja encriptación)
```

### 2. CREDENCIALES EN VERCEL

**NUNCA copiar/pegar en código o logs:**

```javascript
// ❌ MALO
const apiKey = "re_xxxxxxxxxxxxxxxx"; // ← EXPONER EN GIT

// ✅ BIEN
const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
// Vercel encripta y no aparece en logs
```

### 3. ANON KEY vs SERVICE ROLE KEY

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
├─ ✅ Seguro exponer en cliente (Next.js, browser)
├─ ✅ Limitado por Row Level Security (RLS)
└─ ❌ NO puede hacer admin queries

SUPABASE_SERVICE_ROLE_KEY
├─ ❌ NUNCA exponer (solo backend)
├─ ✅ Usable en API routes (/app/api/*)
└─ ✅ Evita RLS (poder absoluto)
```

---

## 🛡️ ROW LEVEL SECURITY (RLS) - CRUCIAL

### Por qué RLS es crítico

Supabase con anon key + RLS = seguridad en cliente

```sql
-- CORRECTO: Solo ver propias peticiones
CREATE POLICY "Users can only view own peticiones"
ON peticiones FOR SELECT
USING (auth.uid() = user_id);

-- PELIGRO: Sin RLS, anon key puede ver TODO
-- (Incluso peticiones confidenciales de otra oficina)
```

### Verificar que RLS esté activado

```
Supabase Dashboard:
1. Editor SQL
2. Ejecutar:

SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('peticiones', 'contratos', 'proyectos', etc);

Resultado esperado:
| tablename    | rowsecurity |
|--------------|-------------|
| peticiones   | t           |  ← t = true, RLS ACTIVO
| contratos    | t           |
```

### Políticas esenciales

```sql
-- 1. PETICIONES: Solo se ve lo de su dependencia
CREATE POLICY "see_own_peticiones"
ON peticiones FOR SELECT
USING (dependencia_id = auth.user().user_metadata->>'dependencia_id'::uuid);

-- 2. CONTRATOS: Solo se ve lo de su dependencia
CREATE POLICY "see_own_contratos"
ON contratos FOR SELECT
USING (dependencia_id = auth.user().user_metadata->>'dependencia_id'::uuid);

-- 3. CREAR: Obligar dependencia_id del usuario
CREATE POLICY "create_own_peticiones"
ON peticiones FOR INSERT
WITH CHECK (dependencia_id = auth.user().user_metadata->>'dependencia_id'::uuid);

-- 4. BORRAR: Solo admin o propietario
CREATE POLICY "delete_own_peticiones"
ON peticiones FOR DELETE
USING (
  auth.uid() = user_id 
  OR auth.user().user_metadata->>'role' = 'admin'
);
```

---

## 🔑 AUTENTICACIÓN Y ROLES

### Estructura de usuarios en Supabase

```javascript
// Supabase Auth + Custom Claims vía user_metadata

{
  id: "uuid-del-usuario",
  email: "funcionario@montelibano.gov.co",
  user_metadata: {
    nombre: "Juan Pérez",
    dependencia_id: "uuid-secretaria-deea",
    dependencia_nombre: "Secretaría DEEA",
    rol: "funcionario",  // "admin" | "funcionario" | "auditor"
    avatar_url: "https://storage.url/avatares/juan.jpg"
  }
}
```

### Crear usuarios (backend only)

```typescript
// ✅ API route seguro (servidor)
// app/api/admin/usuarios/crear/route.ts

import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const serviceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ← SOLO AQUÍ
  );

  const { email, password, metadata } = await request.json();
  
  const { user, error } = await serviceRole.auth.admin.createUser({
    email,
    password,
    user_metadata: metadata,
    email_confirm: true
  });

  if (error) return Response.json({ error }, { status: 400 });
  return Response.json({ user });
}
```

### Verificar rol en API routes

```typescript
// app/api/peticiones/route.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const supabase = createServerComponentClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // ✅ VERIFICACIÓN: Solo admin o propietario
  if (session?.user?.user_metadata?.rol !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Procesar petición...
}
```

---

## 📦 VARIABLES DE ENTORNO EN VERCEL

### Agregar correctamente

**Vercel Dashboard:**
1. Tu proyecto → Settings
2. Environment Variables
3. "Add New Environment Variable"

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co
Environments: Production ✓, Preview ✓, Development ✗
```

⚠️ **Importante:** Deseleccionar "Development" si usas `.env.local` local

### Redeploy después de agregar variables

```bash
# Vercel no reaplicará variables a deployment anterior
# 1. En Vercel Dashboard: Deployments → Latest
# 2. Click "..." → "Redeploy"
# O en terminal:
vercel --prod --force
```

---

## 🚨 MONITOREO EN PRODUCCIÓN

### Verificar logs de Vercel

```
Vercel Dashboard → tu proyecto:
1. Deployments (tab)
2. Click en deployment
3. "Logs" (Function logs, System logs)
4. Buscar: error, warn, CRITICAL
```

### Alertas de errores

```
Vercel → Monitoring:
1. Enable "Alert on deployment errors"
2. Email cuando falla un deployment
3. Enable "Alert on high function duration"
```

### Revisar RLS errors

```sql
-- Supabase Editor SQL
SELECT 
  timestamp,
  event,
  error_message
FROM audit.audit_log_entries
WHERE error_message ILIKE '%policy%'
ORDER BY timestamp DESC
LIMIT 20;

-- Si ves "relation policy error":
-- → RLS está bloqueando legítimamente (revisar política)
-- → O la política está mal escrita (ver Supabase docs)
```

---

## 🔄 ROTACIÓN DE CREDENCIALES

### Cada 90 días

1. **Supabase:**
```
Dashboard → Settings → API Keys:
1. "Regenerate" el anon key
2. Agregar nuevo valor en Vercel env
3. Redeploy
4. Verificar que funciona
5. DESPUÉS regenerar (no antes)
```

2. **CRON_SECRET:**
```bash
openssl rand -hex 32
# Agregar en Vercel env variables
```

3. **RESEND_API_KEY:**
```
Resend Dashboard → API Keys:
1. Create new key
2. Agregar en Vercel
3. Redeploy
4. Eliminar key anterior
```

---

## 🛑 RATE LIMITING

### En API routes

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

// app/api/peticiones/route.ts
export async function POST(request: Request) {
  const { success } = await ratelimit.limit(request.ip!);
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }
  // Procesar...
}
```

---

## ✅ CHECKLIST DE SEGURIDAD PRE-PRODUCCIÓN

```
SECRETOS
[ ] .env.production.local en .gitignore
[ ] No hay keys en código fuente (grep -r "sk_" app/)
[ ] Variables agregadas en Vercel Dashboard
[ ] Vercel redeploy ejecutado
[ ] Logs de Vercel sin "undefined" env variables

AUTENTICACIÓN
[ ] Supabase Auth habilitado
[ ] Email confirmación requerida
[ ] user_metadata con rol y dependencia_id
[ ] Password min 12 caracteres en validación

ROW LEVEL SECURITY
[ ] Todas las tablas tienen RLS = ON
[ ] Políticas verificadas (no bloqueando usuarios legítimos)
[ ] SELECT policy por dependencia_id
[ ] INSERT policy verifica dependencia_id
[ ] DELETE policy solo para admin/propietario

API ROUTES
[ ] Service role key SOLO en /api routes
[ ] Session verification en rutas protegidas
[ ] Response status codes correctos (403 Forbidden, 401 Unauthorized)
[ ] Error messages no exponen detalles internos

DATOS SENSIBLES
[ ] Peticiones no visibles a otras dependencias
[ ] Contratos protegidos por RLS
[ ] Emails cifrados en tránsito (HTTPS)
[ ] PDFs de expedientes con control de acceso

MONITOREO
[ ] Alertas de errores habilitadas en Vercel
[ ] Logs revisados (no hay credentials)
[ ] Sentry o similar para error tracking (opcional)
[ ] Health check endpoint (/api/health)
```

---

## 🚨 INCIDENT RESPONSE

### Si exposición de credencial:

```bash
# 1. INMEDIATO: Regenerar credencial
# Supabase: Settings → API → Regenerate anon key

# 2. Verificar roturas
git log --oneline | grep -i "key\|secret\|password"
# ¿Está en algún commit? → Usar BFG Repo-Cleaner

# 3. Guardar rotaciones
# Archivo privado (NO EN GIT):
# docs/INCIDENT_LOG.txt
# 2024-12-15 10:30 - Anon key regenerated (max-exposed 15 min)

# 4. Notificar equipo
# Email: equipo@montelibano.gov.co
# Asunto: SECURITY INCIDENT - Credencial exposed
```

### Si error de RLS bloqueando usuarios:

```sql
-- Supabase Editor:
-- 1. Identificar política problemática
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'peticiones';

-- 2. Revisar lógica
-- 3. Ejecutar test:
SELECT * FROM peticiones 
WHERE user_id = 'test-uuid';
-- Debe retornar 0 o N rows (no error)

-- 4. Corregir y re-aplicar
DROP POLICY IF EXISTS "see_peticiones" ON peticiones;
CREATE POLICY "see_peticiones" ON peticiones
FOR SELECT USING (user_id = auth.uid());
```

---

## 📚 REFERENCIAS

- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- NextAuth + Supabase: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

## 🎯 RESUMEN

**Regla de Oro:** Si expone `SUPABASE_SERVICE_ROLE_KEY` en cliente, se hackea.

**Dos capas de seguridad:**
1. RLS en base de datos (nunca confiar solo en frontend)
2. Session check en API routes (verificar usuario autenticado)

¡Buenas prácticas = Producción segura! 🔒
