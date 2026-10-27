-- ============================================================================
-- SYNC DEEA GOVTECH - PARTE 2: AGENDA, PENDIENTES Y CONFIGURACIÓN
-- ============================================================================

-- ============================================================================
-- 8. TABLAS AGENDA Y REUNIONES
-- ============================================================================

CREATE TABLE public.agenda_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_evento TEXT NOT NULL, -- 'Reunión', 'Vencimiento petición', 'Vencimiento contrato', 'Entrega proyecto', 'Otra'
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  ubicacion TEXT,
  estado_evento estado_agenda DEFAULT 'Programado',
  responsable_principal UUID REFERENCES public.usuarios(id),
  participantes UUID[], -- Array de IDs de usuarios
  emails_participantes TEXT[],
  orden_del_dia TEXT, -- Para reuniones
  acta_url TEXT,
  acta_storage_path TEXT,
  acuerdos_tomados TEXT,
  tareas_asignadas TEXT,
  
  -- Vinculación a otros módulos
  peticion_vinculada UUID REFERENCES public.peticiones(id),
  contrato_vinculado UUID REFERENCES public.contratos(id),
  proyecto_vinculado UUID REFERENCES public.proyectos_banco(id),
  
  recordatorio_habilitado BOOLEAN DEFAULT true,
  recordatorio_minutos INTEGER DEFAULT 1440, -- 1 día antes
  
  requiere_asistencia BOOLEAN DEFAULT false,
  asistencia_confirmada INTEGER DEFAULT 0,
  asistencia_total_esperada INTEGER,
  
  creado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agenda_fecha ON public.agenda_eventos(fecha_inicio);
CREATE INDEX idx_agenda_responsable ON public.agenda_eventos(responsable_principal);
CREATE INDEX idx_agenda_estado ON public.agenda_eventos(estado_evento);
CREATE INDEX idx_agenda_peticion ON public.agenda_eventos(peticion_vinculada);
CREATE INDEX idx_agenda_contrato ON public.agenda_eventos(contrato_vinculado);
CREATE INDEX idx_agenda_proyecto ON public.agenda_eventos(proyecto_vinculado);

-- ============================================================================
-- 9. TABLAS PENDIENTES Y TAREAS DEL EQUIPO
-- ============================================================================

CREATE TABLE public.pendientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  prioridad prioridad DEFAULT 'Media',
  estado_pendiente estado_pendiente DEFAULT 'Pendiente',
  fecha_vencimiento DATE,
  responsable_asignado UUID REFERENCES public.usuarios(id),
  
  -- Vinculación a otros módulos
  peticion_vinculada UUID REFERENCES public.peticiones(id),
  contrato_vinculado UUID REFERENCES public.contratos(id),
  proyecto_vinculado UUID REFERENCIAS public.proyectos_banco(id),
  
  porcentaje_completado DECIMAL(5, 2) DEFAULT 0,
  notas TEXT,
  creado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_completado DATE
);

CREATE INDEX idx_pendientes_responsable ON public.pendientes(responsable_asignado);
CREATE INDEX idx_pendientes_estado ON public.pendientes(estado_pendiente);
CREATE INDEX idx_pendientes_vencimiento ON public.pendientes(fecha_vencimiento);
CREATE INDEX idx_pendientes_prioridad ON public.pendientes(prioridad);

-- ============================================================================
-- 10. CONFIGURACIÓN DEL SISTEMA
-- ============================================================================

-- Términos legales parametrizables
CREATE TABLE public.terminos_legales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_termino TEXT NOT NULL UNIQUE,
  tipo_peticion tipo_peticion,
  dias_habiles INTEGER NOT NULL,
  descripcion TEXT,
  fundamento_legal TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_terminos_tipo ON public.terminos_legales(tipo_peticion);

-- Festivos de Colombia (tabla de referencia)
CREATE TABLE public.festivos_colombia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL UNIQUE,
  nombre_festivo TEXT NOT NULL,
  tipo_festivo TEXT, -- 'Fijo', 'Móvil', 'Decreto'
  decreto_número TEXT,
  año INTEGER NOT NULL,
  aplica_puente_festivo BOOLEAN DEFAULT false,
  fecha_puente DATE,
  notas TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_festivos_fecha ON public.festivos_colombia(fecha);
CREATE INDEX idx_festivos_año ON public.festivos_colombia(año);

