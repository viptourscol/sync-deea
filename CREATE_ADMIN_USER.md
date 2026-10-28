# 🔐 CREAR USUARIO ADMINISTRATIVO

## Paso 1: Crear usuario en Supabase Auth

### Opción A: Via Dashboard (Recomendado)
1. Ve a: https://supabase.com/dashboard → syncdeea-montelibano
2. Ve a: **Authentication** → **Users** (menú izquierdo)
3. Click en botón **"Add user"** (verde)
4. Completa:
   ```
   Email:    admin@montelibano.gov.co
   Password: (Crea una fuerte: Min 12 caracteres)
   ```
5. Click **"Save user"**

### Opción B: Via SQL (en SQL Editor)
```sql
-- Crear usuario en auth.users (Supabase hace esto automático)
-- Solo necesitas ir a Auth → Users y crear desde ahí
```

---

## Paso 2: Crear perfil en tabla usuarios

Una vez creado el usuario en Auth, obtendrás un **UUID**. Luego:

1. Ve a: **SQL Editor** en Supabase
2. Ejecuta esto (reemplaza UUID_DEL_USUARIO):

```sql
INSERT INTO public.usuarios (id, email, nombre_completo, rol, departamento, cargo, activo)
VALUES (
  'UUID_DEL_USUARIO',  -- Copiar el UUID de Auth → Users
  'admin@montelibano.gov.co',
  'Secretario(a) DEEA',
  'admin',
  'Despacho del Secretario',
  'Secretario(a)',
  true
);
```

3. Reemplaza `UUID_DEL_USUARIO` con el UUID que te muestra Supabase en Auth → Users
4. Click **RUN**

---

## Paso 3: Obtener las credenciales para Vercel

1. Ve a: https://supabase.com/dashboard → syncdeea-montelibano → **Settings** → **API**
2. Copia estos valores:

| Variable | Valor | Dónde usarlo |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Vercel env vars |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Vercel env vars |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (más largo) | Vercel env vars |

---

## Paso 4: Configurar en Vercel

1. Ve a: https://vercel.com → Tu proyecto `sync-deea`
2. Click en **Settings** → **Environment Variables**
3. Agrega estas 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL=https://dnrvasgladqifoymovbt.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<copiar desde Supabase>`
   - `SUPABASE_SERVICE_ROLE_KEY=<copiar desde Supabase>`

4. Click **Save**
5. Vercel re-deployará automáticamente (espera ~2-3 min)

---

## Paso 5: Probar Login

1. Ve a: https://sync-deea.vercel.app
2. Intenta loguearte con:
   ```
   Email:    admin@montelibano.gov.co
   Password: (La que creaste en Paso 1)
   ```

3. Si funciona ✅ → BASE DE DATOS CONECTADA

---

**Tiempo total:** 10 minutos
**Dificultad:** ⭐⭐ Fácil
