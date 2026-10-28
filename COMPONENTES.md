# Arquitectura de Componentes UI - SYNC DEEA

## Sistema de Componentes Reutilizables

### Core UI Components

#### 1. **Button**
- Variantes: `primary`, `secondary`, `danger`, `ghost`
- Tamaños: `sm`, `md`, `lg`
- Estados: `loading`, `disabled`
- Soporta iconos

#### 2. **Card**
- Contenedor de secciones
- Opción `noPadding` para tablas
- Sombra y border consistentes

#### 3. **Badge**
- Variantes: `success`, `warning`, `error`, `info`, `default`
- Para etiquetas y estados

#### 4. **Input**
- Text, email, password, date, number
- Validación con error state
- Helper text

#### 5. **Select**
- Dropdown con opciones
- Validación
- Support para múltiples tipos de datos

#### 6. **Header**
- Título de página
- Subtítulo
- Icono configurable
- Slot para acciones

#### 7. **KPICard**
- Métrica con valor
- Icono y color
- Indicador de tendencia (↑↓%)
- 7 variantes de color

#### 8. **Table**
- Renderizado genérico con TypeScript
- Sorting configurable
- Render custom por columna
- Click en filas
- Mensaje vacío configurable

#### 9. **Modal**
- Tamaños: `sm`, `md`, `lg`
- Header, contenido, footer
- Cerrar con X
- Acciones personalizables

#### 10. **Breadcrumb**
- Navegación de migas de pan
- Links navegables

#### 11. **FormField**
- Wrapper de input/select/textarea
- Label automático
- Validación
- Helper text
- Support para campos requeridos

#### 12. **Alert**
- Tipos: `success`, `error`, `warning`, `info`
- Dismissible
- Con ícono de tipo

#### 13. **Toast/Notification**
- Auto-dismiss
- Tipos: success, error, warning, info
- Stack de notificaciones

#### 14. **Skeleton**
- Componentes de carga
- SkeletonLine, SkeletonCard, SkeletonTable

---

## Paleta de Colores Institucional

```typescript
Primary: #1F4E5F (Azul institucional)
Secondary: #E9EBE6 (Gris papel)
Tinta: #131A24 (Gris oscuro)

Semáforo:
- Verde: #2E7D4F (Completado)
- Ámbar: #B87708 (Atención)
- Rojo: #B3261E (Crítico)
```

---

## Módulos Implementados

### 1. Dashboard Ejecutivo
- 4 KPIs en tiempo real
- Actividades recientes
- Próximos vencimientos

### 2. Derechos de Petición
- Listado con Table
- Modal de detalles
- Formulario de radicación nueva
- Breadcrumb navigation
- Alert de estado crítico

### 3. Correspondencia
- Registro de entrada/salida
- Filtros por tipo
- Búsqueda

### 4. Contratación Pública
- Seguimiento de contratos
- Progreso de ejecución
- Estados (En ejecución, Terminado)

### 5. Pendientes
- Gestión de tareas
- Prioridades (Alta, Media, Baja)
- Asignación a equipos

### 6. Agenda
- Calendario de eventos
- Tipos: Reunión, Vencimiento, Hito
- Participantes

---

## Rutas Disponibles

```
/dashboard                          # Dashboard principal
/dashboard/peticiones               # Listado de peticiones
/dashboard/peticiones/nueva         # Crear petición
/dashboard/correspondencia          # Correspondencia
/dashboard/contratos                # Contratos
/dashboard/pendientes               # Tareas
/dashboard/agenda                   # Calendario
```

---

## Patrones de Uso

### Button
```tsx
<Button size="md" variant="primary" onClick={handleClick}>
  <Plus size={20} />
  Acción
</Button>
```

### Table
```tsx
<Table
  columns={[
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre' }
  ]}
  data={items}
  rowKey="id"
  onRowClick={handleSelect}
/>
```

### FormField
```tsx
<FormField
  label="Nombre"
  name="nombre"
  value={formData.nombre}
  onChange={(val) => setFormData({...formData, nombre: val})}
  required
  placeholder="Ej: Juan Pérez"
/>
```

### Modal
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Detalles"
  size="lg"
>
  Contenido aquí
</Modal>
```

---

## Próximas Integraciones

- [ ] Conectar KPI values a queries de Supabase
- [ ] Implementar búsqueda en tiempo real
- [ ] Filtros avanzados por fecha
- [ ] Exportación a Excel/PDF
- [ ] Cron job para alertas diarias
- [ ] Sistema de roles y permisos
- [ ] Notificaciones con Resend
