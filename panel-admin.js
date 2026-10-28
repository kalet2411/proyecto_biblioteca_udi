/* ==================================
   PANEL ADMINISTRADOR
================================== */

(function () {
    "use strict";

    const CLAVE_SESION = "bibliotecaSesionUDI";
    const CLAVE_USUARIOS = "biblioUsuarios";
    const CLAVE_LIBROS = "biblioLibros";
    const CLAVE_PRESTAMOS = "biblioPrestamos";
    const CLAVE_RESERVAS = "biblioReservas";
    const CLAVE_EQUIPOS = "biblioEquipos";
    const CLAVE_ACTIVIDAD = "biblioActividad";

    function leerSesion() {
        try {
            const guardada = sessionStorage.getItem(CLAVE_SESION);
            if (!guardada) return null;
            const sesion = JSON.parse(guardada);
            if (!sesion || typeof sesion.correo !== "string" || sesion.rol !== "Administrador") return null;
            return sesion;
        } catch (e) { return null; }
    }

    function volverAlInicio() { window.location.replace("index.html"); }
    function cerrarSesion() { try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) {} volverAlInicio(); }

    function leerUsuarios() {
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
        } catch (e) { return []; }
    }

    function guardarUsuarios(usuarios) { try { localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios)); } catch (e) {} }
    function leerLibros() { try { const raw = localStorage.getItem(CLAVE_LIBROS); if (!raw) { return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarLibros(libros) { try { localStorage.setItem(CLAVE_LIBROS, JSON.stringify(libros)); } catch (e) {} }
    function leerPrestamos() { try { const raw = localStorage.getItem(CLAVE_PRESTAMOS); if (!raw) { return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarPrestamos(prestamos) { try { localStorage.setItem(CLAVE_PRESTAMOS, JSON.stringify(prestamos)); } catch (e) {} }
    function leerReservas() { try { const raw = localStorage.getItem(CLAVE_RESERVAS); if (!raw) { return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarReservas(reservas) { try { localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)); } catch (e) {} }
    function leerEquipos() { try { const raw = localStorage.getItem(CLAVE_EQUIPOS); if (!raw) { return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarEquipos(equipos) { try { localStorage.setItem(CLAVE_EQUIPOS, JSON.stringify(equipos)); } catch (e) {} }
    function leerActividad() { try { const raw = localStorage.getItem(CLAVE_ACTIVIDAD); if (!raw) { return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarActividad(actividad) { try { localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(actividad)); } catch (e) {} }
    function registrarActividad(accion) { const act = leerActividad(); act.unshift({ id: Date.now().toString() + Math.random().toString(36).substr(2,5), fecha: new Date().toISOString().slice(0, 10), accion: accion, usuario: leerSesion() ? leerSesion().correo : "sistema" }); guardarActividad(act); }

    const sesion = leerSesion();
    if (!sesion) { volverAlInicio(); return; }

    document.getElementById("usuarioNavCorreo").textContent = sesion.correo;
    document.getElementById("usuarioNavNombre").textContent = sesion.rol;
    const av = document.getElementById("usuarioAvatar"); if (av) av.textContent = sesion.correo.charAt(0).toUpperCase();

    document.getElementById("cerrarSesion").addEventListener("click", cerrarSesion);

    let usuarios = leerUsuarios();
    let libros = leerLibros();
    let prestamos = leerPrestamos();
    let reservas = leerReservas();
    let equipos = leerEquipos();

    function escapeHtml(text) { if (text === null || text === undefined) return ""; const div = document.createElement("div"); div.textContent = String(text); return div.innerHTML; }

    function actualizarResumen() {
        document.getElementById("resumenUsuarios").textContent = usuarios.length;
        document.getElementById("resumenLibros").textContent = libros.length;
        document.getElementById("resumenPrestamos").textContent = prestamos.filter(p => p.estado === "activo").length;
        document.getElementById("resumenReservas").textContent = reservas.filter(r => r.estado === "pendiente").length;
        document.getElementById("repLibros").textContent = libros.length;
        document.getElementById("repPrestamos").textContent = prestamos.filter(p => p.estado === "activo").length;
        document.getElementById("repReservas").textContent = reservas.filter(r => r.estado === "pendiente").length;
        document.getElementById("repEquipos").textContent = equipos.filter(e => e.estado === "pendiente").length;
        document.getElementById("repUsuarios").textContent = usuarios.length;
    }

    function renderUsuarios() {
        const tbody = document.querySelector("#tablaUsuarios tbody"); tbody.innerHTML = "";
        if (usuarios.length === 0) { document.getElementById("sinUsuarios").hidden = false; } else {
            document.getElementById("sinUsuarios").hidden = true;
            usuarios.forEach(usuario => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${escapeHtml(usuario.correo)}</td><td>${escapeHtml(usuario.nombre || "-")}</td><td>${escapeHtml(usuario.rol)}</td><td>${usuario.activo !== false ? "Activo" : "Desactivado"}</td><td><button type="button" class="boton-tabla" data-accion="editarUsuario" data-id="${usuario.id}">Editar</button> <button type="button" class="boton-tabla" data-accion="toggleUsuario" data-id="${usuario.id}">${usuario.activo !== false ? "Desactivar" : "Activar"}</button></td>`;
                tbody.appendChild(tr);
            });
        }
        actualizarResumen();
    }

    function renderLibrosAdmin() {
        const tbody = document.querySelector("#tablaLibrosAdmin tbody"); tbody.innerHTML = "";
        libros.forEach(libro => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(libro.titulo)}</td><td>${escapeHtml(libro.autor)}</td><td>${escapeHtml(libro.categoria)}</td><td>${escapeHtml(libro.isbn)}</td><td>${libro.disponible ? "Disponible" : "No disponible"}</td><td><button type="button" class="boton-tabla" data-accion="editarLibroAdmin" data-id="${libro.id}">Editar</button></td>`;
            tbody.appendChild(tr);
        });
        actualizarResumen();
    }

    function renderPrestamosAdmin() {
        const tbody = document.querySelector("#tablaPrestamosAdmin tbody"); tbody.innerHTML = "";
        prestamos.forEach(prestamo => {
            const libro = libros.find(l => l.id === prestamo.libroId);
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${libro ? escapeHtml(libro.titulo) : prestamo.libroId}</td><td>${escapeHtml(prestamo.usuario)}</td><td>${escapeHtml(prestamo.fechaPrestamo)}</td><td>${prestamo.fechaDevolucion ? escapeHtml(prestamo.fechaDevolucion) : "-"}</td><td>${escapeHtml(prestamo.estado)}</td>`;
            tbody.appendChild(tr);
        });
    }

    function renderReservasAdmin() {
        const tbody = document.querySelector("#tablaReservasAdmin tbody"); tbody.innerHTML = "";
        reservas.forEach(reserva => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(reserva.libroTitulo || reserva.libroId)}</td><td>${escapeHtml(reserva.usuario)}</td><td>${escapeHtml(reserva.fecha)}</td><td>${escapeHtml(reserva.estado)}</td>`;
            tbody.appendChild(tr);
        });
        actualizarResumen();
    }

    function renderEquiposAdmin() {
        const tbody = document.querySelector("#tablaEquiposAdmin tbody"); tbody.innerHTML = "";
        equipos.forEach(equipo => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(equipo.solicitante)}</td><td>${escapeHtml(equipo.tipo)}</td><td>${escapeHtml(equipo.fecha)}</td><td>${escapeHtml(equipo.horario)}</td><td>${escapeHtml(equipo.estado)}</td>`;
            tbody.appendChild(tr);
        });
        actualizarResumen();
    }

    function renderActividad() {
        const lista = document.getElementById("listaActividad"); lista.innerHTML = "";
        const act = leerActividad();
        if (act.length === 0) { document.getElementById("sinActividad").hidden = false; return; }
        document.getElementById("sinActividad").hidden = true;
        act.slice(0, 20).forEach(a => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${escapeHtml(a.fecha)}</strong> - ${escapeHtml(a.accion)} <em>(${escapeHtml(a.usuario)})</em>`;
            lista.appendChild(li);
        });
    }

    document.getElementById("btnNuevoUsuario").addEventListener("click", function () {
        document.getElementById("usuarioId").value = "";
        document.getElementById("usuarioCorreo").value = "";
        document.getElementById("usuarioNombre").value = "";
        document.getElementById("usuarioRol").value = "Estudiante";
        document.getElementById("usuarioActivo").value = "true";
        document.getElementById("modalUsuario").hidden = false;
    });

    document.querySelectorAll("#modalUsuario [data-cerrar-modal]").forEach(btn => { btn.addEventListener("click", function () { document.getElementById("modalUsuario").hidden = true; }); });
    document.querySelectorAll("#modalLibroAdmin [data-cerrar-modal]").forEach(btn => { btn.addEventListener("click", function () { document.getElementById("modalLibroAdmin").hidden = true; }); });

    document.getElementById("formUsuario").addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("usuarioId").value || Date.now().toString();
        const correo = document.getElementById("usuarioCorreo").value.trim().toLowerCase();
        const nombre = document.getElementById("usuarioNombre").value.trim();
        const rol = document.getElementById("usuarioRol").value;
        const activo = document.getElementById("usuarioActivo").value === "true";
        if (!correo || !nombre || !rol) { alert("Completa todos los campos."); return; }
        if (usuarios.find(u => u.correo === correo && u.id !== id)) { alert("Correo duplicado."); return; }
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx >= 0) {
            if (usuarios[idx].correo === "admin@universidad.edu" && usuarios[idx].id === id && rol !== "Administrador") {
                alert("No es posible cambiar el rol del único administrador.");
                return;
            }
            usuarios[idx] = { id, correo, nombre, rol, activo };
            registrarActividad("Editó usuario: " + correo);
        } else {
            usuarios.push({ id, correo, nombre, rol, activo });
            registrarActividad("Registró usuario: " + correo);
        }
        guardarUsuarios(usuarios);
        document.getElementById("modalUsuario").hidden = true;
        renderUsuarios();
        renderActividad();
    });

    document.querySelector("#tablaUsuarios tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        const accion = btn.getAttribute("data-accion"); const id = btn.getAttribute("data-id");
        const usuario = usuarios.find(u => u.id === id); if (!usuario) return;
        if (accion === "editarUsuario") {
            document.getElementById("usuarioId").value = usuario.id;
            document.getElementById("usuarioCorreo").value = usuario.correo;
            document.getElementById("usuarioNombre").value = usuario.nombre || "";
            document.getElementById("usuarioRol").value = usuario.rol;
            document.getElementById("usuarioActivo").value = usuario.activo !== false ? "true" : "false";
            document.getElementById("modalUsuario").hidden = false;
        } else if (accion === "toggleUsuario") {
            if (usuario.correo === "admin@universidad.edu") { alert("No es posible desactivar la cuenta de administrador."); return; }
            if (confirm("¿Cambiar estado del usuario?")) {
                usuario.activo = usuario.activo === false ? true : false;
                guardarUsuarios(usuarios);
                registrarActividad((usuario.activo ? "Activó" : "Desactivó") + " usuario: " + usuario.correo);
                renderUsuarios();
                renderActividad();
            }
        }
    });

    document.getElementById("btnNuevoLibroAdmin").addEventListener("click", function () {
        document.getElementById("libroIdAdmin").value = "";
        document.getElementById("libroTituloAdmin").value = "";
        document.getElementById("libroAutorAdmin").value = "";
        document.getElementById("libroCategoriaAdmin").value = "";
        document.getElementById("libroIsbnAdmin").value = "";
        document.getElementById("libroDisponibleAdmin").value = "true";
        document.getElementById("modalLibroAdmin").hidden = false;
    });

    document.getElementById("formLibroAdmin").addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("libroIdAdmin").value || Date.now().toString();
        const titulo = document.getElementById("libroTituloAdmin").value.trim();
        const autor = document.getElementById("libroAutorAdmin").value.trim();
        const categoria = document.getElementById("libroCategoriaAdmin").value.trim();
        const isbn = document.getElementById("libroIsbnAdmin").value.trim();
        const disponible = document.getElementById("libroDisponibleAdmin").value === "true";
        if (!titulo || !autor || !categoria || !isbn) { alert("Completa todos los campos."); return; }
        const idx = libros.findIndex(l => l.id === id);
        if (idx >= 0) { libros[idx] = { id, titulo, autor, categoria, isbn, disponible }; registrarActividad("Editó libro (admin): " + titulo); } else { libros.push({ id, titulo, autor, categoria, isbn, disponible }); registrarActividad("Agregó libro (admin): " + titulo); }
        guardarLibros(libros);
        document.getElementById("modalLibroAdmin").hidden = true;
        renderLibrosAdmin();
        renderActividad();
    });

    document.querySelector("#tablaLibrosAdmin tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        if (btn.getAttribute("data-accion") === "editarLibroAdmin") {
            const id = btn.getAttribute("data-id");
            const libro = libros.find(l => l.id === id); if (!libro) return;
            document.getElementById("libroIdAdmin").value = libro.id;
            document.getElementById("libroTituloAdmin").value = libro.titulo;
            document.getElementById("libroAutorAdmin").value = libro.autor;
            document.getElementById("libroCategoriaAdmin").value = libro.categoria;
            document.getElementById("libroIsbnAdmin").value = libro.isbn;
            document.getElementById("libroDisponibleAdmin").value = libro.disponible ? "true" : "false";
            document.getElementById("modalLibroAdmin").hidden = false;
        }
    });

    renderUsuarios();
    renderLibrosAdmin();
    renderPrestamosAdmin();
    renderReservasAdmin();
    renderEquiposAdmin();
    renderActividad();
    actualizarResumen();
})();
