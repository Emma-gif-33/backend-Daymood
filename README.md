# DayMood — API Backend

Aplicación móvil de registro de emociones y hábitos con foro anónimo y emociones personalizadas.

**Equipo:** Equipo Lúmina  
**Repositorio backend:** `daymood-api`  
**Repositorio infraestructura:** `infra-Daymood`

---

## Arquitectura

El sistema sigue una arquitectura orientada a servicios (SOA) con tres repositorios independientes:

- **`app_daymood`** — Frontend Android (Kotlin + Jetpack Compose)
- **`daymood-api`** — Backend REST (Node.js + Express + TypeScript)
- **`infra-Daymood`** — Infraestructura de base de datos (PostgreSQL en Railway vía Docker)

Cada dominio del backend está encapsulado en su propio servicio con la separación: `routes → controllers → services → repositories`. Los servicios son: `userService`, `emotionService`, `recordService`, `forumService`, `formService`, `analiticsService` y `bigQueryService`.

```
daymood-api/src/
├── app.ts
├── server.ts
├── config/
│   └── firebase.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   ├── logger.middleware.ts
│   ├── validate.middleware.ts
│   ├── apiKey.middleware.ts
│   └── https.middleware.ts
├── schemas/
│   └── record.schemas.ts
├── prisma/
│   └── prisma.client.ts
├── emotionService/
├── recordService/
├── userService/
├── forumService/
├── formService/
├── analiticsService/
└── bigQueryService/
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Android / Kotlin / Jetpack Compose |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma 5.x |
| Base de datos | PostgreSQL (Railway vía Docker) |
| Autenticación | Firebase Auth (JWT verificado con Firebase Admin SDK) |
| Storage | Firebase Storage (imágenes de emociones personalizadas) |
| Benchmarking | Google Cloud BigQuery |
| Testing móvil | Appium 2.x + WebdriverIO 8.x + Mocha |
| Despliegue backend | Render |

---

## Requisitos previos

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (o Docker para levantar infra-Daymood)
- Cuenta de Firebase con proyecto configurado
- Credenciales de Google Cloud (BigQuery) en formato JSON de service account

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/<org>/daymood-api.git
cd daymood-api
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/daymood_db"
NODE_ENV=development
BIGQUERY_API_KEY=tu-clave-secreta
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
```

> **Importante:** nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

### 3. Levantar la base de datos (con infra-Daymood)

```bash
# En el repositorio infra-Daymood
docker compose up -d
```

### 4. Ejecutar migraciones con Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar el servidor

```bash
npm run dev       # desarrollo con ts-node / nodemon
npm run build     # compilar TypeScript
npm start         # producción
```

El servidor queda disponible en `http://localhost:3000`.

---

## Variables de entorno — referencia completa

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | ✅ |
| `NODE_ENV` | `development` o `production` | ✅ |
| `BIGQUERY_API_KEY` | Clave para proteger el endpoint `/api/bigquery` | ✅ |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | JSON del service account de Google Cloud | ✅ |
| `FIREBASE_STORAGE_BUCKET` | Bucket de Firebase Storage | ✅ |

En Render, estas variables se configuran desde el panel de entorno del servicio, nunca en el código fuente.

---

## API — Referencia de endpoints

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <firebase-id-token>
```

Las respuestas siguen el formato consistente:
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "descripción del error" }
```

---

### Usuarios `/api/users`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/users/register` | ❌ | Registrar usuario nuevo |
| POST | `/api/users/login` | ❌ | Login (devuelve datos del usuario) |
| GET | `/api/users/me` | ✅ | Obtener perfil del usuario autenticado |

**POST `/api/users/register` — Body:**
```json
{
  "firebase_uid": "abc123",
  "email": "usuario@ejemplo.com",
  "birth_day": "2000-05-15",
  "username": "nadia"
}
```

**Respuesta 201:**
```json
{ "success": true, "data": { "id": "uuid", "email": "usuario@ejemplo.com", "username": "nadia" } }
```

---

