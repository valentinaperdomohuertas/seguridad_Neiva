# Seguridad Neiva — Frontend (React)

## Descripción
Interfaz web desarrollada en **React** (con Vite) para el proyecto Seguridad Neiva.
Permite a los ciudadanos reportar incidentes de seguridad, consultar los incidentes
existentes y hacer seguimiento a su estado, consumiendo una API REST propia.

## Estructura del proyecto

```
web/
├── src/
│   ├── components/
│   │   ├── NavBar.jsx          # Navegación principal (reutilizable)
│   │   ├── IncidenteCard.jsx   # Tarjeta de incidente (componente controlado por props)
│   │   └── IncidenteForm.jsx   # Formulario controlado (useState + eventos)
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── Incidentes.jsx      # Consume la API (useEffect + useState)
│   │   └── Reportar.jsx
│   ├── services/
│   │   └── incidentesApi.js    # Integración con la API REST (fetch)
│   ├── styles/
│   │   └── estilos.css
│   ├── App.jsx                 # Enrutamiento (react-router-dom)
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js

api/
├── server.js       # API REST (Express) — endpoints de incidentes
├── db.js           # Conexión a MySQL (pool)
└── package.json
```

## Componentes implementados

| Componente        | Tipo           | Justificación |
|--------------------|----------------|---------------|
| `NavBar`           | Presentacional | Navegación reutilizable en todas las páginas. |
| `IncidenteForm`    | Controlado     | Captura y valida el reporte de un nuevo incidente (formularios, `useState`, eventos `onChange`/`onSubmit`). |
| `IncidenteCard`    | Presentacional | Muestra un incidente y delega acciones (cambiar estado, eliminar) al padre vía props. |
| `Inicio`, `Incidentes`, `Reportar` | Páginas | Componen la estructura de navegación del sitio. |

## Tecnologías
- React 18 + Vite
- React Router DOM (navegación)
- Node.js + Express (API REST)
- MySQL (persistencia, base de datos `seguridad_neiva`)

## Cómo ejecutar

### 1. API
```
cd api
npm install
# Configura tu contraseña de MySQL en db.js
npm start
```
La API queda disponible en `http://localhost:4000`.

### 2. Frontend
```
cd web
npm install
npm run dev
```
La aplicación queda disponible en `http://localhost:5173`.

## Autor
Valentina Perdomo Huertas
