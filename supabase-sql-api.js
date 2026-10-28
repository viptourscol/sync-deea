#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucnZhc2dsYWRxaWZveW1vdmJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTcwMjMzMywiZXhwIjoxODg3NDY4MzMzfQ.6cVeGqJO9Rr7QIE1kFZpQZ87RxJKOXPsxjjvJj9lKa8";
const PROJECT_REF = "dnrvasgladqifoymovbt";

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });

    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runMigrations() {
  console.log('🚀 Iniciando migraciones via Supabase Management API...\n');
  
  const migrations = [
    'schema_01_enums_y_tipos.sql',
    'schema_02_agenda_pendientes_config.sql',
    'schema_03_rls_y_datos_iniciales.sql'
  ];

  for (const file of migrations) {
    try {
      console.log(`📤 ${file}...`);
      const sql = fs.readFileSync(file, 'utf8');
      const result = await executeSql(sql);
      console.log(`✅ ${file} - OK\n`);
    } catch (error) {
      console.error(`❌ ${file}: ${error.message}`);
      if (error.message.includes('already exists')) {
        console.log('   (Ignorado - objetos ya existen)\n');
      }
    }
  }

  console.log('✅ Migraciones completadas');
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});
