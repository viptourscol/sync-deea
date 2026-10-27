# 🚀 QUICK START - SYNC DEEA PASO 3

## 5 Minutos para Entender y Usar

---

## 1️⃣ Qué se Entregó

✅ **7 Componentes Base Reutilizables** listos para usar
✅ **Dashboard Ejecutivo** con KPIs, alertas y agenda
✅ **Layout completo** Header + Sidebar + Footer
✅ **60+ CSS Variables** para mantener identidad visual
✅ **Documentación completa** con ejemplos

---

## 2️⃣ Instalación (3 pasos)

```bash
# 1. Ir a la carpeta del proyecto
cd /Users/janyermartinez/Documents/Proyectos/SyncDEEA

# 2. Instalar dependencias
npm install

# 3. Compilar (verificar que funciona)
npm run build
```

Si falla el build, revisar que `.env` tenga configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (opcional para dev)

---

## 3️⃣ Usar los Componentes (Ejemplos)

### Semaforo
```tsx
import { Semaforo } from "@/components/base";

export default function MiComponente() {
  return <Semaforo estado="Rojo" tamaño="lg" etiqueta />;
}
```

### Dias Restantes
```tsx
import { DiasRestantes } from "@/components/base";

export default function PeticionCard() {
  return (
    <DiasRestantes 
      fechaVencimiento="2024-11-20"
      variant="expanded"
      formato="ambos"
    />
  );
}
```

### Cargar Archivos
```tsx
import { CargaArchivos } from "@/components/base";

export default function SubirDocumento() {
  return (
    <CargaArchivos
      bucket="peticiones"
      carpeta="E-2024-001/"
      onCargaCompleta={(ruta) => console.log("Guardado:", ruta)}
      onError={(error) => console.error(error)}
    />
  );
}
```

### Exportar CSV
```tsx
import { ExportarCSV } from "@/components/base";

const datos = [
  { radicado: "E-001", asunto: "Solicitud" },
  { radicado: "E-002", asunto: "PQRSD" },
];

export default function ReportePeticiones() {
  return (
    <ExportarCSV 
      datos={datos} 
      nombreArchivo="peticiones.csv"
      variant="button"
    />
  );
}
```

### Cambiar Estado Petición
```tsx
import { EstadoPeticion, BotonCambioEstado } from "@/components/base";

export default function PeticionForm() {
  const [estado, setEstado] = useState("Recibido");
  
  return (
    <>
      <EstadoPeticion estado={estado} tamaño="md" />
      <BotonCambioEstado 
        estadoActual={estado} 
        onCambio={setEstado}
      />
    </>
  );
}
```

### Paginación
```tsx
import { Paginacion, usePaginacion } from "@/components/base";

export default function ListadoPeticiones() {
  const peticiones = [...]; // 456 registros
  const { paginaActual, totalPages, offset, limit } = 
    usePaginacion(peticiones.length, 50);
  
  const datosMostrados = peticiones.slice(offset, offset + limit);
  
  return (
    <>
      <table>{/* mostrar datosMostrados */}</table>
      <Paginacion
        paginaActual={paginaActual}
        totalPages={totalPages}
        totalItems={peticiones.length}
        itemsPorPagina={50}
        onPaginaChange={(p) => setPaginaActual(p)}
      />
    </>
  );
}
```

### Modal Confirmación
```tsx
import { ModalConfirmacion, useModalConfirmacion } from "@/components/base";

export default function EliminarPeticion({ id }) {
  const { abierto, abrir, cerrar } = useModalConfirmacion();
  const [cargando, setCargando] = useState(false);
  
  const handleEliminar = async () => {
    setCargando(true);
    await fetch(`/api/peticiones/${id}`, { method: "DELETE" });
    setCargando(false);
    cerrar();
  };
  
  return (
    <>
      <button onClick={abrir}>Eliminar</button>
      
      <ModalConfirmacion
        abierto={abierto}
        titulo="Eliminar petición"
        mensaje="¿Está seguro de que desea eliminar esta petición?"
        advertencia="Esta acción no se puede deshacer"
        onCerrar={cerrar}
        botones={{
          confirmar: {
            etiqueta: "Eliminar",
            onClick: handleEliminar,
            variant: "rojo",
            cargando,
          },
          cancelar: {
            etiqueta: "Cancelar",
            onClick: cerrar,
          },
        }}
      />
    </>
  );
}
```

---

## 4️⃣ Ver el Dashboard

```bash
npm run dev
# Abre http://localhost:3000
```

Verás:
- KPIs ejecutivos (6 tarjetas)
- Alertas inmediatas (peticiones críticas)
- Agenda del día
- Layout con Header + Sidebar + Footer

