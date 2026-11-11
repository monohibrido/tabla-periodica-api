// Conexión a PostgreSQL. Se crea UN solo "pool" y se reutiliza en toda la app.
require('dotenv').config({ quiet: true });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'Falta la variable de entorno DATABASE_URL. Copia .env.example a .env y complétala.'
  );
}

// Bases de datos en la nube (Neon, Supabase...) exigen SSL; la local no.
const esLocal = /localhost|127\.0\.0\.1/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: esLocal ? false : { rejectUnauthorized: false },
  max: 5, // en serverless conviene pocas conexiones por instancia
});

module.exports = pool;
