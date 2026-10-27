## 🚀 GUÍA DEPLOYMENT PRODUCCIÓN - SUPABASE + VERCEL

### 📋 Índice
1. [Preparación del Proyecto](#preparación)
2. [Supabase Producción](#supabase-producción)
3. [Vercel Deployment](#vercel-deployment)
4. [Configuración Variables de Entorno](#variables-entorno)
5. [Testing Pre-Producción](#testing)
6. [Monitoreo y Mantenimiento](#monitoreo)

---

## <a name="preparación"></a>1️⃣ PREPARACIÓN DEL PROYECTO

### 1.1 Verificar que TODO Compile

```bash
cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

# Instalar dependencias actualizadas
npm ci                    # Clean install (más seguro que npm install)

# Validar TypeScript
npm run type-check        # Debe pasar sin errores

# Linting
npm run lint              # Si existe (agregar si no está)

# Build producción
npm run build             # Compila a .next/
```

**Si hay errores:**
- `[ERROR] TypeScript`: Revisar que no haya `any` o tipos faltantes
- `[ERROR] Build`: Revisar que no haya imports inválidos

### 1.2 Crear .env.production

```bash
# Copiar plantilla
cp .env.example .env.production

# Editar con valores REALES de Supabase (no dev!)
```

**Contenido .env.production (VALORES DE PRODUCCIÓN):**

```env
# SUPABASE PRODUCCIÓN (nunca dev!)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...tu-anon-key-produccion...

# Backend-only (NUNCA expongas en .env.public)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...tu-service-role-key...

# Resend (correos)
RESEND_API_KEY=re_produccion_xxxxxxxxxxxx

# Vercel
VERCEL_ENV=production

# App
NEXT_PUBLIC_APP_URL=https://sync-deea.vercel.app
NEXT_PUBLIC_APP_ENV=production

# Timezone
TZ=America/Bogota
```

### 1.3 Verificar .gitignore

```bash
cat .gitignore
```

**Debe contener:**

```
.env.local
.env.*.local
.env.production   # ← IMPORTANTE: no commitar variables sensibles
node_modules/
.next/
out/
.vercel/
.DS_Store
```

### 1.4 Crear `.env.production.local` (NO commitar)

```bash
# En local, crear este archivo CON LOS VALORES REALES
# Este archivo es para testing local antes de subir a Vercel

# Copiar desde .env.production y agregar valores reales:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# NO COMMITAR ESTE ARCHIVO
echo ".env.production.local" >> .gitignore
```

---

## <a name="supabase-producción"></a>2️⃣ SUPABASE PRODUCCIÓN

### 2.1 Crear Proyecto Producción en Supabase

**Opción A: Si aún no tienes cuenta Supabase**

```bash
# Ir a https://supabase.com/
# Sign up → Create organization → Create project
```

**Opción B: Si ya tienes proyecto dev**

```bash
# En Supabase Dashboard:
# 1. Click "New Project" (lado izquierdo)
# 2. Nombre: sync-deea-produccion
# 3. Region: South America (São Paulo) - más cercano
# 4. Password: Fuerte (guardar en gestor de contraseñas)
# 5. Click "Create new project" (esperar ~5 min)
```

### 2.2 Obtener Credenciales Producción

```bash
# En Supabase Dashboard (proyecto producción):

# 1. Project Settings (ícono engranaje inferior izquierdo)
# 2. API → Copy URL → Guardar en NEXT_PUBLIC_SUPABASE_URL
# 3. API → Copy anon public key → Guardar en NEXT_PUBLIC_SUPABASE_ANON_KEY
# 4. API → Copy service_role secret key → Guardar en SUPABASE_SERVICE_ROLE_KEY

# Verificar que estés en el proyecto CORRECTO:
# Debería decir "sync-deea-produccion" en Settings
```

### 2.3 Ejecutar Migrations (Schema SQL)

**Opción A: CLI Supabase (Recomendado)**

```bash
# 1. Instalar CLI
npm install -D supabase

# 2. Login
npx supabase login
# Sigue las instrucciones → genera API token en Supabase

# 3. Ejecutar migrations en producción
npx supabase db push --db-url "postgresql://postgres:PASSWORD@xxxx.supabase.co:5432/postgres"
```

**Opción B: Manual (Si usas el SQL de Paso 1)**

```bash
# 1. En Supabase Dashboard → SQL Editor
# 2. New Query
# 3. Copiar contenido completo de PASO1_ESTRUCTURA_ESQUEMA.md
# 4. Pegar en editor
# 5. Click "Run"
# 6. Esperar completar
```

### 2.4 Cargar Datos Iniciales

```bash
# Festivos Colombia (CRÍTICO para funcionar)
# En Supabase SQL Editor → New Query:

INSERT INTO festivos_colombia (fecha, nombre, es_trasladable) VALUES
('2024-01-01', 'Año Nuevo', false),
('2024-01-08', 'Reyes', false),
('2024-03-28', 'Jueves Santo', true),
('2024-03-29', 'Viernes Santo', true),
('2024-05-01', 'Día del Trabajo', false),
('2024-06-03', 'Sagrado Corazón', true),
('2024-06-10', 'San Pedro y San Pablo', true),
('2024-07-01', 'San Pedro y San Pablo Observado', true),
('2024-07-29', 'Asunción', true),
('2024-11-01', 'Todos los Santos', false),
('2024-11-11', 'Independencia de Cartagena', true),
('2024-12-08', 'Inmaculada Concepción', false),
('2024-12-25', 'Navidad', false),
-- Agregar también años 2025, 2026, etc según sea necesario
```

### 2.5 Verificar RLS Policies

```bash
# En Supabase Dashboard → SQL Editor → New Query

-- Verificar que RLS esté habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename NOT LIKE 'pg_%' 
AND rowsecurity = true;

-- Debería mostrar todas las tablas principales con rowsecurity = true
```

### 2.6 Crear Usuario de Producción (Opcional)

```bash
# En Supabase Auth → Users
# Click "Add user" → Crear usuario de prueba para testing
```

---

## <a name="vercel-deployment"></a>3️⃣ VERCEL DEPLOYMENT

### 3.1 Preparar Repositorio Git

```bash
# 1. Crear repo en GitHub
# Go to https://github.com/new
# Repository name: sync-deea
# Description: "GovTech aplicación para Secretaría DEEA"
# Private (recomendado)
# Create repository

# 2. Conectar local con GitHub
cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

git init
git add .
git commit -m "Paso 3 - Componentes base y Dashboard

- 7 componentes reutilizables (Semaforo, DiasRestantes, etc)
- Dashboard Ejecutivo con KPIs
- Layout responsivo (Header, Sidebar, Footer)
- 60+ CSS variables
- Integración Supabase lista
- 9.050+ líneas production-ready

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 3. Agregar remote origin (cambiar URL)
git remote add origin https://github.com/tu-usuario/sync-deea.git
git branch -M main
git push -u origin main

# Verificar en GitHub que veas los archivos
```

### 3.2 Conectar Vercel

```bash
# Opción A: Via CLI (Recomendado)

npm install -g vercel

# Login
vercel login
# Sigue instrucciones → confirma email

# Deploy a staging
vercel --prod
# Selecciona:
#   - Set up and deploy: Yes
#   - Which scope: Your personal account
#   - Link to existing project: No
#   - What's your project's name: sync-deea
#   - In which directory is your code: ./
#   - Want to modify vercel.json: No
#   - Deploy: Yes

# Espera a que termine (~2-3 min)
# Vercel mostrará URL: https://sync-deea-xxx.vercel.app
```

**Opción B: Via Dashboard Vercel**

```
1. Go to https://vercel.com/dashboard
2. Import Project
3. Seleccionar repo de GitHub (sync-deea)
4. Configurar (ver sección 3.3)
5. Deploy
```

### 3.3 Configurar Variables de Entorno en Vercel

```bash
# Via CLI después del deploy:
vercel env add

# O en Dashboard Vercel:
# 1. Project → Settings → Environment Variables
# 2. Add New
```

**Variables a agregar:**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...  (Solo para Production)
RESEND_API_KEY = re_xxxxx
NEXT_PUBLIC_APP_URL = https://sync-deea.vercel.app
NEXT_PUBLIC_APP_ENV = production
TZ = America/Bogota
```

### 3.4 Habilitar Cron Jobs (Resumen Diario)

**En Vercel Dashboard:**

```
Project → Settings → Cron Jobs → Add Cron Job

Cron Job:
  Path: /api/cron/resumen-diario
  Schedule: 0 7 * * * (7:00 AM todos los días)
  Timezone: America/Bogota

Salvar
```

**Verificar que exista el endpoint:**

```bash
# En app/api/cron/resumen-diario.ts (crear si no existe)
export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Verificar header de autorización Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // TODO: Implementar lógica de resumen diario
    // - Obtener peticiones vencidas
    // - Obtener contratos críticos
    // - Enviar emails a responsables
    
    return Response.json({ success: true, timestamp: new Date() });
  } catch (error) {
    console.error('Cron error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
```

### 3.5 Verificar Deployment

```bash
# 1. Ir a https://sync-deea.vercel.app
# 2. Verificar que carga el Dashboard
# 3. Abrir DevTools Console (F12)
# 4. No debe haber errores de CORS o auth
# 5. Verificar que header search no tenga errores

# Si hay error de Supabase:
# - Vercel → Deployments → Latest
# - Logs → Ver error específico
# - Verificar NEXT_PUBLIC_SUPABASE_URL y ANON_KEY
```

---

## <a name="variables-entorno"></a>4️⃣ CONFIGURACIÓN VARIABLES DE ENTORNO

### 4.1 Jerarquía de .env

```
.env.production.local    ← Testing local (NO commitar)
           ↓
.env.production          ← Template (commitar sin valores)
           ↓
Vercel Dashboard         ← Variables finales (UI)
           ↓
App en producción
```

### 4.2 Variables Requeridas

| Variable | Dónde Obtener | Secreto? | Dónde Usar |
|----------|---------------|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings | ❌ | Cliente + Servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings | ❌ | Cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings | ✅ | Solo Servidor (NO EXPONER) |
| `RESEND_API_KEY` | Resend Dashboard | ✅ | Solo Servidor |
| `NEXT_PUBLIC_APP_URL` | Tu dominio | ❌ | Cliente (para links en emails) |
| `NEXT_PUBLIC_APP_ENV` | Manual | ❌ | Cliente (para feature flags) |
| `TZ` | Manual | ❌ | Servidor (timezone) |

### 4.3 Crear .env.production Template

```bash
# En archivo .env.production (SÍ commitar, sin valores)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
RESEND_API_KEY=your-resend-api-key-here
NEXT_PUBLIC_APP_URL=https://sync-deea.vercel.app
NEXT_PUBLIC_APP_ENV=production
TZ=America/Bogota
CRON_SECRET=your-random-secret-for-cron-jobs
```

---

## <a name="testing"></a>5️⃣ TESTING PRE-PRODUCCIÓN

### 5.1 Test Local con Variables Producción

```bash
# 1. Crear .env.production.local con valores REALES

# 2. Build local
npm run build

# 3. Servir build local
npm start

# 4. Acceder a http://localhost:3000
# 5. Verificar Dashboard carga
# 6. Verificar que conecta a Supabase PROD
```

### 5.2 Test de Funcionalidades Críticas

**Checklist funcional:**

- [ ] Dashboard carga sin errores
- [ ] KPIs muestran datos correctos
- [ ] Semáforo calcula días correctamente
- [ ] Pode crear petición (si está implementado)
- [ ] Puede cargar archivo
- [ ] Puede descargar CSV
- [ ] Responsive en mobile (F12 → toggle device)
- [ ] Notificaciones email funcionan (probar asignar)
- [ ] Búsqueda global responde (si existe)

### 5.3 Test de Performance

```bash
# En Vercel Dashboard:
# Deployments → Latest → Analytics
# - Verificar Core Web Vitals
# - LCP (Largest Contentful Paint) < 2.5s
# - FID (First Input Delay) < 100ms
# - CLS (Cumulative Layout Shift) < 0.1

# Si hay problemas:
# - Vercel → Settings → Analytics
# - Ver qué está lento
# - Optimizar componentes si es necesario
```

### 5.4 Test de Seguridad

```bash
# 1. Verificar que NO se exponen secretos
npm run build
# Revisar que .next/ no contenga SUPABASE_SERVICE_ROLE_KEY

# 2. Verificar RLS en Supabase
# - Login como usuario normal
# - Verificar que SOLO ve sus datos
# - No puede ver datos de otros usuarios

# 3. Verificar CORS
# - DevTools → Network
# - Requests a Supabase deben ser OK (sin CORS errors)
```

---

## <a name="monitoreo"></a>6️⃣ MONITOREO Y MANTENIMIENTO

### 6.1 Monitoring en Vercel

**Configurar alertas:**

```
Vercel Dashboard → Project → Settings → Alerts
- Add Alert
  - Alert Type: Deployment Failed
  - Notification: Email
  - Save
```

### 6.2 Logs de Producción

```bash
# Ver logs en tiempo real
vercel logs --prod

# O en Vercel Dashboard:
# Deployments → Latest → Logs (Runtime Logs)
```

### 6.3 Monitoreo de Supabase

```bash
# En Supabase Dashboard:
# Project → Logs
# - API Requests
# - Query Performance
# - Errors

# Configurar alertas:
# Project → Settings → Notifications
```

### 6.4 Backup Automático Supabase

```bash
# En Supabase Dashboard:
# Project → Settings → Backups
# - Automático cada día (incluido en plan)
# - Guardar por 7 días
# - Download si es necesario: Project → Backups → Download
```

### 6.5 Revisar Costos

```bash
# Vercel:
# Dashboard → Account → Billing
# - Functions: $0.50 per million invocations
# - Cron jobs: $10/mes si no usas plan pro

# Supabase:
# Organization → Billing
# - Database: $25/mes (prod)
# - Auth: Free hasta 50k users
# - Storage: $5 per 100GB
```

---

## 7️⃣ CHECKLIST FINAL DEPLOYMENT

```
PRE-DEPLOYMENT
[ ] npm run build completa sin errores
[ ] npm run type-check pasa sin errores
[ ] .env.production.local creado (NO commitar)
[ ] Supabase producción creado y migrado
[ ] Festivos cargados en base de datos
[ ] RLS policies verificadas

GITHUB
[ ] Repo creado y código pusheado
[ ] .gitignore incluye .env.production.local
[ ] .env.production template sin valores

VERCEL
[ ] Proyecto importado desde GitHub
[ ] Variables de entorno configuradas
[ ] Build preview funciona
[ ] Cron jobs habilitados

TESTING
[ ] Dashboard funciona
[ ] KPIs muestran datos correctos
[ ] Responsive en mobile
[ ] Emails funcionan
[ ] Búsqueda funciona
[ ] No hay errores en console

MONITOREO
[ ] Alertas en Vercel configuradas
[ ] Alertas en Supabase configuradas
[ ] Logs visible en Vercel
[ ] Backups automáticos Supabase

AFTER LAUNCH
[ ] Monitorear Core Web Vitals
[ ] Revisar logs por errores
[ ] Verificar costos
```

---

## 8️⃣ TROUBLESHOOTING COMÚN

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
```
Solución: 
1. Verificar que NEXT_PUBLIC_SUPABASE_URL esté en Vercel Dashboard
2. Re-deploy: Vercel → Deployments → Redeploy
```

### Error: "Failed to fetch from Supabase"
```
Solución:
1. Verificar que URL es correcta (no incluyir /rest/v1)
2. Verificar CORS en Supabase: Project → Settings → API
3. Agregar https://sync-deea.vercel.app a allowed origins
```

### Error: "Unauthorized - RLS policy"
```
Solución:
1. Verificar que usuario esté authenticado
2. Revisar RLS policy: permite read/write?
3. Supabase → SQL Editor → ver policies en tabla
```

### Error: "Email not sent from Resend"
```
Solución:
1. Verificar RESEND_API_KEY es correcto
2. Verificar que email destino es válido
3. Resend Dashboard → Logs ver error específico
```

---

## 9️⃣ COMANDOS RÁPIDOS

```bash
# Build y test local
npm run build && npm start

# Ver build size
npm run build && du -sh .next/

# Deploy a Vercel
git push origin main
# (Auto-deploy habilitado)

# Ver logs
vercel logs --prod

# Redeploy
vercel --prod

# Ver variables (Vercel)
vercel env ls
```

---

## 🎯 RESUMEN PASOS CRÍTICOS

1. **GitHub:** Push código
2. **Supabase:** Crear proyecto, ejecutar migrations
3. **Vercel:** Importar repo, configurar env variables, deploy
4. **Testing:** Verificar funcionalidades en https://sync-deea.vercel.app
5. **Monitoreo:** Activar alertas y revisar logs

**Tiempo estimado:** 30-60 minutos total

---

**¡Listo para producción!** 🚀