-- Configuración global de la Secretaría
CREATE TABLE public.configuracion_secretaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_institucion TEXT DEFAULT 'Secretaría de Desarrollo Económico, Empresarial y Agrícola',
  nombre_municipio TEXT DEFAULT 'Montelíbano',
  departamento_municipio TEXT DEFAULT 'Córdoba',
  direccion_sede TEXT,
  email_contacto TEXT,
  telefono_contacto TEXT,
  logo_url TEXT,
  logo_storage_path TEXT,
  
  -- Configuración de correspondencia
  prefijo_entrada TEXT DEFAULT 'E',
  prefijo_salida TEXT DEFAULT 'S',
  año_actual INTEGER,
  contador_entrada_anual INTEGER DEFAULT 0,
  contador_salida_anual INTEGER DEFAULT 0,
  
  -- Configuración de peticiones
  hora_corte_dia_habil TIME DEFAULT '23:59:59',
  generar_alerta_ambar BOOLEAN DEFAULT true,
  dias_umbral_ambar INTEGER DEFAULT 5,
  generar_alerta_rojo BOOLEAN DEFAULT true,
  dias_umbral_rojo INTEGER DEFAULT 2,
  
  -- Configuración de emails
  email_notificaciones TEXT,
  remitente_email TEXT,
  smtp_configurado BOOLEAN DEFAULT false,
  resend_api_key TEXT,
  
  -- Impresión oficial
  membrete_activo BOOLEAN DEFAULT true,
  incluir_qr_radicado BOOLEAN DEFAULT true,
  incluir_codigo_barras BOOLEAN DEFAULT false,
  
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plantillas de términos predefinidos
CREATE TABLE public.plantillas_respuesta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_plantilla TEXT NOT NULL,
  tipo_peticion tipo_peticion NOT NULL,
  contenido_plantilla TEXT NOT NULL,
  variables_disponibles TEXT[], -- Array de variables como {{solicitante}}, {{asunto}}, {{fecha_vencimiento}}
  activa BOOLEAN DEFAULT true,
  creado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Logs de auditoría
CREATE TABLE public.auditoria_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id),
  tabla_afectada TEXT NOT NULL,
  registro_id UUID,
  tipo_operacion TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  valores_anteriores JSONB,
  valores_nuevos JSONB,
  ip_direccion TEXT,
  user_agent TEXT,
  fecha_operacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_usuario ON public.auditoria_logs(usuario_id);
CREATE INDEX idx_auditoria_tabla ON public.auditoria_logs(tabla_afectada);
CREATE INDEX idx_auditoria_fecha ON public.auditoria_logs(fecha_operacion);

-- ============================================================================
-- 11. TABLAS PARA RASTREO DE CONSECUTIVOS
-- ============================================================================

CREATE TABLE public.consecutivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_consecutivo TEXT NOT NULL UNIQUE, -- 'entrada', 'salida', 'peticion'
  año INTEGER NOT NULL,
  proximo_numero INTEGER DEFAULT 1,
  prefijo TEXT,
  sufijo TEXT,
  longitud_numero INTEGER DEFAULT 4,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(tipo_consecutivo, año)
);

CREATE INDEX idx_consecutivos_tipo_año ON public.consecutivos(tipo_consecutivo, año);

-- ============================================================================
-- 12. NOTIFICACIONES Y HISTORIAL DE EMAILS
-- ============================================================================

CREATE TABLE public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo_notificacion TEXT NOT NULL, -- 'asignacion', 'vencimiento', 'reunion', 'tarea'
  titulo TEXT NOT NULL,
  descripcion TEXT,
  link_relacionado TEXT, -- URL a la vista relacionada (/peticiones/id, /contratos/id, etc.)
  leida BOOLEAN DEFAULT false,
  fecha_lectura TIMESTAMP WITH TIME ZONE,
  
  -- Vinculación
  peticion_id UUID REFERENCES public.peticiones(id),
  contrato_id UUID REFERENCES public.contratos(id),
  agenda_id UUID REFERENCES public.agenda_eventos(id),
  
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notificaciones_usuario ON public.notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON public.notificaciones(leida);