**Nota:** Los datos son mockup. Para conectar Supabase real, ver `CHECKLIST_PASO_3_2.md`

---

## 5️⃣ Estructura de Carpetas (Lo Importante)

```
components/base/
  ├── Semaforo.tsx
  ├── DiasRestantes.tsx
  ├── CargaArchivos.tsx
  ├── ExportarCSV.tsx
  ├── EstadoPeticion.tsx
  ├── Paginacion.tsx
  ├── ModalConfirmacion.tsx
  └── index.ts                ← Exportación centralizada

components/layout/
  ├── Header.tsx
  ├── Sidebar.tsx
  └── Footer.tsx

app/
  ├── layout.tsx              ← Root layout
  └── page.tsx                ← Dashboard (http://localhost:3000)

styles/
  └── globals.css             ← CSS variables + estilos globales

lib/
  ├── fechas-colombia.ts      ← Motor días hábiles
  ├── supabase.ts             ← Cliente Supabase
  ├── validations.ts          ← Esquemas Zod
  └── etc...
```

---

## 🎨 Colores Disponibles (CSS Variables)

Nunca hardcodees colores. Usa variables de `styles/globals.css`:

```css
/* Semáforo */
--color-semaforo-verde: #2E7D4F
--color-semaforo-ambar: #B87708
--color-semaforo-rojo: #B3261E
--color-semaforo-gris: #CCCCCC

/* Institucional */
--color-fondo: #E9EBE6          /* Fondo oficial */
--color-panel: #FFFFFF           /* Paneles */
--color-tinta-principal: #131A24 /* Texto oscuro */
--color-acento-principal: #1F4E5F /* Azul DEEA */

/* Otros */
--color-borde: #CCCCCC
--color-borde-claro: #EEEEEE
```

En componentes:
```tsx
<div style={{ color: "var(--color-acento-principal)" }}>
  Texto azul DEEA
</div>
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Ejecutar en localhost:3000

# Compilación
npm run build            # Build production
npm run start            # Ejecutar build

# Validación
npm run type-check       # Validar TypeScript
npx tsc --noEmit         # Verificar tipos

# Supabase (cuando esté conectado)
npm run supabase:gen-types   # Regenerar tipos desde DB
```

---

## 📚 Documentación Completa

Para detalles técnicos:

| Archivo | Contenido |
|---------|----------|
| `ENTREGA_PASO_3.md` | Resumen general y próximos pasos |
| `PASO3_COMPONENTES_BASE.md` | Detalles técnicos de cada componente |
| `INDICE_PROYECTO.md` | Estructura completa del proyecto |
| `CHECKLIST_PASO_3_2.md` | Tareas para módulo Peticiones (próximo) |

---

## ⚠️ Cosas a Recordar

1. **Siempre importa desde `@/components/base`**
   ```tsx
   // ✓ Correcto
   import { Semaforo } from "@/components/base";
   
   // ✗ Incorrecto
   import { Semaforo } from "@/components/base/Semaforo";
   ```

2. **Usa CSS variables, no hardcodes**
   ```tsx
   // ✓ Correcto
   <div style={{ color: "var(--color-acento-principal)" }}>
   
   // ✗ Incorrecto
   <div style={{ color: "#1F4E5F" }}>
   ```

3. **Valida datos con Zod**
   ```tsx
   // Ver lib/validations.ts
   import { schemaCrearPeticion } from "@/lib/validations";
   const validar = () => {
     const resultado = schemaCrearPeticion.safeParse(datos);
     if (!resultado.success) {
       console.error(resultado.error);
     }
   };
   ```

4. **TypeScript strict mode**
   - No usar `any`
   - Siempre tipificar props
   - Validar tipos en compilación

---

## 🎓 Siguiente Paso: Paso 3.2

Cuando estés listo para desarrollar más, seguir:
`CHECKLIST_PASO_3_2.md`

Tareas:
1. Crear tabla genérica
2. Página listado peticiones
3. Página crear petición
4. Página detalle petición
5. API endpoints
6. Conectar Supabase real
7. Dashboard con datos vivos

---

## 💬 Resumen

- ✅ 7 componentes base funcionando
- ✅ Dashboard ejecutivo listo
- ✅ Layout responsive
- ✅ CSS variables centralizadas
- ✅ Documentación completa
- 🔄 Próximo: Módulo Peticiones (Paso 3.2)

---

**¡Ahora estás listo para desarrollar!** 🚀

Cualquier pregunta, revisar la documentación o código dentro de cada archivo.
