-- ============================================================================
-- SYNC DEEA GOVTECH - PARTE 3: ROW LEVEL SECURITY (RLS) Y DATOS INICIALES
-- ============================================================================

-- ============================================================================
-- 15. HABILITAR RLS EN TABLAS
-- ============================================================================

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peticiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correspondencia_entrada ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correspondencia_salida ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_contrato ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuentas_cobro_pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos_banco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hitos_proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asociaciones_rurales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_productivas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emprendedores ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 16. POLÍTICAS RLS
-- ============================================================================

-- USUARIOS: Los usuarios ven su propio perfil; admins ven todos
CREATE POLICY "usuarios_ver_propio" ON public.usuarios
FOR SELECT USING (
  auth.uid() = id OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "usuarios_actualizar_propio" ON public.usuarios
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- PETICIONES: Todos ven, pero solo responsable y admin pueden editar
CREATE POLICY "peticiones_ver_todas" ON public.peticiones
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

CREATE POLICY "peticiones_crear" ON public.peticiones
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional')
);

CREATE POLICY "peticiones_editar_responsable_admin" ON public.peticiones
FOR UPDATE USING (
  responsable_asignado = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
)
WITH CHECK (
  responsable_asignado = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
);

-- CORRESPONDENCIA_ENTRADA: Similar a peticiones
CREATE POLICY "entrada_ver_todas" ON public.correspondencia_entrada
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

CREATE POLICY "entrada_crear" ON public.correspondencia_entrada
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'asistente')
);

CREATE POLICY "entrada_editar" ON public.correspondencia_entrada
FOR UPDATE USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario') OR
  registrado_por = auth.uid()
)
WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario') OR
  registrado_por = auth.uid()
);

-- CORRESPONDENCIA_SALIDA: Similar
CREATE POLICY "salida_ver_todas" ON public.correspondencia_salida
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

CREATE POLICY "salida_crear" ON public.correspondencia_salida
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional')
);

CREATE POLICY "salida_editar" ON public.correspondencia_salida
FOR UPDATE USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario') OR
  responsable_elaboracion = auth.uid()
)
WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario') OR
  responsable_elaboracion = auth.uid()
);

-- CONTRATOS: Solo profesionales con rol supervisor o admin
CREATE POLICY "contratos_ver_todas" ON public.contratos
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'supervisor_contrato', 'profesional')
);

CREATE POLICY "contratos_crear" ON public.contratos
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'supervisor_contrato')
);

CREATE POLICY "contratos_editar" ON public.contratos
FOR UPDATE USING (
  supervisor_asignado = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
)
WITH CHECK (
  supervisor_asignado = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
);

-- AGENDA_EVENTOS
CREATE POLICY "agenda_ver_todas" ON public.agenda_eventos
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
  OR auth.uid() = ANY(participantes)
);

CREATE POLICY "agenda_crear" ON public.agenda_eventos
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional')
);

CREATE POLICY "agenda_editar" ON public.agenda_eventos
FOR UPDATE USING (
  responsable_principal = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
)
WITH CHECK (
  responsable_principal = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
);

-- PENDIENTES
CREATE POLICY "pendientes_ver_asignadas_o_creadas" ON public.pendientes
FOR SELECT USING (
  responsable_asignado = auth.uid() OR
  creado_por = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
);

CREATE POLICY "pendientes_crear" ON public.pendientes
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional')
);

CREATE POLICY "pendientes_editar" ON public.pendientes
FOR UPDATE USING (
  responsable_asignado = auth.uid() OR
  creado_por = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
)
WITH CHECK (
  responsable_asignado = auth.uid() OR
  creado_por = auth.uid() OR
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario')
);

-- NOTIFICACIONES: Solo ver las propias
CREATE POLICY "notificaciones_ver_propias" ON public.notificaciones
FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "notificaciones_actualizar_propias" ON public.notificaciones
FOR UPDATE USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

-- AUDITORIA: Solo admin
CREATE POLICY "auditoria_solo_admin" ON public.auditoria_logs
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'admin'
);

-- DESARROLLO ECONÓMICO MISIONAL (productores, asociaciones, etc.)
CREATE POLICY "productores_ver_todas" ON public.productores
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

CREATE POLICY "productores_crear" ON public.productores
FOR INSERT WITH CHECK (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional')
);

CREATE POLICY "asociaciones_ver_todas" ON public.asociaciones_rurales
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

CREATE POLICY "unidades_ver_todas" ON public.unidades_productivas
FOR SELECT USING (
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('admin', 'secretario', 'funcionario', 'profesional', 'asistente')
);

-- ============================================================================
-- 17. DATOS INICIALES
-- ============================================================================

