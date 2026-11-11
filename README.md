# API Tabla Periódica IUPAC

API REST con los 118 elementos de la Tabla Periódica (datos en español).
Stack: **Node.js + Express + PostgreSQL**, desplegable en **Vercel** (con Neon como base de datos).

## Estructura

```
tabla-periodica-api/
├── data/elementos.json     ← los datos originales (118 elementos)
├── db/schema.sql           ← define la tabla "elementos" en PostgreSQL
├── scripts/seed.js         ← carga el JSON dentro de PostgreSQL
├── src/
│   ├── index.js            ← punto de entrada (crea la app Express)
│   ├── db.js               ← conexión a PostgreSQL
│   ├── routes/             ← un archivo por grupo de endpoints
│   └── utils/              ← validaciones y formato de respuesta
├── .env.example            ← plantilla de variables de entorno
└── package.json
```

## Cómo funciona (flujo de datos)

1. `data/elementos.json` es solo la **fuente**. La API **no lo lee** al responder.
2. `npm run seed` copia esos datos a la tabla `elementos` de PostgreSQL (una sola vez).
3. Cada petición a la API hace una consulta SQL a PostgreSQL y devuelve el resultado en JSON.

## Endpoints

| Método | Ruta | Qué devuelve |
|---|---|---|
| GET | `/` | Descripción de la API |
| GET | `/api/v1/salud` | Comprueba API y base de datos |
| GET | `/api/v1/elementos` | Todos los elementos (con filtros) |
| GET | `/api/v1/elementos/:numero` | Un elemento por número atómico (1–118) |
| GET | `/api/v1/elementos/simbolo/:simbolo` | Un elemento por símbolo (`Fe`, `fe`) |
| GET | `/api/v1/grupos/:n` | Elementos de un grupo (1–18) |
| GET | `/api/v1/periodos/:n` | Elementos de un período (1–7) |
| GET | `/api/v1/categorias` | Categorías y cuántos elementos tiene cada una |

Filtros de `/api/v1/elementos` (se pueden combinar):
`?categoria=Gas noble` · `?tipo=Metal` · `?bloque=p` · `?estado=gas` · `?grupo=18` · `?periodo=3` · `?buscar=hidr`

Ejemplo: `/api/v1/elementos?periodo=2&bloque=p&estado=gas`

Errores: `400` (parámetro inválido), `404` (no existe), `500` (error interno). Siempre en JSON: `{ "error": "mensaje" }`.

## Unidades de medida

| Campo | Unidad |
|---|---|
| `masa_atomica` | u (unidad de masa atómica) |
| `radio_atomico_pm` | pm (picómetros) |
| `punto_fusion_c`, `punto_ebullicion_c` | °C (grados Celsius) |
| `densidad_g_cm3` | g/cm³ |
| `electronegatividad_pauling` | sin unidad (escala de Pauling) |

`null` significa dato desconocido o no medido. `npm run seed` borra y vuelve a crear la tabla `elementos` cada vez, así que si cambias `data/elementos.json` basta con repetirlo.

## Uso en tu computador (Windows / PowerShell)

1. Instala dependencias:
   ```powershell
   npm install
   ```
2. Crea tu archivo de variables:
   ```powershell
   copy .env.example .env
   ```
   Edita `.env` y pon tu `DATABASE_URL` (PostgreSQL local, o la de Neon).
3. Carga los datos en la base (crea la tabla y los 118 elementos):
   ```powershell
   npm run seed
   ```
4. Levanta la API:
   ```powershell
   npm run dev
   ```
5. Abre `http://localhost:3000/api/v1/elementos/26` en el navegador.

## Despliegue en Vercel + Neon

1. Sube el proyecto a un repositorio de GitHub (el `.gitignore` ya excluye `node_modules` y `.env`).
2. En vercel.com: **Add New → Project**, elige el repositorio e **Import**. Vercel detecta Express solo (usa `src/index.js`).
3. En el proyecto de Vercel: pestaña **Storage** (o Marketplace) → agrega **Neon (Postgres)** y conéctalo al proyecto.
   Vercel agrega las variables de entorno de conexión. Revisa en **Settings → Environment Variables** cómo se llama la que contiene la URL (normalmente `DATABASE_URL`; la API también acepta `POSTGRES_URL`).
4. Carga los datos en Neon **desde tu computador**: copia esa URL en tu `.env` local como `DATABASE_URL` y ejecuta `npm run seed`.
5. Vuelve a desplegar (o haz un push) y prueba `https://TU-PROYECTO.vercel.app/api/v1/salud`.

Nota: `express.static()` no sirve archivos en Vercel; los archivos estáticos (el futuro frontend, por ejemplo) van en la carpeta `public/`.
