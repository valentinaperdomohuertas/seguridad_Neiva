import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Componente de navegación principal.
 * Reutilizable en toda la aplicación: se importa una sola vez en App.jsx.
 */
function NavBar() {
  const enlaceClase = ({ isActive }) => (isActive ? "nav-link nav-link--activo" : "nav-link");

  return (
    <nav className="navbar">
      <div className="navbar__marca">🛡️ Seguridad Neiva</div>
      <div className="navbar__enlaces">
        <NavLink to="/" className={enlaceClase} end>
          Inicio
        </NavLink>
        <NavLink to="/incidentes" className={enlaceClase}>
          Incidentes
        </NavLink>
        <NavLink to="/reportar" className={enlaceClase}>
          Reportar
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
