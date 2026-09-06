// ==========================
// CONFIGURACIÓN DE LA API Y CLAVES LOCALES
// ==========================
const API_URL       = "/api";
const CLAVE_SESION  = "sn_sesion";
const CLAVE_TOKEN   = "sn_token";

// ==========================
// ESTADO EN MEMORIA (sesión actual)
// ==========================
let usuarioActual   = null;
let mapaLeaflet      = null;
let capaMarcadores   = null;

// ==========================
// CLIENTE HTTP CON TOKEN (servicio de acceso a datos en el frontend)
// ==========================
async function apiFetch(ruta, opciones = {}) {
    let token = localStorage.getItem(CLAVE_TOKEN);
    let respuesta = await fetch(API_URL + ruta, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            ...(opciones.headers || {})
        }
    });

    if (respuesta.status === 401) {
        cerrarSesion();
        throw new Error("Sesión expirada");
    }
    return respuesta;
}

// ==========================
// VERIFICAR SESIÓN AL CARGAR
// ==========================
(function verificarSesion() {
    let datos = localStorage.getItem(CLAVE_SESION);
    let token = localStorage.getItem(CLAVE_TOKEN);
    if (!datos || !token) {
        window.location.href = "login.html";
        return;
    }
    usuarioActual = JSON.parse(datos);
    actualizarPerfil();
    actualizarContadores();
    irA("inicio");
})();

// ==========================
// UTILIDADES DE INTERFAZ
// ==========================
function ocultar(id) {
    document.getElementById(id).classList.add("oculto");
}

function mostrar(id) {
    document.getElementById(id).classList.remove("oculto");
}

// ==========================
// CIERRE DE SESIÓN
// ==========================
function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_TOKEN);
    window.location.href = "login.html";
}

// ==========================
// NAVEGACIÓN ENTRE VISTAS
// ==========================
function irA(nombreVista) {
    mostrar("panel-principal");

    document.querySelectorAll(".vista").forEach(function (v) {
        v.classList.add("oculto");
    });

    let vista = document.getElementById("vista-" + nombreVista);
    if (!vista) return;
    vista.classList.remove("oculto");

    document.querySelectorAll("#menu li").forEach(function (li) {
        li.classList.remove("active");
    });
    let item = document.querySelector("#menu li[data-vista='" + nombreVista + "']");
    if (item) item.classList.add("active");

    if (nombreVista === "reportar") renderReportes();
    if (nombreVista === "inicio")   actualizarContadores();
    if (nombreVista === "chat")     renderMensajes();
    if (nombreVista === "mapa") {
        setTimeout(function () {
            inicializarMapa();
            renderizarMarcadores();
        }, 50);
    }
}

// ==========================
// MAPA INTERACTIVO (Leaflet + geocodificación Nominatim)
// No depende de la persistencia; se mantiene igual que en la versión original
// ==========================
const CENTRO_NEIVA = [2.9273, -75.2819];

const UBICACIONES_NEIVA = {
    "centro de neiva":    [2.9273, -75.2819],
    "centro":             [2.9273, -75.2819],
    "avenida circunvalar":[2.9400, -75.2700],
    "circunvalar":        [2.9400, -75.2700],
    "parque santander":   [2.9270, -75.2810],
    "santander":          [2.9270, -75.2810],
    "comuna 5":           [2.9500, -75.2900],
    "universidad surcolombiana": [2.9400, -75.2640],
    "usco":               [2.9400, -75.2640],
    "terminal de transportes": [2.9200, -75.2900],
    "terminal":           [2.9200, -75.2900],
    "calle 26":           [2.9350, -75.2750],
    "rivera":             [2.8900, -75.2600],
    "colegio julio perez":[2.9300, -75.2800],
    "barrio la flora":    [2.9250, -75.2950],
    "barrio estacion":    [2.9330, -75.2720],
    "centro comercial san pedro": [2.9280, -75.2830]
};

function obtenerCoordenadas(ubicacionTexto) {
    let texto = ubicacionTexto.toLowerCase().trim();
    for (let clave in UBICACIONES_NEIVA) {
        if (texto.includes(clave)) {
            return UBICACIONES_NEIVA[clave];
        }
    }
    let offsetLat = (Math.random() - 0.5) * 0.006;
    let offsetLng = (Math.random() - 0.5) * 0.006;
    return [CENTRO_NEIVA[0] + offsetLat, CENTRO_NEIVA[1] + offsetLng];
}

function colorEstado(estado) {
    if (estado === "Resuelto")   return "#2e9e5b";
    if (estado === "En proceso") return "#1d5a8f";
    return "#d9a441"; // Pendiente
}

