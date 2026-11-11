// Convierte una fila de la base de datos (plana) al formato JSON de la API.
function aElemento(f) {
  return {
    numero_atomico: f.numero_atomico,
    simbolo: f.simbolo,
    nombre: f.nombre,
    nombre_ingles: f.nombre_ingles,
    masa_atomica: f.masa_atomica,
    incertidumbre_masa_atomica: f.incertidumbre_masa_atomica,
    grupo: f.grupo,
    periodo: f.periodo,
    bloque: f.bloque,
    tipo: f.tipo,
    categoria: f.categoria,
    configuracion_electronica: f.configuracion_electronica,
    electronegatividad_pauling: f.electronegatividad_pauling,
    radio_atomico_pm: f.radio_atomico_pm,
    punto_fusion_c: f.punto_fusion_c,
    punto_ebullicion_c: f.punto_ebullicion_c,
    densidad_g_cm3: f.densidad_g_cm3,
    estado_normal: f.estado_normal,
    estados_oxidacion: f.estados_oxidacion,
    radiactivo: f.radiactivo,
    anio_descubrimiento: f.anio_descubrimiento,
    descubierto_por: f.descubierto_por,
    numero_cas: f.numero_cas,
    color_cpk: f.color_cpk,
    posicion_tabla: { fila: f.fila, columna: f.columna },
  };
}

module.exports = { aElemento };
