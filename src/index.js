// Punto de entrada. Vercel busca este archivo (src/index.js) y usa la app exportada.
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const elementos = require('./routes/elementos');
const grupos = require('./routes/grupos');
const periodos = require('./routes/periodos');
const categorias = require('./routes/categorias');

const app = express();

app.use(cors());          // permite que tu frontend (otro dominio) llame a la API
app.use(express.json());

// Ruta raíz: describe la API
app.get('/', (req, res) => {
  res.json({
    nombre: 'API Tabla Periódica IUPAC',
    version: 'v1',
    endpoints: [
      'GET /api/v1/elementos  (filtros: categoria, tipo, bloque, estado, grupo, periodo, buscar)',
      'GET /api/v1/elementos/:numero',
      'GET /api/v1/elementos/simbolo/:simbolo',
      'GET /api/v1/grupos/:n',
      'GET /api/v1/periodos/:n',
      'GET /api/v1/categorias',
      'GET /api/v1/salud',
    ],
  });
});

// Comprueba que la API y la base de datos responden
app.get('/api/v1/salud', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ estado: 'ok', base_de_datos: 'conectada' });
});

app.use('/api/v1/elementos', elementos);
app.use('/api/v1/grupos', grupos);
app.use('/api/v1/periodos', periodos);
app.use('/api/v1/categorias', categorias);

// 404: ninguna ruta coincidió
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejo central de errores (Express 5 envía aquí también los errores de funciones async)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : err.message,
  });
});

// Local: "npm run dev" levanta el servidor. En Vercel solo se exporta la app.
if (require.main === module) {
  const puerto = process.env.PORT || 3000;
  app.listen(puerto, () => console.log(`API lista en http://localhost:${puerto}`));
}

module.exports = app;