async function geocodificarDireccion(direccion) {
    let query = encodeURIComponent(direccion + ", Neiva, Huila, Colombia");
    let url = "https://nominatim.openstreetmap.org/search?format=json&q=" + query + "&limit=1";
    try {
        let respuesta = await fetch(url, { headers: { "Accept-Language": "es" } });
        let datos = await respuesta.json();
        if (datos && datos.length > 0) {
            return { lat: parseFloat(datos[0].lat), lng: parseFloat(datos[0].lon) };
        }
    } catch (e) {
        console.warn("No se pudo geocodificar:", e);
    }
    return null;
}

function inicializarMapa() {
    let contenedor = document.getElementById("map");
    if (!contenedor) return;

    if (mapaLeaflet) {
        mapaLeaflet.invalidateSize();
        return;
    }

    mapaLeaflet = L.map("map").setView(CENTRO_NEIVA, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaLeaflet);

    capaMarcadores = L.layerGroup().addTo(mapaLeaflet);

    L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: "Buscar dirección en Neiva...",
        errorMessage: "No se encontró la dirección. Intenta con otra.",
        suggestTimeout: 250,
        query: "",
        collapsed: false
    }).on("markgeocode", function (e) {
        let bbox = e.geocode.bbox;
        let poly = L.polygon([
            bbox.getSouthEast(), bbox.getNorthEast(), bbox.getNorthWest(), bbox.getSouthWest()
        ]).addTo(mapaLeaflet);
        mapaLeaflet.fitBounds(poly.getBounds());
        setTimeout(function () { mapaLeaflet.removeLayer(poly); }, 2000);
    }).addTo(mapaLeaflet);
}

async function renderizarMarcadores() {
    if (!mapaLeaflet || !capaMarcadores) return;
    capaMarcadores.clearLayers();

    let reportes = await (await apiFetch("/reportes")).json();
    if (!Array.isArray(reportes) || reportes.length === 0) return;

    reportes.forEach(function (r) {
        let coords = (r.lat && r.lng) ? [r.lat, r.lng] : obtenerCoordenadas(r.ubicacion);
        let color = colorEstado(r.estado);

        let marcador = L.circleMarker(coords, {
            radius: 10, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.85
        }).addTo(capaMarcadores);

        marcador.bindPopup(`
            <div style="min-width:180px">
                <strong style="color:${color};font-size:1.05rem">${r.tipo}</strong><br>
                <small><b>Ubicación:</b> ${r.ubicacion}</small><br>
                <p style="margin:6px 0">${r.descripcion}</p>
                <span style="background:${color};color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem">${r.estado}</span><br>
                <small style="color:#888">${new Date(r.fecha).toLocaleString("es-CO")}</small>
            </div>
        `);
    });

    mapaLeaflet.invalidateSize();
}

// ==========================================================
// CRUD DE REPORTES — ahora persistido en MySQL vía la API REST
// ==========================================================

async function guardarReporte() {
    let id          = document.getElementById("reporte-id").value;
    let tipo        = document.getElementById("incidente").value;
    let ubicacion   = document.getElementById("ubicacion").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();

    if (tipo === "") { alert("Debe seleccionar el tipo de incidente."); return; }
    if (ubicacion.length < 5) { alert("La ubicación debe tener al menos 5 caracteres."); return; }
    if (descripcion.length < 10) { alert("La descripción debe tener al menos 10 caracteres."); return; }

    let coords = await geocodificarDireccion(ubicacion);
    let cuerpo = { tipo, ubicacion, descripcion, lat: coords ? coords.lat : null, lng: coords ? coords.lng : null };

    try {
        let respuesta = id
            ? await apiFetch(`/reportes/${id}`, { method: "PUT", body: JSON.stringify(cuerpo) })
            : await apiFetch(`/reportes`, { method: "POST", body: JSON.stringify(cuerpo) });

        let datos = await respuesta.json();
        if (!respuesta.ok) { alert(datos.error); return; }

        alert(id ? "Reporte actualizado correctamente." : "Reporte enviado correctamente.");
        cancelarEdicion();
        renderReportes();
        actualizarContadores();
    } catch (e) {
        // apiFetch ya redirige a login si la sesión expiró
    }
}

