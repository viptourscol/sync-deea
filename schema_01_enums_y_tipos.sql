-- ============================================================================
-- SYNC DEEA GOVTECH - ESQUEMA SQL PARA SUPABASE
-- Secretaría de Desarrollo Económico, Empresarial y Agrícola
-- Alcaldía Municipal de Montelíbano, Córdoba - Colombia
-- ============================================================================

-- ============================================================================
-- 1. ENUMS Y TIPOS PERSONALIZADOS
-- ============================================================================

CREATE TYPE estado_peticion AS ENUM ('Recibido', 'En trámite', 'Respondido', 'Archivo');
CREATE TYPE tipo_peticion AS ENUM ('Petición general', 'Documentos e información', 'Consulta jurídica', 'Solicitud de congresista', 'Acción de tutela', 'PQRS');
CREATE TYPE tipo_correspondencia AS ENUM ('Oficio', 'Memorando', 'Circular', 'Informe', 'Nota', 'Certificación');
CREATE TYPE medio_recepcion AS ENUM ('Presencial', 'Email', 'Plataforma digital', 'Sistema de Información', 'Correspondencia física');
CREATE TYPE medio_envio AS ENUM ('Presencial', 'Email', 'Plataforma digital', 'Correspondencia física', 'Mensajería', 'Certificado');
CREATE TYPE tipo_contrato AS ENUM ('Mínima cuantía', 'Prestación de servicios', 'Suministros', 'Convenio de asociación', 'Convenio solidario');
CREATE TYPE estado_contrato AS ENUM ('Planeación', 'Por licitar', 'En licitación', 'Adjudicado', 'En ejecución', 'Terminado', 'Cancelado');
CREATE TYPE estado_ejecucion AS ENUM ('No iniciado', 'En ejecución', 'Suspendido', 'Terminado');
CREATE TYPE prioridad AS ENUM ('Alta', 'Media', 'Baja');
CREATE TYPE rol_usuario AS ENUM ('admin', 'secretario', 'funcionario', 'profesional', 'asistente', 'supervisor_contrato', 'visor');
CREATE TYPE estado_agenda AS ENUM ('Programado', 'Realizado', 'Cancelado', 'Reprogramado');
CREATE TYPE estado_pendiente AS ENUM ('Pendiente', 'En progreso', 'Completado', 'Archivado');
CREATE TYPE semaforo AS ENUM ('Verde', 'Ámbar', 'Rojo', 'Vencido');

-- ============================================================================
-- 2. TABLAS BASE: USUARIOS Y ROLES
-- ============================================================================

CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre_completo TEXT NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'visor',
  departamento TEXT,
  cargo TEXT,
  telefono TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_usuarios_rol ON public.usuarios(rol);
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_activo ON public.usuarios(activo);

-- ============================================================================
-- 3. TABLAS MISIONALES: DESARROLLO ECONÓMICO, EMPRESARIAL Y AGRÍCOLA
-- ============================================================================

-- Pequeños productores agropecuarios
CREATE TABLE public.productores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_productor TEXT NOT NULL,
  cedula_productor TEXT NOT NULL UNIQUE,
  telefono TEXT,
  email TEXT,
  vereda TEXT NOT NULL,
  municipio TEXT DEFAULT 'Montelíbano',
  departamento TEXT DEFAULT 'Córdoba',
  cultivo_actividad_pecuaria TEXT NOT NULL,
  area_hectareas DECIMAL(10, 2),
  certificaciones TEXT,
  estado BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  registrado_por UUID REFERENCES public.usuarios(id),
  notas TEXT
);

CREATE INDEX idx_productores_vereda ON public.productores(vereda);
CREATE INDEX idx_productores_cultivo ON public.productores(cultivo_actividad_pecuaria);

