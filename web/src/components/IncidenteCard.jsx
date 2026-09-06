import React from "react";

/**
 * Componente de presentación (sin estado propio).
 * Recibe toda la información por props y delega las acciones al componente padre,
 * siguiendo el patrón de "componentes controlados" recomendado en React.
 */
function IncidenteCard({ incidente, onCambiarEstado, onEliminar }) {
  const colorEstado = {
    PENDIENTE: "#e0a800",
    EN_PROCESO: "#2e74b5",
    ATENDIDO: "#2e8b57",
    CERRADO: "#6c757d",
  };

  return (
    <article className="tarjeta-incidente">
      <header className="tarjeta-incidente__encabezado">
        <h3>{incidente.tipo}</h3>
        <span
          className="tarjeta-incidente__estado"
          style={{ backgroundColor: colorEstado[incidente.estado] || "#999" }}
        >
          {incidente.estado}
        </span>
      </header>
      <p className="tarjeta-incidente__descripcion">{incidente.descripcion}</p>
      <p className="tarjeta-incidente__ubicacion">📍 {incidente.ubicacion}</p>

      <div className="tarjeta-incidente__acciones">
        <select
          value={incidente.estado}
          onChange={(evento) => onCambiarEstado(incidente.id_incidente, evento.target.value)}
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="ATENDIDO">Atendido</option>
          <option value="CERRADO">Cerrado</option>
        </select>
        <button className="boton boton--peligro" onClick={() => onEliminar(incidente.id_incidente)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default IncidenteCard;