async function renderReportes() {
    let reportes   = await (await apiFetch("/reportes")).json();
    let contenedor = document.getElementById("lista-reportes");
    contenedor.innerHTML = "";

    document.getElementById("conteo-reportes").textContent = reportes.length;

    if (reportes.length === 0) {
        contenedor.innerHTML = "<p class='vacio'>Aún no has registrado reportes.</p>";
        return;
    }

    reportes.forEach(function (r) {
        let item = document.createElement("div");
        item.className = "reporte-item";
        item.innerHTML = `
            <div class="reporte-info">
                <strong>${r.tipo}</strong> — ${r.ubicacion}
                <p>${r.descripcion}</p>
                <small>${new Date(r.fecha).toLocaleString("es-CO")}</small>
            </div>
            <div class="reporte-acciones">
                <select onchange="cambiarEstado('${r.id}', this.value)" class="estado-${r.estado.replace(/\s/g,'')}">
                    <option value="Pendiente"  ${r.estado === "Pendiente"  ? "selected" : ""}>Pendiente</option>
                    <option value="En proceso" ${r.estado === "En proceso" ? "selected" : ""}>En proceso</option>
                    <option value="Resuelto"   ${r.estado === "Resuelto"   ? "selected" : ""}>Resuelto</option>
                </select>
                <button class="btn-editar"   onclick="editarReporte('${r.id}')"><i class="fi fi-rr-pencil"></i> Editar</button>
                <button class="btn-eliminar" onclick="eliminarReporte('${r.id}')"><i class="fi fi-rr-trash"></i> Eliminar</button>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

async function editarReporte(id) {
    let reportes = await (await apiFetch("/reportes")).json();
    let reporte  = reportes.find(function (r) { return String(r.id) === String(id); });
    if (!reporte) return;

    document.getElementById("reporte-id").value    = reporte.id;
    document.getElementById("incidente").value    = reporte.tipo;
    document.getElementById("ubicacion").value    = reporte.ubicacion;
    document.getElementById("descripcion").value  = reporte.descripcion;

    document.getElementById("titulo-form-reporte").innerHTML = '<i class="fi fi-rr-pencil"></i> Editando reporte';
    document.getElementById("btn-guardar-reporte").innerHTML = '<i class="fi fi-rr-disk"></i> Guardar cambios';
    mostrar("btn-cancelar-edicion");

    document.getElementById("incidente").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicion() {
    document.getElementById("reporte-id").value    = "";
    document.getElementById("incidente").value     = "";
    document.getElementById("ubicacion").value    = "";
    document.getElementById("descripcion").value  = "";

    document.getElementById("titulo-form-reporte").innerHTML = '<i class="fi fi-rr-document-signed"></i> Reportar incidente';
    document.getElementById("btn-guardar-reporte").innerHTML = '<i class="fi fi-rr-paper-plane"></i> Enviar reporte';
    ocultar("btn-cancelar-edicion");
}

async function cambiarEstado(id, nuevoEstado) {
    await apiFetch(`/reportes/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado: nuevoEstado }) });
    renderReportes();
    actualizarContadores();
}

async function eliminarReporte(id) {
    let reportes = await (await apiFetch("/reportes")).json();
    let reporte  = reportes.find(function (r) { return String(r.id) === String(id); });
    if (reporte && reporte.estado === "En proceso") {
        alert("No se puede eliminar un reporte que está 'En proceso'. Cámbialo a Pendiente o Resuelto primero.");
        return;
    }
    if (!confirm("¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.")) return;

    let respuesta = await apiFetch(`/reportes/${id}`, { method: "DELETE" });
    if (respuesta.ok) { renderReportes(); actualizarContadores(); }
}

// ==========================
// CONTADORES DINÁMICOS
// ==========================
async function actualizarContadores() {
    let reportes = await (await apiFetch("/reportes")).json();
    let proceso   = reportes.filter(function (r) { return r.estado === "En proceso"; }).length;
    let resueltos = reportes.filter(function (r) { return r.estado === "Resuelto"; }).length;

    document.getElementById("card-total").textContent     = reportes.length;
    document.getElementById("card-proceso").textContent   = proceso;
    document.getElementById("card-resueltos").textContent = resueltos;
}

// ==========================
// CHAT — ahora persistido en MongoDB vía la API
// ==========================
async function enviarMensaje() {
    let input = document.getElementById("mensaje-nuevo");
    let texto = input.value.trim();
    if (texto === "") return;

    input.value = "";
    await apiFetch("/chat", { method: "POST", body: JSON.stringify({ contenido: texto }) });
    renderMensajes();
}

async function renderMensajes() {
    let mensajes   = await (await apiFetch("/chat")).json();
    let contenedor = document.getElementById("mensajes-chat");
    contenedor.innerHTML = "";

    mensajes.forEach(function (m) {
        let p = document.createElement("p");
        p.innerHTML = `<strong>${m.emisor}:</strong> ${m.contenido}`;
        contenedor.appendChild(p);
    });
    contenedor.scrollTop = contenedor.scrollHeight;
}

// ==========================
// PERFIL
// ==========================
function actualizarPerfil() {
    if (!usuarioActual) return;
    document.getElementById("perfil-nombre").textContent = usuarioActual.nombre;
    document.getElementById("perfil-cedula").textContent = usuarioActual.cedula;
    document.getElementById("perfil-correo").textContent = usuarioActual.correo || "No especificado";
}
