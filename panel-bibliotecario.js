/* ==================================
   PANEL BIBLIOTECARIO
================================== */

(function () {
    "use strict";

    const CLAVE_SESION = "bibliotecaSesionUDI";
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
            if (!sesion || typeof sesion.correo !== "string" || sesion.rol !== "Bibliotecario") return null;
            return sesion;
        } catch (e) { return null; }
    }

    function volverAlInicio() { window.location.replace("index.html"); }
    function cerrarSesion() { try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) {} volverAlInicio(); }

    function leerLibros() {
        try {
            const raw = localStorage.getItem(CLAVE_LIBROS);
            if (!raw) {
                const iniciales = [
                    { id: "l1", titulo: "Clean Code", autor: "Robert C. Martin", categoria: "Tecnología", isbn: "9780132350884", disponible: true },
                    { id: "l2", titulo: "Cálculo", autor: "James Stewart", categoria: "Matemáticas", isbn: "9780538498845", disponible: true },
                    { id: "l3", titulo: "Fundamentos del diseño", autor: "Wucius Wong", categoria: "Diseño", isbn: "9780471289270", disponible: false },
                    { id: "l4", titulo: "Física universitaria", autor: "Young & Freedman", categoria: "Ciencias", isbn: "9780321976444", disponible: true },
                    { id: "l5", titulo: "Introducción a los algoritmos", autor: "Thomas H. Cormen", categoria: "Programación", isbn: "9780262033848", disponible: true },
                    { id: "l6", titulo: "Álgebra lineal y sus aplicaciones", autor: "David C. Lay", categoria: "Matemáticas", isbn: "9780321982384", disponible: true },
                    { id: "l7", titulo: "Psicología del desarrollo", autor: "John W. Santrock", categoria: "Psicología", isbn: "9781259665971", disponible: false },
                    { id: "l8", titulo: "Historia de Colombia", autor: "David Bushnell", categoria: "Historia", isbn: "9789586807403", disponible: true },
                    { id: "l9", titulo: "Fundamentos de marketing", autor: "Philip Kotler", categoria: "Administración", isbn: "9780133798937", disponible: true }
                ];
                localStorage.setItem(CLAVE_LIBROS, JSON.stringify(iniciales));
                return iniciales;
            }
            return JSON.parse(raw);
        } catch (e) { return []; }
    }

    function guardarLibros(libros) { try { localStorage.setItem(CLAVE_LIBROS, JSON.stringify(libros)); } catch (e) {} }
    function leerPrestamos() { try { const raw = localStorage.getItem(CLAVE_PRESTAMOS); if (!raw) { localStorage.setItem(CLAVE_PRESTAMOS, JSON.stringify([])); return []; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarPrestamos(prestamos) { try { localStorage.setItem(CLAVE_PRESTAMOS, JSON.stringify(prestamos)); } catch (e) {} }
    function leerReservas() { try { const raw = localStorage.getItem(CLAVE_RESERVAS); if (!raw) { const iniciales = [{ id: "r1", libroId: "l3", libroTitulo: "Fundamentos del diseño", usuario: "estudiante@universidad.edu", fecha: "2026-10-25", estado: "pendiente" }]; localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(iniciales)); return iniciales; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarReservas(reservas) { try { localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)); } catch (e) {} }
    function leerEquipos() { try { const raw = localStorage.getItem(CLAVE_EQUIPOS); if (!raw) { const iniciales = [{ id: "e1", solicitante: "estudiante@universidad.edu", tipo: "laptop", fecha: "2026-10-28", horario: "10-12", estado: "pendiente" }]; localStorage.setItem(CLAVE_EQUIPOS, JSON.stringify(iniciales)); return iniciales; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarEquipos(equipos) { try { localStorage.setItem(CLAVE_EQUIPOS, JSON.stringify(equipos)); } catch (e) {} }
    function leerActividad() { try { const raw = localStorage.getItem(CLAVE_ACTIVIDAD); if (!raw) { const iniciales = [{ id: Date.now().toString(), fecha: new Date().toISOString().slice(0, 10), accion: "Sistema inicializado", usuario: "sistema" }]; localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(iniciales)); return iniciales; } return JSON.parse(raw); } catch (e) { return []; } }
    function guardarActividad(actividad) { try { localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(actividad)); } catch (e) {} }
    function registrarActividad(accion) { const act = leerActividad(); act.unshift({ id: Date.now().toString() + Math.random().toString(36).substr(2,5), fecha: new Date().toISOString().slice(0, 10), accion: accion, usuario: leerSesion() ? leerSesion().correo : "sistema" }); guardarActividad(act); }

    const sesion = leerSesion();
    if (!sesion) { volverAlInicio(); return; }

    document.getElementById("usuarioNavCorreo").textContent = sesion.correo;
    document.getElementById("usuarioNavNombre").textContent = sesion.rol;
    const av = document.getElementById("usuarioAvatar"); if (av) av.textContent = sesion.correo.charAt(0).toUpperCase();

    document.getElementById("cerrarSesion").addEventListener("click", cerrarSesion);

    let libros = leerLibros();
    let prestamos = leerPrestamos();
    let reservas = leerReservas();
    let equipos = leerEquipos();

    function actualizarResumen() {
        document.getElementById("resumenLibros").textContent = libros.length;
        document.getElementById("resumenPrestamos").textContent = prestamos.filter(p => p.estado === "activo").length;
        document.getElementById("resumenReservas").textContent = reservas.filter(r => r.estado === "pendiente").length;
        document.getElementById("resumenEquipos").textContent = equipos.filter(e => e.estado === "pendiente").length;
    }

    function escapeHtml(text) { if (text === null || text === undefined) return ""; const div = document.createElement("div"); div.textContent = String(text); return div.innerHTML; }

    function renderLibros() {
        const tbody = document.querySelector("#tablaLibros tbody"); tbody.innerHTML = "";
        if (libros.length === 0) { document.getElementById("sinLibros").hidden = false; } else {
            document.getElementById("sinLibros").hidden = true;
            libros.forEach(libro => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${escapeHtml(libro.titulo)}</td><td>${escapeHtml(libro.autor)}</td><td>${escapeHtml(libro.categoria)}</td><td>${escapeHtml(libro.isbn)}</td><td>${libro.disponible ? "Disponible" : "No disponible"}</td><td><button type="button" class="boton-tabla" data-accion="editarLibro" data-id="${libro.id}">Editar</button> <button type="button" class="boton-tabla" data-accion="toggleLibro" data-id="${libro.id}">${libro.disponible ? "Marcar no disponible" : "Marcar disponible"}</button></td>`;
                tbody.appendChild(tr);
            });
        }
        actualizarResumen();
    }

    function renderPrestamos() {
        const tbody = document.querySelector("#tablaPrestamos tbody"); tbody.innerHTML = "";
        if (prestamos.length === 0) { document.getElementById("sinPrestamos").hidden = false; } else {
            document.getElementById("sinPrestamos").hidden = true;
            prestamos.forEach(prestamo => {
                const libro = libros.find(l => l.id === prestamo.libroId);
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${libro ? escapeHtml(libro.titulo) : prestamo.libroId}</td><td>${escapeHtml(prestamo.usuario)}</td><td>${escapeHtml(prestamo.fechaPrestamo)}</td><td>${prestamo.fechaDevolucion ? escapeHtml(prestamo.fechaDevolucion) : "-"}</td><td>${prestamo.estado}</td><td>${prestamo.estado === "activo" ? `<button type="button" class="boton-tabla" data-accion="devolverPrestamo" data-id="${prestamo.id}">Registrar devolución</button>` : ""}</td>`;
                tbody.appendChild(tr);
            });
        }
        actualizarResumen();
    }

    function renderReservas() {
        const tbody = document.querySelector("#tablaReservas tbody"); tbody.innerHTML = "";
        if (reservas.length === 0) { document.getElementById("sinReservas").hidden = false; } else {
            document.getElementById("sinReservas").hidden = true;
            reservas.forEach(reserva => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${escapeHtml(reserva.libroTitulo || reserva.libroId)}</td><td>${escapeHtml(reserva.usuario)}</td><td>${escapeHtml(reserva.fecha)}</td><td>${escapeHtml(reserva.estado)}</td><td>${reserva.estado === "pendiente" ? `<button type="button" class="boton-tabla" data-accion="aprobarReserva" data-id="${reserva.id}">Aprobar</button> <button type="button" class="boton-tabla" data-accion="cancelarReserva" data-id="${reserva.id}">Cancelar</button>` : ""}</td>`;
                tbody.appendChild(tr);
            });
        }
        actualizarResumen();
    }

    function renderEquipos() {
        const tbody = document.querySelector("#tablaEquipos tbody"); tbody.innerHTML = "";
        if (equipos.length === 0) { document.getElementById("sinEquipos").hidden = false; } else {
            document.getElementById("sinEquipos").hidden = true;
            equipos.forEach(equipo => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${escapeHtml(equipo.solicitante)}</td><td>${escapeHtml(equipo.tipo)}</td><td>${escapeHtml(equipo.fecha)}</td><td>${escapeHtml(equipo.horario)}</td><td>${escapeHtml(equipo.estado)}</td><td>${equipo.estado === "pendiente" ? `<button type="button" class="boton-tabla" data-accion="aprobarEquipo" data-id="${equipo.id}">Aprobar</button> <button type="button" class="boton-tabla" data-accion="rechazarEquipo" data-id="${equipo.id}">Rechazar</button>` : ""}</td>`;
                tbody.appendChild(tr);
            });
        }
        actualizarResumen();
    }

    document.getElementById("btnNuevoLibro").addEventListener("click", function () {
        document.getElementById("libroId").value = "";
        document.getElementById("libroTitulo").value = "";
        document.getElementById("libroAutor").value = "";
        document.getElementById("libroCategoria").value = "";
        document.getElementById("libroIsbn").value = "";
        document.getElementById("libroDisponible").value = "true";
        document.getElementById("modalLibro").hidden = false;
    });

    document.querySelectorAll("#modalLibro [data-cerrar-modal]").forEach(btn => { btn.addEventListener("click", function () { document.getElementById("modalLibro").hidden = true; }); });

    document.getElementById("formLibro").addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("libroId").value || Date.now().toString();
        const titulo = document.getElementById("libroTitulo").value.trim();
        const autor = document.getElementById("libroAutor").value.trim();
        const categoria = document.getElementById("libroCategoria").value.trim();
        const isbn = document.getElementById("libroIsbn").value.trim();
        const disponible = document.getElementById("libroDisponible").value === "true";
        if (!titulo || !autor || !categoria || !isbn) { alert("Completa todos los campos."); return; }
        const idx = libros.findIndex(l => l.id === id);
        if (idx >= 0) { libros[idx] = { id, titulo, autor, categoria, isbn, disponible }; registrarActividad("Editó libro: " + titulo); } else { libros.push({ id, titulo, autor, categoria, isbn, disponible }); registrarActividad("Agregó libro: " + titulo); }
        guardarLibros(libros);
        document.getElementById("modalLibro").hidden = true;
        renderLibros();
    });

    document.querySelector("#tablaLibros tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        const accion = btn.getAttribute("data-accion"); const id = btn.getAttribute("data-id");
        if (accion === "editarLibro") {
            const libro = libros.find(l => l.id === id); if (!libro) return;
            document.getElementById("libroId").value = libro.id;
            document.getElementById("libroTitulo").value = libro.titulo;
            document.getElementById("libroAutor").value = libro.autor;
            document.getElementById("libroCategoria").value = libro.categoria;
            document.getElementById("libroIsbn").value = libro.isbn;
            document.getElementById("libroDisponible").value = libro.disponible ? "true" : "false";
            document.getElementById("modalLibro").hidden = false;
        } else if (accion === "toggleLibro") {
            const libro = libros.find(l => l.id === id); if (!libro) return;
            libro.disponible = !libro.disponible;
            guardarLibros(libros);
            registrarActividad((libro.disponible ? "Marcar disponible" : "Marcar no disponible") + ": " + libro.titulo);
            renderLibros();
        }
    });

    document.getElementById("btnNuevoPrestamo").addEventListener("click", function () {
        const sel = document.getElementById("prestamoLibro"); sel.innerHTML = "";
        libros.filter(l => l.disponible).forEach(l => { const opt = document.createElement("option"); opt.value = l.id; opt.textContent = l.titulo + " (" + l.isbn + ")"; sel.appendChild(opt); });
        document.getElementById("prestamoUsuario").value = "";
        document.getElementById("prestamoFecha").value = new Date().toISOString().slice(0, 10);
        document.getElementById("modalPrestamo").hidden = false;
    });

    document.querySelectorAll("#modalPrestamo [data-cerrar-modal]").forEach(btn => { btn.addEventListener("click", function () { document.getElementById("modalPrestamo").hidden = true; }); });

    document.getElementById("formPrestamo").addEventListener("submit", function (e) {
        e.preventDefault();
        const libroId = document.getElementById("prestamoLibro").value;
        const usuario = document.getElementById("prestamoUsuario").value.trim();
        const fecha = document.getElementById("prestamoFecha").value;
        if (!libroId || !usuario || !fecha) { alert("Completa todos los campos."); return; }
        const libro = libros.find(l => l.id === libroId);
        if (libro) { libro.disponible = false; guardarLibros(libros); }
        prestamos.push({ id: Date.now().toString(), libroId, usuario, fechaPrestamo: fecha, fechaDevolucion: null, estado: "activo" });
        guardarPrestamos(prestamos);
        registrarActividad("Registró préstamo: " + (libro ? libro.titulo : libroId) + " a " + usuario);
        document.getElementById("modalPrestamo").hidden = true;
        renderPrestamos();
        renderLibros();
    });

    document.querySelector("#tablaPrestamos tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        if (btn.getAttribute("data-accion") === "devolverPrestamo") {
            const id = btn.getAttribute("data-id");
            const prestamo = prestamos.find(p => p.id === id);
            if (!prestamo) return;
            if (confirm("¿Registrar devolución del préstamo?")) {
                prestamo.estado = "devuelto";
                prestamo.fechaDevolucion = new Date().toISOString().slice(0, 10);
                guardarPrestamos(prestamos);
                const libro = libros.find(l => l.id === prestamo.libroId);
                if (libro) { libro.disponible = true; guardarLibros(libros); }
                registrarActividad("Registró devolución de préstamo: " + (libro ? libro.titulo : prestamo.libroId));
                renderPrestamos();
                renderLibros();
            }
        }
    });

    document.querySelector("#tablaReservas tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        const accion = btn.getAttribute("data-accion"); const id = btn.getAttribute("data-id");
        const reserva = reservas.find(r => r.id === id); if (!reserva) return;
        if (accion === "aprobarReserva") { if (confirm("¿Aprobar esta reserva?")) { reserva.estado = "aprobada"; guardarReservas(reservas); registrarActividad("Aprobó reserva: " + reserva.libroTitulo); renderReservas(); } }
        else if (accion === "cancelarReserva") { if (confirm("¿Cancelar esta reserva?")) { reserva.estado = "cancelada"; guardarReservas(reservas); registrarActividad("Canceló reserva: " + reserva.libroTitulo); renderReservas(); } }
    });

    document.querySelector("#tablaEquipos tbody").addEventListener("click", function (e) {
        const btn = e.target; if (btn.tagName !== "BUTTON") return;
        const accion = btn.getAttribute("data-accion"); const id = btn.getAttribute("data-id");
        const equipo = equipos.find(eq => eq.id === id); if (!equipo) return;
        if (accion === "aprobarEquipo") { if (confirm("¿Aprobar solicitud de equipo?")) { equipo.estado = "aprobada"; guardarEquipos(equipos); registrarActividad("Aprobó solicitud de equipo: " + equipo.solicitante); renderEquipos(); } }
        else if (accion === "rechazarEquipo") { if (confirm("¿Rechazar solicitud de equipo?")) { equipo.estado = "rechazada"; guardarEquipos(equipos); registrarActividad("Rechazó solicitud de equipo: " + equipo.solicitante); renderEquipos(); } }
    });

    renderLibros();
    renderPrestamos();
    renderReservas();
    renderEquipos();
    actualizarResumen();
})();
