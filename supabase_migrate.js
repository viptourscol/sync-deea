#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

const SUPABASE_URL = "https://dnrvasgladqifoymovbt.supabase.co";
const SERVICE_ROLE_KEY = process.argv[2];

// Leer migraciones en orden
const migrations = [
  'schema_01_enums_y_tipos.sql',
  'schema_02_agenda_pendientes_config.sql',
  'schema_03_rls_y_datos_iniciales.sql'
];

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql }));
    req.end();
  });
}

async function runMigrations() {
  console.log('🚀 Iniciando migraciones Supabase...\n');
  
  for (const file of migrations) {
    try {
      console.log(`📤 Ejecutando: ${file}`);
      const sql = fs.readFileSync(file, 'utf8');
      const result = await executeSql(sql);
      console.log(`✅ ${file} - OK\n`);
    } catch (error) {
      console.error(`❌ ${file} - ERROR:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('✅ Todas las migraciones completadas');
}

runMigrations();
