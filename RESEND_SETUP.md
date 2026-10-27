# 📧 RESEND SETUP - NOTIFICACIONES EN PRODUCCIÓN

## 1️⃣ CREAR CUENTA RESEND

### Paso 1: Registro

```
Ir a: https://resend.com
1. "Sign up"
2. Email: tu@montelibano.gov.co
3. Contraseña fuerte
4. Verificar email
```

### Paso 2: Obtener API Key

```
https://resend.com/api-keys
1. Click "Create API Key"
2. Name: SYNC DEEA Production
3. Copy: re_xxxxxxxxxxxxxxxx
   (Guardar en archivo temporal - NO en git)
```

---

## 2️⃣ AGREGAR DOMINIO (Opcional pero Recomendado)

### Sin dominio personalizado (Resend)
```
De: noreply@sync-deea.resend.dev
✅ Funciona inmediatamente
⚠️  Puede ir a spam
```

### Con dominio personalizado
```
De: noreply@montelibano.gov.co
✅ Mejor reputación
⚠️  Requiere configurar DNS

Pasos:
1. https://resend.com/domains
2. "+ Add domain"
3. Ingresar: montelibano.gov.co
4. Copiar registros DNS (TXT, DKIM, etc)
5. En tu proveedor DNS, agregar registros
6. Esperar verificación (5-30 min)
```

---

## 3️⃣ CONFIGURAR EN SYNC DEEA

### .env.production

```
# .env.production.local (NO COMMITEAR)
NEXT_PUBLIC_RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

### Vercel Environment Variables

```
Settings → Environment Variables
+ Add New:

NEXT_PUBLIC_RESEND_API_KEY
└─ re_xxxxxxxxxxxxxxxx

✅ Save
✅ Redeploy
```

---

## 4️⃣ TEMPLATES DE EMAIL (React Email)

### Resend admite templates en React

```typescript
// lib/resend.ts - YA IMPLEMENTADO
// Usa React.createElement() para portabilidad

import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function enviarNotificacionPeticion(
  email: string,
  datos: {
    radicado: string;
    asunto: string;
    fecha_vencimiento: string;
    dias_restantes: number;
  }
) {
  return resend.emails.send({
    from: 'noreply@sync-deea.resend.dev', // O tu dominio
    to: email,
    subject: `Notificación - Petición ${datos.radicado}`,
    html: `
      <h2>Nueva Petición Asignada</h2>
      <p><strong>Radicado:</strong> ${datos.radicado}</p>
      <p><strong>Asunto:</strong> ${datos.asunto}</p>
      <p><strong>Vencimiento:</strong> ${datos.fecha_vencimiento}</p>
      <p><strong>Días Restantes:</strong> ${datos.dias_restantes}</p>
      <a href="https://sync-deea.vercel.app/peticiones/${datos.radicado}">
        Ver detalles
      </a>
    `
  });
}
```

---

## 5️⃣ CASOS DE USO

### Caso 1: Asignar responsable en petición

```typescript
// app/api/peticiones/asignar/route.ts
import { enviarNotificacionPeticion } from '@/lib/resend';

export async function POST(request: Request) {
  const { peticion_id, responsable_email, ... } = await request.json();
  
  // Actualizar BD
  // ...
  
  // Enviar email
  await enviarNotificacionPeticion(responsable_email, {
    radicado: 'E-2024-0001',
    asunto: 'Derecho de petición ciudadano',
    fecha_vencimiento: '2024-12-20',
    dias_restantes: 15
  });
  
  return Response.json({ success: true });
}
```

### Caso 2: Alertas Diarias (Vercel Cron Job)

```typescript
// app/api/cron/resumen-diario/route.ts
import { enviarResumenDiario } from '@/lib/resend';