CREATE TABLE public.historial_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destinatario_email TEXT NOT NULL,
  asunto TEXT NOT NULL,
  tipo_email TEXT, -- 'asignacion', 'resumen_diario', 'alerta_vencimiento', 'citacion_reunion'
  cuerpo_html TEXT,
  estado_envio TEXT DEFAULT 'enviado', -- 'pendiente', 'enviado', 'fallido', 'rebotado'
  mensaje_error TEXT,
  
  usuario_id UUID REFERENCES public.usuarios(id),
  peticion_id UUID REFERENCES public.peticiones(id),
  contrato_id UUID REFERENCES public.contratos(id),
  agenda_id UUID REFERENCES public.agenda_eventos(id),
  
  fecha_intento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  intentos INTEGER DEFAULT 1
);

CREATE INDEX idx_emails_destinatario ON public.historial_emails(destinatario_email);
CREATE INDEX idx_emails_estado ON public.historial_emails(estado_envio);
CREATE INDEX idx_emails_fecha ON public.historial_emails(fecha_intento);

-- ============================================================================
-- 13. FUNCIONES Y TRIGGERS PARA LÓGICA DE NEGOCIO
-- ============================================================================

-- Función para calcular semáforo de petición
CREATE OR REPLACE FUNCTION public.actualizar_semaforo_peticion()
RETURNS TRIGGER AS $$
DECLARE
  dias_restantes INTEGER;
BEGIN
  dias_restantes := NEW.fecha_vencimiento - CURRENT_DATE;
  
  IF NEW.estado = 'Respondido' OR NEW.estado = 'Archivo' THEN
    NEW.semaforo := 'Verde';
  ELSIF dias_restantes < 0 THEN
    NEW.semaforo := 'Vencido';
  ELSIF dias_restantes <= 2 THEN
    NEW.semaforo := 'Rojo';
  ELSIF dias_restantes <= 5 THEN
    NEW.semaforo := 'Ámbar';
  ELSE
    NEW.semaforo := 'Verde';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_semaforo_peticion
BEFORE INSERT OR UPDATE ON public.peticiones
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_semaforo_peticion();

-- Función para calcular semáforo de contrato
CREATE OR REPLACE FUNCTION public.actualizar_semaforo_contrato()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_terminacion_pactada IS NOT NULL THEN
    IF (NEW.fecha_terminacion_pactada - CURRENT_DATE) < 0 THEN
      NEW.estado_contrato := 'Terminado';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_semaforo_contrato
BEFORE UPDATE ON public.contratos
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_semaforo_contrato();

