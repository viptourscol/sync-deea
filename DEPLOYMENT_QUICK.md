# 🚀 DEPLOYMENT RÁPIDO - PASO A PASO (30 MIN)

## ⚡ TL;DR (Resumen Ejecutivo)

1. Compilar: `npm run build` ✅
2. Push a GitHub: `git push origin main` ✅
3. Crear Supabase producción y cargar schema
4. Crear Vercel y conectar repo GitHub
5. Agregar variables env en Vercel
6. Deploy automático
7. Testing en https://sync-deea.vercel.app

---

## PASO 1️⃣: PREPARAR PROYECTO LOCAL (5 min)

```bash
cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

# Verificar que todo compila
npm run build
# ✅ Debe decir "ready - started server on 0.0.0.0:3000"

# Verificar tipos TypeScript
npm run type-check
# ✅ Debe pasar sin errores
```

**Si hay errores:**
```
Error "Cannot find module X"
→ npm install
→ npm run build

Error "Type X is not assignable"
→ Revisar tsconfig.json
→ npm run type-check
```

---

## PASO 2️⃣: GITHUB (5 min)

### 2.1 Crear Repositorio

```bash
# Ir a https://github.com/new
# 1. Repository name: sync-deea
# 2. Description: GovTech para Secretaría DEEA
# 3. Private: ✓ (para código propietario)
# 4. Click "Create repository"

# Copiar SSH URL: git@github.com:tu-usuario/sync-deea.git
```

### 2.2 Pushear Código

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

git init
git add .
git commit -m "Initial commit - Paso 3 components and dashboard"
git branch -M main
git remote add origin git@github.com:tu-usuario/sync-deea.git
git push -u origin main
```

**Verificar en GitHub:** https://github.com/tu-usuario/sync-deea

---

## PASO 3️⃣: SUPABASE PRODUCCIÓN (10 min)

### 3.1 Crear Proyecto

```
Ir a https://supabase.com/dashboard
1. New Project
2. Name: sync-deea-produccion
3. Region: South America (São Paulo)
4. Password: [Guardar en gestor]
5. Create new project [Esperar 5 min]
```

### 3.2 Obtener Credenciales

```
En Supabase Dashboard:
1. Settings (engranaje inferior izquierdo)
2. API
3. Copy y guardar:
   - URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role secret → SUPABASE_SERVICE_ROLE_KEY
```

**Guardar en archivo temporal:**
```
URL: https://xxxxx.supabase.co
ANON: eyJhbGc...
SERVICE: eyJhbGc...
```

### 3.3 Cargar Schema SQL

```
En Supabase Dashboard:
1. SQL Editor → New Query
2. Copiar contenido completo de:
   /Users/janyermartinez/Documents/Proyectos/SyncDEEA/PASO1_ESTRUCTURA_ESQUEMA.md
3. Pegar en editor
4. Click "Run"
5. Esperar completar (no debe haber errores rojos)
```

### 3.4 Cargar Festivos Colombia

```sql
-- En SQL Editor → New Query
INSERT INTO festivos_colombia (fecha, nombre, es_trasladable) VALUES
('2024-01-01', 'Año Nuevo', false),
('2024-01-08', 'Reyes', false),
('2024-03-28', 'Jueves Santo', true),
('2024-03-29', 'Viernes Santo', true),
('2024-05-01', 'Día del Trabajo', false),
('2024-06-03', 'Sagrado Corazón', true),
('2024-06-10', 'San Pedro y San Pablo', true),
('2024-06-17', 'San Pedro y San Pablo Observado', true),
('2024-07-01', 'San Pedro y San Pablo Observado', true),
('2024-07-29', 'Asunción', true),
('2024-11-01', 'Todos los Santos', false),
('2024-11-11', 'Independencia de Cartagena', true),
('2024-12-08', 'Inmaculada Concepción', false),
('2024-12-25', 'Navidad', false),
('2025-01-01', 'Año Nuevo', false),
('2025-01-08', 'Reyes', false),
('2025-04-17', 'Jueves Santo', true),
('2025-04-18', 'Viernes Santo', true),
('2025-05-01', 'Día del Trabajo', false),
('2025-06-02', 'Sagrado Corazón', true),
('2025-06-09', 'San Pedro y San Pablo', true),
('2025-06-16', 'San Pedro y San Pablo Observado', true),
('2025-07-07', 'San Pedro y San Pablo Observado', true),
('2025-08-07', 'Asunción', true),
('2025-11-03', 'Todos los Santos', true),
('2025-11-17', 'Independencia de Cartagena', true),
('2025-12-08', 'Inmaculada Concepción', false),
('2025-12-25', 'Navidad', false);