export async function GET(request: Request) {
  // Verificar CRON_SECRET
  const secret = request.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Obtener datos críticos
  const criticas = await obtenerPeticionesCriticas();
  const vencidas = await obtenerPeticionesVencidas();
  
  // Enviar a Secretario
  await enviarResumenDiario('secretario@montelibano.gov.co', {
    peticiones_criticas: criticas.length,
    peticiones_vencidas: vencidas.length,
    enlaces: {
      peticiones: 'https://sync-deea.vercel.app/peticiones',
      dashboard: 'https://sync-deea.vercel.app'
    }
  });
  
  return Response.json({ sent: true });
}
```

---

## 6️⃣ TESTING LOCAL

### Opción 1: Test en desarrollo (sin Resend real)

```typescript
// lib/resend.ts
if (process.env.NODE_ENV === 'development') {
  console.log('[DEV] Email would be sent to:', email);
  console.log('[DEV] Subject:', subject);
  return { success: true, id: 'test-id' };
}
```

### Opción 2: Usar API key de test (Resend)

```
Resend Dashboard → API Keys
Crear: "Development" key
Usar en .env.local para testing
```

### Test via curl

```bash
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "tu@email.com",
    "subject": "Test SYNC DEEA",
    "html": "<h1>Test OK</h1>"
  }'

# Respuesta OK:
# {"id":"00000000-0000-0000-0000-000000000000"}
```

---

## 7️⃣ TROUBLESHOOTING

### Error: "Invalid API key"
```
1. Verificar: NEXT_PUBLIC_RESEND_API_KEY en Vercel
2. Copiar exacto (sin espacios)
3. Redeploy
```

### Email va a spam
```
1. Usar dominio personalizado
   (en lugar de resend.dev)
2. Agregar SPF/DKIM en DNS
   (Resend te da los records)
3. Test con: https://mailtester.com
```

### "Invalid 'to' email address"
```
1. Email no válido (typo?)
2. Resend bloquea emails de testing
3. Usar email real para testing
```

### No llega email en producción
```
1. Vercel logs: vercel logs --prod
2. Buscar: "Resend" o "email"
3. Si error → Ver arriba
4. Si OK pero no recibe → Revisar spam
```

---

## 8️⃣ VERCEL CRON JOBS (AUTOMÁTICO)

### Configurar resumen diario a las 7:00 AM

```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/resumen-diario",
    "schedule": "0 7 * * *"  // 7:00 AM UTC (2:00 AM Colombia)
  }]
}
```

⚠️ **Nota:** Vercel Cron usa UTC. Para 7:00 AM Colombia (UTC-5):
- UTC: 12:00 (mediodía) = "0 12 * * *"
- O usar función `convertirHoraAColombia()` en el endpoint

```typescript
// app/api/cron/resumen-diario/route.ts
const ahora = new Date();
const ahoraColombia = new Date(ahora.toLocaleString('es-CO', { timeZone: 'America/Bogota' }));

console.log('Cron ejecutado a las:', ahoraColombia.toLocaleTimeString());
// Esperado: 7:00:XX
```

### Verificar en Vercel

```
Vercel Dashboard:
1. Deployments
2. Latest deployment
3. "Logs" → buscar "Cron"
4. Debe mostrar ejecuciones cada día
```

---

## ✅ CHECKLIST RESEND

```
SETUP
[ ] Cuenta Resend creada
[ ] API key copiada
[ ] .env.production.local actualizado
[ ] Vercel env variable agregada
[ ] Vercel redeploy completado

OPTIONAL
[ ] Dominio personalizado configurado
[ ] DNS records verificados
[ ] SPF/DKIM activos

TESTING
[ ] Email de test enviado OK
[ ] Email llega a inbox (no spam)
[ ] Links en email funcionan
[ ] Template se ve correcto

PRODUCCIÓN
[ ] Asignaciones envían email
[ ] Cron job configurado
[ ] Logs muestran envíos OK
[ ] Email diario 7:00 AM llega
```

---

## 📚 REFERENCIAS

- Resend Docs: https://resend.com/docs
- React Email: https://react.email/
- Vercel Cron: https://vercel.com/docs/cron-jobs

---

**Estado:** Listo para activar después del deployment inicial ✅

Cuando el sistema esté estable con datos reales:
1. Verificar plantillas con datos verdaderos
2. Testear flujo completo (asignar → email → validar)
3. Configurar Cron Job para alertas diarias
