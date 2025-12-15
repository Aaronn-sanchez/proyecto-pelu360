// ============================================
// VISTA: TURNOS - REFACTORIZADO
// ============================================

const Turnos = {

    // ============================================
    // MÉTODOS PRINCIPALES
    // ============================================
    render() {
        Utilidades.transicionContenido(() => {
            if (State.accionActual === "ver") {
                this.renderVer();
            } else if (State.accionActual === "agregar") {
                this.renderAgregar();
            } else if (State.accionActual === "modificar") {
                this.renderModificar();
            } else if (State.accionActual === "servicios") {
                this.renderServicios();
            }
        });
    },

    renderVer() {
        let html = `
            <div class="content-header">
                <h2>Gestión de Turnos</h2>
                <p>Visualiza y administra todos los turnos programados</p>
            </div>
            
            <div class="row g-3" id="turnosContainer"></div>
        `;

        document.getElementById("mainContent").innerHTML = html;
        this.renderLista();
    },

    renderLista() {
        const container = document.getElementById("turnosContainer");
        container.innerHTML = "";

        if (State.turnos.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-secondary">No hay turnos registrados</p></div>';
            return;
        }

        State.turnos.forEach(t => {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";

            const badgeClass = t.estado === "Confirmado" ? "badge-confirmado" :
                t.estado === "Pendiente" ? "badge-pendiente" : "badge-cancelado";

            let diaFormateado = '';
            if (t.dia) {
                const fecha = new Date(t.dia + 'T00:00:00');
                const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                diaFormateado = diasSemana[fecha.getDay()];
            }

            col.innerHTML = `
                <div class="card-custom">
                    <div class="card-header-custom">
                        <div>
                            <div class="card-title">${t.cliente || 'Sin cliente'}</div>
                            ${t.telefono ? `<div class="card-subtitle"><i class="fas fa-phone"></i> ${t.telefono}</div>` : ""}
                        </div>
                        <span class="badge-custom ${badgeClass}">${t.estado}</span>
                    </div>
                    <div class="card-body-custom">
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-cut"></i> Servicio:</span>
                            <span class="card-info-value">${t.servicio || 'Sin servicio'}</span>
                        </div>
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-user-tie"></i> Empleado:</span>
                            <span class="card-info-value">${t.empleado || 'Sin empleado'}</span>
                        </div>
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-hourglass-half"></i> Duración:</span>
                            <span class="card-info-value">${t.duracion || 'No especificada'}</span>
                        </div>
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-clock"></i> Horario:</span>
                            <span class="card-info-value">${t.hora || 'Sin hora'}${diaFormateado ? ` - ${diaFormateado}` : ''}</span>
                        </div>
                       ${(t.sugerencias && t.sugerencias.trim() !== '') ? `
                            <div class="card-info-row" style="align-items: flex-start; padding: 0.75rem 0;">
                                <span class="card-info-label" style="padding-top: 0.25rem;">
                                <i class="fas fa-comment"></i> Sugerencias:
                                </span>
                                <span class="card-info-value" style="line-height: 1.6; padding-left: 0.5rem;">
                                ${t.sugerencias}
                                </span>
                            </div>
                        ` : ''}
                    </div>
                    ${this.renderBotonesAccion(t)}
                </div>
            `;
            container.appendChild(col);
        });
    },

    // ============================================
    // RENDER DE BOTONES SEGÚN PERMISOS
    // ============================================
   renderBotonesAccion(turno) {
    const usuario = State.usuarioActual;
    
    if (usuario.rol === "administrador") {
        return `
            <div class="card-footer-custom">
                <button class="btn btn-custom btn-edit btn-sm-custom" 
                        onclick="Turnos.irAModificar(${turno.id})"
                        title="Modificar turno">
                    <i class="fas fa-edit"></i> Modificar
                </button>
                
                ${turno.estado !== "Cancelado" ? `
                    <button class="btn btn-custom btn-sm-custom ms-2" 
                            style="background: #f59e0b; border-color: #f59e0b; color: white;"
                            onclick="Turnos.cancelar(${turno.id})"
                            title="Marcar como cancelado">
                        <i class="fas fa-ban"></i> Cancelar
                    </button>
                ` : ''}
                
                <button class="btn btn-custom btn-delete btn-sm-custom ms-2" 
                        onclick="Turnos.eliminar(${turno.id})"
                        title="Eliminar permanentemente">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
    }
    
    if (usuario.rol === "empleado" && turno.empleado === `${usuario.nombre} ${usuario.apellido}`) {
        return `
            <div class="card-footer-custom">
                ${turno.estado === "Pendiente" ? `
                    <button class="btn btn-custom btn-primary-custom btn-sm-custom" 
                            onclick="Turnos.aceptar(${turno.id})">
                        <i class="fas fa-check"></i> Aceptar
                    </button>
                ` : `
                    <span class="badge-custom badge-confirmado">
                        <i class="fas fa-check-circle"></i> Ya confirmado
                    </span>
                `}
            </div>
        `;
    }
    
    return `<div class="card-footer-custom"><span class="text-muted">Sin permisos</span></div>`;
},

    // ============================================
    // FORMULARIO DE AGREGAR/MODIFICAR (UNIFICADO)
    // ============================================
    async renderAgregar() {
        await this.renderFormulario();
    },

    async renderModificar() {
        const turnoId = State.turnoEditando;
        const turno = State.turnos.find(t => t.id == turnoId);
        
        if (!turno) {
            Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
            Router.navegarAccion('ver');
            return;
        }
        
        await this.renderFormulario(turno);
    },

    async renderFormulario(turnoExistente = null) {
        const esEdicion = turnoExistente !== null;
        const titulo = esEdicion ? " Modificar Turno" : " Nuevo Turno";
        const subtitulo = esEdicion 
            ? `Edita los datos del turno de <strong>${turnoExistente.cliente}</strong>`
            : "Completa los datos para agendar un nuevo turno";

        let html = `
            <div class="content-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style="font-size: 2rem; font-weight: 700;">${titulo}</h2>
                    <p style="color: #718096; margin-bottom: 0;">${subtitulo}</p>
                </div>
                <button class="btn btn-custom btn-delete" onclick="Router.navegarAccion('ver')">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
            </div>
            
            <form id="formTurno" class="turno-form-container">
                ${esEdicion ? `<input type="hidden" id="id_turno" value="${turnoExistente.id}">` : ''}
                
                <!-- SECCIÓN 1: CLIENTE -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon bg-gradient-blue">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Información del Cliente</h3>
                            <p class="section-subtitle">Selecciona o agrega un nuevo cliente</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-8">
                            <label class="form-label-required">Cliente</label>
                            <div class="d-flex gap-2">
                                <div class="input-group-enhanced flex-grow-1">
                                    <i class="fas fa-user input-icon"></i>
                                    <select id="clienteSelect" class="form-control-enhanced" required>
                                        <option value="">Seleccionar cliente...</option>
                                        ${State.clientes.map(c => {
                                            const selected = esEdicion && c.Nombre === turnoExistente.cliente.split(' ')[0] ? 'selected' : '';
                                            return `<option value="${c.id_cliente}" data-telefono="${c.Telefono || ''}" ${selected}>
                                                ${c.Nombre} ${c.Apellido}
                                            </option>`;
                                        }).join('')}
                                    </select>
                                </div>
                                <button type="button" class="btn btn-custom btn-primary-custom btn-add-new"
                                        data-bs-toggle="modal" data-bs-target="#modalNuevoCliente">
                                    <i class="fas fa-user-plus"></i> Nuevo
                                </button>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Teléfono</label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-phone input-icon"></i>
                                <input type="tel" class="form-control-enhanced readonly-field" 
                                       id="telefono" placeholder="Auto-completado" 
                                       value="${esEdicion ? (turnoExistente.telefono || '') : ''}" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN 2: SERVICIO -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon bg-gradient-pink">
                            <i class="fas fa-cut"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Detalles del Servicio</h3>
                            <p class="section-subtitle">Selecciona el servicio y el profesional</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label-required">Servicio</label>
                            <div class="d-flex gap-2">
                                <div class="input-group-enhanced flex-grow-1">
                                    <i class="fas fa-cut input-icon"></i>
                                    <select class="form-control-enhanced" id="servicioSelect" required>
                                        <option value="">Seleccionar servicio...</option>
                                        ${State.servicios.map(s => {
                                            const selected = esEdicion && s.nombre_servicio === turnoExistente.servicio ? 'selected' : '';
                                            return `<option value="${s.id_servicio}" data-duracion="${s.duracion_estimada}" ${selected}>
                                                ${s.nombre_servicio} (${s.duracion_estimada})
                                            </option>`;
                                        }).join('')}
                                    </select>
                                </div>
                                <button type="button" class="btn btn-custom btn-primary-custom btn-add-new"
                                        data-bs-toggle="modal" data-bs-target="#modalNuevoServicio">
                                    <i class="fas fa-plus"></i> Nuevo
                                </button>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label-required">Profesional</label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-user-tie input-icon"></i>
                                <select class="form-control-enhanced" id="empleadoSelect" required>
                                    <option value="">Seleccionar profesional...</option>
                                    ${State.empleados.map(e => {
                                        const selected = esEdicion && `${e.nombre} ${e.apellido}` === turnoExistente.empleado ? 'selected' : '';
                                        return `<option value="${e.id_usuario}" ${selected}>${e.nombre} ${e.apellido}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="col-md-12">
                            <label class="form-label">Duración Estimada</label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-hourglass-half input-icon"></i>
                                <input type="text" class="form-control-enhanced readonly-field" 
                                       id="duracion" placeholder="Auto-completado" 
                                       value="${esEdicion ? (turnoExistente.duracion || '') : ''}" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN 3: FECHA Y HORA -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon bg-gradient-cyan">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Fecha y Horario</h3>
                            <p class="section-subtitle">Define cuándo se realizará el servicio</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label-required">Fecha</label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-calendar input-icon"></i>
                                <input type="date" class="form-control-enhanced" id="dia" 
                                       value="${esEdicion ? (turnoExistente.dia || '') : ''}" required>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label-required">Hora</label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-clock input-icon"></i>
                                <input type="time" class="form-control-enhanced" id="hora" 
                                       value="${esEdicion ? (turnoExistente.hora || '') : ''}" required>
                            </div>
                        </div>
                    </div>
                </div>

                ${esEdicion ? `
                    <!-- SECCIÓN ESTADO (solo en edición) -->
                    <div class="form-section">
                        <div class="section-header">
                            <div class="section-icon bg-gradient-yellow">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div>
                                <h3 class="section-title">Estado del Turno</h3>
                                <p class="section-subtitle">Cambia el estado según corresponda</p>
                            </div>
                        </div>
                        
                        <div class="estado-radio-group">
                            <label class="estado-radio-label">
                                <input type="radio" name="estado" value="Pendiente" 
                                       ${turnoExistente.estado === 'Pendiente' ? 'checked' : ''}>
                                <span class="badge-custom badge-pendiente">
                                    <i class="fas fa-clock"></i> Pendiente
                                </span>
                            </label>
                            <label class="estado-radio-label">
                                <input type="radio" name="estado" value="Confirmado" 
                                       ${turnoExistente.estado === 'Confirmado' ? 'checked' : ''}>
                                <span class="badge-custom badge-confirmado">
                                    <i class="fas fa-check-circle"></i> Confirmado
                                </span>
                            </label>
                        </div>
                    </div>
                ` : ''}

                <!-- SECCIÓN 4: OBSERVACIONES -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon bg-gradient-orange">
                            <i class="fas fa-comment-dots"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Observaciones</h3>
                            <p class="section-subtitle">Agrega notas o preferencias del cliente (opcional)</p>
                        </div>
                    </div>
                    
                    <div class="input-group-enhanced">
                        <i class="fas fa-comment input-icon" style="top: 1.25rem;"></i>
                        <textarea class="form-control-enhanced" id="sugerencias" rows="4" 
                                  placeholder="Ejemplo: Cliente prefiere puntas rectas...">${esEdicion ? (turnoExistente.sugerencias || '') : ''}</textarea>
                    </div>
                </div>

                <!-- BOTONES DE ACCIÓN -->
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="Router.navegarAccion('ver')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-${esEdicion ? 'save' : 'check'}"></i> ${esEdicion ? 'Guardar Cambios' : 'Guardar Turno'}
                    </button>
                </div>
            </form>
        `;

        document.getElementById("mainContent").innerHTML = html;

        // Crear modales
        if (typeof ClientesModal !== 'undefined') {
            ClientesModal.crearModal();
            await ClientesModal.cargarEnSelector();
        }

        if (typeof ServiciosModal !== 'undefined') {
            ServiciosModal.crearModal();
        }

        // Setup de eventos
        this.setupFormularioEventos(esEdicion);
    },

    // ============================================
    // EVENTOS DEL FORMULARIO
    // ============================================
    setupFormularioEventos(esEdicion) {
        const form = document.getElementById("formTurno");
        const clienteSelect = document.getElementById("clienteSelect");
        const servicioSelect = document.getElementById("servicioSelect");
        const telefonoInput = document.getElementById("telefono");
        const duracionInput = document.getElementById("duracion");

        // Auto-completar teléfono
        clienteSelect.addEventListener("change", (e) => {
            const telefono = e.target.selectedOptions[0]?.dataset.telefono || "";
            telefonoInput.value = telefono;
        });

        // Auto-completar duración
        servicioSelect.addEventListener("change", (e) => {
            const duracion = e.target.selectedOptions[0]?.dataset.duracion || "";
            if (duracion && duracion !== "null") {
                duracionInput.value = duracion;
            }
        });

        // Submit
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            if (esEdicion) {
                await this.guardarModificacion();
            } else {
                await this.guardarNuevo();
            }
        });
    },

    async guardarNuevo() {
        const clienteSelect = document.getElementById("clienteSelect");
        const servicioSelect = document.getElementById("servicioSelect");
        
        const id_cliente = parseInt(clienteSelect.value);
        const id_servicio = parseInt(servicioSelect.value);
        const id_empleado = parseInt(document.getElementById("empleadoSelect").value);

        if (!id_cliente || !id_servicio || !id_empleado) {
            Utilidades.mostrarNotificacion("⚠️ Completa todos los campos requeridos", "error");
            return;
        }

        const nuevoTurno = {
            id_cliente,
            id_servicio,
            id_empleado,
            dia: document.getElementById("dia").value,
            horario: document.getElementById("hora").value,
            estado: "Pendiente",
            sugerencias: document.getElementById("sugerencias").value || null
        };

        const resultado = await ApiServicios.crearTurno(nuevoTurno);

        if (resultado.success) {
            Utilidades.mostrarNotificacion("✅ Turno agregado exitosamente");
            await ApiServicios.obtenerTurnos();
            Router.navegarAccion("ver");
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
        }
    },

    async guardarModificacion() {
        const clienteSelect = document.getElementById("clienteSelect");
        const servicioSelect = document.getElementById("servicioSelect");

        const turnoActualizado = {
            id_turno: parseInt(document.getElementById("id_turno").value),
            id_cliente: parseInt(clienteSelect.value),
            id_servicio: parseInt(servicioSelect.value),
            id_empleado: parseInt(document.getElementById("empleadoSelect").value),
            dia: document.getElementById("dia").value,
            horario: document.getElementById("hora").value,
            estado: document.querySelector('input[name="estado"]:checked').value,
            sugerencias: document.getElementById("sugerencias").value || null
        };

        const resultado = await ApiServicios.modificarTurno(turnoActualizado);

        if (resultado.success) {
            Utilidades.mostrarNotificacion("✅ Turno actualizado exitosamente");
            
            if (typeof window.cargarTurnos === 'function') {
                await window.cargarTurnos();
            }
            
            Router.navegarAccion("ver");
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`);
        }
    },

    // ============================================
    // ACCIONES SOBRE TURNOS
    // ============================================
    irAModificar(id_turno) {
        State.turnoEditando = id_turno;
        Router.navegarAccion('modificar');
    },

    async aceptar(id_turno) {
        const turno = State.turnos.find(t => t.id == id_turno);

        if (!turno) {
            Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
            return;
        }

        const nombreCompleto = `${State.usuarioActual.nombre} ${State.usuarioActual.apellido}`;
        if (turno.empleado !== nombreCompleto) {
            Utilidades.mostrarNotificacion("⚠️ Solo el empleado asignado puede aceptar este turno", "error");
            return;
        }

        const confirmar = confirm(`¿Aceptar el turno de ${turno.cliente}?`);
        if (!confirmar) return;

        const turnoActualizado = { ...turno, estado: "Confirmado" };
        const resultado = await ApiServicios.modificarTurno(turnoActualizado);

        if (resultado.success) {
            Utilidades.mostrarNotificacion("✅ Turno aceptado correctamente");
            await ApiServicios.obtenerTurnos();
            this.renderLista();
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
        }
    },

    async cancelar(id_turno) {
        const turno = State.turnos.find(t => t.id == id_turno);

        if (!turno) {
            Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
            return;
        }

        const confirmar = confirm(`¿Cancelar el turno de ${turno.cliente}?`);
        if (!confirmar) return;

        const turnoActualizado = { ...turno, estado: "Cancelado" };
        const resultado = await ApiServicios.modificarTurno(turnoActualizado);

        if (resultado.success) {
            Utilidades.mostrarNotificacion("🗑️ Turno cancelado");
            await ApiServicios.obtenerTurnos();
            this.renderLista();
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
        }
    },

    async eliminar(id_turno) {
    if (State.usuarioActual?.rol !== "administrador") {
        Utilidades.mostrarNotificacion(" Solo administradores pueden eliminar turnos", "error");
        return;
    }

    const turno = State.turnos.find(t => t.id == id_turno);

    if (!turno) {
        Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
        return;
    }

    const confirmar = confirm(
        `ELIMINAR PERMANENTEMENTE\n\n` +
        `Cliente: ${turno.cliente}\n` +
        `Servicio: ${turno.servicio}\n` +
        `Fecha: ${turno.dia} - ${turno.hora}\n\n` +
        `Esta acción NO se puede deshacer.\n\n` +
        ` Si solo deseas cancelarlo, usa el botón "Cancelar" en su lugar.`
    );
    
    if (!confirmar) return;

    try {
        const resultado = await ApiServicios.eliminarTurno(id_turno);

        if (resultado.success) {
            Utilidades.mostrarNotificacion("🗑️ Turno eliminado permanentemente", "success");
            this.renderLista();
        } else {
            Utilidades.mostrarNotificacion(
                `❌ ${resultado.msg || 'Error al eliminar turno'}`, 
                "error"
            );
        }
    } catch (error) {
        console.error("Error al eliminar turno:", error);
        Utilidades.mostrarNotificacion(" Error de conexión con el servidor", "error");
    }
},

    // ============================================
    // GESTIÓN DE SERVICIOS
    // ============================================
    renderServicios() {
        let html = `
            <div class="content-header">
                <h2> Gestión de Servicios</h2>
                <p>Administra los servicios disponibles para los turnos</p>
                <button class="btn btn-custom btn-primary-custom" onclick="Turnos.toggleFormServicio()">
                    <i class="fas fa-plus"></i> Agregar Nuevo Servicio
                </button>
            </div>
            
            <div id="formServicioContainer" style="display: none;" class="mb-4">
                <div class="form-custom">
                    <form id="formServicio">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label-custom">
                                    <i class="fas fa-cut"></i> Nombre del Servicio
                                </label>
                                <input type="text" class="form-control form-control-custom" 
                                       id="nombreServicio" placeholder="Ej: Corte de Cabello" required>
                            </div>
                            
                            <div class="col-md-4">
                                <label class="form-label-custom">
                                    <i class="fas fa-clock"></i> Duración Estimada
                                </label>
                                <input type="text" class="form-control form-control-custom" 
                                       id="duracionEstimada" placeholder="Ej: 45 min" required>
                            </div>
                            
                            <div class="col-md-2 d-flex align-items-end">
                                <button type="submit" class="btn btn-custom btn-primary-custom w-100">
                                    <i class="fas fa-save"></i> Guardar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="table-custom">
                    <thead>
                        <tr>
                            <th><i class="fas fa-hashtag"></i> ID</th>
                            <th><i class="fas fa-cut"></i> Servicio</th>
                            <th><i class="fas fa-clock"></i> Duración</th>
                            <th><i class="fas fa-cog"></i> Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaServiciosBody"></tbody>
                </table>
            </div>
            
            <div class="mt-3">
                <button class="btn btn-custom btn-delete" onclick="Router.navegarAccion('agregar')">
                    <i class="fas fa-arrow-left"></i> Volver a Crear Turno
                </button>
            </div>
        `;

        document.getElementById("mainContent").innerHTML = html;
        this.renderTablaServicios();
        this.setupFormServicio();
    },

    renderTablaServicios() {
        const tbody = document.getElementById("tablaServiciosBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (State.servicios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay servicios registrados</td></tr>';
            return;
        }

        State.servicios.forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>#${s.id_servicio}</strong></td>
                <td><i class="fas fa-cut text-purple"></i> ${s.nombre_servicio}</td>
                <td>
                    <span class="badge-custom badge-pendiente">
                        <i class="fas fa-clock"></i> ${s.duracion_estimada || 'No especificada'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-custom btn-delete btn-sm-custom" 
                            onclick="Turnos.eliminarServicio(${s.id_servicio})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    toggleFormServicio() {
        const form = document.getElementById("formServicioContainer");
        form.style.display = form.style.display === "none" ? "block" : "none";
    },

    setupFormServicio() {
        const form = document.getElementById("formServicio");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombreServicio = document.getElementById("nombreServicio").value.trim();

            const existe = State.servicios.some(
                s => s.nombre_servicio.toLowerCase() === nombreServicio.toLowerCase()
            );

            if (existe) {
                Utilidades.mostrarNotificacion(`⚠️ El servicio "${nombreServicio}" ya existe`, "error");
                return;
            }

            const nuevoServicio = {
                nombre_servicio: nombreServicio,
                duracion_estimada: document.getElementById("duracionEstimada").value.trim()
            };

            const resultado = await ApiServicios.crearServicio(nuevoServicio);

            if (resultado.ok) {
            Utilidades.mostrarNotificacion("✅ Servicio agregado");
            form.reset();
            document.getElementById("formServicioContainer").style.display = "none";
            this.renderTablaServicios();
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
        }
    });
},

async eliminarServicio(id) {
    const servicio = State.servicios.find(s => s.id_servicio == id);

    if (confirm(`¿Eliminar "${servicio.nombre_servicio}"?`)) {
        const resultado = await ApiServicios.eliminarServicio(id);

        if (resultado.ok) {
            this.renderTablaServicios();
            Utilidades.mostrarNotificacion(`🗑️ Servicio eliminado`);
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
        }
    }
}
};