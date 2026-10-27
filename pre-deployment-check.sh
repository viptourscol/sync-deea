#!/bin/bash

# SYNC DEEA - PRE-DEPLOYMENT VALIDATION SCRIPT
# Ejecutar ANTES de hacer push a GitHub/Vercel
# Verificar: TypeScript, builds, tests, security

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║          SYNC DEEA - PRE-DEPLOYMENT VALIDATION                ║"
echo "║                                                                ║"
echo "║   🚀 Verificar que todo está listo ANTES de production       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Variables de control
ERRORS=0
WARNINGS=0

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir resultados
check_result() {
  local test_name=$1
  local exit_code=$2
  
  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✅ $test_name${NC}"
  else
    echo -e "${RED}❌ $test_name${NC}"
    ((ERRORS++))
  fi
}

warn_result() {
  local test_name=$1
  echo -e "${YELLOW}⚠️  $test_name${NC}"
  ((WARNINGS++))
}

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 1: VERIFICACIONES BÁSICAS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}📋 SECCIÓN 1: Verificaciones Básicas${NC}"
echo "───────────────────────────────────────────────────────────────"

# 1.1 Node.js y npm
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "✅ Node.js: $NODE_VERSION"
else
  echo -e "${RED}❌ Node.js no instalado${NC}"
  ((ERRORS++))
fi

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo "✅ npm: $NPM_VERSION"
else
  echo -e "${RED}❌ npm no instalado${NC}"
  ((ERRORS++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 2: SEGURIDAD
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}🔐 SECCIÓN 2: Verificaciones de Seguridad${NC}"
echo "───────────────────────────────────────────────────────────────"

# 2.1 Verificar .gitignore
echo -n "Verificando .gitignore... "
if grep -q "\.env\.production" .gitignore 2>/dev/null; then
  check_result ".env.production en .gitignore" 0
else
  check_result ".env.production en .gitignore" 1
fi

# 2.2 Buscar credenciales en código
echo -n "Buscando credenciales expuestas... "
if grep -r "sk_live\|pk_live\|SUPABASE_SERVICE_ROLE\|RESEND_API" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" app/ lib/ src/ 2>/dev/null | grep -v ".example"; then
  check_result "Credenciales en código" 1
else
  check_result "Credenciales en código" 0
fi

# 2.3 Verificar que .env.production.local no está en git
echo -n "Verificando que .env.production.local no está tracked... "
if git ls-files | grep -q "\.env\.production\.local"; then
  check_result ".env.production.local no en git" 1
else
  check_result ".env.production.local no en git" 0
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 3: LINTING Y TIPOS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}🎯 SECCIÓN 3: TypeScript y Linting${NC}"
echo "───────────────────────────────────────────────────────────────"

# 3.1 Type checking
echo -n "Ejecutando type-check... "
npm run type-check &>/dev/null
check_result "npm run type-check" $?

# 3.2 ESLint (si existe)
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.yml" ]; then
  echo -n "Ejecutando ESLint... "
  npm run lint &>/dev/null
  check_result "npm run lint" $?
else
  warn_result "ESLint no configurado (optional)"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 4: BUILD
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}🔨 SECCIÓN 4: Build${NC}"
echo "───────────────────────────────────────────────────────────────"

echo "Ejecutando build (esto puede tomar 2-5 min)..."
npm run build &>/dev/null
BUILD_EXIT=$?
check_result "npm run build" $BUILD_EXIT

if [ $BUILD_EXIT -eq 0 ]; then
  # Verificar que .next existe
  if [ -d ".next" ]; then
    NEXT_SIZE=$(du -sh .next | cut -f1)
    echo "  → .next generado: $NEXT_SIZE"
  fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 5: DEPENDENCIAS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}📦 SECCIÓN 5: Dependencias${NC}"
echo "───────────────────────────────────────────────────────────────"

# 5.1 Verificar node_modules
echo -n "Verificando node_modules... "
if [ -d "node_modules" ]; then
  check_result "node_modules existe" 0
else
  check_result "node_modules existe" 1
fi

