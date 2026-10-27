# CHECKLIST PASO 3.2 - MÓDULO PETICIONES

## 🎯 Objetivo Principal
Implementar el módulo **Peticiones y PQRSD** completo:
- Listado con filtros, búsqueda, paginación
- Crear nueva petición (formulario validado)
- Detalle petición (cambiar estado, asignar responsable, cargar archivos)
- Tabla reutilizable TablaP​eticiones.tsx

---

## 📋 Checklist Paso 3.2

### 1. Tabla Genérica Base (PRIMERO)
- [ ] Crear `components/shared/Tabla.tsx`
  - Props: datos, columnas, paginar, onSort, onFilter
  - Features: Sort, filter, selección múltiple
  - Usar `Paginacion` de componentes base
  - Ejemplo: `<Tabla datos={peticiones} columnas={['radicado', 'asunto', 'dias']} />`

### 2. Página Listado Peticiones
- [ ] Crear `app/peticiones/page.tsx`
  - Estado: useState (paginaActual, filtros, búsqueda)
  - Datos: Hook o Supabase query (próximo: conectar lib/supabase.ts)
  - Filtros: estado, semáforo, responsable, rango fechas
  - Búsqueda: Radicado o asunto
  - Componentes: Header + Filtros + Tabla + Paginación
  - Botones: Crear nueva petición, Exportar CSV, Refrescar

### 3. Página Crear Petición
- [ ] Crear `app/peticiones/nuevo/page.tsx`
  - Formulario: Usar `schemaCrearPeticion` de lib/validations.ts
  - Campos: Radicado (auto), Solicitante, Asunto, Descripción, Tipo término, Fechas
  - Upload: CargaArchivos para PDF entrada
  - Validación: `validarFormulario()` antes de submit
  - Submit: POST `/api/peticiones` (próximo: crear endpoint)
  - Toast/Modal: Confirmación de creación

### 4. Página Detalle Petición
- [ ] Crear `app/peticiones/[id]/page.tsx`
  - Datos: Fetch desde Supabase (useEffect + useState)
  - Secciones:
    - [ ] Resumen: Radicado, asunto, solicitante, fecha radicación
    - [ ] Término legal: Días totales, días restantes (DiasRestantes), vencimiento
    - [ ] Semáforo: Indicador con color actual
    - [ ] Estado: BotonCambioEstado para Recibido → En trámite → Respondido
    - [ ] Responsable: Selector del equipo (dropdown)
    - [ ] Archivos entrada: CargaArchivos (bucket: peticiones)
    - [ ] Respuesta: CargaArchivos para oficio respuesta
    - [ ] Historial: Tabla de cambios de estado + auditoría
  - Botones: Guardar cambios, Imprimir, Compartir, Archivar

### 5. Componentes Específicos Peticiones
- [ ] Crear `components/peticiones/TablaP​eticiones.tsx`
  - Extiende Tabla genérica
  - Columnas: Radicado, Asunto, Solicitante, Días, Semáforo, Estado, Responsable
  - Row click: Navigate to detail
  - Inline actions: Edit, Delete, Export

- [ ] Crear `components/peticiones/FormularioPeticion.tsx`
  - Reutilizable: Crear y editar
  - Validación: Zod schema
  - Campos: Solicitante (Nombre, Cédula, Email), Asunto, Descripción, Tipo término
  - Date pickers: Fecha radicación, vencimiento (calculado)
  - Vencimiento preview: Mostrar fecha exacta de vencimiento calculada

- [ ] Crear `components/peticiones/DetallesPeticion.tsx`
  - Panel con resumen ejecutivo
  - Indicador semáforo destacado
  - DiasRestantes expandido
  - Info solicitante (nombre, cédula, email)
  - Cambios recientes (últimos 5)

### 6. API Endpoints
- [ ] Crear `app/api/peticiones/route.ts`
  - GET: Listar peticiones (filtros, paginación)
  - POST: Crear petición
  - Validación: Zod schema
  - Autenticación: Verificar usuario (Supabase Auth)
  - Respuestas: Error handling, status codes

- [ ] Crear `app/api/peticiones/[id]/route.ts`
  - GET: Detalle petición
  - PATCH: Actualizar (estado, responsable)
  - DELETE: Eliminar (soft delete)
  - Auditoría: Registrar cambios

### 7. Integración Supabase
- [ ] Conectar `lib/supabase.ts` funciones:
  - [ ] obtenerPeticiones(filtros, paginaActual, itemsPorPagina)
  - [ ] obtenerPeticionPorId(id)
  - [ ] crearPeticion(datos, archivo?)
  - [ ] actualizarPeticion(id, datos)
  - [ ] cambiarEstadoPeticion(id, nuevoEstado)
  - [ ] asignarResponsable(id, usuarioId)
  - [ ] obtenerPeticionesCriticas() [para Dashboard]

