# 📖 CHEAT SHEET - DEPLOYMENT SYNC DEEA

## ⚡ Comandos Rápidos

```bash
# PRE-DEPLOYMENT VALIDATION
bash pre-deployment-check.sh

# COMPILAR LOCALMENTE
npm run build
npm run type-check

# GIT → GITHUB
git add .
git commit -m "Deploy: production ready"
git push origin main

# VERCEL (solo si cambios remotos)
vercel --prod --force

# VER LOGS (Vercel)
vercel logs --prod
```

---

## 🔑 Variables de Entorno

### Producción (.env.production.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://sync-deea.vercel.app
NEXT_PUBLIC_APP_ENV=production
TZ=America/Bogota
```

### En Vercel Dashboard

```
Settings → Environment Variables
Agregar: [Ver template .env.production.example]
Redeploy después de agregar
```

---

## 🔐 Seguridad Checklist

```
❌ NUNCA
  - Commitear .env.production
  - Exponer SUPABASE_SERVICE_ROLE_KEY en cliente
  - Poner credenciales en código

✅ SIEMPRE
  - .env.production.local en .gitignore
  - Usar process.env en código
  - Agregar variables en Vercel Dashboard
  - Redeploy después de cambiar env vars
  - Verificar RLS está ON en Supabase
```

---

## 🗄️ Supabase SQL Rápido

### Verificar RLS
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- Resultado: rowsecurity = t (true)
```

### Crear usuario
```sql
-- NO hacer aquí - usar API endpoint /api/admin/usuarios/crear
-- Solo en Supabase UI si es admin
```

### Ver audit logs
```sql
SELECT timestamp, event, error_message
FROM audit.audit_log_entries
WHERE error_message ILIKE '%policy%'
ORDER BY timestamp DESC LIMIT 20;
```

---

## 🚀 Vercel Dashboard Shortcuts

| Tarea | Ruta |
|-------|------|
| Ver app | sync-deea.vercel.app |
| Logs de última deploy | Deployments → Latest → Logs |
| Redeploy | Deployments → Latest → ... → Redeploy |
| Env variables | Settings → Environment Variables |
| Dominio personalizado | Settings → Domains |
| Monitoreo | Monitoring (si habilitado) |

---

## 📊 URLs Clave

```
Supabase Dashboard:   https://supabase.com/dashboard
Vercel Dashboard:     https://vercel.com/dashboard
GitHub Repo:          https://github.com/usuario/sync-deea
App Producción:       https://sync-deea.vercel.app
```

---

## 🐛 Troubleshooting Rápido

### Build falla
```bash
# 1. Ver error
vercel logs --prod

# 2. Buscar en archivo
# (si output muy largo)
vercel logs --prod > logs.txt
grep -i error logs.txt

# 3. Causas comunes
- Variable env faltante → Agregar en Vercel
- Type error → npm run type-check local
- Dependencia faltante → npm install (local), push, redeploy
```

### App muestra error 500
```
F12 → Console
↓
Buscar "Supabase" o "fetch"
↓
Si error: "Cannot read property 'url' of undefined"
→ NEXT_PUBLIC_SUPABASE_URL no está en env
→ Vercel: Settings → Env Variables → Redeploy
```

### Supabase: "RLS policy error"
```sql
-- Schema incompleto
-- Volver a Supabase SQL Editor
-- Copiar PASO1_ESTRUCTURA_ESQUEMA.md
-- Ejecutar completo (click Run)
-- ✅ Sin errores rojos = OK
```

---

## 📋 Checklist Mínimo Pre-Push

```bash
# 1. Compilar
npm run build
# ✅ "ready - started server"

# 2. Types
npm run type-check
# ✅ Sin errores

# 3. Git
git status
# ✅ "working tree clean"

# 4. Secretos
grep -r "sk_\|pk_\|_KEY=" app/ lib/
# ✅ Sin matches (solo en .example)

# 5. GO
git push origin main
# ✅ Vercel auto-deploy en 2-3 min
```

---

## 🎯 Post-Deploy

```
1. Esperar 3 min (build + deploy)
2. Ir a https://sync-deea.vercel.app
3. F12 → Console (sin errores rojos)
4. Dashboard carga OK
5. Si error → Vercel Logs
```

---

## 💡 Pro Tips

```
1. Usar aliases en .gitconfig
   git config --global alias.deploy 'push origin main'
   Luego: git deploy

2. Crear alias para logs
   alias vlog='vercel logs --prod'

3. Guardar URLs en navegador
   - Vercel dashboard
   - Supabase dashboard
   - App producción

4. Monitoring: Ir a Vercel → Settings → Monitoring
   Habilitar alertas de errores
```

---

## 📞 Soporte

Si algo falla:
1. Revisar `SECURITY_PRODUCTION.md` (credenciales)
2. Revisar `DEPLOYMENT_QUICK.md` (paso a paso)
3. Revisar `DEPLOYMENT_SUPABASE_VERCEL.md` (completo)
4. Ver logs: `vercel logs --prod`
5. Google: [error específico + "vercel" + "supabase"]

---

**Last Updated:** 2024
**Status:** Production Ready ✅
