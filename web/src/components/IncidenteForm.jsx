import React, { useState } from "react";

/**
 * Formulario controlado: cada campo está enlazado al estado del componente (useState),
 * y el evento onSubmit delega el envío al componente padre mediante props (onRegistrar).
 */
function IncidenteForm({ onRegistrar }) {
  const [formulario, setFormulario] = useState({
    tipo: "",
    descripcion: "",
    ubicacion: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!formulario.tipo || !formulario.descripcion || !formulario.ubicacion) {
      setMensaje({ tipo: "error", texto: "Todos los campos son obligatorios." });
      return;
    }

    setEnviando(true);
    setMensaje(null);
    try {
      await onRegistrar({ ...formulario, idUsuario: 1 });
      setFormulario({ tipo: "", descripcion: "", ubicacion: "" });
      setMensaje({ tipo: "exito", texto: "Incidente registrado correctamente." });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <div className="formulario__campo">
        <label htmlFor="tipo">Tipo de incidente</label>
        <select id="tipo" name="tipo" value={formulario.tipo} onChange={manejarCambio}>
          <option value="">Seleccione una opción</option>
          <option value="Robo">Robo</option>
          <option value="Accidente">Accidente</option>
          <option value="Actividad sospechosa">Actividad sospechosa</option>
          <option value="Vandalismo">Vandalismo</option>
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formulario.descripcion}
          onChange={manejarCambio}
          placeholder="Describe brevemente lo ocurrido"
        />
      </div>

      <div className="formulario__campo">
        <label htmlFor="ubicacion">Ubicación</label>
        <input
          id="ubicacion"
          name="ubicacion"
          type="text"
          value={formulario.ubicacion}
          onChange={manejarCambio}
          placeholder="Barrio, calle o punto de referencia"
        />
      </div>

      {mensaje && (
        <p className={`formulario__mensaje formulario__mensaje--${mensaje.tipo}`}>
          {mensaje.texto}
        </p>
      )}

      <button type="submit" className="boton boton--primario" disabled={enviando}>
        {enviando ? "Enviando..." : "Reportar incidente"}
      </button>
    </form>
  );
}

export default IncidenteForm;
