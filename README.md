# Seguridad Neiva

Aplicación web de seguridad ciudadana para reportar incidentes en Neiva, consultarlos y hacer
seguimiento a su estado. Esta versión integra un **frontend en React**, una **API REST en
Node.js/Express** y una base de datos **MySQL**.

**Versión a evaluar:** rama `master`, etiqueta `v1.0.0`.

## Arquitectura

```
Frontend (React + Vite)  --HTTP/JSON-->  API REST (Express)  --SQL-->  MySQL (seguridad_neiva)
http://localhost:5173                    http://localhost:4000
```

## Estructura del repositorio

```
api/    API REST: rutas, controladores, middlewares, conexión a MySQL y esquema SQL
web/    Frontend en React (componentes, páginas y servicio de acceso a la API)
(raíz)  Aplicación base previa (app.js, routes/, controllers/, middlewares/).
        Se conserva como referencia y no hace parte de esta versión integrada.
```

## Requisitos

- Node.js 18 o superior (probado con Node 24) y npm
- MySQL 8.0
- Git

## Dependencias

| Parte | Paquetes |
|-------|----------|
| API (`api/`) | express, cors, mysql2, bcryptjs, jsonwebtoken, dotenv, nodemon (desarrollo) |
| Frontend (`web/`) | react, react-dom, react-router-dom, vite, @vitejs/plugin-react |

Se instalan con `npm install` dentro de cada carpeta.

## Configuración

### 1. Base de datos

```
mysql -u root -p < api/sql/schema.sql
```

Crea la base `seguridad_neiva` con las tablas `usuario` e `incidente`. El esquema también crea
un usuario de sistema (id 1) sin acceso, al que el frontend asocia los reportes mientras no
tiene pantalla de login.

### 2. Variables de entorno

Copia la plantilla y completa tus datos. El archivo `.env` **no se versiona**.

```
cd api
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Servidor de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | (la tuya) |
| `DB_NAME` | Base de datos | `seguridad_neiva` |
| `JWT_SECRET` | Clave para firmar los tokens | una frase larga y propia |
| `PORT` | Puerto de la API | `4000` |

## Ejecución

Abre dos terminales.

**Terminal 1 — API**

```
cd api
npm install
npm start
```

Debe mostrar: `API de Seguridad Neiva escuchando en http://localhost:4000`

**Terminal 2 — Frontend**

```
cd web
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## Documentación de endpoints

La API responde en formato JSON.

### Autenticación

| Método | Endpoint | Body (JSON) | Respuesta esperada |
|--------|----------|-------------|--------------------|
| POST | `/api/auth/registro` | `nombre`, `correo`, `contrasena` | `201` con los datos del usuario creado |
| POST | `/api/auth/login` | `correo`, `contrasena` | `200` con `token` (JWT) y datos del usuario |

Validaciones: campos obligatorios, formato de correo válido, contraseña de mínimo 6 caracteres
y correo no repetido (`409`).

### Incidentes

| Método | Endpoint | Body (JSON) | Respuesta esperada |
|--------|----------|-------------|--------------------|
| GET | `/api/incidentes` | no lleva | `200` con la lista de incidentes |
| GET | `/api/incidentes/:id` | no lleva | `200` con el incidente, o `404` si no existe |
| POST | `/api/incidentes` | `tipo`, `descripcion`, `ubicacion`, `idUsuario` | `201` con el id creado, o `400` si faltan datos |
| PUT | `/api/incidentes/:id/estado` | `estado` | `200`, o `400` si el estado no es válido, o `404` |
| DELETE | `/api/incidentes/:id` | no lleva | `200`, o `404` si no existe |

Estados válidos: `PENDIENTE`, `EN_PROCESO`, `ATENDIDO`, `CERRADO`.

Códigos de error: `400` datos inválidos, `401` credenciales incorrectas, `404` recurso no
encontrado, `409` correo ya registrado, `500` error interno.

## Seguridad

- Las credenciales se leen de variables de entorno (`api/.env`), que está en `.gitignore`.
- Las contraseñas de los usuarios se guardan cifradas con bcrypt.
- En esta versión los endpoints de incidentes no exigen token, para que el frontend los consuma
  directamente. El login y la generación del token ya están implementados en la API.
  Mejora prevista: pantalla de login en React y envío del token en cada petición.

## Autor

Valentina Perdomo Huertas