### Emociones `/api/emotions`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/emotions` | ✅ | Listar emociones del usuario (predeterminadas + propias) |
| POST | `/api/emotions` | ✅ | Crear emoción personalizada (multipart/form-data) |
| DELETE | `/api/emotions/:id` | ✅ | Eliminar emoción propia |
| GET | `/api/emotions/explore?page=1&limit=10` | ✅ | Descubrir emociones de otros usuarios (paginado) |
| GET | `/api/emotions/favorites` | ✅ | Listar favoritos |
| POST | `/api/emotions/favorites/:id` | ✅ | Agregar emoción a favoritos |
| DELETE | `/api/emotions/favorites/:id` | ✅ | Eliminar emoción de favoritos |

**GET `/api/emotions/explore` — Query params:**
- `page` (default: 1)
- `limit` (default: 10, máximo: 50)

**Respuesta 200:**
```json
{
  "success": true,
  "data": [ { "id": "uuid", "name": "Nostalgia", "img_url": "https://...", "categories": { "id": 8, "name": "Alegría" } } ],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

**POST `/api/emotions` — Body (multipart/form-data):**
- `name` (string, 2–30 caracteres)
- `id_category` (número, 8–15)
- `image` (archivo: jpg, png, webp, gif)
- `save_to_favorites` (string `"true"` | `"false"`, opcional)

---

### Registros diarios `/api/records`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/records` | ✅ | Crear registro diario (emoción + hábitos) |
| GET | `/api/records` | ✅ | Listar registros del usuario |
| GET | `/api/records/:id` | ✅ | Obtener registro específico |
| PUT | `/api/records/:id` | ✅ | Actualizar registro |
| DELETE | `/api/records/:id` | ✅ | Eliminar registro |

**POST `/api/records` — Body:**
```json
{
  "date": "2025-04-15",
  "note": "Fue un buen día",
  "emotion_id": "uuid-de-emocion",
  "habit_ids": ["uuid-habito-1", "uuid-habito-2"]
}
```

---

### Foro `/api/forums`, `/api/posts`, `/api/comments`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/forums/category/:categoryId` | ✅ | Foros disponibles para el usuario (filtrado por edad) |
| GET | `/api/forums/detail/:id` | ❌ | Detalle de un foro |
| GET | `/api/posts?forumId=uuid&page=1&limit=10` | ✅ | Posts de un foro (paginado) |
| POST | `/api/posts` | ✅ | Crear post |
| GET | `/api/posts/:id` | ✅ | Obtener post con comentarios |
| PATCH | `/api/posts/:id` | ✅ | Editar post (solo autor) |
| DELETE | `/api/posts/:id` | ✅ | Eliminar post (solo autor) |
| POST | `/api/comments` | ✅ | Crear comentario |
| DELETE | `/api/comments/:id` | ✅ | Eliminar comentario (solo autor) |

**GET `/api/posts` — Query params:**
- `forumId` (requerido, UUID)
- `page` (default: 1)
- `limit` (default: 10, máximo: 50)

**Respuesta 200:**
```json
{
  "success": true,
  "data": [ { "id": "uuid", "title": "Mi experiencia", "content": "...", "created_at": "2025-04-15T10:00:00Z" } ],
  "total": 30,
  "page": 1,
  "totalPages": 3
}
```

**POST `/api/posts` — Body:**
```json
{
  "title": "Mi experiencia con la ansiedad",
  "content": "Hoy quise compartir algo que me pasó...",
  "id_category": 3,
  "id_forum": "uuid-del-foro"
}
```

**POST `/api/comments` — Body:**
```json
{
  "content": "Gracias por compartir esto",
  "id_post": "uuid-del-post"
}
```

---

### Estadísticas `/api/stats`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/stats` | ✅ | Estadísticas de emociones y hábitos del usuario |

---

### BigQuery `/api/bigquery`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/bigquery/cutoff` | API Key (`x-api-key`) | Exportar métricas diarias a BigQuery |

**Headers requeridos:**
```
x-api-key: <BIGQUERY_API_KEY>
```

---

## Seguridad

El sistema implementa los siguientes controles:

