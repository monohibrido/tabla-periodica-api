// Carga data/elementos.json en PostgreSQL.
// Uso: npm run seed
// Es seguro ejecutarlo varias veces: actualiza las filas que ya existen.
const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  const { elementos } = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/elementos.json'), 'utf8')
  );

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schema);

    const sql = `
      INSERT INTO elementos (
        numero_atomico, simbolo, nombre, nombre_ingles, masa_atomica,
        incertidumbre_masa_atomica, grupo, periodo, bloque, tipo, categoria,
        configuracion_electronica, electronegatividad_pauling, radio_atomico_pm,
        punto_fusion_c, punto_ebullicion_c, densidad_g_cm3, estado_normal,
        estados_oxidacion, radiactivo, anio_descubrimiento, descubierto_por,
        numero_cas, color_cpk, fila, columna
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
      )
      ON CONFLICT (numero_atomico) DO UPDATE SET
        simbolo = EXCLUDED.simbolo, nombre = EXCLUDED.nombre,
        nombre_ingles = EXCLUDED.nombre_ingles, masa_atomica = EXCLUDED.masa_atomica,
        incertidumbre_masa_atomica = EXCLUDED.incertidumbre_masa_atomica,
        grupo = EXCLUDED.grupo, periodo = EXCLUDED.periodo, bloque = EXCLUDED.bloque,
        tipo = EXCLUDED.tipo, categoria = EXCLUDED.categoria,
        configuracion_electronica = EXCLUDED.configuracion_electronica,
        electronegatividad_pauling = EXCLUDED.electronegatividad_pauling,
        radio_atomico_pm = EXCLUDED.radio_atomico_pm,
        punto_fusion_c = EXCLUDED.punto_fusion_c,
        punto_ebullicion_c = EXCLUDED.punto_ebullicion_c,
        densidad_g_cm3 = EXCLUDED.densidad_g_cm3, estado_normal = EXCLUDED.estado_normal,
        estados_oxidacion = EXCLUDED.estados_oxidacion, radiactivo = EXCLUDED.radiactivo,
        anio_descubrimiento = EXCLUDED.anio_descubrimiento,
        descubierto_por = EXCLUDED.descubierto_por, numero_cas = EXCLUDED.numero_cas,
        color_cpk = EXCLUDED.color_cpk, fila = EXCLUDED.fila, columna = EXCLUDED.columna`;

    for (const e of elementos) {
      await client.query(sql, [
        e.numero_atomico, e.simbolo, e.nombre, e.nombre_ingles, e.masa_atomica,
        e.incertidumbre_masa_atomica, e.grupo, e.periodo, e.bloque, e.tipo, e.categoria,
        e.configuracion_electronica, e.electronegatividad_pauling, e.radio_atomico_pm,
        e.punto_fusion_c, e.punto_ebullicion_c, e.densidad_g_cm3, e.estado_normal,
        e.estados_oxidacion, e.radiactivo, e.anio_descubrimiento, e.descubierto_por,
        e.numero_cas, e.color_cpk, e.posicion_tabla.fila, e.posicion_tabla.columna,
      ]);
    }

    await client.query('COMMIT');
    console.log(`Listo: ${elementos.length} elementos cargados.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en el seed, se revirtió todo:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
