const express = require('express');
const pool = require('../db');
const { aElemento } = require('../utils/formato');
const { enteroEnRango, ErrorHttp } = require('../utils/validar');

const router = express.Router();

// GET /api/v1/periodos/3  -> elementos de un período (fila 1 a 7)
router.get('/:n', async (req, res) => {
  const n = enteroEnRango(req.params.n, 1, 7);
  if (n === null) throw new ErrorHttp(400, 'El período debe estar entre 1 y 7');

  const { rows } = await pool.query(
    'SELECT * FROM elementos WHERE periodo = $1 ORDER BY numero_atomico',
    [n]
  );
  res.json({ periodo: n, total: rows.length, datos: rows.map(aElemento) });
});

module.exports = router;