- **Autenticación JWT** — Todos los endpoints protegidos verifican el token de Firebase con Firebase Admin SDK. El token expirado devuelve 401 con mensaje específico.
- **Validación de entradas con Zod** — Los endpoints POST/PATCH validan el body antes de llegar al controlador. Los campos no declarados en el schema son eliminados automáticamente.
- **Rate limiting** — 100 requests por IP cada 15 minutos en general; 10 intentos en auth; 5 exportaciones por hora en BigQuery.
- **API Key para BigQuery** — El endpoint de exportación de métricas está protegido con una clave secreta almacenada en variables de entorno.
- **Redirección HTTPS** — En producción, cualquier request HTTP es redirigido automáticamente a HTTPS.
- **Logger con sanitización** — El logger de requests redacta automáticamente campos sensibles (`password`, `token`, `secret`, `authorization`) antes de escribir en consola.
- **Errores sin detalles internos** — El error handler nunca expone stack traces en producción. Los errores 500 devuelven únicamente `"Error interno del servidor"`.
- **CORS** — No aplica a esta aplicación: el cliente es una app móvil nativa (Android/Kotlin), no un navegador web. CORS es un mecanismo de seguridad del navegador y no es relevante para clientes HTTP nativos.
- **Variables de entorno** — Todas las credenciales (base de datos, Firebase, BigQuery, API keys) se gestionan exclusivamente mediante variables de entorno. Ninguna credencial está hardcodeada en el código fuente ni expuesta en el repositorio.

---

## Pruebas

### Pruebas de integración / API — Postman

Se realizaron pruebas manuales de todos los flujos principales usando Postman. La colección de pruebas está disponible en el archivo `DayMood.postman_collection.json` en la raíz del repositorio.

Flujos probados:
- Registro e inicio de sesión de usuario
- Creación, lectura y eliminación de registros diarios con hábitos
- Creación de emoción personalizada con imagen
- Flujo completo del foro: obtener foros → crear post → comentar → eliminar
- Exportación de métricas a BigQuery
- Manejo de errores: token inválido, campos faltantes, usuario duplicado

### Pruebas E2E móvil — Appium + WebdriverIO

Stack: Appium 2.x + WebdriverIO 8.x + Mocha, sobre dispositivo Android físico.

Casos implementados:
- **TC-001:** Login con credenciales válidas
- **TC-002:** Login con contraseña incorrecta
- **TC-003:** Login con campos vacíos
- **TC-004:** Login con email inválido

```bash
# Ejecutar pruebas móviles (requiere Appium server activo y dispositivo conectado)
npx wdio run wdio.conf.js
```

---

## Uso de inteligencia artificial

Durante el desarrollo de este proyecto se utilizó **Claude (Anthropic)** como asistente de programación. A continuación se detalla en qué áreas y cómo se usó:

| Área | Uso |
|---|---|
| Middlewares de seguridad | Apoyo en la implementación de `validate.middleware.ts` (Zod), `rateLimit.middleware.ts`, `logger.middleware.ts` y `apiKey.middleware.ts` |
| Resolución de errores de tipos | Corrección de errores de tipado TypeScript/Prisma (tipos generados por el ORM) |
| Configuración de BigQuery SDK | Apoyo en la configuración del cliente BigQuery con service account desde variables de entorno |
| Pruebas con Appium | Generación y depuración de selectores XPath para elementos de Jetpack Compose |
| Documentación | Apoyo en la redacción de este README y el API Spec |

**Todo el código generado con apoyo de IA fue revisado, comprendido y adaptado por el equipo** al contexto específico del proyecto. La arquitectura, el diseño del schema de base de datos, la lógica de negocio (filtrado por edad en foros, cálculo de estadísticas, integración Firebase-Prisma) y las decisiones técnicas del proyecto son propias del equipo.

---

## Despliegue en producción (Render)

El backend está desplegado en Render. Las variables de entorno se configuran desde el panel de Render (Settings → Environment).

URL base: `https://daymood-api.onrender.com`

La base de datos PostgreSQL está desplegada en Railway mediante el repositorio `infra-Daymood`.
