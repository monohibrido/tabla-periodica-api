const express = require('express');
const pool = require('../db');
const { aElemento } = require('../utils/formato');
const { enteroEnRango, ErrorHttp } = require('../utils/validar');

const router = express.Router();

// GET /api/v1/grupos/18  -> elementos de un grupo (columna 1 a 18)
router.get('/:n', async (req, res) => {
  const n = enteroEnRango(req.params.n, 1, 18);
  if (n === null) throw new ErrorHttp(400, 'El grupo debe estar entre 1 y 18');

  const { rows } = await pool.query(
    'SELECT * FROM elementos WHERE grupo = $1 ORDER BY numero_atomico',
    [n]
  );
  res.json({ grupo: n, total: rows.length, datos: rows.map(aElemento) });
});

module.exports = router;
