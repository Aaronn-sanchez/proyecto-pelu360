// ============================================
// VISTA: TURNOS (Con datos reales de la BD)
// ============================================

const Turnos = {

    render() {
        Utilidades.transicionContenido(() => {
            if (State.accionActual === "ver") {
                this.renderVer();
            } else if (State.accionActual === "agregar") {
                this.renderAgregar();
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

            // Obtener el día en formato legible
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
                    <div class="card-footer-custom">
    ${State.usuarioActual?.rol === "Administrador" ? `
        <button class="btn btn-custom btn-edit btn-sm-custom" 
                onclick="Turnos.modificar(${t.id})">
            <i class="fas fa-edit"></i> Modificar
        </button>
        <button class="btn btn-custom btn-delete btn-sm-custom" 
                onclick="Turnos.cancelar(${t.id})">
            <i class="fas fa-times"></i> Cancelar
        </button>
    ` : State.usuarioActual?.rol === "Empleado" && t.empleado === State.usuarioActual.nombre ? `
        <button class="btn btn-custom btn-primary-custom btn-sm-custom" 
                onclick="Turnos.aceptar(${t.id})">
            <i class="fas fa-check"></i> Aceptar
        </button>
    ` : `
        <span class="text-muted">Sin permisos</span>
    `}
</div>

                </div>
            `;
            container.appendChild(col);
        });
    },

    async renderAgregar() {
        let html = `
            <style>
                .form-section {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    border: 1px solid #e9ecef;
                    transition: all 0.3s ease;
                }
                
                .form-section:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                    transform: translateY(-2px);
                }
                
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f0f0f0;
                }
                
                .section-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: white;
                    background: linear-gradient(135deg, #0a0c14ff 0%, #764ba2 100%);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0;
                }
                
                .section-subtitle {
                    font-size: 0.875rem;
                    color: #718096;
                    margin: 0;
                }
                
                .input-group-enhanced {
                    position: relative;
                }
                
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a0aec0;
                    z-index: 10;
                }
                
                .form-control-enhanced {
                    padding-left: 2.75rem !important;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    height: 48px;
                    transition: all 0.2s ease;
                }
                
                .form-control-enhanced:focus {
                    border-color: #32333aff;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .btn-add-new {
                    height: 48px;
                    border-radius: 10px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                }
                
                .btn-add-new:hover {
                    transform: scale(1.05);
                }
                
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    padding-top: 2rem;
                    border-top: 2px solid #f0f0f0;
                    margin-top: 2rem;
                }
                
                .btn-submit {
                    background: linear-gradient(135deg, #1a1c22ff 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    padding: 0.875rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }
                
                .btn-cancel {
                    background: #f7fafc;
                    border: 2px solid #e2e8f0;
                    color: #4a5568;
                    padding: 0.875rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                }
                
                .btn-cancel:hover {
                    background: #edf2f7;
                    border-color: #cbd5e0;
                }
                
                .readonly-field {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    cursor: not-allowed;
                }
                
                textarea.form-control-enhanced {
                    height: auto;
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                }
            </style>
            
            <div class="content-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style="font-size: 2rem; font-weight: 700; background: -webkit-background-clip: text;">
                         Nuevo Turno
                    </h2>
                    <p style="color: #718096; margin-bottom: 0;">Completa los datos para agendar un nuevo turno</p>
                </div>
                <button class="btn btn-cancel" onclick="Router.navegarAccion('ver')">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
            </div>
            
            <form id="formTurno">
                <!-- SECCIÓN 1: INFORMACIÓN DEL CLIENTE -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Información del Cliente</h3>
                            <p class="section-subtitle">Selecciona o agrega un nuevo cliente</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-8">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Cliente <span style="color: #e53e3e;">*</span>
                            </label>
                            <div class="d-flex gap-2">
                                <div class="input-group-enhanced flex-grow-1">
                                    <i class="fas fa-user input-icon"></i>
                                    <select id="clienteSelect" class="form-control form-control-enhanced" required>
                                        <option value="">Seleccionar cliente...</option>
                                        ${State.clientes.map(c =>
            `<option value="${c.id_cliente}" data-telefono="${c.telefono || ''}">
                                                ${c.nombre} ${c.apellido}
                                            </option>`
        ).join('')}
                                    </select>
                                </div>
                                <button type="button" 
                                        class="btn btn-custom btn-primary-custom btn-add-new"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalNuevoCliente">
                                    <i class="fas fa-user-plus"></i> Nuevo Cliente
                                </button>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Teléfono
                            </label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-phone input-icon"></i>
                                <input type="tel" class="form-control form-control-enhanced readonly-field" 
                                       id="telefono" placeholder="Se completa automáticamente" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN 2: DETALLES DEL SERVICIO -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <i class="fas fa-cut"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Detalles del Servicio</h3>
                            <p class="section-subtitle">Selecciona el servicio y el profesional</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Servicio <span style="color: #e53e3e;">*</span>
                            </label>
                            <div class="d-flex gap-2">
                                <div class="input-group-enhanced flex-grow-1">
                                    <i class="fas fa-cut input-icon"></i>
                                    <select class="form-control form-control-enhanced" id="servicioSelect" required>
                                        <option value="">Seleccionar servicio...</option>
                                        ${State.servicios.map(s =>
            `<option value="${s.id_servicio}" data-duracion="${s.duracion_estimada}">
                                                ${s.nombre_servicio} (${s.duracion_estimada})
                                            </option>`
        ).join('')}
                                    </select>
                                </div>
                                <button type="button" 
                                        class="btn btn-custom btn-primary-custom btn-add-new"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalNuevoServicio">
                                    <i class="fas fa-plus"></i> Nuevo
                                </button>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Profesional <span style="color: #e53e3e;">*</span>
                            </label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-user-tie input-icon"></i>
                                <select class="form-control form-control-enhanced" id="empleadoSelect" required>
                                    <option value="">Seleccionar profesional...</option>
                                    ${State.empleados.map(e =>
            `<option value="${e.id_usuario}">${e.nombre} ${e.apellido}</option>`
        ).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="col-md-12">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Duración Estimada
                            </label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-hourglass-half input-icon"></i>
                                <input type="text" class="form-control form-control-enhanced readonly-field" 
                                       id="duracion" placeholder="Se completa automáticamente" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN 3: FECHA Y HORA -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Fecha y Horario</h3>
                            <p class="section-subtitle">Define cuándo se realizará el servicio</p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Fecha <span style="color: #e53e3e;">*</span>
                            </label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-calendar input-icon"></i>
                                <input type="date" class="form-control form-control-enhanced" 
                                       id="dia" required>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label" style="font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">
                                Hora <span style="color: #e53e3e;">*</span>
                            </label>
                            <div class="input-group-enhanced">
                                <i class="fas fa-clock input-icon"></i>
                                <input type="time" class="form-control form-control-enhanced" 
                                       id="hora" required>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECCIÓN 4: OBSERVACIONES -->
                <div class="form-section">
                    <div class="section-header">
                        <div class="section-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                            <i class="fas fa-comment-dots"></i>
                        </div>
                        <div>
                            <h3 class="section-title">Observaciones</h3>
                            <p class="section-subtitle">Agrega notas o preferencias del cliente (opcional)</p>
                        </div>
                    </div>
                    
                    <div class="input-group-enhanced">
                        <i class="fas fa-comment input-icon" style="top: 1.25rem;"></i>
                        <textarea class="form-control form-control-enhanced" id="sugerencias" 
                                  rows="4" placeholder="Ejemplo: Cliente prefiere puntas rectas, traer referencia del estilo deseado..."></textarea>
                    </div>
                </div>

                <!-- BOTONES DE ACCIÓN -->
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="Router.navegarAccion('ver')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-check"></i> Guardar Turno
                    </button>
                </div>
            </form>
        `;

        document.getElementById("mainContent").innerHTML = html;

        // Crear modal de clientes
        if (typeof ClientesModal !== 'undefined') {
            ClientesModal.crearModal();
            await ClientesModal.cargarEnSelector();
        }

        // Crear modal de servicios
        if (typeof ServiciosModal !== 'undefined') {
            ServiciosModal.crearModal();
        }

        // Autocompletar teléfono y duración
        document.getElementById("clienteSelect").addEventListener("change", e => {
            const tel = e.target.selectedOptions[0]?.dataset.telefono || "";
            document.getElementById("telefono").value = tel;
        });

        document.getElementById("servicioSelect").addEventListener("change", e => {
            const dur = e.target.selectedOptions[0]?.dataset.duracion || "";
            document.getElementById("duracion").value = dur;
        });

        // Envío del formulario
        this.setupForm();
    },

    // ============================================
    // GESTIÓN DE SERVICIOS
    // ============================================
    renderServicios() {
        let html = `
            <div class="content-header">
                <h2>✂️ Gestión de Servicios</h2>
                <p>Administra los servicios disponibles para los turnos</p>
                <button class="btn btn-custom btn-primary-custom" onclick="Turnos.toggleFormServicio()">
                    <i class="fas fa-plus"></i> Agregar Nuevo Servicio
                </button>
            </div>
            
            <!-- FORMULARIO PARA AGREGAR -->
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
                                <small class="text-muted">
                                    <i class="fas fa-info-circle"></i> 
                                    El sistema verificará si ya existe
                                </small>
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
            
            <!-- TABLA DE SERVICIOS -->
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
                <td>
                    <i class="fas fa-cut text-purple"></i> 
                    ${s.nombre_servicio}
                </td>
                <td>
                    <span class="badge-custom badge-pendiente">
                        <i class="fas fa-clock"></i> ${s.duracion_estimada || 'No especificada'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-custom btn-edit btn-sm-custom" 
                            onclick="Turnos.modificarServicio(${s.id_servicio})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-custom btn-delete btn-sm-custom ms-2" 
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
        if (form.style.display === "none") {
            form.style.display = "block";
        } else {
            form.style.display = "none";
        }
    },

    setupFormServicio() {
        const form = document.getElementById("formServicio");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombreServicio = document.getElementById("nombreServicio").value.trim();

            // Validar duplicados
            const existe = State.servicios.some(
                s => s.nombre_servicio.toLowerCase() === nombreServicio.toLowerCase()
            );

            if (existe) {
                Utilidades.mostrarNotificacion(
                    `⚠️ El servicio "${nombreServicio}" ya existe`,
                    "error"
                );
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
    },

    modificarServicio(id) {
        const servicio = State.servicios.find(s => s.id_servicio == id);
        Utilidades.mostrarNotificacion(`📝 Función en desarrollo para: ${servicio.nombre_servicio}`);
    },

    // ============================================
    // EVENTOS DE FORMULARIO DE TURNOS
    // ============================================
    setupForm() {
        const form = document.getElementById("formTurno");
        const clienteSelect = document.getElementById("clienteSelect");
        const servicioSelect = document.getElementById("servicioSelect");
        const duracionInput = document.getElementById("duracion");
        const telefonoInput = document.getElementById("telefono");

        // Auto-completar teléfono al seleccionar cliente
        clienteSelect.addEventListener("change", (e) => {
            const option = e.target.selectedOptions[0];
            const telefono = option.getAttribute("data-telefono");
            telefonoInput.value = telefono || '';
        });

        // Auto-completar duración al seleccionar servicio
        servicioSelect.addEventListener("change", (e) => {
            const option = e.target.selectedOptions[0];
            const duracion = option.getAttribute("data-duracion");
            if (duracion && duracion !== "null") {
                duracionInput.value = duracion;
            }
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

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

            console.log("📤 Enviando turno:", nuevoTurno);

            const resultado = await ApiServicios.crearTurno(nuevoTurno);

            if (resultado.success) {
                Utilidades.mostrarNotificacion("✅ Turno agregado exitosamente");

                // 🔄 Recargar todos los turnos desde la BD con el mapeo correcto
                await ApiServicios.obtenerTurnos();

                // Volver a la vista principal
                Router.navegarAccion("ver");

            } else {
                Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, "error");
            }
        });
    },

    async aceptar(id_turno) {
    const turno = State.turnos.find(t => t.id == id_turno);

    if (!turno) {
        Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
        return;
    }

    if (turno.empleado !== State.usuarioActual.nombre) {
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


    async modificar(id_turno) {
    const turno = State.turnos.find(t => t.id == id_turno);
    
    if (!turno) {
        Utilidades.mostrarNotificacion("❌ Turno no encontrado", "error");
        return;
    }

    // Renderizar formulario de edición
    await this.renderModificar(turno);
    },

   // 2️⃣ Agregar esta función simplificada para el formulario de modificación:

async renderModificar(turno) {
    let html = `
        <div class="content-header">
            <h2>✏️ Modificar Turno</h2>
            <p>Edita los datos del turno de <strong>${turno.cliente}</strong></p>
        </div>
        
        <div class="form-custom">
            <form id="formModificarTurno">
                <input type="hidden" id="id_turno" value="${turno.id}">
                
                <div class="row g-3">
                    <!-- Cliente -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-user"></i> Cliente *
                        </label>
                        <select id="clienteSelect" class="form-control form-control-custom" required>
                            <option value="">Seleccionar cliente...</option>
                            ${State.clientes.map(c => {
                                const selected = c.Nombre === turno.cliente.split(' ')[0] ? 'selected' : '';
                                return `<option value="${c.id_cliente}" data-telefono="${c.Telefono || ''}" ${selected}>
                                    ${c.Nombre} ${c.Apellido}
                                </option>`;
                            }).join('')}
                        </select>
                    </div>

                    <!-- Teléfono -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-phone"></i> Teléfono
                        </label>
                        <input type="tel" class="form-control form-control-custom" 
                               id="telefono" value="${turno.telefono || ''}" readonly 
                               style="background: #f8f9fa;">
                    </div>

                    <!-- Servicio -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-cut"></i> Servicio *
                        </label>
                        <select class="form-control form-control-custom" id="servicioSelect" required>
                            <option value="">Seleccionar servicio...</option>
                            ${State.servicios.map(s => {
                                const selected = s.nombre_servicio === turno.servicio ? 'selected' : '';
                                return `<option value="${s.id_servicio}" data-duracion="${s.duracion_estimada}" ${selected}>
                                    ${s.nombre_servicio} (${s.duracion_estimada})
                                </option>`;
                            }).join('')}
                        </select>
                    </div>
                    
                    <!-- Empleado -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-user-tie"></i> Profesional *
                        </label>
                        <select class="form-control form-control-custom" id="empleadoSelect" required>
                            <option value="">Seleccionar profesional...</option>
                            ${State.empleados.map(e => {
                                const selected = `${e.nombre} ${e.apellido}` === turno.empleado ? 'selected' : '';
                                return `<option value="${e.id_usuario}" ${selected}>${e.nombre} ${e.apellido}</option>`;
                            }).join('')}
                        </select>
                    </div>

                    <!-- Fecha -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-calendar"></i> Fecha *
                        </label>
                        <input type="date" class="form-control form-control-custom" 
                               id="dia" value="${turno.dia || ''}" required>
                    </div>
                    
                    <!-- Hora -->
                    <div class="col-md-6">
                        <label class="form-label-custom">
                            <i class="fas fa-clock"></i> Hora *
                        </label>
                        <input type="time" class="form-control form-control-custom" 
                               id="hora" value="${turno.hora || ''}" required>
                    </div>

                    <!-- Estado -->
                    <div class="col-md-12">
                        <label class="form-label-custom">
                            <i class="fas fa-info-circle"></i> Estado
                        </label>
                        <div style="display: flex; gap: 1rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="radio" name="estado" value="Pendiente" 
                                       ${turno.estado === 'Pendiente' ? 'checked' : ''}>
                                <span class="badge-custom badge-pendiente">
                                    <i class="fas fa-clock"></i> Pendiente
                                </span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="radio" name="estado" value="Confirmado" 
                                       ${turno.estado === 'Confirmado' ? 'checked' : ''}>
                                <span class="badge-custom badge-confirmado">
                                    <i class="fas fa-check-circle"></i> Confirmado
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Sugerencias -->
                    <div class="col-md-12">
                        <label class="form-label-custom">
                            <i class="fas fa-comment"></i> Sugerencias
                        </label>
                        <textarea class="form-control form-control-custom" id="sugerencias" 
                                  rows="3" placeholder="Observaciones o preferencias...">${turno.sugerencias || ''}</textarea>
                    </div>

                    <!-- Botones -->
                    <div class="col-12 d-flex gap-2 mt-3">
                        <button type="button" class="btn btn-custom btn-delete" 
                                onclick="Router.navegarAccion('ver')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn btn-custom btn-primary-custom flex-grow-1">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;

    document.getElementById("mainContent").innerHTML = html;
    this.setupFormModificar();
},

// 3️⃣ Función para configurar el formulario (simplificada):

setupFormModificar() {
    const form = document.getElementById("formModificarTurno");
    const clienteSelect = document.getElementById("clienteSelect");
    const servicioSelect = document.getElementById("servicioSelect");

    // Auto-completar teléfono
    clienteSelect.addEventListener("change", (e) => {
        const telefono = e.target.selectedOptions[0]?.dataset.telefono || "";
        document.getElementById("telefono").value = telefono;
    });

    // Submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

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
            
            // Recargar turnos
            if (typeof window.cargarTurnos === 'function') {
                await window.cargarTurnos();
            }
            
            Router.navegarAccion("ver");
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`);
        }
    });
}

// ============================================
// FIN - Solo 3 funciones simples
// ============================================
};

console.log("✅ turnos.js cargado");