-- Click Run
```

---

## PASO 4️⃣: VERCEL (5 min)

### 4.1 Crear Proyecto

```
Ir a https://vercel.com/dashboard
1. Add New... → Project
2. "Import Git Repository"
3. Buscar: sync-deea (tu repo)
4. Click "Import"
```

### 4.2 Configurar

```
Configure project:
1. Project name: sync-deea (auto-detectado)
2. Framework preset: Next.js (auto-detectado)
3. Root directory: ./
4. Click "Deploy"
   [Esperar 2-3 min mientras compila]
```

### 4.3 Agregar Variables de Entorno

```
Vercel Dashboard → tu proyecto:
1. Settings → Environment Variables
2. "Add New"

Agregar estos (copia del PASO 3.2):

NEXT_PUBLIC_SUPABASE_URL
  Value: https://xxxxx.supabase.co
  
NEXT_PUBLIC_SUPABASE_ANON_KEY
  Value: eyJhbGc...
  
SUPABASE_SERVICE_ROLE_KEY
  Value: eyJhbGc...
  
NEXT_PUBLIC_APP_URL
  Value: https://sync-deea.vercel.app
  
NEXT_PUBLIC_APP_ENV
  Value: production
  
TZ
  Value: America/Bogota

Click "Save" después de cada variable
```

### 4.4 Redeploy

```
Vercel Dashboard:
1. Deployments (tab izquierdo)
2. Latest deployment
3. Click "..." → "Redeploy"
4. Esperar a que termine

O via CLI:
vercel --prod
```

---

## PASO 5️⃣: TESTING (5 min)

### 5.1 Acceder a la App

```
Ir a: https://sync-deea.vercel.app
(La URL exacta está en Vercel Dashboard)

✅ Debe mostrar el Dashboard con:
  - Header con logo
  - Sidebar con menú
  - 6 KPIs
  - Alertas
  - Agenda
  - Footer
```

### 5.2 Verificar Consola

```
F12 → Console
❌ NO debe haber errores rojo
⚠️  Warnings son OK (deprecation, etc)

Si hay error de Supabase:
→ Vercel → Deployments → Latest → Logs
→ Buscar el error específico
→ Revisar que las env variables sean correctas
```

### 5.3 Verificar Datos

```
Dashboard KPIs deben mostrar datos (aunque sean mockup):
✅ Peticiones vencidas: 2
✅ Críticas: 5
✅ Pendientes: 12
✅ Sin asignar: 3
✅ Contratos: 8
✅ Ejecución: 65%

Alertas deben mostrar 3 items con semáforo rojo/ámbar
Agenda debe mostrar 2 eventos
```

### 5.4 Test Responsive

```
F12 → Toggle device toolbar (Ctrl+Shift+M)
Cambiar a diferentes dispositivos:
✅ iPhone 12: OK
✅ iPad: OK
✅ Desktop: OK

Sidebar debe convertirse en drawer en mobile
```

---

## ✅ CHECKLIST FINAL

```
COMPILACIÓN
[ ] npm run build sin errores
[ ] npm run type-check sin errores

GITHUB
[ ] Repo creado y privado
[ ] Código pusheado a main
[ ] .env.production.local en .gitignore

SUPABASE
[ ] Proyecto "sync-deea-produccion" creado
[ ] Schema SQL ejecutado
[ ] Festivos cargados
[ ] Credenciales copiadas

VERCEL
[ ] Proyecto importado desde GitHub
[ ] Build inicial completado
[ ] Variables de entorno agregadas
[ ] Redeploy ejecutado

TESTING
[ ] App funciona en https://sync-deea.vercel.app
[ ] Dashboard muestra KPIs
[ ] Console sin errores
[ ] Responsive mobile OK
[ ] Alertas y agenda OK
```

---

## 🎯 TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| Build falla en Vercel | Ir a Logs → ver error. Usualmente var env faltante |
| "Cannot find module @supabase" | Vercel: redeploy después de agregar var env |
| Dashboard muestra datos vacíos | Es normal (mockup). Próximo: conectar Supabase real |
| Error CORS en Supabase | Supabase Settings → API → Agregar https://sync-deea.vercel.app |
| "RLS policy error" | Supabase SQL Editor → verificar policies en tablas |

---

## 📞 VERIFICAR QUE FUNCIONA

```bash
# Desde terminal local:
curl https://sync-deea.vercel.app
# Debe retornar HTML del sitio (no error 500)

# Desde browser:
# F12 → Network → debe haber requests OK a Supabase
# No debe haber "Failed to fetch" rojo
```

---

## 🎉 ¡LISTO!

Tu app está en **producción**:
- **URL:** https://sync-deea.vercel.app
- **BD:** Supabase producción
- **Hosting:** Vercel (serverless)
- **Auto-deploy:** Cada push a main

### Próximos pasos:
1. Agregar monitoreo (alertas en Vercel)
2. Implementar Paso 3.2 (Módulo Peticiones)
3. Conectar emails reales (Resend)
4. Testing exhaustivo
5. Marketing/Launch

---

**Documentación completa:** `DEPLOYMENT_SUPABASE_VERCEL.md`

¡Felicidades por el deployment! 🚀
