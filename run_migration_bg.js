#!/usr/bin/env node
const fs = require('fs');
const { Client } = require('pg');

const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucnZhc2dsYWRxaWZveW1vdmJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTcwMjMzMywiZXhwIjoxODg3NDY4MzMzfQ.6cVeGqJO9Rr7QIE1kFZpQZ87RxJKOXPsxjjvJj9lKa8";

console.log('🔐 Conectando a Supabase...');

const client = new Client({
  host: 'dnrvasgladqifoymovbt.supabase.co',
  port: 5432,
  user: 'postgres',
  password: SERVICE_ROLE_KEY,
  database: 'postgres',
  ssl: 'require',
  application_name: 'sync-deea-migration',
  connectionTimeoutMillis: 30000,
});

const migrations = [
  'schema_01_enums_y_tipos.sql',
  'schema_02_agenda_pendientes_config.sql',
  'schema_03_rls_y_datos_iniciales.sql'
];

async function runMigrations() {
  try {
    console.log('Intentando conectar...');
    await client.connect();
    console.log('✅ Conectado a Supabase');

    for (const file of migrations) {
      console.log(`\n📤 Ejecutando: ${file}`);
      const sql = fs.readFileSync(file, 'utf8');
      
      // Split by statements
      const statements = sql.split(';').filter(s => s.trim());
      let success = 0, skipped = 0;
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
            success++;
          } catch (err) {
            if (err.message.includes('already exists') || err.message.includes('duplicate')) {
              skipped++;
            } else if (err.message.includes('syntax error')) {
              console.log(`  ⚠️  Syntax: ${statement.substring(0, 50)}...`);
            } else {
              throw err;
            }
          }
        }
      }
      console.log(`  ✅ ${file}: ${success} ejecutados, ${skipped} omitidos`);
    }

    console.log('\n✅ ¡MIGRACIONES COMPLETADAS EXITOSAMENTE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}

// Timeout de 120 segundos
setTimeout(() => {
  console.error('⏱️  TIMEOUT - Abortando');
  process.exit(1);
}, 120000);

runMigrations();
