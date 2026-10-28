/* ==================================
   LOGIN MODAL DE LA BIBLIOTECA UDI
   Sesión de demostración en el navegador
================================== */

(function () {
    "use strict";

    const CLAVE_SESION = "bibliotecaSesionUDI";
    const CLAVE_USUARIOS = "biblioUsuarios";

    function inicializarUsuarios() {
        try {
            const raw = localStorage.getItem(CLAVE_USUARIOS);
            if (!raw) {
                const iniciales = [
                    { id: "u1", correo: "estudiante@universidad.edu", nombre: "Estudiante", rol: "Estudiante", activo: true },
                    { id: "u2", correo: "bibliotecario@universidad.edu", nombre: "Bibliotecario", rol: "Bibliotecario", activo: true },
                    { id: "u3", correo: "admin@universidad.edu", nombre: "Administrador", rol: "Administrador", activo: true }
                ];
                localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(iniciales));
                return iniciales;
            }
            return JSON.parse(raw);
        } catch (e) {
            return [
                { correo: "estudiante@universidad.edu", rol: "Estudiante", activo: true },
                { correo: "bibliotecario@universidad.edu", rol: "Bibliotecario", activo: true },
                { correo: "admin@universidad.edu", rol: "Administrador", activo: true }
            ];
        }
    }

    const usuariosSistema = inicializarUsuarios();

    const usuariosCredenciales = [
        { correo: "estudiante@universidad.edu", contrasena: "estudiante123", rol: "Estudiante" },
        { correo: "bibliotecario@universidad.edu", contrasena: "biblio123", rol: "Bibliotecario" },
        { correo: "admin@universidad.edu", contrasena: "admin123", rol: "Administrador" }
    ];

    const modal = document.getElementById("modalLogin");
    const formulario = document.getElementById("formularioLogin");
    const campoCorreo = document.getElementById("correo");
    const campoContrasena = document.getElementById("contrasena");
    const mensaje = document.getElementById("mensajeLogin");
    const botonCerrar = document.getElementById("cerrarLogin");
    const botonAbrir = document.getElementById("abrirLogin");
    const botonSalir = document.getElementById("cerrarSesionNav");
    const usuarioNav = document.getElementById("usuarioNav");
    const usuarioAvatar = document.getElementById("usuarioAvatar");
    const usuarioNavNombre = document.getElementById("usuarioNavNombre");
    const usuarioNavCorreo = document.getElementById("usuarioNavCorreo");

    if (!modal || !formulario || !campoCorreo || !campoContrasena || !mensaje) {
        return;
    }

    let ultimoFoco = null;

    function leerSesion() {
        try {
            const guardada = sessionStorage.getItem(CLAVE_SESION);
            if (!guardada) return null;
            const sesion = JSON.parse(guardada);
            if (!sesion || typeof sesion.correo !== "string" || !sesion.rol) return null;
            return sesion;
        } catch (e) {
            return null;
        }
    }

    function guardarSesion(usuario) {
        try {
            sessionStorage.setItem(CLAVE_SESION, JSON.stringify({
                correo: usuario.correo,
                rol: usuario.rol
            }));
            return true;
        } catch (e) {
            return false;
        }
    }

    function borrarSesion() {
        try {
            sessionStorage.removeItem(CLAVE_SESION);
        } catch (e) {}
    }

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = "mensaje-login " + tipo;
        mensaje.hidden = false;
    }

    function ocultarMensaje() {
        mensaje.textContent = "";
        mensaje.className = "mensaje-login";
        mensaje.hidden = true;
    }

    function actualizarNavbar() {
        const sesion = leerSesion();
        if (sesion) {
            if (usuarioNav) usuarioNav.hidden = false;
            if (usuarioAvatar) usuarioAvatar.textContent = sesion.correo.charAt(0).toUpperCase();
            if (usuarioNavNombre) usuarioNavNombre.textContent = sesion.rol;
            if (usuarioNavCorreo) usuarioNavCorreo.textContent = sesion.correo;
            if (botonAbrir) botonAbrir.hidden = true;
            if (botonSalir) botonSalir.hidden = false;
        } else {
            if (usuarioNav) usuarioNav.hidden = true;
            if (botonAbrir) botonAbrir.hidden = false;
            if (botonSalir) botonSalir.hidden = true;
        }
    }

    function abrirModal() {
        const sesion = leerSesion();
        if (sesion) {
            if (sesion.rol === "Estudiante") window.location.href = "panel.html";
            else if (sesion.rol === "Bibliotecario") window.location.href = "panel-bibliotecario.html";
            else if (sesion.rol === "Administrador") window.location.href = "panel-admin.html";
            return;
        }
        ultimoFoco = document.activeElement;
        ocultarMensaje();
        if (campoContrasena) campoContrasena.value = "";
        modal.hidden = false;
        document.body.classList.add("modal-abierto");
        window.setTimeout(function () {
            if (campoCorreo) campoCorreo.focus();
        }, 40);
    }

    function cerrarModal() {
        modal.hidden = true;
        document.body.classList.remove("modal-abierto");
        if (ultimoFoco && typeof ultimoFoco.focus === "function") {
            ultimoFoco.focus();
        }
    }

    document.querySelectorAll("[data-abrir-login]").forEach(function (elemento) {
        elemento.addEventListener("click", function (evento) {
            evento.preventDefault();
            abrirModal();
        });
    });

    if (botonCerrar) {
        botonCerrar.addEventListener("click", cerrarModal);
    }

    modal.querySelectorAll("[data-cerrar-login]").forEach(function (elemento) {
        elemento.addEventListener("click", cerrarModal);
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !modal.hidden) {
            cerrarModal();
        }
    });

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const correo = (campoCorreo.value || "").trim().toLowerCase();
        const contrasena = campoContrasena.value || "";

        const usuarioEncontrado = usuariosCredenciales.find(function (usuario) {
            return usuario.correo === correo && usuario.contrasena === contrasena;
        });

        if (!usuarioEncontrado) {
            if (campoContrasena) campoContrasena.value = "";
            mostrarMensaje("Correo o contraseña incorrectos. Inténtalo de nuevo.", "error");
            if (campoContrasena) campoContrasena.focus();
            return;
        }

        const usuarioSistema = usuariosSistema.find(function (u) {
            return (u.correo || "").toLowerCase() === correo;
        });
        if (usuarioSistema && usuarioSistema.activo === false) {
            if (campoContrasena) campoContrasena.value = "";
            mostrarMensaje("Esta cuenta ha sido desactivada.", "error");
            if (campoContrasena) campoContrasena.focus();
            return;
        }

        if (!guardarSesion(usuarioEncontrado)) {
            if (campoContrasena) campoContrasena.value = "";
            mostrarMensaje("No fue posible iniciar la sesión en este navegador.", "error");
            return;
        }

        if (campoContrasena) campoContrasena.value = "";
        if (usuarioEncontrado.rol === "Estudiante") {
            window.location.href = "panel.html";
        } else if (usuarioEncontrado.rol === "Bibliotecario") {
            window.location.href = "panel-bibliotecario.html";
        } else if (usuarioEncontrado.rol === "Administrador") {
            window.location.href = "panel-admin.html";
        } else {
            window.location.href = "panel.html";
        }
    });

    if (botonSalir) {
        botonSalir.addEventListener("click", function () {
            borrarSesion();
            actualizarNavbar();
            window.location.href = "index.html";
        });
    }

    actualizarNavbar();

    if (window.location.hash === "#login") {
        abrirModal();
    }
})();
