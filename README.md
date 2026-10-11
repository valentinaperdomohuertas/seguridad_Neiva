# Seguridad Neiva

Aplicación web para el reporte de incidentes de seguridad ciudadana en Neiva, con
mapa interactivo (Leaflet + geocodificación Nominatim), chat de soporte y panel
de administración de reportes.

## Tecnologías generales del proyecto
- Backend: Node.js, Express.js, JWT, bcrypt
- Frontend: HTML5, CSS3, JavaScript, Leaflet
- Bases de datos: MySQL (usuarios y reportes), MongoDB (mensajes de chat)

## Módulos
- **Usuarios**: registro, login, perfil (contraseñas cifradas con bcrypt, sesión con JWT).
- **Reportes**: CRUD completo de incidentes (crear, listar, editar, cambiar estado, eliminar), con geocodificación automática de la dirección.
- **Chat**: mensajería de soporte persistida en MongoDB.
- **Mapa**: visualización de reportes sobre un mapa de Neiva con buscador de direcciones.

## Frontend en React (evidencia AA4-EV03)

Como parte del componente formativo "Desarrollo de Frontend con React JS", se implementó
una interfaz alternativa en React (carpeta `/web`) junto con una API REST propia en
Node/Express (carpeta `/api`), enfocada en el módulo de gestión de incidentes.

### Estructura
web/
├── src/
│ ├── components/ # NavBar, IncidenteCard, IncidenteForm
│ ├── pages/ # Inicio, Incidentes, Reportar
│ ├── services/ # incidentesApi.js (integración con la API REST)
│ └── App.jsx
api/
├── server.js # API REST (Express) — endpoints de incidentes
├── db.js # Conexión a MySQL (pool)

### Cómo ejecutar
cd api
npm install
npm start # http://localhost:4000

cd web
npm install
npm run dev # http://localhost:5173


## Instalación del proyecto general
```bash
git clone <URL-DE-TU-REPOSITORIO>
cd seguridad-neiva
npm install
cp .env.example .env        # completa tus credenciales de MySQL y MongoDB
mysql -u root -p < sql/schema.sql   # crea la base de datos y las tablas
npm start
```
Abre `http://localhost:3000/login.html` en el navegador.

## Variables de entorno (.env)

DB_HOST=, DB_USER=, DB_PASSWORD=, DB_NAME=, MONGO_URI=, JWT_SECRET=, PORT=3000


## Autor
Valentina Perdomo Huertas
## Documentación de endpoints (API REST, carpeta /api)

La API corre en `http://localhost:4000` y responde en formato JSON.

### Autenticación

| Método | Endpoint | Body (JSON) | Respuesta esperada |
|--------|----------|-------------|--------------------|
| POST | `/api/auth/registro` | `nombre`, `correo`, `contrasena` | `201` con los datos del usuario creado |
| POST | `/api/auth/login` | `correo`, `contrasena` | `200` con `token` (JWT) y datos del usuario |

Validaciones: campos obligatorios, formato de correo válido, contraseña de mínimo 6 caracteres y correo no repetido (`409`).

### Incidentes

| Método | Endpoint | Body (JSON) | Respuesta esperada |
|--------|----------|-------------|--------------------|
| GET | `/api/incidentes` | no lleva | `200` con la lista de incidentes |
| GET | `/api/incidentes/:id` | no lleva | `200` con el incidente, o `404` si no existe |
| POST | `/api/incidentes` | `tipo`, `descripcion`, `ubicacion`, `idUsuario` | `201` con el id creado, o `400` si faltan datos |
| PUT | `/api/incidentes/:id/estado` | `estado` | `200`, o `400` si el estado no es válido, o `404` |
| DELETE | `/api/incidentes/:id` | no lleva | `200`, o `404` si no existe |

Estados válidos: `PENDIENTE`, `EN_PROCESO`, `ATENDIDO`, `CERRADO`.

En esta versión los endpoints de incidentes no exigen token, para que el frontend en React pueda consumirlos directamente. El login genera un token JWT que queda disponible para proteger las rutas.

### Códigos de error
`400` datos inválidos, `401` credenciales incorrectas, `404` recurso no encontrado, `409` correo ya registrado, `500` error interno del servidor.
