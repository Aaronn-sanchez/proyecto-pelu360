// ============================================
// VISTA: INICIO - LIMPIO
// ============================================

const Inicio = {
    async cargarAvisosDesdeDB() {
        const resultado = await ApiServicios.obtenerAvisos();
        
        if (resultado.success && Array.isArray(resultado.avisos)) {
            State.alertas = resultado.avisos.map(aviso => ({
                id: aviso.id_aviso,
                titulo: aviso.titulo,
                contenido: aviso.contenido,
                fecha: aviso.fecha_publicacion,
                usuario: aviso.id_usuario
            }));
            console.log("✅ Avisos cargados desde BD:", State.alertas.length);
        } else {
            console.error('❌ Error al cargar avisos');
            Utilidades.mostrarNotificacion("⚠️ Error al cargar avisos");
        }
    },

    render() {
        Utilidades.transicionContenido(() => {
            if (State.accionActual === "ver") {
                this.renderVista();
            } else if (State.accionActual === "alertas") {
                this.renderGestionAlertas();
            }
            // ❌ ELIMINADO: else if estadisticas
        });
    },
    
    renderVista() {
        const turnosConfirmados = State.turnos.filter(t => t.estado === "Confirmado").length;
        const turnosPendientes = State.turnos.filter(t => t.estado === "Pendiente").length;
        
        let html = `
            <div class="content-header">
                <h2>¡Bienvenido/a, ${State.usuarioActual.nombre}! 👋</h2>
                <p>Aquí tienes un resumen de la actividad de hoy</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-calendar-day stat-icon" style="color: #667eea;"></i>
                    <div class="stat-value">${State.turnos.length}</div>
                    <div class="stat-label">Turnos de Hoy</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle stat-icon" style="color: #48bb78;"></i>
                    <div class="stat-value">${turnosConfirmados}</div>
                    <div class="stat-label">Confirmados</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock stat-icon" style="color: #ed8936;"></i>
                    <div class="stat-value">${turnosPendientes}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users stat-icon" style="color: #764ba2;"></i>
                    <div class="stat-value">${State.empleados.length}</div>
                    <div class="stat-label">Empleados</div>
                </div>
            </div>
            
            <h4 class="mb-3">📅 Turnos de Hoy</h4>
            <div class="row g-3" id="turnosDelDia"></div>
            
            <h4 class="mt-4 mb-3">📢 Alertas Importantes</h4>
            <div id="alertasContainer"></div>
        `;
        
        document.getElementById("mainContent").innerHTML = html;
        this.renderTurnosDelDia();
        this.renderAlertasVista();
    },
    
    renderTurnosDelDia() {
        const container = document.getElementById("turnosDelDia");
        container.innerHTML = "";
        
        State.turnos.forEach(t => {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";
            const badgeClass = t.estado === "Confirmado" ? "badge-confirmado" : "badge-pendiente";
            col.innerHTML = `
                <div class="card-custom">
                    <div class="card-header-custom">
                        <div>
                            <div class="card-title">${t.cliente}</div>
                            <div class="card-subtitle">${t.servicio}</div>
                        </div>
                        <span class="badge-custom ${badgeClass}">${t.estado}</span>
                    </div>
                    <div class="card-body-custom">
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-clock"></i> Hora:</span>
                            <span class="card-info-value">${t.hora}</span>
                        </div>
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-user"></i> Empleado:</span>
                            <span class="card-info-value">${t.empleado}</span>
                        </div>
                        <div class="card-info-row">
                            <span class="card-info-label"><i class="fas fa-hourglass-half"></i> Duración:</span>
                            <span class="card-info-value">${t.duracion}</span>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    },
    
    renderAlertasVista() {
        const container = document.getElementById("alertasContainer");
        container.innerHTML = "";
        
        if (State.alertas.length === 0) {
            container.innerHTML = '<p class="text-secondary">No hay alertas en este momento</p>';
            return;
        }
        
        State.alertas.forEach((aviso, index) => {
            const div = document.createElement("div");
            div.className = "alert-custom";
            
            if (aviso.titulo && aviso.contenido) {
                const fecha = new Date(aviso.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es-AR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                });
                
                div.innerHTML = `
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div class="alert-body">
                        <strong style="display: block; margin-bottom: 0.3rem; color: #333;">${aviso.titulo}</strong>
                        <p style="margin: 0; color: #555;">${aviso.contenido}</p>
                        <small style="display: block; margin-top: 0.5rem; color: #888; font-size: 0.85rem;">
                            <i class="fas fa-calendar"></i> ${fechaFormateada}
                        </small>
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div class="alert-body">${aviso}</div>
                `;
            }
            
            container.appendChild(div);
        });
    },
    
    renderGestionAlertas() {
        // ✅ Solo administradores
        if (State.usuarioActual.rol !== "administrador") {
            Utilidades.mostrarNotificacion('🚫 No tienes permisos para gestionar alertas', 'error');
            Router.navegarAccion('ver');
            return;
        }

        let html = `
            <div class="content-header">
                <h2>📢 Gestión de Alertas</h2>
                <p>Administra las notificaciones importantes del sistema</p>
            </div>
            
            <div class="form-custom">
                <h5>Agregar Nueva Alerta</h5>
                <form id="formAlerta">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Título del Aviso</label>
                            <input type="text" class="form-control form-control-custom" 
                                   id="tituloAlerta" placeholder="Ejemplo: Feriado Nacional - 25 de Mayo" 
                                   maxlength="100" required>
                            <div id="contadorTitulo" style="text-align: right; font-size: 0.85rem; color: #666; margin-top: 0.3rem;">0/100</div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">Contenido</label>
                            <textarea class="form-control form-control-custom" 
                                      id="contenidoAlerta" rows="3" 
                                      placeholder="Escribe el mensaje completo de la alerta..." 
                                      maxlength="500" required></textarea>
                            <div id="contadorContenido" style="text-align: right; font-size: 0.85rem; color: #666; margin-top: 0.3rem;">0/500</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Fecha de Publicación</label>
                            <input type="date" class="form-control form-control-custom" 
                                   id="fechaAlerta" required>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <button type="submit" class="btn btn-custom btn-primary-custom w-100">
                                <i class="fas fa-plus"></i> Agregar Aviso
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <h5 class="mt-4 mb-3">Alertas Activas</h5>
            <div id="alertasLista"></div>
        `;
        
        document.getElementById("mainContent").innerHTML = html;
        document.getElementById("fechaAlerta").valueAsDate = new Date();
        
        this.renderListaAlertas();
        this.setupFormAlerta();
    },
    
    renderListaAlertas() {
        const container = document.getElementById("alertasLista");
        container.innerHTML = "";
        
        if (State.alertas.length === 0) {
            container.innerHTML = '<p class="text-secondary">No hay alertas registradas</p>';
            return;
        }
        
        State.alertas.forEach((aviso, index) => {
            const div = document.createElement("div");
            div.className = "alert-custom";
            
            if (aviso.titulo && aviso.contenido) {
                const fecha = new Date(aviso.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es-AR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                });
                
                div.innerHTML = `
                    <i class="fas fa-bell alert-icon"></i>
                    <div class="alert-body">
                        <strong style="display: block; margin-bottom: 0.3rem; color: #333;">${aviso.titulo}</strong>
                        <p style="margin: 0; color: #555;">${aviso.contenido}</p>
                        <small style="display: block; margin-top: 0.5rem; color: #888; font-size: 0.85rem;">
                            <i class="fas fa-calendar"></i> ${fechaFormateada}
                        </small>
                    </div>
                    <button class="alert-close" onclick="Inicio.eliminarAlerta(${aviso.id})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            } else {
                div.innerHTML = `
                    <i class="fas fa-bell alert-icon"></i>
                    <div class="alert-body">${aviso}</div>
                    <button class="alert-close" onclick="Inicio.eliminarAlerta(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }
            
            container.appendChild(div);
        });
    },
    
    setupFormAlerta() {
        const form = document.getElementById("formAlerta");
        const inputTitulo = document.getElementById("tituloAlerta");
        const inputContenido = document.getElementById("contenidoAlerta");
        const inputFecha = document.getElementById("fechaAlerta");
        
        const contadorTitulo = document.getElementById("contadorTitulo");
        const contadorContenido = document.getElementById("contadorContenido");
        
        const LIMITE_TITULO = 100;
        const LIMITE_CONTENIDO = 500;

        inputTitulo.addEventListener("input", () => {
            const longitud = inputTitulo.value.length;
            if (longitud > LIMITE_TITULO) {
                inputTitulo.value = inputTitulo.value.substring(0, LIMITE_TITULO);
                Utilidades.mostrarNotificacion("⚠️ Máximo " + LIMITE_TITULO + " caracteres en el título");
            }
            contadorTitulo.textContent = `${inputTitulo.value.length}/${LIMITE_TITULO}`;
        });

        inputContenido.addEventListener("input", () => {
            const longitud = inputContenido.value.length;
            if (longitud > LIMITE_CONTENIDO) {
                inputContenido.value = inputContenido.value.substring(0, LIMITE_CONTENIDO);
                Utilidades.mostrarNotificacion("⚠️ Máximo " + LIMITE_CONTENIDO + " caracteres en el contenido");
            }
            contadorContenido.textContent = `${inputContenido.value.length}/${LIMITE_CONTENIDO}`;
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const titulo = inputTitulo.value.trim();
            const contenido = inputContenido.value.trim();
            const fecha = inputFecha.value;

            if (titulo === "" || contenido === "") {
                Utilidades.mostrarNotificacion("⚠️ Complete todos los campos");
                return;
            }

            const nuevoAviso = {
                titulo: titulo.substring(0, LIMITE_TITULO),
                contenido: contenido.substring(0, LIMITE_CONTENIDO),
                fecha_publicacion: fecha,
                id_usuario: State.usuarioActual.id_usuario
            };

            const resultado = await ApiServicios.crearAviso(nuevoAviso);

            if (resultado.success) {
                await this.cargarAvisosDesdeDB();
                this.renderListaAlertas();
                form.reset();
                inputFecha.valueAsDate = new Date();
                contadorTitulo.textContent = `0/${LIMITE_TITULO}`;
                contadorContenido.textContent = `0/${LIMITE_CONTENIDO}`;
                Utilidades.mostrarNotificacion("✅ Aviso agregado exitosamente");
            } else {
                Utilidades.mostrarNotificacion("❌ Error: " + (resultado.message || resultado.error));
            }
        });
    },
    
    async eliminarAlerta(id) {
        if (confirm("¿Estás seguro de eliminar esta alerta?")) {
            const resultado = await ApiServicios.eliminarAviso(id);

            if (resultado.success) {
                await this.cargarAvisosDesdeDB();
                
                if (State.accionActual === "alertas") {
                    this.renderListaAlertas();
                } else {
                    this.renderAlertasVista();
                }
                Utilidades.mostrarNotificacion("🗑️ Alerta eliminada");
            } else {
                Utilidades.mostrarNotificacion("❌ Error: " + (resultado.message || resultado.error));
            }
        }
    }
};