-- Función para registrar cambios en auditoría
CREATE OR REPLACE FUNCTION public.registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.auditoria_logs (usuario_id, tabla_afectada, registro_id, tipo_operacion, valores_anteriores, valores_nuevos)
    VALUES (
      COALESCE((current_setting('app.usuario_id', true))::uuid, NULL),
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.auditoria_logs (usuario_id, tabla_afectada, registro_id, tipo_operacion, valores_nuevos)
    VALUES (
      COALESCE((current_setting('app.usuario_id', true))::uuid, NULL),
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.auditoria_logs (usuario_id, tabla_afectada, registro_id, tipo_operacion, valores_anteriores)
    VALUES (
      COALESCE((current_setting('app.usuario_id', true))::uuid, NULL),
      TG_TABLE_NAME,
      OLD.id,
      TG_OP,
      to_jsonb(OLD)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoría a tablas principales
CREATE TRIGGER audit_peticiones AFTER INSERT OR UPDATE OR DELETE ON public.peticiones
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

CREATE TRIGGER audit_contratos AFTER INSERT OR UPDATE OR DELETE ON public.contratos
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

CREATE TRIGGER audit_correspondencia_entrada AFTER INSERT OR UPDATE OR DELETE ON public.correspondencia_entrada
FOR EACH ROW EXECUTE FUNCTION public.registrar_auditoria();

-- Función para generar radicados automáticos
CREATE OR REPLACE FUNCTION public.generar_proximo_radicado(p_tipo TEXT)
RETURNS TEXT AS $$
DECLARE
  v_año INTEGER;
  v_contador INTEGER;
  v_prefijo TEXT;
  v_radicado TEXT;
BEGIN
  v_año := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  
  -- Obtener prefijo según tipo
  CASE p_tipo
    WHEN 'entrada' THEN v_prefijo := 'E';
    WHEN 'salida' THEN v_prefijo := 'S';
    ELSE v_prefijo := p_tipo;
  END CASE;
  
  -- Actualizar y obtener contador
  UPDATE public.consecutivos 
  SET proximo_numero = proximo_numero + 1,
      fecha_actualizacion = CURRENT_TIMESTAMP
  WHERE tipo_consecutivo = p_tipo AND año = v_año
  RETURNING proximo_numero INTO v_contador;
  
  -- Si no existe el registro, crearlo
  IF v_contador IS NULL THEN
    INSERT INTO public.consecutivos (tipo_consecutivo, año, proximo_numero, prefijo)
    VALUES (p_tipo, v_año, 2)
    RETURNING proximo_numero INTO v_contador;
    v_contador := 1;
  END IF;
  
  -- Generar radicado
  v_radicado := v_prefijo || '-' || v_año || '-' || LPAD(v_contador::TEXT, 4, '0');
  
  RETURN v_radicado;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION public.actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de actualización de fecha
CREATE TRIGGER update_fecha_peticiones BEFORE UPDATE ON public.peticiones
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();

CREATE TRIGGER update_fecha_contratos BEFORE UPDATE ON public.contratos
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();

CREATE TRIGGER update_fecha_correspondencia_entrada BEFORE UPDATE ON public.correspondencia_entrada
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();

CREATE TRIGGER update_fecha_correspondencia_salida BEFORE UPDATE ON public.correspondencia_salida
FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();

-- ============================================================================
-- 14. VISTAS MATERIALIZADAS PARA REPORTES
-- ============================================================================

CREATE VIEW public.v_peticiones_criticas AS
SELECT 
  id, radicado, solicitante_nombre, asunto, fecha_vencimiento, 
  responsable_asignado, semaforo, estado, dias_restantes
FROM (
  SELECT 
    id, radicado, solicitante_nombre, asunto, fecha_vencimiento, 
    responsable_asignado, semaforo, estado,
    (fecha_vencimiento - CURRENT_DATE) AS dias_restantes
  FROM public.peticiones
  WHERE estado != 'Respondido' AND estado != 'Archivo'
) AS subquery
WHERE semaforo IN ('Ámbar', 'Rojo', 'Vencido')
ORDER BY dias_restantes ASC;

CREATE VIEW public.v_contratos_por_vencer AS
SELECT 
  id, numero_contrato, contratista_nombre, valor_total, fecha_terminacion_pactada,
  (fecha_terminacion_pactada - CURRENT_DATE) AS dias_restantes,
  supervisor_asignado, estado_contrato
FROM public.contratos
WHERE estado_contrato NOT IN ('Terminado', 'Cancelado')
  AND fecha_terminacion_pactada IS NOT NULL
  AND (fecha_terminacion_pactada - CURRENT_DATE) <= 30
ORDER BY fecha_terminacion_pactada ASC;

CREATE VIEW public.v_proyectos_por_hito AS
SELECT 
  p.id, p.nombre_proyecto, h.nombre_hito, h.fecha_fin_pactada,
  (h.fecha_fin_pactada - CURRENT_DATE) AS dias_restantes,
  h.porcentaje_completado, h.responsable, h.estado
FROM public.proyectos_banco p
JOIN public.hitos_proyecto h ON p.id = h.proyecto_id
WHERE h.estado != 'Terminado'
ORDER BY h.fecha_fin_pactada ASC;

CREATE VIEW public.v_kpi_resumen_ejecutivo AS
SELECT 
  (SELECT COUNT(*) FROM public.peticiones WHERE semaforo IN ('Rojo', 'Vencido')) AS peticiones_vencidas,
  (SELECT COUNT(*) FROM public.peticiones WHERE semaforo = 'Ámbar') AS peticiones_criticas,
  (SELECT COUNT(*) FROM public.peticiones WHERE estado = 'Recibido' OR estado = 'En trámite') AS peticiones_abiertas,
  (SELECT COUNT(*) FROM public.agenda_eventos WHERE fecha_inicio >= CURRENT_DATE AND fecha_inicio < CURRENT_DATE + INTERVAL '1 day') AS reuniones_hoy,
  (SELECT COUNT(*) FROM public.agenda_eventos WHERE fecha_inicio >= CURRENT_DATE AND fecha_inicio < CURRENT_DATE + INTERVAL '7 days') AS reuniones_proxima_semana,
  (SELECT COUNT(*) FROM public.contratos WHERE estado_contrato = 'En ejecución') AS contratos_activos,
  (SELECT SUM(valor_total) FROM public.contratos WHERE estado_contrato = 'En ejecución') AS valor_contratos_activos,
  (SELECT SUM(pago_total_realizado) / SUM(valor_total) * 100 FROM public.contratos WHERE estado_contrato = 'En ejecución') AS ejecucion_presupuestal_promedio;
