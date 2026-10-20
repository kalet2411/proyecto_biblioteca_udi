/* ==================================
   LOGIN MODAL DE LA BIBLIOTECA UDI
   Sesión de demostración en el navegador
================================== */

(function () {
    "use strict";

    const CLAVE_SESION = "bibliotecaSesionUDI";

    const usuarios = [
        {
            correo: "estudiante@universidad.edu",
            contrasena: "estudiante123",
            rol: "Estudiante"
        },
        {
            correo: "bibliotecario@universidad.edu",
            contrasena: "biblio123",
            rol: "Bibliotecario"
        },
        {
            correo: "admin@universidad.edu",
            contrasena: "admin123",
            rol: "Administrador"
        }
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

            if (!guardada) {
                return null;
            }

            const sesion = JSON.parse(guardada);

            if (!sesion ||
                typeof sesion.correo !== "string" ||
                sesion.rol !== "Estudiante") {
                return null;
            }

            return sesion;
        } catch (error) {
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
        } catch (error) {
            return false;
        }
    }

    function borrarSesion() {
        try {
            sessionStorage.removeItem(CLAVE_SESION);
        } catch (error) {
            return;
        }
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
            if (usuarioNav) {
                usuarioNav.hidden = false;
            }

            if (usuarioAvatar) {
                usuarioAvatar.textContent = sesion.correo.charAt(0).toUpperCase();
            }

            if (usuarioNavNombre) {
                usuarioNavNombre.textContent = sesion.rol;
            }

            if (usuarioNavCorreo) {
                usuarioNavCorreo.textContent = sesion.correo;
            }

            if (botonAbrir) {
                botonAbrir.hidden = true;
            }

            if (botonSalir) {
                botonSalir.hidden = false;
            }
        } else {
            if (usuarioNav) {
                usuarioNav.hidden = true;
            }

            if (botonAbrir) {
                botonAbrir.hidden = false;
            }

            if (botonSalir) {
                botonSalir.hidden = true;
            }
        }
    }

    function abrirModal() {
        if (leerSesion()) {
            window.location.href = "panel.html";
            return;
        }

        ultimoFoco = document.activeElement;
        ocultarMensaje();
        campoContrasena.value = "";
        modal.hidden = false;
        document.body.classList.add("modal-abierto");

        window.setTimeout(function () {
            campoCorreo.focus();
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

        const correo = campoCorreo.value.trim().toLowerCase();
        const contrasena = campoContrasena.value;

        const usuarioEncontrado = usuarios.find(function (usuario) {
            return usuario.correo === correo &&
                   usuario.contrasena === contrasena;
        });

        if (!usuarioEncontrado) {
            campoContrasena.value = "";
            mostrarMensaje(
                "Correo o contraseña incorrectos. Inténtalo de nuevo.",
                "error"
            );
            campoContrasena.focus();
            return;
        }

        if (usuarioEncontrado.rol !== "Estudiante") {
            campoContrasena.value = "";
            mostrarMensaje(
                "Esta cuenta no tiene acceso al panel de estudiante.",
                "error"
            );
            campoContrasena.focus();
            return;
        }

        if (!guardarSesion(usuarioEncontrado)) {
            campoContrasena.value = "";
            mostrarMensaje(
                "No fue posible iniciar la sesión en este navegador.",
                "error"
            );
            return;
        }

        campoContrasena.value = "";
        window.location.href = "panel.html";
    });

    if (botonSalir) {
        botonSalir.addEventListener("click", function () {
            borrarSesion();
            actualizarNavbar();
        });
    }

    actualizarNavbar();

    if (window.location.hash === "#login") {
        abrirModal();
    }
})();
