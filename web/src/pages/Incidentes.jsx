import React, { useEffect, useState } from "react";
import IncidenteCard from "../components/IncidenteCard.jsx";
import {
  obtenerIncidentes,
  actualizarEstadoIncidente,
  eliminarIncidente,
} from "../services/incidentesApi.js";

/**
 * Página que integra el frontend con la API REST.
 * useEffect representa el ciclo de vida "al montar el componente" en React
 * (equivalente funcional de componentDidMount).
 */
function Incidentes() {
  const [incidentes, setIncidentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarIncidentes = async () => {
    setCargando(true);
    try {
      const datos = await obtenerIncidentes();
      setIncidentes(datos);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarIncidentes();
  }, []);

  const manejarCambioEstado = async (id, nuevoEstado) => {
    await actualizarEstadoIncidente(id, nuevoEstado);
    cargarIncidentes();
  };

  const manejarEliminar = async (id) => {
    await eliminarIncidente(id);
    cargarIncidentes();
  };

  if (cargando) return <p className="estado-carga">Cargando incidentes...</p>;
  if (error) return <p className="estado-error">Ocurrió un error: {error}</p>;

  return (
    <section className="pagina-incidentes">
      <h1>Incidentes reportados</h1>
      {incidentes.length === 0 ? (
        <p>No hay incidentes registrados todavía.</p>
      ) : (
        <div className="lista-incidentes">
          {incidentes.map((incidente) => (
            <IncidenteCard
              key={incidente.id_incidente}
              incidente={incidente}
              onCambiarEstado={manejarCambioEstado}
              onEliminar={manejarEliminar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Incidentes;
