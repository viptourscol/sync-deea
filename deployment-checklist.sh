#!/bin/bash

# SYNC DEEA - DEPLOYMENT CHECKLIST
# Script interactivo para verificar que todo esté listo para producción

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           SYNC DEEA - PRE-DEPLOYMENT CHECKLIST               ║"
echo "║                                                                ║"
echo "║      Verificar que TODO esté listo para producción            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Variables
PASO_1_COMPLETO=0
PASO_2_COMPLETO=0
PASO_3_COMPLETO=0
PASO_4_COMPLETO=0
TOTAL_PASOS=0

# PASO 1: Verificar que compila
echo "📋 PASO 1: Verificar compilación..."
echo "─────────────────────────────────────────"

if npm run type-check 2>/dev/null; then
  echo "✅ TypeScript: OK"
  ((PASO_1_COMPLETO++))
else
  echo "❌ TypeScript: ERROR - Necesita correcciones"
fi

if npm run build 2>/dev/null | tail -5 | grep -q "created successfully"; then
  echo "✅ Build Next.js: OK"
  ((PASO_1_COMPLETO++))
else
  echo "⚠️  Build Next.js: Revisar errores arriba"
fi

if [ -f ".gitignore" ] && grep -q "\.env\.production" ".gitignore"; then
  echo "✅ .gitignore: .env.production protegido"
  ((PASO_1_COMPLETO++))
else
  echo "⚠️  .gitignore: Agregar .env.production"
fi

((TOTAL_PASOS+=3))

echo ""
echo "📋 PASO 2: Verificar repositorio Git..."
echo "─────────────────────────────────────────"

if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "✅ Git repository: Inicializado"
  ((PASO_2_COMPLETO++))
else
  echo "❌ Git: No inicializado. Ejecutar: git init"
fi

if git remote | grep -q "origin"; then
  REMOTE_URL=$(git config --get remote.origin.url)
  echo "✅ Git remote: $REMOTE_URL"
  ((PASO_2_COMPLETO++))
else
  echo "⚠️  Git remote: No configurado. Ver: git remote add origin <URL>"
fi

if [ -f ".env.production" ]; then
  echo "✅ .env.production: Existe (sin valores sensibles)"
  ((PASO_2_COMPLETO++))
else
  echo "❌ .env.production: No existe. Crear desde .env.example"
fi

((TOTAL_PASOS+=3))

echo ""
echo "📋 PASO 3: Verificar dependencias..."
echo "─────────────────────────────────────────"

if [ -d "node_modules" ]; then
  echo "✅ node_modules: Instalado"
  ((PASO_3_COMPLETO++))
else
  echo "⚠️  node_modules: No existe. Ejecutar: npm install"
fi

if grep -q "\"next\"" package.json; then
  VERSION=$(grep "\"next\"" package.json | grep -oP '"\K[^"]+')
  echo "✅ Next.js: $VERSION"
  ((PASO_3_COMPLETO++))
else
  echo "❌ Next.js: No encontrado en package.json"
fi

if grep -q "\"supabase\"" package.json; then
  echo "✅ Supabase: Instalado"
  ((PASO_3_COMPLETO++))
else
  echo "❌ Supabase: No encontrado. Ejecutar: npm install @supabase/supabase-js"
fi

((TOTAL_PASOS+=3))

echo ""
echo "📋 PASO 4: Checklist Pre-Producción..."
echo "─────────────────────────────────────────"

# Array de preguntas
declare -a PREGUNTAS=(
  "¿Supabase proyecto producción creado?"
  "¿Variables env configuradas en Vercel?"
  "¿Festivos cargados en BD producción?"
  "¿RLS policies verificadas?"
  "¿Dashboard testing local OK?"
  "¿Responsive mobile verificado?"
)

RESPUESTAS_SI=0

for PREGUNTA in "${PREGUNTAS[@]}"; do
  echo ""
  echo "❓ $PREGUNTA"
  echo "   (y/n/skip): "
  read -r RESPUESTA
  
  if [ "$RESPUESTA" = "y" ]; then
    echo "   ✅ Confirmado"
    ((RESPUESTAS_SI++))
  elif [ "$RESPUESTA" = "n" ]; then
    echo "   ❌ Falta completar"
  else
    echo "   ⏭️  Saltado"
  fi
done

((PASO_4_COMPLETO=$RESPUESTAS_SI))
((TOTAL_PASOS+=6))

# RESUMEN FINAL
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        RESUMEN FINAL                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

TOTAL_COMPLETADO=$((PASO_1_COMPLETO + PASO_2_COMPLETO + PASO_3_COMPLETO + PASO_4_COMPLETO))
PORCENTAJE=$((TOTAL_COMPLETADO * 100 / TOTAL_PASOS))

echo "📊 Progreso: $TOTAL_COMPLETADO/$TOTAL_PASOS items completados"
echo "📈 Porcentaje: $PORCENTAJE%"
echo ""

if [ $PORCENTAJE -ge 90 ]; then
  echo "🚀 ¡LISTO PARA DEPLOYMENT A PRODUCCIÓN!"
  echo ""
  echo "Próximos pasos:"
  echo "1. git add . && git commit -m 'Ready for production'"
  echo "2. git push origin main"
  echo "3. Ir a Vercel Dashboard y confirmar deploy"
  echo "4. Monitorear https://sync-deea.vercel.app"
elif [ $PORCENTAJE -ge 70 ]; then
  echo "⚠️  CASI LISTO - Faltan algunos items"
  echo ""
  echo "Revisar:"
  if [ $PASO_1_COMPLETO -lt 3 ]; then echo "- Paso 1: Compilación"; fi
  if [ $PASO_2_COMPLETO -lt 3 ]; then echo "- Paso 2: Git/GitHub"; fi
  if [ $PASO_3_COMPLETO -lt 3 ]; then echo "- Paso 3: Dependencias"; fi
  if [ $PASO_4_COMPLETO -lt 6 ]; then echo "- Paso 4: Pre-prod checklist"; fi
else
  echo "❌ NECESITA MÁS TRABAJO"
  echo ""
  echo "Ver: DEPLOYMENT_SUPABASE_VERCEL.md"
fi

echo ""
echo "Documentación: DEPLOYMENT_SUPABASE_VERCEL.md"
echo ""
