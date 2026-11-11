-- Tabla de elementos químicos (118 filas).
-- Se recrea desde cero cada vez que se ejecuta "npm run seed" (los datos se vuelven a cargar desde data/elementos.json).
DROP TABLE IF EXISTS elementos;
CREATE TABLE elementos (
  numero_atomico              SMALLINT PRIMARY KEY CHECK (numero_atomico BETWEEN 1 AND 118),
  simbolo                     VARCHAR(3) NOT NULL UNIQUE,
  nombre                      VARCHAR(40) NOT NULL,
  nombre_ingles               VARCHAR(40) NOT NULL,
  masa_atomica                DOUBLE PRECISION,
  incertidumbre_masa_atomica  DOUBLE PRECISION,
  grupo                       SMALLINT CHECK (grupo BETWEEN 1 AND 18),
  periodo                     SMALLINT NOT NULL CHECK (periodo BETWEEN 1 AND 7),
  bloque                      CHAR(1) NOT NULL CHECK (bloque IN ('s','p','d','f')),
  tipo                        VARCHAR(20) NOT NULL,
  categoria                   VARCHAR(40) NOT NULL,
  configuracion_electronica   VARCHAR(60),
  electronegatividad_pauling  DOUBLE PRECISION,
  radio_atomico_pm            DOUBLE PRECISION,
  punto_fusion_c              DOUBLE PRECISION,
  punto_ebullicion_c          DOUBLE PRECISION,
  densidad_g_cm3              DOUBLE PRECISION,
  estado_normal               VARCHAR(10),
  estados_oxidacion           SMALLINT[],
  radiactivo                  BOOLEAN NOT NULL DEFAULT FALSE,
  anio_descubrimiento         SMALLINT,
  descubierto_por             TEXT,
  numero_cas                  VARCHAR(20),
  color_cpk                   VARCHAR(7),
  fila                        SMALLINT NOT NULL,
  columna                     SMALLINT NOT NULL
);

-- Índices para los filtros más usados por la API
CREATE INDEX IF NOT EXISTS idx_elementos_grupo     ON elementos (grupo);
CREATE INDEX IF NOT EXISTS idx_elementos_periodo   ON elementos (periodo);
CREATE INDEX IF NOT EXISTS idx_elementos_categoria ON elementos (categoria);
