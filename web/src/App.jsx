import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Inicio from "./pages/Inicio.jsx";
import Incidentes from "./pages/Incidentes.jsx";
import Reportar from "./pages/Reportar.jsx";

/**
 * Componente raíz de la aplicación.
 * Define la estructura de navegación (React Router) y compone
 * el resto de los componentes de la interfaz.
 */
function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app__contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/incidentes" element={<Incidentes />} />
          <Route path="/reportar" element={<Reportar />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