# 5.2 Vulnerabilidades conocidas
echo -n "Buscando vulnerabilidades (npm audit)... "
npm audit --audit-level=moderate &>/dev/null
AUDIT_EXIT=$?

if [ $AUDIT_EXIT -eq 0 ]; then
  check_result "npm audit (sin vulnerabilidades)" 0
else
  warn_result "npm audit detectó vulnerabilidades (revisar, no crítico si son dev-only)"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 6: GIT
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}📝 SECCIÓN 6: Git${NC}"
echo "───────────────────────────────────────────────────────────────"

# 6.1 Verificar que estamos en un repo
echo -n "Verificando repositorio Git... "
git rev-parse --git-dir &>/dev/null
check_result "Git repository inicializado" $?

# 6.2 Verificar cambios sin commits
echo -n "Verificando cambios sin commit... "
if git status --porcelain | grep -q "^"; then
  warn_result "Hay cambios sin commit (¿intentabas hacer push?)"
else
  echo -e "${GREEN}✅ Todos los cambios están committed${NC}"
fi

# 6.3 Verificar rama
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Rama actual: $CURRENT_BRANCH"
if [ "$CURRENT_BRANCH" != "main" ]; then
  warn_result "No estás en rama 'main' (estás en '$CURRENT_BRANCH')"
fi

# 6.4 Verificar remote
echo -n "Verificando remote origin... "
if git remote | grep -q "origin"; then
  REMOTE=$(git config --get remote.origin.url)
  echo -e "${GREEN}✅ Remote: $REMOTE${NC}"
else
  check_result "Remote origin configurado" 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 7: VARIABLES DE ENTORNO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}🔑 SECCIÓN 7: Variables de Entorno${NC}"
echo "───────────────────────────────────────────────────────────────"

# 7.1 .env.local (desarrollo)
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✅ .env.local existe${NC}"
else
  warn_result ".env.local no encontrado (solo necesario en desarrollo)"
fi

# 7.2 .env.production.example
echo -n "Verificando .env.production.example... "
if [ -f ".env.production.example" ]; then
  check_result ".env.production.example existe" 0
else
  check_result ".env.production.example existe" 1
fi

# 7.3 Variables críticas
echo "Variables críticas esperadas:"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY (NO en NEXT_PUBLIC)"
echo "  - NEXT_PUBLIC_APP_URL (producción)"

echo ""

# ═══════════════════════════════════════════════════════════════
# SECCIÓN 8: ARCHIVOS CRÍTICOS
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}📁 SECCIÓN 8: Archivos Críticos${NC}"
echo "───────────────────────────────────────────────────────────────"

ARCHIVOS_ESPERADOS=(
  "package.json"
  "tsconfig.json"
  "next.config.js"
  "tailwind.config.js"
  "lib/supabase.ts"
  "lib/fechas-colombia.ts"
  "app/layout.tsx"
  "app/page.tsx"
)

for archivo in "${ARCHIVOS_ESPERADOS[@]}"; do
  echo -n "Verificando $archivo... "
  if [ -f "$archivo" ]; then
    check_result "$archivo" 0
  else
    check_result "$archivo" 1
  fi
done

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        RESUMEN FINAL                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -le 2 ]; then
  echo -e "${GREEN}✅ LISTO PARA PRODUCCIÓN${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "1. Verificar cambios: git diff HEAD~1"
  echo "2. Push a GitHub: git push origin main"
  echo "3. Ir a Vercel Dashboard y confirmar deploy"
  echo "4. Monitorear: https://sync-deea.vercel.app"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ] && [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  CASI LISTO - Revisar warnings arriba${NC}"
  echo ""
  echo "Puedes proceder si no afecta tu caso:"
  echo "1. git push origin main"
  echo "2. Vercel desplegará automáticamente"
  echo ""
  exit 0
else
  echo -e "${RED}❌ NO LISTO PARA PRODUCCIÓN${NC}"
  echo ""
  echo "Errores encontrados: $ERRORS"
  echo "Warnings encontrados: $WARNINGS"
  echo ""
  echo "Revisar arriba y corregir antes de hacer push"
  echo ""
  exit 1
fi
