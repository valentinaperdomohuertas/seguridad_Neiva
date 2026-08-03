# Seguridad Neiva

Aplicación web para el reporte de incidentes de seguridad ciudadana en Neiva, con
mapa interactivo (Leaflet + geocodificación Nominatim), chat de soporte y panel
de administración de reportes.

## Tecnologías

- Backend: Node.js, Express.js, JWT, bcrypt
- Frontend: HTML5, CSS3, JavaScript, Leaflet
- Bases de datos: MySQL (usuarios y reportes), MongoDB (mensajes de chat)

## Módulos

- **Usuarios**: registro, login, perfil (contraseñas cifradas con bcrypt, sesión con JWT).
- **Reportes**: CRUD completo de incidentes (crear, listar, editar, cambiar estado, eliminar), con geocodificación automática de la dirección.
- **Chat**: mensajería de soporte persistida en MongoDB.
- **Mapa**: visualización de reportes sobre un mapa de Neiva con buscador de direcciones.

## Instalación

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

```
DB_HOST=, DB_USER=, DB_PASSWORD=, DB_NAME=, MONGO_URI=, JWT_SECRET=, PORT=3000
```

## Autor

Valentina Perdomo Huertas