-- Asociaciones rurales
CREATE TABLE public.asociaciones_rurales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_asociacion TEXT NOT NULL UNIQUE,
  nit TEXT NOT NULL UNIQUE,
  representante_legal TEXT NOT NULL,
  cedula_representante TEXT NOT NULL,
  telefono_contacto TEXT,
  email_contacto TEXT,
  tipo_asociacion TEXT, -- Junta, Asociación, Cooperativa, etc.
  numero_asociados INTEGER,
  vereda_principal TEXT,
  fecha_constitucion DATE,
  estado BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  registrado_por UUID REFERENCES public.usuarios(id)
);

CREATE INDEX idx_asociaciones_nit ON public.asociaciones_rurales(nit);
CREATE INDEX idx_asociaciones_vereda ON public.asociaciones_rurales(vereda_principal);

-- Sesiones y actas del CMDR (Consejo Municipal de Desarrollo Rural)
CREATE TABLE public.cmdr_sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_sesion INTEGER NOT NULL,
  fecha_sesion DATE NOT NULL,
  tema_principal TEXT NOT NULL,
  acta_url TEXT, -- URL almacenada en Supabase Storage
  acta_storage_path TEXT,
  asistentes TEXT[], -- Array de nombres/cédulas
  decisiones_tomadas TEXT,
  proxima_fecha_sesion DATE,
  generado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cmdr_sesiones_fecha ON public.cmdr_sesiones(fecha_sesion);

-- Entregas de insumos y asistencia técnica
CREATE TABLE public.entregas_insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  productor_id UUID REFERENCES public.productores(id),
  asociacion_id UUID REFERENCES public.asociaciones_rurales(id),
  tipo_insumo TEXT NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad_medida TEXT NOT NULL,
  fecha_entrega DATE NOT NULL,
  responsable_entrega UUID REFERENCES public.usuarios(id),
  observaciones TEXT,
  comprobante_url TEXT,
  comprobante_storage_path TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT al_menos_una_parte CHECK (productor_id IS NOT NULL OR asociacion_id IS NOT NULL)
);

CREATE INDEX idx_entregas_productor ON public.entregas_insumos(productor_id);
CREATE INDEX idx_entregas_asociacion ON public.entregas_insumos(asociacion_id);
CREATE INDEX idx_entregas_fecha ON public.entregas_insumos(fecha_entrega);

-- Mercado Campesino
CREATE TABLE public.mercado_campesino_ediciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_edicion INTEGER NOT NULL,
  fecha_evento DATE NOT NULL,
  ubicacion TEXT NOT NULL,
  hora_inicio TIME,
  hora_cierre TIME,
  numero_participantes INTEGER,
  ventas_totales DECIMAL(15, 2),
  productos_comercializados TEXT,
  logistica_notas TEXT,
  organizador UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mercado_fecha ON public.mercado_campesino_ediciones(fecha_evento);

-- Empresas y unidades productivas
CREATE TABLE public.unidades_productivas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_comercial TEXT NOT NULL,
  nit TEXT NOT NULL UNIQUE,
  representante_legal TEXT NOT NULL,
  cedula_representante TEXT NOT NULL,
  sector_economico TEXT NOT NULL,
  tamaño_empresa TEXT, -- Microempresa, Pequeña, Mediana, Grande
  numero_empleados INTEGER,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  estado BOOLEAN DEFAULT true,
  fecha_constitucion DATE,
  certificaciones TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  registrado_por UUID REFERENCES public.usuarios(id)
);

CREATE INDEX idx_unidades_sector ON public.unidades_productivas(sector_economico);
CREATE INDEX idx_unidades_tamaño ON public.unidades_productivas(tamaño_empresa);

-- Emprendedores capacitados
CREATE TABLE public.emprendedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_emprendedor TEXT NOT NULL,
  cedula TEXT NOT NULL UNIQUE,
  email TEXT,
  telefono TEXT,
  idea_negocio TEXT NOT NULL,
  fecha_capacitacion DATE,
  programa_id UUID,
  estado_idea TEXT, -- Idea, En prototipo, En ejecución, Operando, Abandonada
  monto_capital_requerido DECIMAL(15, 2),
  acceso_credito BOOLEAN,
  entidad_credito TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  registrado_por UUID REFERENCES public.usuarios(id)
);