- [ ] Reemplazar datos mockup en Dashboard:
  - KPI: Conectar a queries reales
  - Alertas: obtenerPeticionesCriticas()
  - Agenda: obtenerEventosDelDia()

### 8. Búsqueda Global
- [ ] Crear `app/api/search/route.ts`
  - Buscar en: peticiones (radicado, asunto), correspondencia, contratos
  - Query: Texto búsqueda
  - Resultado: Array de objetos con tipo, id, title, subtitle
  - Límite: 10 resultados

- [ ] Conectar Header search
  - Input onChange: Debounce 300ms
  - Dropdown resultados
  - Click: Navigate to detail

### 9. Mejoras UI/UX
- [ ] Toast notifications (usar `react-hot-toast` o similar)
  - [ ] Instalación: `npm install react-hot-toast`
  - [ ] Toast provider en layout.tsx
  - [ ] Usarlos en: Save success, Error messages, Upload complete

- [ ] Loading skeleton para tablas
  - [ ] Crear `components/shared/SkeletonTabla.tsx`
  - [ ] Usar en: Listado peticiones (mientras carga)

- [ ] Autocierre Sidebar móvil
  - [ ] Actualizar Sidebar.tsx: useRouter para detectar navegación
  - [ ] Cerrar drawer al hacer click en un item

### 10. Testing
- [ ] Validar flujo crear petición E2E
- [ ] Validar campos obligatorios (validación Zod)
- [ ] Validar cálculo de vencimiento
- [ ] Validar cambio de estado
- [ ] Validar carga de archivos
- [ ] Validar búsqueda

---

## 📊 Orden de Ejecución Recomendado

```
1. Tabla.tsx (genérica reutilizable)
   ↓
2. TablaP​eticiones.tsx (específica)
   ↓
3. FormularioPeticion.tsx (create/edit)
   ↓
4. app/peticiones/page.tsx (listado)
   ↓
5. app/peticiones/nuevo/page.tsx (crear)
   ↓
6. app/peticiones/[id]/page.tsx (detalle)
   ↓
7. API endpoints (GET, POST, PATCH, DELETE)
   ↓
8. Integración Supabase completa
   ↓
9. Dashboard conexión real
   ↓
10. Búsqueda global
    ↓
11. Mejoras UI/UX (toast, skeleton, etc)
    ↓
12. Testing exhaustivo
```

---

## 🎨 Diseño Visual (Mantener Paso 3)

- **Colores:** CSS variables de globals.css
- **Tipografía:** Sans + Mono (radicados)
- **Espaciado:** Consistente con spacing scale
- **Responsive:** Mobile 640px, Tablet 768px, Desktop 1024px+
- **Animaciones:** transition-base (0.2s ease-out)
- **Prints:** @media print hide buttons, keep content

---

## 🔌 Dependencias a Verificar

```bash
npm install
npm run build
npx supabase gen types typescript --linked  # Actualizar types.ts
```

---

## 📝 Documentación a Actualizar

- [ ] PASO3_COMPONENTES_BASE.md → Agregar sección "Próximos: Módulo Peticiones"
- [ ] INDICE_PROYECTO.md → Actualizar estado del módulo
- [ ] Crear MODULO_PETICIONES.md con detalles técnicos

---

## 🐛 Posibles Gotchas

1. **Radicado automático:** Necesita incrementar desde DB, no confiable si múltiples usuarios crean simultáneamente → Usar SEQUENCE de Supabase
2. **Cálculo vencimiento:** Mostrar preview exacto incluyendo festivos
3. **Upload archivos:** Validar tipo + tamaño cliente y servidor
4. **Cambio estado:** Registrar quién hizo cambio + timestamp en auditoría
5. **Búsqueda:** Performance si hay 10k+ peticiones → Agregar índices en Supabase

---

## ✨ Metas Paso 3.2

- [ ] 100% funcional módulo peticiones (CRUD)
- [ ] Integración real Supabase
- [ ] Dashboard con datos vivos
- [ ] Búsqueda global operativa
- [ ] Notificaciones email al asignar
- [ ] Reportes CSV funcionando
- [ ] Cero datos mockup en flujo crítico
- [ ] Responsive todas las pantallas
- [ ] Tests exploratorios completados

---

**Checklist preparado para Paso 3.2**
**Estado actual:** Paso 3 ✅ componentes base listos
**Próxima sesión:** Iniciar con punto 1 (Tabla.tsx)
