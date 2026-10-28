/* ==================================
   PANEL PERSONAL DEL ESTUDIANTE UDI
   Comprueba la sesión y activa las tarjetas
================================== */

(function () {
    "use strict";

    const CLAVE_SESION = "bibliotecaSesionUDI";

    function leerSesion() {
        try {
            const guardada = sessionStorage.getItem(CLAVE_SESION);
            if (!guardada) return null;
            const sesion = JSON.parse(guardada);
            if (!sesion || typeof sesion.correo !== "string" || sesion.rol !== "Estudiante") {
                return null;
            }
            return sesion;
        } catch (e) {
            return null;
        }
    }

    function volverAlInicio() {
        window.location.replace("index.html");
    }

    function cerrarSesion() {
        try {
            sessionStorage.removeItem(CLAVE_SESION);
        } catch (e) {
            volverAlInicio();
            return;
        }
        volverAlInicio();
    }

    const sesion = leerSesion();
    if (!sesion) {
        volverAlInicio();
        return;
    }

    const perfilCorreo = document.getElementById("perfilCorreo");
    const perfilRol = document.getElementById("perfilRol");
    const usuarioNavCorreo = document.getElementById("usuarioNavCorreo");
    const usuarioNavNombre = document.getElementById("usuarioNavNombre");
    const usuarioAvatar = document.getElementById("usuarioAvatar");

    if (perfilCorreo) perfilCorreo.textContent = sesion.correo;
    if (perfilRol) perfilRol.textContent = sesion.rol;
    if (usuarioNavCorreo) usuarioNavCorreo.textContent = sesion.correo;
    if (usuarioNavNombre) usuarioNavNombre.textContent = sesion.rol;
    if (usuarioAvatar) usuarioAvatar.textContent = sesion.correo.charAt(0).toUpperCase();

    document.querySelectorAll("[data-toggle]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const detalle = document.getElementById(boton.dataset.toggle);
            if (!detalle) return;
            const seVaAMostrar = detalle.hidden;
            detalle.hidden = !seVaAMostrar;
            boton.setAttribute("aria-expanded", String(seVaAMostrar));
            boton.textContent = seVaAMostrar
                ? (boton.dataset.textoCerrar || "Ocultar detalle")
                : (boton.dataset.textoAbrir || "Ver detalle");
        });
    });

    document.querySelectorAll("#cerrarSesion, #cerrarSesionInferior").forEach(function (boton) {
        boton.addEventListener("click", cerrarSesion);
    });

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted && !leerSesion()) {
            volverAlInicio();
        }
    });
})();