CREATE INDEX idx_emprendedores_estado ON public.emprendedores(estado_idea);

-- Programas de fortalecimiento
CREATE TABLE public.programas_fortalecimiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_programa TEXT NOT NULL,
  descripcion TEXT,
  objetivo TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  beneficiarios_estimados INTEGER,
  presupuesto DECIMAL(15, 2),
  responsable UUID REFERENCES public.usuarios(id),
  estado BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. TABLAS PETICIONES Y PQRSD
-- ============================================================================

CREATE TABLE public.peticiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radicado TEXT NOT NULL UNIQUE,
  fecha_radicacion DATE NOT NULL,
  tipo_peticion tipo_peticion NOT NULL,
  solicitante_nombre TEXT NOT NULL,
  solicitante_cedula TEXT,
  solicitante_email TEXT,
  solicitante_telefono TEXT,
  asunto TEXT NOT NULL,
  descripcion_detallada TEXT,
  medio_presentacion medio_recepcion NOT NULL,
  dias_habiles_termino INTEGER NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  responsable_asignado UUID REFERENCES public.usuarios(id),
  estado estado_peticion DEFAULT 'Recibido',
  documento_entrada_url TEXT,
  documento_entrada_storage_path TEXT,
  respuesta_oficio_url TEXT,
  respuesta_oficio_storage_path TEXT,
  observaciones TEXT,
  fecha_respuesta DATE,
  semaforo semaforo DEFAULT 'Verde',
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fecha_vencimiento_posterior CHECK (fecha_vencimiento > fecha_radicacion)
);

CREATE INDEX idx_peticiones_radicado ON public.peticiones(radicado);
CREATE INDEX idx_peticiones_estado ON public.peticiones(estado);
CREATE INDEX idx_peticiones_vencimiento ON public.peticiones(fecha_vencimiento);
CREATE INDEX idx_peticiones_responsable ON public.peticiones(responsable_asignado);
CREATE INDEX idx_peticiones_semaforo ON public.peticiones(semaforo);
CREATE INDEX idx_peticiones_fecha_radicacion ON public.peticiones(fecha_radicacion);

-- ============================================================================
-- 5. TABLAS CORRESPONDENCIA
-- ============================================================================

CREATE TABLE public.correspondencia_entrada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio_entrada TEXT NOT NULL UNIQUE,
  fecha_recepcion DATE NOT NULL,
  remitente_nombre TEXT NOT NULL,
  remitente_institucion TEXT,
  remitente_email TEXT,
  asunto TEXT NOT NULL,
  tipo_correspondencia tipo_correspondencia NOT NULL,
  numero_anexos INTEGER DEFAULT 0,
  descripcion_anexos TEXT,
  medio_recepcion medio_recepcion NOT NULL,
  documento_url TEXT,
  documento_storage_path TEXT,
  estado BOOLEAN DEFAULT true,
  observaciones TEXT,
  acuse_recibo_generado BOOLEAN DEFAULT false,
  fecha_acuse DATE,
  registrado_por UUID REFERENCES public.usuarios(id),
  destinatario_interno UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entrada_folio ON public.correspondencia_entrada(folio_entrada);
CREATE INDEX idx_entrada_fecha ON public.correspondencia_entrada(fecha_recepcion);
CREATE INDEX idx_entrada_destinatario ON public.correspondencia_entrada(destinatario_interno);

