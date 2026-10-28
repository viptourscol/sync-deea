#!/usr/bin/env node
const fs = require('fs');
const { Client } = require('pg');

const SUPABASE_URL = "https://dnrvasgladqifoymovbt.supabase.co";
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Uso: node migrate-supabase.js <SERVICE_ROLE_KEY>');
  process.exit(1);
}

// Extract host from URL
const host = SUPABASE_URL.replace('https://', '');

const client = new Client({
  host: host,
  port: 5432,
  user: 'postgres',
  password: SERVICE_ROLE_KEY,
  database: 'postgres',
  ssl: 'require',
});

const migrations = [
  'schema_01_enums_y_tipos.sql',
  'schema_02_agenda_pendientes_config.sql',
  'schema_03_rls_y_datos_iniciales.sql'
];

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Conectado a Supabase');

    for (const file of migrations) {
      console.log(`\n📤 Ejecutando: ${file}`);
      const sql = fs.readFileSync(file, 'utf8');
      
      // Split by statements
      const statements = sql.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
          } catch (err) {
            if (err.message.includes('already exists')) {
              console.log(`  ⚠️  Ya existe: ${err.message.split('\n')[0]}`);
            } else {
              throw err;
            }
          }
        }
      }
      console.log(`  ✅ ${file} - Completado`);
    }

    console.log('\n✅ ¡Todas las migraciones completadas exitosamente!');
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
