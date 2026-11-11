const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/v1/categorias -> lista de categorías y cuántos elementos tiene cada una
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT categoria, tipo, COUNT(*)::int AS total
       FROM elementos
      GROUP BY categoria, tipo
      ORDER BY MIN(numero_atomico)`
  );
  res.json({ total: rows.length, datos: rows });
});

module.exports = router;
