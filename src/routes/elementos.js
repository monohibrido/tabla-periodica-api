const express = require('express');
const pool = require('../db');
const { aElemento } = require('../utils/formato');
const { enteroEnRango, ErrorHttp } = require('../utils/validar');

const router = express.Router();

// GET /api/v1/elementos
// Filtros opcionales: ?categoria= &tipo= &bloque= &estado= &grupo= &periodo= &buscar=
router.get('/', async (req, res) => {
  const { categoria, tipo, bloque, estado, grupo, periodo, buscar } = req.query;
  const condiciones = [];
  const valores = [];

  // Cada filtro agrega una condición y su valor. Los $1, $2... evitan SQL injection.
  const agregar = (sql, valor) => {
    valores.push(valor);
    condiciones.push(sql.replace('?', `$${valores.length}`));
  };

  if (categoria) agregar('LOWER(categoria) = LOWER(?)', categoria);
  if (tipo)      agregar('LOWER(tipo) = LOWER(?)', tipo);
  if (estado)    agregar('LOWER(estado_normal) = LOWER(?)', estado);
  if (bloque) {
    if (!/^[spdf]$/i.test(bloque)) throw new ErrorHttp(400, 'bloque debe ser s, p, d o f');
    agregar('bloque = LOWER(?)', bloque);
  }
  if (grupo !== undefined) {
    const g = enteroEnRango(grupo, 1, 18);
    if (g === null) throw new ErrorHttp(400, 'grupo debe ser un número entre 1 y 18');
    agregar('grupo = ?', g);
  }
  if (periodo !== undefined) {
    const p = enteroEnRango(periodo, 1, 7);
    if (p === null) throw new ErrorHttp(400, 'periodo debe ser un número entre 1 y 7');
    agregar('periodo = ?', p);
  }
  if (buscar) {
    valores.push(`%${buscar}%`);
    const n = valores.length;
    condiciones.push(`(nombre ILIKE $${n} OR nombre_ingles ILIKE $${n} OR simbolo ILIKE $${n})`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT * FROM elementos ${where} ORDER BY numero_atomico`,
    valores
  );

  res.json({ total: rows.length, datos: rows.map(aElemento) });
});

// GET /api/v1/elementos/simbolo/Fe   (esta ruta va ANTES de /:numero)
router.get('/simbolo/:simbolo', async (req, res) => {
  const { simbolo } = req.params;
  if (!/^[a-zA-Z]{1,3}$/.test(simbolo)) {
    throw new ErrorHttp(400, 'El símbolo debe tener de 1 a 3 letras');
  }
  const { rows } = await pool.query(
    'SELECT * FROM elementos WHERE LOWER(simbolo) = LOWER($1)',
    [simbolo]
  );
  if (rows.length === 0) throw new ErrorHttp(404, `No existe el elemento con símbolo "${simbolo}"`);
  res.json(aElemento(rows[0]));
});

// GET /api/v1/elementos/26
router.get('/:numero', async (req, res) => {
  const numero = enteroEnRango(req.params.numero, 1, 118);
  if (numero === null) throw new ErrorHttp(400, 'El número atómico debe estar entre 1 y 118');

  const { rows } = await pool.query('SELECT * FROM elementos WHERE numero_atomico = $1', [numero]);
  if (rows.length === 0) throw new ErrorHttp(404, `No existe el elemento ${numero}`);
  res.json(aElemento(rows[0]));
});

module.exports = router;