-- Términos legales base (Art. 14, Ley 1755 de 2015)
INSERT INTO public.terminos_legales (nombre_termino, tipo_peticion, dias_habiles, descripcion, fundamento_legal, activo)
VALUES
  ('Petición general', 'Petición general', 15, 'Término para responder peticiones generales', 'Ley 1755 de 2015, Art. 14', true),
  ('Documentos e información', 'Documentos e información', 10, 'Acceso a documentos e información', 'Ley 1755 de 2015, Art. 14', true),
  ('Consulta jurídica', 'Consulta jurídica', 30, 'Consultas jurídicas especializadas', 'Ley 1755 de 2015, Art. 14', true),
  ('Solicitud de congresista', 'Solicitud de congresista', 5, 'Solicitudes de congresista (Ley 5ª/1992)', 'Ley 5ª de 1992', true),
  ('Acción de tutela', 'Acción de tutela', 2, 'Término para acción de tutela', 'CPC, Art. 86', true),
  ('PQRS', 'PQRS', 15, 'Peticiones, Quejas, Reclamos y Sugerencias', 'Decreto 1083 de 2015', true);

-- Festivos de Colombia 2024-2025 (muestra)
INSERT INTO public.festivos_colombia (fecha, nombre_festivo, tipo_festivo, año, aplica_puente_festivo)
VALUES
  ('2024-01-01', 'Año Nuevo', 'Fijo', 2024, false),
  ('2024-01-08', 'Epifanía (trasladado)', 'Móvil', 2024, false),
  ('2024-03-25', 'Lunes de Carnaval', 'Móvil', 2024, false),
  ('2024-03-28', 'Jueves Santo', 'Móvil', 2024, false),
  ('2024-03-29', 'Viernes Santo', 'Móvil', 2024, false),
  ('2024-05-01', 'Día del Trabajo', 'Fijo', 2024, false),
  ('2024-05-13', 'Ascensión del Señor', 'Móvil', 2024, false),
  ('2024-06-03', 'Corpus Christi', 'Móvil', 2024, false),
  ('2024-06-10', 'Sagrado Corazón', 'Móvil', 2024, false),
  ('2024-07-01', 'San Pedro y San Pablo', 'Fijo', 2024, false),
  ('2024-07-29', 'Santa Marta y Santiago Apóstol (trasladado)', 'Móvil', 2024, false),
  ('2024-08-07', 'Batalla de Boyacá', 'Fijo', 2024, false),
  ('2024-08-15', 'Asunción de María', 'Fijo', 2024, false),
  ('2024-11-01', 'Todos los Santos', 'Fijo', 2024, false),
  ('2024-11-11', 'Independencia de Cartagena', 'Fijo', 2024, false),
  ('2024-12-08', 'Inmaculada Concepción', 'Fijo', 2024, false),
  ('2024-12-25', 'Navidad', 'Fijo', 2024, false),
  ('2025-01-01', 'Año Nuevo', 'Fijo', 2025, false),
  ('2025-01-06', 'Epifanía (trasladado)', 'Móvil', 2025, false),
  ('2025-04-14', 'Lunes de Carnaval', 'Móvil', 2025, false),
  ('2025-04-17', 'Jueves Santo', 'Móvil', 2025, false),
  ('2025-04-18', 'Viernes Santo', 'Móvil', 2025, false),
  ('2025-05-01', 'Día del Trabajo', 'Fijo', 2025, false),
  ('2025-05-02', 'San José (trasladado)', 'Móvil', 2025, false),
  ('2025-05-26', 'Ascensión del Señor', 'Móvil', 2025, false),
  ('2025-06-23', 'Corpus Christi', 'Móvil', 2025, false),
  ('2025-06-30', 'Sagrado Corazón', 'Móvil', 2025, false),
  ('2025-07-01', 'San Pedro y San Pablo', 'Fijo', 2025, false),
  ('2025-07-07', 'San Pedro y San Pablo (trasladado)', 'Móvil', 2025, false),
  ('2025-08-07', 'Batalla de Boyacá', 'Fijo', 2025, false),
  ('2025-08-15', 'Asunción de María', 'Fijo', 2025, false),
  ('2025-10-12', 'Descubrimiento de América', 'Fijo', 2025, false),
  ('2025-11-01', 'Todos los Santos', 'Fijo', 2025, false),
  ('2025-11-03', 'Todos los Santos (trasladado)', 'Móvil', 2025, false),
  ('2025-11-11', 'Independencia de Cartagena', 'Fijo', 2025, false),
  ('2025-12-01', 'Inmaculada Concepción (trasladado)', 'Móvil', 2025, false),
  ('2025-12-08', 'Inmaculada Concepción', 'Fijo', 2025, false),
  ('2025-12-25', 'Navidad', 'Fijo', 2025, false);

-- Configuración inicial de la Secretaría
INSERT INTO public.configuracion_secretaria (
  nombre_institucion,
  nombre_municipio,
  departamento_municipio,
  prefijo_entrada,
  prefijo_salida,
  año_actual
)
VALUES (
  'Secretaría de Desarrollo Económico, Empresarial y Agrícola',
  'Montelíbano',
  'Córdoba',
  'E',
  'S',
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
);

