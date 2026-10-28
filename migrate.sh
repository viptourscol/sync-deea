#!/bin/bash
set -e

SUPABASE_URL="https://dnrvasgladqifoymovbt.supabase.co"
SERVICE_ROLE_KEY="$1"
DB_CONNECTION="${SUPABASE_URL/https:\/\//postgresql://postgres:}/query"

# Extract host from URL
HOST=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')

# Proper connection string
PGPASSWORD="$SERVICE_ROLE_KEY" psql -h "$HOST.supabase.co" -U postgres -d postgres << 'SQLEOF'
-- Verificar conexión
SELECT version();
SQLEOF

echo "✅ Conexión exitosa a Supabase"
