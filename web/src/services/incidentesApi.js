// Servicio centralizado para consumir la API REST de incidentes.
// Aísla las llamadas HTTP del resto de los componentes (separación de responsabilidades).

const BASE_URL = "http://localhost:4000/api/incidentes";

export async function obtenerIncidentes() {
  const respuesta = await fetch(BASE_URL);
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los incidentes.");
  }
  return respuesta.json();
}

export async function registrarIncidente(incidente) {
  const respuesta = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidente),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.mensaje || "No se pudo registrar el incidente.");
  }
  return respuesta.json();
}

export async function actualizarEstadoIncidente(id, estado) {
  const respuesta = await fetch(`${BASE_URL}/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el estado del incidente.");
  }
  return respuesta.json();
}

export async function eliminarIncidente(id) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el incidente.");
  }
  return respuesta.json();
}