-- Inicializar consecutivos para el año actual
INSERT INTO public.consecutivos (tipo_consecutivo, año, proximo_numero, prefijo)
VALUES
  ('entrada', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 1, 'E'),
  ('salida', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 1, 'S'),
  ('peticion', EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 1, 'P')
ON CONFLICT (tipo_consecutivo, año) DO NOTHING;

-- Plantillas de respuesta predefinidas
INSERT INTO public.plantillas_respuesta (nombre_plantilla, tipo_peticion, contenido_plantilla, variables_disponibles, activa)
VALUES
  (
    'Respuesta estándar Petición general',
    'Petición general',
    'Ciudadano(a) {{solicitante}},

Ref: {{radicado}} - {{asunto}}

En atención a su solicitud radicada el {{fecha_radicacion}} y con término de respuesta al {{fecha_vencimiento}}, informamos lo siguiente:

{{contenido_respuesta}}

Cordialmente,

Secretaría de Desarrollo Económico, Empresarial y Agrícola
Alcaldía Municipal de Montelíbano, Córdoba',
    ARRAY['{{solicitante}}', '{{radicado}}', '{{asunto}}', '{{fecha_radicacion}}', '{{fecha_vencimiento}}', '{{contenido_respuesta}}'],
    true
  ),
  (
    'Respuesta estándar Documentos e Información',
    'Documentos e información',
    'Ciudadano(a) {{solicitante}},

Ref: {{radicado}} - {{asunto}}

En respuesta a su solicitud de información radicada bajo el folio {{radicado}} el {{fecha_radicacion}}, informamos que:

{{contenido_respuesta}}

Los documentos solicitados se adjuntan al presente oficio.

Cordialmente,

Secretaría de Desarrollo Económico, Empresarial y Agrícola
Alcaldía Municipal de Montelíbano, Córdoba',
    ARRAY['{{solicitante}}', '{{radicado}}', '{{asunto}}', '{{fecha_radicacion}}', '{{contenido_respuesta}}'],
    true
  );

-- ============================================================================
-- 18. ÍNDICES ADICIONALES PARA RENDIMIENTO
-- ============================================================================

CREATE INDEX idx_peticiones_responsable_estado ON public.peticiones(responsable_asignado, estado);
CREATE INDEX idx_peticiones_semaforo_vencimiento ON public.peticiones(semaforo, fecha_vencimiento);
CREATE INDEX idx_contratos_supervisor_estado ON public.contratos(supervisor_asignado, estado_contrato);
CREATE INDEX idx_contratos_valor_ejecucion ON public.contratos(valor_total, porcentaje_ejecucion_financiera);
CREATE INDEX idx_agenda_participantes ON public.agenda_eventos USING GIN(participantes);
CREATE INDEX idx_pendientes_responsable_estado ON public.pendientes(responsable_asignado, estado_pendiente);
CREATE INDEX idx_correspondencia_entrada_año ON public.correspondencia_entrada((EXTRACT(YEAR FROM fecha_recepcion)));
CREATE INDEX idx_correspondencia_salida_año ON public.correspondencia_salida((EXTRACT(YEAR FROM fecha_elaboracion)));

-- ============================================================================
-- 19. COMENTARIOS DESCRIPTIVOS
-- ============================================================================

COMMENT ON TABLE public.peticiones IS 'Registro central de Derechos de Petición (PQRSD) y solicitudes ciudadanas según Ley 1755 de 2015';
COMMENT ON TABLE public.correspondencia_entrada IS 'Correspondencia oficial recibida por la Secretaría';
COMMENT ON TABLE public.correspondencia_salida IS 'Correspondencia oficial expedida por la Secretaría';
COMMENT ON TABLE public.contratos IS 'Registro de contratos públicos y su ejecución presupuestal';
COMMENT ON TABLE public.proyectos_banco IS 'Banco de proyectos de la Secretaría de Desarrollo Económico';
COMMENT ON TABLE public.agenda_eventos IS 'Calendario unificado de eventos, reuniones y vencimientos';
COMMENT ON TABLE public.productores IS 'Base de datos de pequeños productores agropecuarios';
COMMENT ON TABLE public.festivos_colombia IS 'Calendario de festivos de Colombia (Ley 51 de 1983)';

COMMENT ON COLUMN public.peticiones.semaforo IS 'Estado de urgencia calculado automáticamente: Verde (>5 días), Ámbar (≤5 días), Rojo (≤2 días), Vencido';
COMMENT ON COLUMN public.peticiones.dias_habiles_termino IS 'Días hábiles según Art. 14 Ley 1755/2015, descontando sábados, domingos y festivos';
COMMENT ON COLUMN public.contratos.porcentaje_ejecucion_financiera IS 'Porcentaje del presupuesto ejecutado: (pago_total_realizado / valor_total) * 100';
COMMENT ON COLUMN public.contratos.porcentaje_ejecucion_fisica IS 'Porcentaje de avance físico del contrato (0-100)';