CREATE TABLE public.correspondencia_salida (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio_salida TEXT NOT NULL UNIQUE,
  fecha_elaboracion DATE NOT NULL,
  fecha_envio DATE,
  destinatario_nombre TEXT NOT NULL,
  destinatario_institucion TEXT,
  destinatario_email TEXT,
  destinatario_direccion TEXT,
  asunto TEXT NOT NULL,
  tipo_correspondencia tipo_correspondencia NOT NULL,
  numero_anexos INTEGER DEFAULT 0,
  descripcion_anexos TEXT,
  medio_envio medio_envio NOT NULL,
  documento_url TEXT,
  documento_storage_path TEXT,
  referencia_peticion UUID REFERENCES public.peticiones(id),
  responsable_elaboracion UUID REFERENCES public.usuarios(id),
  estado BOOLEAN DEFAULT true,
  observaciones TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_salida_folio ON public.correspondencia_salida(folio_salida);
CREATE INDEX idx_salida_fecha_envio ON public.correspondencia_salida(fecha_envio);
CREATE INDEX idx_salida_peticion_vinculada ON public.correspondencia_salida(referencia_peticion);

-- ============================================================================
-- 6. TABLAS CONTRATACIÓN PÚBLICA
-- ============================================================================

CREATE TABLE public.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_contrato TEXT NOT NULL UNIQUE,
  secop_id TEXT, -- ID SECOP II
  secop_url TEXT, -- URL a SECOP II
  fecha_celebracion DATE NOT NULL,
  tipo_contrato tipo_contrato NOT NULL,
  contratista_nombre TEXT NOT NULL,
  contratista_nit TEXT,
  contratista_email TEXT,
  contratista_telefono TEXT,
  objeto_contrato TEXT NOT NULL,
  valor_total DECIMAL(15, 2) NOT NULL,
  valor_cdp DECIMAL(15, 2),
  valor_rp DECIMAL(15, 2),
  fecha_acta_inicio DATE,
  plazo_ejecucion_dias INTEGER,
  fecha_terminacion_pactada DATE,
  supervisor_asignado UUID REFERENCES public.usuarios(id),
  estado_contrato estado_contrato DEFAULT 'Planeación',
  porcentaje_ejecucion_financiera DECIMAL(5, 2) DEFAULT 0,
  porcentaje_ejecucion_fisica DECIMAL(5, 2) DEFAULT 0,
  pago_total_realizado DECIMAL(15, 2) DEFAULT 0,
  pago_pendiente DECIMAL(15, 2),
  necesita_adicion BOOLEAN DEFAULT false,
  necesita_prorroga BOOLEAN DEFAULT false,
  observaciones TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valor_total_positivo CHECK (valor_total > 0)
);

CREATE INDEX idx_contratos_numero ON public.contratos(numero_contrato);
CREATE INDEX idx_contratos_estado ON public.contratos(estado_contrato);
CREATE INDEX idx_contratos_supervisor ON public.contratos(supervisor_asignado);
CREATE INDEX idx_contratos_fecha_terminacion ON public.contratos(fecha_terminacion_pactada);
CREATE INDEX idx_contratos_contratista ON public.contratos(contratista_nombre);

-- Documentos de contrato
CREATE TABLE public.documentos_contrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES public.contratos(id) ON DELETE CASCADE,
  tipo_documento TEXT NOT NULL, -- 'Estudio previo', 'Póliza de garantía', 'Acta inicial', 'Acta parcial', 'Acta de terminación'
  numero_documento TEXT,
  fecha_documento DATE,
  descripcion TEXT,
  archivo_url TEXT,
  archivo_storage_path TEXT,
  cumplida BOOLEAN DEFAULT false,
  fecha_cumplimiento DATE,
  registrado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documentos_contrato ON public.documentos_contrato(contrato_id);
CREATE INDEX idx_documentos_tipo ON public.documentos_contrato(tipo_documento);

