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