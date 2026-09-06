// ==========================
// CONFIGURACIÓN DE LA API
// ==========================
const API_URL      = "/api/usuarios";
const CLAVE_SESION = "sn_sesion";
const CLAVE_TOKEN  = "sn_token";

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
// LOGIN / REGISTRO
// ==========================
function mostrarRegistro() {
    ocultar("seccion-login");
    mostrar("seccion-registro");
}

function mostrarLogin() {
    ocultar("seccion-registro");
    mostrar("seccion-login");
}

async function registrarUsuario() {
    let nombre   = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let cedula   = document.getElementById("cedula").value.trim();
    let fecha    = document.getElementById("fecha").value;
    let correo   = document.getElementById("reg-correo").value.trim();
    let clave    = document.getElementById("reg-clave").value.trim();

    if (nombre === "" || apellido === "" || cedula === "" || fecha === "" || correo === "" || clave === "") {
        alert("Debe completar toda la información.");
        return;
    }
    if (clave.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres.");
        return;
    }

    try {
        let respuesta = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, apellido, cedula, fecha, correo, clave })
        });
        let datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error);
            return;
        }

        alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        document.querySelectorAll("#seccion-registro input").forEach(function (campo) {
            campo.value = "";
        });
        mostrarLogin();
    } catch (error) {
        alert("No se pudo conectar con el servidor. Verifica que esté encendido.");
    }
}

async function iniciarSesion() {
    let correo = document.getElementById("correo").value.trim();
    let clave  = document.getElementById("clave").value.trim();

    if (correo === "" || clave === "") {
        alert("Complete todos los campos.");
        return;
    }

    try {
        let respuesta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, clave })
        });
        let datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error);
            return;
        }

        localStorage.setItem(CLAVE_TOKEN, datos.token);
        localStorage.setItem(CLAVE_SESION, JSON.stringify(datos.usuario));
        window.location.href = "index.html";
    } catch (error) {
        alert("No se pudo conectar con el servidor. Verifica que esté encendido.");
    }
}