-- Cuentas de cobro y pagos
CREATE TABLE public.cuentas_cobro_pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES public.contratos(id) ON DELETE CASCADE,
  numero_cuenta TEXT NOT NULL,
  fecha_presentacion DATE NOT NULL,
  periodo_facturado TEXT, -- Ej: "Enero 2024"
  concepto_pago TEXT NOT NULL,
  valor_solicitado DECIMAL(15, 2) NOT NULL,
  valor_aprobado DECIMAL(15, 2),
  fecha_aprobacion DATE,
  fecha_pago DATE,
  estado_pago TEXT, -- 'Presentado', 'En revisión', 'Aprobado', 'Pagado', 'Rechazado'
  observaciones TEXT,
  archivo_url TEXT,
  archivo_storage_path TEXT,
  registrado_por UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cuentas_contrato ON public.cuentas_cobro_pagos(contrato_id);
CREATE INDEX idx_cuentas_fecha_presentacion ON public.cuentas_cobro_pagos(fecha_presentacion);
CREATE INDEX idx_cuentas_estado ON public.cuentas_cobro_pagos(estado_pago);

-- ============================================================================
-- 7. TABLAS PLANEACIÓN Y PROYECTOS
-- ============================================================================

CREATE TABLE public.proyectos_banco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_bpin TEXT UNIQUE, -- BPIN si fue registrado
  nombre_proyecto TEXT NOT NULL,
  descripcion TEXT,
  linea_estrategica TEXT NOT NULL,
  meta_plan_desarrollo TEXT, -- Meta del Plan de Desarrollo Municipal vinculada
  objetivo_general TEXT,
  objetivos_especificos TEXT,
  poblacion_beneficiada TEXT,
  numero_beneficiarios INTEGER,
  presupuesto_total DECIMAL(15, 2) NOT NULL,
  presupuesto_contrapartida DECIMAL(15, 2),
  fuentes_financiamiento TEXT,
  responsable_proyecto UUID REFERENCES public.usuarios(id),
  estado_proyecto BOOLEAN DEFAULT true,
  fecha_inicio_estimada DATE,
  fecha_fin_estimada DATE,
  fecha_inicio_real DATE,
  fecha_fin_real DATE,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proyectos_linea ON public.proyectos_banco(linea_estrategica);
CREATE INDEX idx_proyectos_responsable ON public.proyectos_banco(responsable_proyecto);

-- Cronograma de actividades / Hitos del proyecto
CREATE TABLE public.hitos_proyecto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES public.proyectos_banco(id) ON DELETE CASCADE,
  nombre_hito TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin_pactada DATE NOT NULL,
  porcentaje_completado DECIMAL(5, 2) DEFAULT 0,
  responsable UUID REFERENCES public.usuarios(id),
  estado estado_ejecucion DEFAULT 'No iniciado',
  observaciones TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hitos_proyecto ON public.hitos_proyecto(proyecto_id);
CREATE INDEX idx_hitos_fecha_fin ON public.hitos_proyecto(fecha_fin_pactada);

-- Indicadores de proyectos
CREATE TABLE public.indicadores_proyecto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES public.proyectos_banco(id) ON DELETE CASCADE,
  nombre_indicador TEXT NOT NULL,
  tipo_indicador TEXT, -- 'Producto', 'Resultado', 'Proceso'
  unidad_medida TEXT,
  meta_esperada DECIMAL(10, 2),
  valor_actual DECIMAL(10, 2),
  fecha_medicion DATE,
  responsable_seguimiento UUID REFERENCES public.usuarios(id),
  fuente_verificacion TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_indicadores_proyecto ON public.indicadores_proyecto(proyecto_id);

-- Evidencias de proyectos (fotografías, documentales)
CREATE TABLE public.evidencias_proyecto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES public.proyectos_banco(id) ON DELETE CASCADE,
  tipo_evidencia TEXT, -- 'Fotografía', 'Video', 'Documento', 'Acta'
  descripcion TEXT,
  archivo_url TEXT,
  archivo_storage_path TEXT,
  fecha_captura DATE,
  responsable_carga UUID REFERENCES public.usuarios(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidencias_proyecto ON public.evidencias_proyecto(proyecto_id);
