import React from "react";
import { Link } from "react-router-dom";

function Inicio() {
  return (
    <section className="pagina-inicio">
      <h1>Bienvenido a Seguridad Neiva</h1>
      <p>
        Plataforma ciudadana para el reporte de incidentes de seguridad, consulta de
        estados y seguimiento por parte de las autoridades.
      </p>
      <div className="pagina-inicio__acciones">
        <Link to="/reportar" className="boton boton--primario">
          Reportar un incidente
        </Link>
        <Link to="/incidentes" className="boton boton--secundario">
          Ver incidentes reportados
        </Link>
      </div>
    </section>
  );
}

export default Inicio;
