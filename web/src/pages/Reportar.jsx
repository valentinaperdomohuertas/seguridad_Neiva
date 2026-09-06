import React from "react";
import { useNavigate } from "react-router-dom";
import IncidenteForm from "../components/IncidenteForm.jsx";
import { registrarIncidente } from "../services/incidentesApi.js";

function Reportar() {
  const navegar = useNavigate();

  const manejarRegistro = async (incidente) => {
    await registrarIncidente(incidente);
    setTimeout(() => navegar("/incidentes"), 1200);
  };

  return (
    <section className="pagina-reportar">
      <h1>Reportar un incidente</h1>
      <p>Completa el siguiente formulario. Tu reporte será visible para las autoridades.</p>
      <IncidenteForm onRegistrar={manejarRegistro} />
    </section>
  );
}

export default Reportar;
