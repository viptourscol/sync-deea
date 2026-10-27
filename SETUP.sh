#!/usr/bin/env bash
# ============================================================================
# SYNC DEEA GOVTECH - GUÍA DE INSTALACIÓN Y CONFIGURACIÓN
# ============================================================================

# PASO 1: CREAR PROYECTO NEXT.JS 14
# ----------------------------------
echo "=== Creando proyecto Next.js 14 ==="
npx create-next-app@latest sync-deea-govtech --typescript --tailwind --eslint --app --src-dir --no-git --import-alias '@/*'

cd sync-deea-govtech

# PASO 2: INSTALAR DEPENDENCIAS
# ----------------------------------
echo "=== Instalando dependencias ==="

npm install \
  @supabase/supabase-js \
  @supabase/auth-helpers-nextjs \
  @supabase/auth-helpers-react \
  zod \
  react-hook-form \
  @hookform/resolvers \
  shadcn-ui \
  lucide-react \
  recharts \
  date-fns \
  react-calendar \
  react-big-calendar \
  xlsx \
  papaparse \
  qrcode.react \
  resend \
  react-email \
  @react-email/components

# Dev dependencies
npm install --save-dev \
  @types/papaparse \
  @types/qrcode.react \
  typescript \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  tailwindcss \
  postcss

# PASO 3: CONFIGURAR shadcn/ui
# ----------------------------------
echo "=== Configurando shadcn/ui ==="
npx shadcn-ui@latest init -d

# Instalar componentes específicos
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu

# PASO 4: CREAR ESTRUCTURA DE CARPETAS
# ----------------------------------
echo "=== Creando estructura de carpetas ==="

mkdir -p src/app/{auth/{login,register,callback},dashboard/peticiones/{[id]/edit,crear},dashboard/correspondencia/{entrada,salida},dashboard/contratos/{[id]/ejecucion,crear},dashboard/proyectos/{[id],crear},dashboard/desarrollo-economico/{agropecuario,empresarial},dashboard/agenda,dashboard/configuracion}
mkdir -p src/components/{layout,ui,common,peticiones,correspondencia,contratos,proyectos,dashboard}
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/emails
mkdir -p src/styles
mkdir -p src/types
mkdir -p supabase/migrations
mkdir -p public

# PASO 5: CREAR ARCHIVOS .env.local
# ----------------------------------
echo "=== Creando archivo .env.local ==="
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# Resend
RESEND_API_KEY=[YOUR_RESEND_API_KEY]
NEXT_PUBLIC_APP_EMAIL_FROM=noreply@sync-deea.gov.co

# Configuración de aplicación
NEXT_PUBLIC_APP_NAME="SYNC DEEA"
NEXT_PUBLIC_MUNICIPIO="Montelíbano"
NEXT_PUBLIC_DEPARTAMENTO="Córdoba"

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# PASO 6: GUÍA MANUAL PARA SUPABASE
# ----------------------------------
echo ""
echo "=== CONFIGURACIÓN MANUAL EN SUPABASE ==="
echo ""
echo "1. Ir a https://app.supabase.com"
echo "2. Crear un nuevo proyecto:"
echo "   - Nombre: sync-deea-govtech"
echo "   - Base de datos: PostgreSQL"
echo "   - Región: América del Sur (Brasília o Bogotá)"
echo ""
echo "3. Una vez creado, ir a SQL Editor y ejecutar secuencialmente:"
echo "   - schema_01_enums_y_tipos.sql"
echo "   - schema_02_agenda_pendientes_config.sql"
echo "   - schema_03_rls_y_datos_iniciales.sql"
echo ""
echo "4. Habilitar Storage (bucket 'documentos-deea'):"
echo "   - Ir a Storage"
echo "   - Crear nuevo bucket: documentos-deea"
echo "   - Permitir uploads públicos"
echo ""
echo "5. Configurar autenticación:"
echo "   - Authentication > Providers > Email"
echo "   - Configurar SMTP si es necesario"
echo "   - O usar Resend (recomendado para GovTech)"
echo ""
echo "6. Obtener credenciales:"
echo "   - Project Settings > API"
echo "   - Copiar Project URL y anon/service role keys"
echo "   - Actualizar .env.local"
echo ""

echo "=== Setup completado ==="
echo "Próximos pasos:"
echo "1. npm run dev"
echo "2. Visitar http://localhost:3000"
